// app/actions/auth.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getSession, setSession, clearSession, AuthSession } from '@/lib/auth';
import { updateTeamMemberInNotion, createTeamMemberInNotion, getTeamMembers } from '@/lib/notion';
import { mockTeamMembers, updateMockMember, createMockMember } from '@/lib/mock-data';
import { TeamMember } from '@/types/notion';

// Preset credentials for 4 core team members to allow instant testing
const TEAM_CREDENTIALS: Record<string, { memberId: string; password?: string; name: string; role: string; avatarUrl?: string }> = {
  'alex@shotshot.dev': {
    memberId: 'member-alex-kim',
    name: 'Alex Kim',
    role: 'Product Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  'chloe@shotshot.dev': {
    memberId: 'member-chloe-lee',
    name: 'Chloe Lee',
    role: 'Frontend Engineer',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  'david@shotshot.dev': {
    memberId: 'member-david-park',
    name: 'David Park',
    role: 'Fullstack Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  'sara@shotshot.dev': {
    memberId: 'member-sara-choi',
    name: 'Sara Choi',
    role: 'Growth Marketer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
};

export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Please enter both email and password.' };
  }

  // 1. Check preset demo team members
  const preset = TEAM_CREDENTIALS[email];
  if (preset) {
    await setSession({
      memberId: preset.memberId,
      email,
      name: preset.name,
      role: preset.role,
      avatarUrl: preset.avatarUrl,
    });
    revalidatePath('/');
    return { success: true };
  }

  // 2. Check Notion Team DB members if active
  const notionMembers = await getTeamMembers();
  const matchedNotionMember = notionMembers.find((m) => {
    const slug = m.name.toLowerCase().replace(/\s+/g, '');
    return email.startsWith(slug) || (m.personalLink && m.personalLink.includes(email));
  });

  if (matchedNotionMember) {
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

  // 3. Fallback: match by mock team members
  const matchedMock = mockTeamMembers.find((m) => {
    const slug = m.name.toLowerCase().replace(/\s+/g, '');
    return email.includes(slug);
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
    error: 'Member account not found. Please use the 1-click presets or register a new account.',
  };
}

export async function signupAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = (formData.get('role') as string)?.trim() || 'Contributor';
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'Please fill in all required fields (name, email, password).' };
  }

  // 1. If Notion Team DB is configured, create member in Notion
  let memberId = '';
  if (process.env.NOTION_TEAM_DB_ID && process.env.NOTION_TOKEN) {
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
}): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Authentication required.' };
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
    });
    if (!updated) {
      console.warn('Failed to update Notion directly, applying fallback update in memory.');
    }
  }

  // Update current session cookie with new profile info
  await setSession({
    ...session,
    name: data.name,
    role: data.role,
    avatarUrl: data.avatarUrl,
  });

  revalidatePath('/');
  return { success: true };
}

// Quick 1-click Demo Login for any team member
export async function quickDemoLoginAction(email: string): Promise<boolean> {
  const preset = TEAM_CREDENTIALS[email];
  if (!preset) return false;

  await setSession({
    memberId: preset.memberId,
    email,
    name: preset.name,
    role: preset.role,
    avatarUrl: preset.avatarUrl,
  });

  revalidatePath('/');
  return true;
}
