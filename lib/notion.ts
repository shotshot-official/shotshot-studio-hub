// lib/notion.ts
import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  TeamMember,
  ProductItem,
  ContentBlock,
} from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const MEMBER_DB_ID = process.env.NOTION_MEMBER_DB_ID || '';
const PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID || '';

function isFullPage(response: unknown): response is PageObjectResponse {
  return typeof response === 'object' && response !== null && 'properties' in response;
}

function isFullBlock(response: unknown): response is BlockObjectResponse {
  return typeof response === 'object' && response !== null && 'type' in response;
}

function joinRichText(items: RichTextItemResponse[]): string {
  return items.map((item) => item.plain_text).join('').trim();
}

export function isMemberInProduct(member: TeamMember, product: ProductItem): boolean {
  const memberNameLower = member.name.toLowerCase().trim();
  return product.memberIds.some((idOrName) => {
    const token = idOrName.toLowerCase().trim();
    return (
      idOrName === member.id ||
      token === memberNameLower ||
      token.includes(memberNameLower) ||
      memberNameLower.includes(token)
    );
  });
}

export async function getPageBlocks(pageId: string): Promise<ContentBlock[]> {
  if (
    !process.env.NOTION_TOKEN ||
    !/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(pageId)
  ) {
    return [];
  }

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 50,
    });

    const blocks: ContentBlock[] = [];
    for (const raw of response.results) {
      if (!isFullBlock(raw)) continue;

      switch (raw.type) {
        case 'paragraph': {
          const text = joinRichText(raw.paragraph.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'paragraph', text });
          break;
        }
        case 'heading_1': {
          const text = joinRichText(raw.heading_1.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'heading_1', text });
          break;
        }
        case 'heading_2': {
          const text = joinRichText(raw.heading_2.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'heading_2', text });
          break;
        }
        case 'heading_3': {
          const text = joinRichText(raw.heading_3.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'heading_3', text });
          break;
        }
        case 'bulleted_list_item': {
          const text = joinRichText(raw.bulleted_list_item.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'bulleted_list_item', text });
          break;
        }
        case 'numbered_list_item': {
          const text = joinRichText(raw.numbered_list_item.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'numbered_list_item', text });
          break;
        }
        case 'quote': {
          const text = joinRichText(raw.quote.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'quote', text });
          break;
        }
        case 'callout': {
          const text = joinRichText(raw.callout.rich_text);
          if (text) blocks.push({ id: raw.id, type: 'callout', text });
          break;
        }
        case 'divider': {
          blocks.push({ id: raw.id, type: 'divider', text: '' });
          break;
        }
        default:
          break;
      }
    }

    return blocks;
  } catch (error) {
    console.error(`Failed to fetch Notion blocks for page ${pageId}:`, error);
    return [];
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!MEMBER_DB_ID || !process.env.NOTION_TOKEN) {
    console.warn('NOTION_MEMBER_DB_ID or NOTION_TOKEN is not defined in environment variables.');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: MEMBER_DB_ID,
    });

    return response.results.filter(isFullPage).map((page) => {
      const props = page.properties;
      const name = props.Name?.type === 'title' ? props.Name.title[0]?.plain_text : undefined;
      const role =
        props.Role?.type === 'select'
          ? props.Role.select?.name
          : props.Role?.type === 'rich_text'
          ? joinRichText(props.Role.rich_text)
          : undefined;
      const skills = props.Skills?.type === 'multi_select' ? props.Skills.multi_select.map((s) => s.name) : [];

      const bioProp = props.Bio || props.Description || props.Intro || props.About;
      const bio =
        bioProp?.type === 'rich_text' && bioProp.rich_text.length > 0
          ? joinRichText(bioProp.rich_text)
          : undefined;

      const specialtyProp = props.Specialty || props.Focus;
      const specialty =
        specialtyProp?.type === 'rich_text' && specialtyProp.rich_text.length > 0
          ? joinRichText(specialtyProp.rich_text)
          : undefined;

      const quoteProp = props.FeaturedQuote || props.Quote || props.Motto;
      const featuredQuote =
        quoteProp?.type === 'rich_text' && quoteProp.rich_text.length > 0
          ? joinRichText(quoteProp.rich_text)
          : undefined;

      // Extract Email (support Email/Gmail property as email or rich_text, or parse from personalLinks)
      let email: string | undefined = undefined;
      const emailProp = props.Email || props.Gmail || props.email;
      if (emailProp?.type === 'email' && emailProp.email) {
        email = emailProp.email.trim().toLowerCase();
      } else if (emailProp?.type === 'rich_text') {
        email = emailProp.rich_text[0]?.plain_text?.trim().toLowerCase();
      }

      // Extract Password (support Password property as rich_text, number, or title)
      let password: string | undefined = undefined;
      const passProp = props.Password || props.password || props.PW;
      if (passProp?.type === 'rich_text' && passProp.rich_text.length > 0) {
        password = passProp.rich_text[0]?.plain_text?.trim();
      } else if (passProp?.type === 'number' && passProp.number !== null && passProp.number !== undefined) {
        password = String(passProp.number);
      }

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

      // Extract Personal Links (Single URL or newline/space/comma separated URLs in Rich Text)
      const personalLinks: string[] = [];
      const linksProp =
        props.PersonalLinks ||
        props.Links ||
        props.SocialLinks ||
        props.Social ||
        props.SNS ||
        props.Link;

      if (linksProp?.type === 'url' && linksProp.url) {
        personalLinks.push(linksProp.url);
      } else if (linksProp?.type === 'rich_text') {
        const rawText = linksProp.rich_text.map((t) => t.plain_text).join('\n');
        const matchedUrls = rawText.match(/https?:\/\/[^\s,]+/g);
        if (matchedUrls && matchedUrls.length > 0) {
          personalLinks.push(...matchedUrls);
        } else {
          // Fallback: split by newlines, commas, or spaces for raw domain entries (e.g. github.com/user)
          const tokens = rawText.split(/[\n,\s]+/).map((s) => s.trim()).filter(Boolean);
          for (const token of tokens) {
            if (/^https?:\/\//i.test(token) || token.startsWith('mailto:')) {
              personalLinks.push(token);
            } else if (token.includes('.') && !token.includes('@')) {
              personalLinks.push(`https://${token}`);
            }
          }
        }
        if (!email) {
          const matchedEmail = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (matchedEmail) email = matchedEmail[0].toLowerCase();
        }
      }

      return {
        id: page.id,
        name: name || 'Anonymous Member',
        role: role || 'Contributor',
        skills,
        avatarUrl,
        bio,
        specialty,
        featuredQuote,
        email,
        password,
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
      const brandName = props.BrandName?.type === 'title' ? joinRichText(props.BrandName.title) : undefined;
      const category =
        props.Category?.type === 'select'
          ? props.Category.select?.name
          : props.Category?.type === 'rich_text'
          ? joinRichText(props.Category.rich_text)
          : undefined;
      const timeline =
        props.Timeline?.type === 'rich_text' && props.Timeline.rich_text.length > 0
          ? joinRichText(props.Timeline.rich_text)
          : undefined;
      const oneLiner = props.OneLiner?.type === 'rich_text' ? joinRichText(props.OneLiner.rich_text) : undefined;
      const overviewProp = props.Overview || props.Description || props.Summary;
      const overview =
        overviewProp?.type === 'rich_text' && overviewProp.rich_text.length > 0
          ? joinRichText(overviewProp.rich_text)
          : undefined;

      const deliverablesProp = props.Deliverables || props.Highlights;
      const deliverables =
        deliverablesProp?.type === 'rich_text' && deliverablesProp.rich_text.length > 0
          ? joinRichText(deliverablesProp.rich_text)
              .split(/\n+/)
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined;

      const videoUrl =
        props.VideoURL?.type === 'url' && props.VideoURL.url
          ? props.VideoURL.url
          : undefined;

      const memberIds: string[] = [];
      if (props.Members?.type === 'relation') {
        memberIds.push(...props.Members.relation.map((r) => r.id));
      } else if (props.Members?.type === 'multi_select') {
        memberIds.push(...props.Members.multi_select.map((s) => s.name));
      }

      const techStack: string[] = [];
      if (props.TechStack?.type === 'multi_select') {
        techStack.push(...props.TechStack.multi_select.map((s) => s.name));
      }
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
        category,
        timeline,
        oneLiner: oneLiner || '',
        overview,
        deliverables,
        videoUrl,
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
  category?: string;
  timeline?: string;
  oneLiner: string;
  overview?: string;
  deliverables?: string[];
  videoUrl?: string;
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
      OneLiner: {
        rich_text: [{ text: { content: data.oneLiner } }],
      },
    };

    if (data.category) {
      properties.Category = { select: { name: data.category } };
    }
    if (data.timeline) {
      properties.Timeline = { rich_text: [{ text: { content: data.timeline } }] };
    }
    if (data.techStack && data.techStack.length > 0) {
      properties.TechStack = {
        multi_select: data.techStack.map((name) => ({ name })),
      };
    }
    if (data.memberIds && data.memberIds.length > 0) {
      properties.Members = {
        relation: data.memberIds.map((id) => ({ id })),
      };
    }
    if (data.overview) {
      properties.Overview = { rich_text: [{ text: { content: data.overview } }] };
    }
    if (data.deliverables && data.deliverables.length > 0) {
      properties.Deliverables = {
        rich_text: [{ text: { content: data.deliverables.join('\n') } }],
      };
    }
    if (data.videoUrl) {
      properties.VideoURL = { url: data.videoUrl };
    }
    if (data.liveUrl) {
      properties.LiveURL = { url: data.liveUrl };
    }
    if (data.internalLink) {
      properties.InternalLinks = { url: data.internalLink };
    }
    if (data.coverImage) {
      properties.CoverImage = { url: data.coverImage };
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

export async function updateProductInNotion(
  pageId: string,
  data: {
    brandName?: string;
    category?: string;
    timeline?: string;
    oneLiner?: string;
    overview?: string;
    deliverables?: string[];
    videoUrl?: string;
    memberIds?: string[];
    techStack?: string[];
    liveUrl?: string;
    internalLink?: string;
    coverImage?: string;
  }
): Promise<boolean> {
  if (!process.env.NOTION_TOKEN) return false;

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isFullPage(page)) return false;
    const pageProps = page.properties;

    const properties: Record<string, unknown> = {};

    if (data.brandName !== undefined && pageProps.BrandName) {
      properties.BrandName = {
        title: [{ text: { content: data.brandName } }],
      };
    }
    if (data.category !== undefined && pageProps.Category) {
      properties.Category = data.category ? { select: { name: data.category } } : { select: null };
    }
    if (data.timeline !== undefined && pageProps.Timeline) {
      properties.Timeline = {
        rich_text: data.timeline ? [{ text: { content: data.timeline } }] : [],
      };
    }
    if (data.techStack !== undefined && pageProps.TechStack) {
      properties.TechStack = {
        multi_select: data.techStack.map((name) => ({ name })),
      };
    }
    if (data.memberIds !== undefined && pageProps.Members) {
      properties.Members = {
        relation: data.memberIds.map((id) => ({ id })),
      };
    }
    if (data.oneLiner !== undefined && pageProps.OneLiner) {
      properties.OneLiner = {
        rich_text: data.oneLiner ? [{ text: { content: data.oneLiner } }] : [],
      };
    }
    if (data.overview !== undefined && pageProps.Overview) {
      properties.Overview = {
        rich_text: data.overview ? [{ text: { content: data.overview } }] : [],
      };
    }
    if (data.deliverables !== undefined && pageProps.Deliverables) {
      properties.Deliverables = {
        rich_text:
          data.deliverables.length > 0
            ? [{ text: { content: data.deliverables.join('\n') } }]
            : [],
      };
    }
    if (data.videoUrl !== undefined && pageProps.VideoURL) {
      properties.VideoURL = { url: data.videoUrl || null };
    }
    if (data.liveUrl !== undefined && pageProps.LiveURL) {
      properties.LiveURL = { url: data.liveUrl || null };
    }
    if (data.internalLink !== undefined && pageProps.InternalLinks) {
      properties.InternalLinks = { url: data.internalLink || null };
    }
    if (data.coverImage !== undefined && pageProps.CoverImage) {
      properties.CoverImage = { url: data.coverImage || null };
    }

    await notion.pages.update({
      page_id: pageId,
      properties: properties as Parameters<typeof notion.pages.update>[0]['properties'],
    });

    return true;
  } catch (error) {
    console.error('Failed to update Product in Notion:', error);
    return false;
  }
}

export async function updateTeamMemberInNotion(
  pageId: string,
  data: {
    name?: string;
    role?: string;
    bio?: string;
    specialty?: string;
    featuredQuote?: string;
    skills?: string[];
    avatarUrl?: string;
    personalLinks?: string[];
    password?: string;
  }
): Promise<boolean> {
  if (!process.env.NOTION_TOKEN) return false;

  try {
    // 1. Retrieve page first to dynamically inspect which properties exist on this Notion page
    const page = await notion.pages.retrieve({ page_id: pageId });
    if (!isFullPage(page)) return false;
    const pageProps = page.properties;

    const properties: Record<string, unknown> = {};

    if (data.name && pageProps.Name) {
      properties.Name = {
        title: [{ text: { content: data.name } }],
      };
    }
    if (data.role && pageProps.Role) {
      properties.Role = {
        select: { name: data.role },
      };
    }
    if (data.bio !== undefined && pageProps.Bio) {
      properties.Bio = {
        rich_text: data.bio ? [{ text: { content: data.bio } }] : [],
      };
    }
    if (data.specialty !== undefined && pageProps.Specialty) {
      properties.Specialty = {
        rich_text: data.specialty ? [{ text: { content: data.specialty } }] : [],
      };
    }
    if (data.featuredQuote !== undefined && pageProps.FeaturedQuote) {
      properties.FeaturedQuote = {
        rich_text: data.featuredQuote ? [{ text: { content: data.featuredQuote } }] : [],
      };
    }
    if (data.skills && pageProps.Skills) {
      properties.Skills = {
        multi_select: data.skills.map((s) => ({ name: s })),
      };
    }

    // Avatar update: support both setting a new public URL and clearing the photo
    if (data.avatarUrl !== undefined && pageProps.Avatar) {
      const avatarPropType = pageProps.Avatar.type;
      if (avatarPropType === 'url') {
        properties.Avatar = { url: data.avatarUrl ? data.avatarUrl : null };
      } else if (avatarPropType === 'files') {
        properties.Avatar = {
          files: data.avatarUrl
            ? [
                {
                  name: 'avatar',
                  type: 'external',
                  external: { url: data.avatarUrl },
                },
              ]
            : [],
        };
      }
    }

    // Update PersonalLinks: dynamically find PersonalLinks, Links, SocialLinks, Social, SNS, Link
    const linksPropKey = Object.keys(pageProps).find((key) =>
      ['personallinks', 'links', 'sociallinks', 'social', 'sns', 'link'].includes(key.toLowerCase())
    );

    if (data.personalLinks !== undefined && linksPropKey && pageProps[linksPropKey]) {
      const targetProp = pageProps[linksPropKey];
      if (targetProp.type === 'rich_text') {
        properties[linksPropKey] = {
          rich_text:
            data.personalLinks.length > 0
              ? [
                  {
                    text: { content: data.personalLinks.join('\n') },
                  },
                ]
              : [],
        };
      } else if (targetProp.type === 'url') {
        properties[linksPropKey] = {
          url: data.personalLinks[0] || null,
        };
      }
    }

    if (data.password && pageProps.Password) {
      properties.Password = {
        rich_text: [
          {
            text: { content: data.password },
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
  email?: string;
  password?: string;
}): Promise<string | null> {
  if (!MEMBER_DB_ID || !process.env.NOTION_TOKEN) return null;

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

    if (data.email) {
      properties.Email = { email: data.email };
    }

    if (data.password) {
      properties.Password = {
        rich_text: [{ text: { content: data.password } }],
      };
    }

    if (data.avatarUrl) {
      // Notion Member DB uses URL type for Avatar
      properties.Avatar = { url: data.avatarUrl };
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
      parent: { database_id: MEMBER_DB_ID },
      properties: properties as Parameters<typeof notion.pages.create>[0]['properties'],
    });

    return response.id;
  } catch (error) {
    console.error('Failed to create Team Member in Notion:', error);
    return null;
  }
}


