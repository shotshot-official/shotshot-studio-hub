// scripts/update-descriptions.js
import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  console.error('NOTION_TOKEN is required');
  process.exit(1);
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const MEMBER_UPDATES = {
  // Seo Min-su
  'ab8035e5-a1e5-4114-add5-3a281ce8e849': {
    properties: {
      Specialty: {
        rich_text: [{ text: { content: 'Creative Direction · Full-Stack Web · End-to-End Production' } }],
      },
      FeaturedQuote: {
        rich_text: [{ text: { content: 'Every cut and line of code should serve the story—nothing purely decorative.' } }],
      },
      Bio: {
        rich_text: [{
          text: {
            content: 'Producer and full-stack developer running creative direction at SHOTSHOT Studio. He leads video production from initial treatment to final color grade, while architecting the studio\'s web applications and digital platforms.',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Hybrid Production & Direction' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Directs video shoots, oversees editing and color, and builds web applications in-house to keep every release cohesive and independent.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Creative Direction & Producing — Concept development, scheduling, and on-set directing for studio projects.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Cinematography & Post-Production — Multi-camera setups, lighting, audio engineering, and final master delivery.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Full-Stack Development — High-performance web platforms and content hubs built with Next.js and TypeScript.',
            },
          }],
        },
      },
    ],
  },

  // Kim Min-kyun
  '8bfd7aa5-de08-435f-8e87-4fec9cece432': {
    properties: {
      Specialty: {
        rich_text: [{ text: { content: 'Visual Directing · Location Cinematography · Color Pipeline' } }],
      },
      FeaturedQuote: {
        rich_text: [{ text: { content: 'Good directing makes an unfamiliar alley feel like a place you have known for years.' } }],
      },
      Bio: {
        rich_text: [{
          text: {
            content: 'Video director specializing in location cinematography, narrative rhythm, and color grading. Leads visual storytelling across the studio\'s original documentary and series releases.',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Visual Storytelling & Cinematography' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Captures the natural light, textures, and atmosphere of Seoul\'s neighborhoods using fluid handheld camera work and minimal artificial staging.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Location Cinematography — Documentary-style camera work capturing neighborhood streets, workshops, and interiors.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Narrative Pacing & Editorial — Precise cutting rhythm in Premiere Pro to balance narrative pacing with room to breathe.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Look Development & Color Grading — Custom film emulation and color pipelines tailored to each project.',
            },
          }],
        },
      },
    ],
  },

  // Yu Han-seong
  '08aa07df-050a-4b35-ab41-d4caafeb4698': {
    properties: {
      Specialty: {
        rich_text: [{ text: { content: 'On-Camera Hosting · Neighborhood Curation · Field Interviews' } }],
      },
      FeaturedQuote: {
        rich_text: [{ text: { content: 'The best spots in Seoul are found on foot, not in search engine rankings.' } }],
      },
      Bio: {
        rich_text: [{
          text: {
            content: 'On-camera host and creator exploring Seoul\'s neighborhoods. Researches local spaces, interviews shop owners and makers, and leads walking-tour series across the city.',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Neighborhood Curation & Hosting' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Spends time walking neighborhoods, building relationships with local shop owners and artisans, and sharing their stories on camera through genuine conversation.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Field Hosting & Moderation — Unscripted on-camera interviews that make guests and local artisans feel at ease.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Neighborhood Research — Documenting neighborhood history, walking pacing, and seasonal changes into practical field notes.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Episode Planning — Curating half-day walking routes that viewers can easily retrace on their own weekends.',
            },
          }],
        },
      },
    ],
  },

  // Won Jong-hyeon
  'a9877d00-485c-47f7-9feb-8cb405c3ad93': {
    properties: {
      Specialty: {
        rich_text: [{ text: { content: 'System Architecture · Product Strategy · Full-Stack Engineering' } }],
      },
      FeaturedQuote: {
        rich_text: [{ text: { content: 'Great studio software stays invisible so the creative work can speak at full volume.' } }],
      },
      Bio: {
        rich_text: [{
          text: {
            content: 'Tech lead and product designer turning the studio\'s video series and local archives into fast, responsive web applications. Designs data schemas and serverless web infrastructure.',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Systems & Product Architecture' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Builds the studio\'s digital products, transforming video content and neighborhood archives into structured, searchable web tools.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Serverless Web Architecture — High-speed, zero-maintenance web platforms powered by Next.js 15, edge caching, and Notion CMS.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Service & Schema Planning — User-friendly navigation, bilingual data schemas, and lightweight API pipelines.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Cross-Media Publishing — Linking video drops with live companion websites, map pins, and downloadable resources.',
            },
          }],
        },
      },
    ],
  },
};

const PRODUCT_UPDATES = {
  // Hanseong Spots
  'fd4b6861-18fd-4cd3-b1ae-63d83c9ec0d2': {
    properties: {
      BrandName: {
        title: [{ text: { content: 'Hanseong Spots (Seoul Field Notes)' } }],
      },
      OneLiner: {
        rich_text: [{ text: { content: 'A walking video guide to Seoul\'s quiet alleys, historic workshops, and independent local spaces.' } }],
      },
      Overview: {
        rich_text: [{
          text: {
            content: 'Hosted by Yu Han-seong, this series documents Seoul\'s lesser-known neighborhoods on foot. Moving away from crowded commercial hotspots, each episode focuses on independent shop owners, historic side streets, and practical half-day walking routes.',
          },
        }],
      },
      Deliverables: {
        rich_text: [{
          text: {
            content: '10–15 min cinematic walking episodes on YouTube\nHalf-day neighborhood walking maps and schedules\nArchived interviews with local shop owners and artisans',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Concept & Perspective' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'A quiet walking guide focused on neighborhoods that reward exploration on foot, skipping sponsored spots in favor of genuine neighborhood fixtures.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '02 // Production Details' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Walking Route Design — Half-day walking courses planned for natural flow and optimal daylight.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Maker Backstories — Short conversations exploring the history of each space and its neighborhood.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Web Companion — Every location links directly to the Seoul Pulse guide for map pins and opening hours.',
            },
          }],
        },
      },
    ],
  },

  // Seoul Pulse & Guide
  'd6ed899b-7346-4135-9071-36c40be5d484': {
    properties: {
      BrandName: {
        title: [{ text: { content: 'Seoul Pulse & Guide (Local Travel Wiki)' } }],
      },
      OneLiner: {
        rich_text: [{ text: { content: 'A bilingual web guide and short-form video series covering weekly top spots and practical Seoul travel tips.' } }],
      },
      Overview: {
        rich_text: [{
          text: {
            content: 'A lightweight web wiki paired with short-form video guides. Designed for international visitors and locals looking for reliable, candid advice on transit, payments, neighborhood cafes, and seasonal highlights.',
          },
        }],
      },
      Deliverables: {
        rich_text: [{
          text: {
            content: 'Bilingual web guide built with Next.js and Notion CMS\nWeekly curated top-five recommendations across Seoul\nShort-form video tips on local transit, payments, and reservations',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Scope & Practical Utility' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Designed to solve practical challenges travelers encounter in Seoul—from domestic map navigation to subway transfers and cashless payments.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '02 // Stack & Publishing' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Fast Web Experience — Built on Next.js 15 with instant caching and sub-second load times.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Weekly Spot Lists — Five verified recommendations updated weekly with peak-hour tips.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Video Previews — 30-second clips showing venue entrances and street-level views.',
            },
          }],
        },
      },
    ],
  },

  // Budget to Boutique
  '0c7fcc58-5ab2-411d-845a-9165782d5e04': {
    properties: {
      BrandName: {
        title: [{ text: { content: 'Budget to Boutique (Road Trip Series)' } }],
      },
      OneLiner: {
        rich_text: [{ text: { content: 'A travel series exploring Korea through strict spending caps and contrasting themes.' } }],
      },
      Overview: {
        rich_text: [{
          text: {
            content: 'Four studio members travel across Korean regions under creative constraints—from shoestring backpacker budgets to boutique countryside stays—comparing how different budgets shape the travel experience.',
          },
        }],
      },
      Deliverables: {
        rich_text: [{
          text: {
            content: 'Episodic travel documentary films\nOn-screen cost breakdowns and route tracking\nDownloadable Notion budget sheets and itinerary templates',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Concept & Rules' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Each episode tests a different budget constraint, testing whether thoughtful planning and local choices can outmatch big-spending tours.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '02 // Format Highlights' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Transparent Spending — Clear on-screen tallies for transport, stays, and meals.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Shareable Itineraries — Free Notion templates viewers can duplicate for their own trips.',
            },
          }],
        },
      },
    ],
  },

  // Seoul In-Between
  '46c72bb2-406c-4e49-9634-57390c40da42': {
    properties: {
      BrandName: {
        title: [{ text: { content: 'Seoul In-Between (Creator Dialogues)' } }],
      },
      OneLiner: {
        rich_text: [{ text: { content: 'Candid walking interviews with Seoul-based artists, designers, and craftspeople.' } }],
      },
      Overview: {
        rich_text: [{
          text: {
            content: 'A quiet interview series that steps away from formal studio sets. Host Yu Han-seong joins local creators in their workspaces and neighborhood haunts for unscripted conversations on craft, creative routines, and city life.',
          },
        }],
      },
      Deliverables: {
        rich_text: [{
          text: {
            content: '20-minute cinematic walking interviews\nPhoto essays of guest studios and neighborhoods\nBilingual transcripts and show notes',
          },
        }],
      },
    },
    blocks: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '01 // Format & Tone' } }],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{
            text: {
              content: 'Recorded on foot in the neighborhoods where guests live and work, giving the conversations an unhurried, natural tempo.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: '02 // Production Notes' } }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Continuous Takes — Long handheld takes that let conversations breathe naturally.',
            },
          }],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{
            text: {
              content: 'Natural Light & Sound — Filmed without heavy artificial lighting, using ambient city soundscapes.',
            },
          }],
        },
      },
    ],
  },
};

async function replacePageBlocks(pageId, newBlocks) {
  // 1. Fetch current blocks
  const existing = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });
  
  // 2. Delete existing blocks
  for (const block of existing.results) {
    try {
      await notion.blocks.delete({ block_id: block.id });
    } catch (err) {
      console.warn(`Could not delete block ${block.id}:`, err.message);
    }
  }

  // 3. Append new blocks
  if (newBlocks && newBlocks.length > 0) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: newBlocks,
    });
  }
}

async function run() {
  console.log('--- UPDATING MEMBER DB IN NOTION ---');
  for (const [id, update] of Object.entries(MEMBER_UPDATES)) {
    console.log(`Updating member ${id}...`);
    await notion.pages.update({
      page_id: id,
      properties: update.properties,
    });
    console.log(`Updating child blocks for member ${id}...`);
    await replacePageBlocks(id, update.blocks);
    console.log(`Member ${id} updated successfully.`);
  }

  console.log('--- UPDATING PRODUCTS DB IN NOTION ---');
  for (const [id, update] of Object.entries(PRODUCT_UPDATES)) {
    console.log(`Updating product ${id}...`);
    await notion.pages.update({
      page_id: id,
      properties: update.properties,
    });
    console.log(`Updating child blocks for product ${id}...`);
    await replacePageBlocks(id, update.blocks);
    console.log(`Product ${id} updated successfully.`);
  }

  console.log('ALL NOTION DB ENTRIES UPDATED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
