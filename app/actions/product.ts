// app/actions/product.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { createProductInNotion } from '@/lib/notion';
import { ProductStatus } from '@/types/notion';

export async function createProductAction(data: {
  brandName: string;
  status: ProductStatus;
  oneLiner: string;
  memberIds: string[];
  techStack: string[];
  liveUrl?: string;
  internalLink?: string;
  coverImage?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Sign in is required to publish a project to the matrix.' };
  }

  const brandName = data.brandName.trim();
  if (!brandName) {
    return { success: false, error: 'Brand name is required.' };
  }

  const oneLiner = data.oneLiner.trim();
  if (!oneLiner) {
    return { success: false, error: 'A one-liner description is required.' };
  }

  // Include current member in project contributors
  const memberIds = Array.from(new Set([...data.memberIds, session.memberId])).filter(Boolean);

  const notionId = await createProductInNotion({
    brandName,
    status: data.status,
    oneLiner,
    memberIds,
    techStack: data.techStack,
    liveUrl: data.liveUrl?.trim() || undefined,
    internalLink: data.internalLink?.trim() || undefined,
    coverImage: data.coverImage?.trim() || undefined,
  });

  if (!notionId) {
    return { success: false, error: 'Failed to publish project to Notion database.' };
  }

  revalidatePath('/');
  return { success: true, id: notionId };
}
