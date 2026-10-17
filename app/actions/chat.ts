// app/actions/chat.ts
'use server';

import { getSession } from '@/lib/auth';
import { getChatMessages, sendChatMessageInNotion } from '@/lib/notion';
import { getMockChatMessages, addMockChatMessage } from '@/lib/mock-data';
import { ChatMessage } from '@/types/notion';

export async function fetchChatMessagesAction(): Promise<ChatMessage[]> {
  const notionMessages = await getChatMessages();
  if (notionMessages.length > 0) {
    return notionMessages;
  }
  return getMockChatMessages();
}

export async function sendChatMessageAction(content: string): Promise<{ success: boolean; error?: string; message?: ChatMessage }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Please sign in to send messages to the studio feed.' };
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return { success: false, error: 'Message cannot be empty.' };
  }
  if (trimmed.length > 500) {
    return { success: false, error: 'Message cannot exceed 500 characters.' };
  }

  const messagePayload = {
    senderId: session.memberId,
    senderName: session.name,
    senderRole: session.role,
    senderAvatar: session.avatarUrl,
    content: trimmed,
  };

  // If Notion Messages DB is configured, send to Notion
  if (process.env.NOTION_MESSAGES_DB_ID && process.env.NOTION_TOKEN) {
    await sendChatMessageInNotion({
      senderName: session.name,
      senderRole: session.role,
      senderAvatar: session.avatarUrl,
      content: trimmed,
    });
  }

  // Always keep mock storage updated for instant UI responsiveness
  const createdMsg = addMockChatMessage(messagePayload);

  return { success: true, message: createdMsg };
}
