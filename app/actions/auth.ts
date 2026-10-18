// app/actions/auth.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getSession, setSession, clearSession, AuthSession, hashPassword, verifyPassword } from '@/lib/auth';
import { updateTeamMemberInNotion, createTeamMemberInNotion, getTeamMembers } from '@/lib/notion';
import { mockTeamMembers, updateMockMember, createMockMember } from '@/lib/mock-data';
import { TeamMember } from '@/types/notion';


export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { success: false, error: '이메일과 비밀번호를 모두 입력해 주세요.' };
  }

  // 1. Check Notion Team DB members (Live Notion DB connection)
  const notionMembers = await getTeamMembers();
  const matchedNotionMember = notionMembers.find((m) => {
    // 1) Match direct Email property
    if (m.email && m.email.toLowerCase() === email) return true;
    // 2) Match email found in PersonalLinks
    if (m.personalLinks && m.personalLinks.some((link) => link.toLowerCase().includes(email))) return true;
    if (m.personalLink && m.personalLink.toLowerCase().includes(email)) return true;
    // 3) Match Korean name or slug
    const nameSlug = m.name.toLowerCase().replace(/\s+/g, '');
    const emailPrefix = email.split('@')[0];
    return emailPrefix === nameSlug || email.includes(nameSlug);
  });

  if (matchedNotionMember) {
    const isPasswordValid = await verifyPassword(password, matchedNotionMember.password);
    if (!isPasswordValid) {
      return { success: false, error: '비밀번호가 올바르지 않습니다.' };
    }

    // Auto-upgrade plain-text password in Notion to SHA-256 cryptographic hash
    if (
      matchedNotionMember.password &&
      matchedNotionMember.password.trim() === password &&
      password.length < 60
    ) {
      try {
        const secureHash = await hashPassword(password);
        await updateTeamMemberInNotion(matchedNotionMember.id, {
          password: secureHash,
        });
      } catch (err) {
        console.warn('Failed to auto-upgrade password hash in Notion:', err);
      }
    }

    await setSession({
      memberId: matchedNotionMember.id,
      email,
      name: matchedNotionMember.name,
      role: matchedNotionMember.role,
      avatarUrl: matchedNotionMember.avatarUrl,
    });
    revalidatePath('/');
    return { success: true };
  }

  // 2. Fallback: match by local team members (during local development / Notion sync)
  if (password !== '1234') {
    return { success: false, error: '비밀번호가 올바르지 않습니다.' };
  }

  const matchedMock = mockTeamMembers.find((m) => {
    const nameSlug = m.name.toLowerCase().replace(/\s+/g, '');
    const emailPrefix = email.split('@')[0];
    return emailPrefix === nameSlug || email.includes(nameSlug);
  });

  if (matchedMock) {
    await setSession({
      memberId: matchedMock.id,
      email,
      name: matchedMock.name,
      role: matchedMock.role,
      avatarUrl: matchedMock.avatarUrl,
    });
    revalidatePath('/');
    return { success: true };
  }

  return {
    success: false,
    error: '등록된 팀원 계정을 찾을 수 없습니다. 이메일을 다시 확인해 주세요.',
  };
}

export async function signupAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = (formData.get('role') as string)?.trim() || 'Contributor';
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'Enter your name, email, and password.' };
  }

  // 1. If Notion Member DB is configured, create member in Notion
  let memberId = '';
  if (process.env.NOTION_MEMBER_DB_ID && process.env.NOTION_TOKEN) {
    const notionPageId = await createTeamMemberInNotion({
      name,
      role,
      skills: ['New Member', 'Creator'],
      personalLinks: [email],
    });
    if (notionPageId) {
      memberId = notionPageId;
    }
  }

  // 2. Fallback to mock storage if Notion not available or error
  if (!memberId) {
    const newMember = createMockMember({
      name,
      role,
      skills: ['Collaboration', 'Design & Code'],
      personalLinks: [],
    });
    memberId = newMember.id;
  }

  await setSession({
    memberId,
    email,
    name,
    role,
  });

  revalidatePath('/');
  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  revalidatePath('/');
}

export async function getCurrentUserAction(): Promise<AuthSession | null> {
  return await getSession();
}

export async function updateProfileAction(data: {
  name: string;
  role: string;
  avatarUrl?: string;
  skills: string[];
  personalLinks: string[];
  newPassword?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Sign in to update your profile.' };
  }

  let hashedPassword: string | undefined = undefined;
  if (data.newPassword && data.newPassword.trim().length > 0) {
    if (data.newPassword.trim().length < 4) {
      return { success: false, error: '새 비밀번호는 최소 4자 이상이어야 합니다.' };
    }
    hashedPassword = await hashPassword(data.newPassword.trim());
  }

  if (data.avatarUrl && data.avatarUrl.startsWith('blob:')) {
    return { success: false, error: '이미지 파일 업로드가 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.' };
  }

  // If in Mock Mode or mock member ID
  if (session.memberId.startsWith('member-')) {
    updateMockMember(session.memberId, {
      name: data.name,
      role: data.role,
      avatarUrl: data.avatarUrl,
      skills: data.skills,
      personalLinks: data.personalLinks,
    });
  } else {
    // Update real Notion database record
    const updated = await updateTeamMemberInNotion(session.memberId, {
      name: data.name,
      role: data.role,
      avatarUrl: data.avatarUrl,
      skills: data.skills,
      personalLinks: data.personalLinks,
      password: hashedPassword,
    });
    if (!updated) {
      return {
        success: false,
        error: '노션 데이터베이스 저장에 실패했습니다. Notion 토큰 및 권한 설정을 확인해 주세요.',
      };
    }
  }

  // Update current session cookie with new profile info
  await setSession({
    ...session,
    name: data.name,
    role: data.role,
    avatarUrl: data.avatarUrl || undefined,
  });

  revalidatePath('/');
  return { success: true };
}

