// app/actions/upload.ts
'use server';

import { getSession } from '@/lib/auth';

/**
 * Primary: Uploads an image to Imgur (Global CDN, fast, reliable, high availability)
 */
async function uploadToImgur(bytes: Uint8Array): Promise<string> {
  const base64 = Buffer.from(bytes).toString('base64');
  const form = new FormData();
  form.append('image', base64);
  form.append('type', 'base64');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: 'Client-ID 546c25a59c58ad7',
      },
      body: form,
      signal: controller.signal,
    });

    const data = (await res.json()) as { success?: boolean; data?: { link?: string } };
    if (!res.ok || !data.data?.link) {
      throw new Error(`Imgur API error: status ${res.status}`);
    }

    return data.data.link;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Secondary fallback: Upload to tmpfiles.org
 */
async function uploadToTmpfiles(file: File, filename: string): Promise<string> {
  const form = new FormData();
  form.append('file', file, filename);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Tmpfiles API error: ${res.status}`);
    }

    const json = (await res.json()) as { status: string; data?: { url: string } };
    if (json.status !== 'success' || !json.data?.url) {
      throw new Error('Tmpfiles returned unparseable response');
    }

    // Direct download link conversion: https://tmpfiles.org/123/name.png -> https://tmpfiles.org/dl/123/name.png
    return json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Universal free image upload action for $0 Tech Stack.
 * Converts local image file to a permanent, public HTTPS URL for Notion compatibility.
 */
export async function uploadImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Sign in to upload images.' };
    }

    const file = (formData.get('avatar') || formData.get('file') || formData.get('image')) as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Please select a valid image file.' };
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      return { success: false, error: 'Supported image formats: JPG, PNG, WebP, GIF, SVG.' };
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Image file size must be under 10MB.' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const safeName = `upload-${Date.now()}.${extension}`;

    // 1. Primary: Upload to Imgur (Global high-speed CDN)
    try {
      const publicUrl = await uploadToImgur(bytes);
      return { success: true, url: publicUrl };
    } catch (primaryErr) {
      console.warn('Primary Imgur upload failed, attempting fallback to tmpfiles:', primaryErr);
    }

    // 2. Secondary fallback: tmpfiles.org
    try {
      const publicUrl = await uploadToTmpfiles(file, safeName);
      return { success: true, url: publicUrl };
    } catch (fallbackErr) {
      console.error('All free upload services failed:', fallbackErr);
      return {
        success: false,
        error: 'Failed to upload image. Please check your network and try again.',
      };
    }
  } catch (error) {
    console.error('Unexpected error in uploadImageAction:', error);
    return { success: false, error: 'An unexpected error occurred during image processing.' };
  }
}

// Backward-compatible alias for ProfileDrawer
export const uploadAvatarAction = uploadImageAction;
