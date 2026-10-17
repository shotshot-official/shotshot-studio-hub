// lib/notion.ts
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { TeamMember, ProductItem, MemberStatus, ProductStatus, ChatMessage } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const TEAM_DB_ID = process.env.NOTION_TEAM_DB_ID || '';
const PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID || '';
const MESSAGES_DB_ID = process.env.NOTION_MESSAGES_DB_ID || '';

function isFullPage(response: unknown): response is PageObjectResponse {
  return typeof response === 'object' && response !== null && 'properties' in response;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!TEAM_DB_ID || !process.env.NOTION_TOKEN) {
    console.warn('NOTION_TEAM_DB_ID or NOTION_TOKEN is not defined in environment variables.');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: TEAM_DB_ID,
    });

    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const name = props.Name?.type === 'title' ? props.Name.title[0]?.plain_text : undefined;
      const role = props.Role?.type === 'select' ? props.Role.select?.name : undefined;
      const skills = props.Skills?.type === 'multi_select' ? props.Skills.multi_select.map((s) => s.name) : [];
      const status = props.Status?.type === 'status' ? props.Status.status?.name : undefined;
      // Extract Avatar URL (Files & media or URL)
      let avatarUrl: string | undefined = undefined;
      const avatarProp = props.Avatar || props.ProfileImage || props.Photo;
      if (avatarProp?.type === 'files' && avatarProp.files.length > 0) {
        const fileObj = avatarProp.files[0];
        if (fileObj.type === 'external') {
          avatarUrl = fileObj.external.url;
        } else if (fileObj.type === 'file') {
          avatarUrl = fileObj.file.url;
        }
      } else if (avatarProp?.type === 'url' && avatarProp.url) {
        avatarUrl = avatarProp.url;
      }

      // Extract Personal Links (Single URL or space/comma separated URLs in Rich Text)
      const personalLinks: string[] = [];
      if (props.PersonalLinks?.type === 'url' && props.PersonalLinks.url) {
        personalLinks.push(props.PersonalLinks.url);
      } else if (props.PersonalLinks?.type === 'rich_text') {
        const rawText = props.PersonalLinks.rich_text.map((t) => t.plain_text).join(' ');
        const matchedUrls = rawText.match(/https?:\/\/[^\s,]+/g);
        if (matchedUrls) {
          personalLinks.push(...matchedUrls);
        }
      }

      return {
        id: page.id,
        name: name || 'Anonymous Member',
        role: role || 'Contributor',
        skills,
        avatarUrl,
        status: (status as MemberStatus) || 'Away',
        personalLink: personalLinks[0] || undefined,
        personalLinks,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Team Members from Notion:', error);
    return [];
  }
}

export async function getProducts(): Promise<ProductItem[]> {
  if (!PRODUCTS_DB_ID || !process.env.NOTION_TOKEN) {
    console.warn('NOTION_PRODUCTS_DB_ID or NOTION_TOKEN is not defined in environment variables.');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: PRODUCTS_DB_ID,
    });

    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const brandName = props.BrandName?.type === 'title' ? props.BrandName.title[0]?.plain_text : undefined;
      const status = props.Status?.type === 'select' ? props.Status.select?.name : undefined;
      const oneLiner = props.OneLiner?.type === 'rich_text' ? props.OneLiner.rich_text[0]?.plain_text : undefined;
      let memberIds: string[] = [];
      if (props.Members?.type === 'relation') {
        memberIds = props.Members.relation.map((r) => r.id);
      } else if (props.Members?.type === 'rich_text') {
        const rawText = props.Members.rich_text.map((t) => t.plain_text).join(' ');
        memberIds = rawText.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
      }

      const techStack = props.TechStack?.type === 'multi_select' ? props.TechStack.multi_select.map((t) => t.name) : [];
      const liveUrl = props.LiveURL?.type === 'url' ? props.LiveURL.url : undefined;
      const internalLink = props.InternalLinks?.type === 'url' ? props.InternalLinks.url : undefined;

      // Notion Image Defense: Support both URL property and Files & media property
      let coverImage: string | undefined = undefined;
      if (props.CoverImage?.type === 'url' && props.CoverImage.url) {
        coverImage = props.CoverImage.url;
      } else if (props.CoverImage?.type === 'files' && props.CoverImage.files.length > 0) {
        const fileObj = props.CoverImage.files[0];
        if (fileObj.type === 'external') {
          coverImage = fileObj.external.url;
        } else if (fileObj.type === 'file') {
          coverImage = fileObj.file.url;
        }
      }

      return {
        id: page.id,
        brandName: brandName || 'Untitled Project',
        status: (status as ProductStatus) || 'Concept',
        oneLiner: oneLiner || '',
        memberIds,
        techStack,
        liveUrl: liveUrl || undefined,
        internalLink: internalLink || undefined,
        coverImage,
      };
    });
  } catch (error) {
    console.error('Failed to fetch Products from Notion:', error);
    return [];
  }
}

export async function createProductInNotion(data: {
  brandName: string;
  status: ProductStatus;
  oneLiner: string;
  memberIds?: string[];
  techStack?: string[];
  liveUrl?: string;
  internalLink?: string;
  coverImage?: string;
}): Promise<string | null> {
  if (!PRODUCTS_DB_ID || !process.env.NOTION_TOKEN) return null;

  try {
    const properties: Record<string, unknown> = {
      BrandName: {
        title: [{ text: { content: data.brandName } }],
      },
      Status: {
        select: { name: data.status },
      },
      OneLiner: {
        rich_text: [{ text: { content: data.oneLiner } }],
      },
      TechStack: {
        multi_select: (data.techStack || []).map((t) => ({ name: t })),
      },
    };

    if (data.liveUrl) {
      properties.LiveURL = { url: data.liveUrl };
    }
    if (data.internalLink) {
      properties.InternalLinks = { url: data.internalLink };
    }
    if (data.coverImage) {
      properties.CoverImage = { url: data.coverImage };
    }
    if (data.memberIds && data.memberIds.length > 0) {
      const validUuids = data.memberIds.filter((id) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      );
      if (validUuids.length > 0) {
        properties.Members = {
          relation: validUuids.map((id) => ({ id })),
        };
      }
    }

    const response = await notion.pages.create({
      parent: { database_id: PRODUCTS_DB_ID },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return response.id;
  } catch (error) {
    console.error('Failed to create Product in Notion:', error);
    return null;
  }
}

export async function updateTeamMemberInNotion(
  pageId: string,
  data: {
    name?: string;
    role?: string;
    skills?: string[];
    avatarUrl?: string;
    personalLinks?: string[];
  }
): Promise<boolean> {
  if (!process.env.NOTION_TOKEN) return false;

  try {
    const properties: Record<string, unknown> = {};

    if (data.name) {
      properties.Name = {
        title: [{ text: { content: data.name } }],
      };
    }
    if (data.role) {
      properties.Role = {
        select: { name: data.role },
      };
    }
    if (data.skills) {
      properties.Skills = {
        multi_select: data.skills.map((s) => ({ name: s })),
      };
    }
    if (data.avatarUrl) {
      properties.Avatar = {
        files: [
          {
            name: 'avatar',
            type: 'external',
            external: { url: data.avatarUrl },
          },
        ],
      };
    }
    if (data.personalLinks) {
      properties.PersonalLinks = {
        rich_text: [
          {
            text: { content: data.personalLinks.join('\n') },
          },
        ],
      };
    }

    await notion.pages.update({
      page_id: pageId,
      properties: properties as Parameters<typeof notion.pages.update>[0]['properties'],
    });
    return true;
  } catch (error) {
    console.error('Failed to update Notion team member:', error);
    return false;
  }
}

export async function createTeamMemberInNotion(data: {
  name: string;
  role: string;
  skills?: string[];
  avatarUrl?: string;
  personalLinks?: string[];
}): Promise<string | null> {
  if (!TEAM_DB_ID || !process.env.NOTION_TOKEN) return null;

  try {
    const properties: Record<string, unknown> = {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      Role: {
        select: { name: data.role },
      },
      Skills: {
        multi_select: (data.skills || ['Creator', 'Contributor']).map((s) => ({ name: s })),
      },
    };

    if (data.avatarUrl) {
      properties.Avatar = {
        files: [
          {
            name: 'avatar',
            type: 'external',
            external: { url: data.avatarUrl },
          },
        ],
      };
    }

    if (data.personalLinks && data.personalLinks.length > 0) {
      properties.PersonalLinks = {
        rich_text: [
          {
            text: { content: data.personalLinks.join('\n') },
          },
        ],
      };
    }

    const response = await notion.pages.create({
      parent: { database_id: TEAM_DB_ID },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return response.id;
  } catch (error) {
    console.error('Failed to create Team Member in Notion:', error);
    return null;
  }
}

export async function getChatMessages(): Promise<ChatMessage[]> {
  if (!MESSAGES_DB_ID || !process.env.NOTION_TOKEN) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: MESSAGES_DB_ID,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'ascending',
        },
      ],
    });

    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const content =
        props.Message?.type === 'title'
          ? props.Message.title[0]?.plain_text
          : props.Message?.type === 'rich_text'
          ? props.Message.rich_text[0]?.plain_text
          : '';
      const senderName =
        props.SenderName?.type === 'rich_text'
          ? props.SenderName.rich_text[0]?.plain_text
          : props.SenderName?.type === 'title'
          ? props.SenderName.title[0]?.plain_text
          : 'Anonymous';
      const senderRole =
        props.SenderRole?.type === 'select'
          ? props.SenderRole.select?.name
          : props.SenderRole?.type === 'rich_text'
          ? props.SenderRole.rich_text[0]?.plain_text
          : 'Member';

      let senderAvatar: string | undefined = undefined;
      if (props.SenderAvatar?.type === 'url' && props.SenderAvatar.url) {
        senderAvatar = props.SenderAvatar.url;
      }

      return {
        id: page.id,
        senderId: page.id,
        senderName: senderName || 'Anonymous',
        senderRole: senderRole || 'Member',
        senderAvatar,
        content: content || '',
        createdAt: (page as { created_time?: string }).created_time || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('Failed to fetch Chat Messages from Notion:', error);
    return [];
  }
}

export async function sendChatMessageInNotion(msg: {
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  content: string;
}): Promise<boolean> {
  if (!MESSAGES_DB_ID || !process.env.NOTION_TOKEN) return false;

  try {
    const properties: Record<string, unknown> = {
      Message: {
        title: [{ text: { content: msg.content } }],
      },
      SenderName: {
        rich_text: [{ text: { content: msg.senderName } }],
      },
      SenderRole: {
        select: { name: msg.senderRole },
      },
    };

    if (msg.senderAvatar) {
      properties.SenderAvatar = {
        url: msg.senderAvatar,
      };
    }

    await notion.pages.create({
      parent: { database_id: MESSAGES_DB_ID },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });
    return true;
  } catch (error) {
    console.error('Failed to send message to Notion:', error);
    return false;
  }
}


