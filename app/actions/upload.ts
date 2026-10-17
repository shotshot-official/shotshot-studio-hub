// app/actions/upload.ts
'use server';

import fs from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';

export async function uploadAvatarAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: '로그인 후 사진을 업로드할 수 있습니다.' };
    }

    const file = formData.get('avatar') as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: '유효한 이미지 파일을 선택해 주세요.' };
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      return { success: false, error: 'JPG, PNG, WebP, GIF, SVG 형식의 이미지 파일만 지원됩니다.' };
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: '파일 크기는 최대 5MB까지 업로드 가능합니다.' };
    }

    // Prepare uploads directory in public folder
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Sanitize extension
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeMemberSlug = session.name.replace(/[^a-zA-Z0-9가-힣]/g, '_');
    const filename = `avatar-${safeMemberSlug}-${Date.now()}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    // Write file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    return { success: false, error: '이미지 업로드 중 오류가 발생했습니다.' };
  }
}
