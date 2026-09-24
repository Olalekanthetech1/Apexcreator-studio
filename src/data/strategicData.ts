import { CaseStudy, TeamMember, InsightArticle } from '../types';

export const INITIAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-tech-streamer',
    clientName: 'Apex Gaming Tech',
    clientHandle: '@ApexGamingTech',
    platform: 'YouTube',
    serviceCategory: 'YouTube',
    title: 'How Apex Gaming Tech Scaled Organic Engagement by 315% in 60 Days',
    summary: 'A complete channel overhaul including custom 4K thumbnails, high-CTR title engineering, and retention-focused video pacing.',
    challenge: 'Apex Gaming Tech was getting steady views but suffering from a low 2.1% Click-Through Rate (CTR) and a high 45% drop-off in the first 30 seconds of video uploads due to weak packaging and uninspired branding.',
    strategy: 'ApexCreator Studio implemented a multi-stage channel transformation: redesigned high-contrast 3D-styled thumbnails, optimized metadata with targeted long-tail search intent, and instituted a standardized intro hook structure.',
    execution: [
      'Engineered 12 bespoke high-CTR thumbnail templates with vibrant typography & lighting',
      'Restructured video title hooks using curiosity-gap and high-search-intent keywords',
      'Configured YouTube Studio uploading defaults, end screens, and info cards for viewer retention looping',
      'Audited audience analytics to identify peak upload timing for North American creator audiences'
    ],
    metrics: [
      { label: 'Click-Through Rate (CTR)', value: '8.7%', change: '+314%', isPositive: true },
      { label: 'Avg View Duration', value: '7m 42s', change: '+185%', isPositive: true },
      { label: 'Monthly Subscribers', value: '+14,200', change: '+290%', isPositive: true }
    ],
    testimonialQuote: 'Working with ApexCreator Studio completely unlocked our channel growth. The thumbnail designs and title strategies doubled our CTR in less than two weeks!',
    beforeImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80',
    timeframe: '60 Days Execution'
  },
  {
    id: 'cs-twitch-partner',
    clientName: 'ValkyrieVibes',
    clientHandle: 'twitch.tv/ValkyrieVibes',
    platform: 'Twitch',
    serviceCategory: 'Twitch',
    title: 'Twitch Channel Rebrand & Stream Package Boosts Viewer Retention by 180%',
    summary: 'Custom animated stream overlays, alert badges, stingers, and panel graphics created a broadcast-quality live stream environment.',
    challenge: 'ValkyrieVibes had strong gameplay skills but a cluttered, amateur stream layout that caused new raid viewers to drop off before subscribing or following.',
    strategy: 'We crafted an ultra-clean, cyberpunk neon stream package featuring dynamic animated overlay scenes, sleek chat boxes, sub alerts, and custom channel panel graphics.',
    execution: [
      'Designed animated Starting Soon, Be Right Back, and Stream Ended scenes',
      'Created custom Twitch emotes, sub badges, and cheer bit badges',
      'Integrated Streamlabs/OBS alert animations with sound cues',
      'Formatted full channel panel bio graphics with direct tip & sponsor links'
    ],
    metrics: [
      { label: 'Average Concurrent Viewers', value: '420 CCV', change: '+180%', isPositive: true },
      { label: 'Sub Count Conversion', value: '1,150 Subs', change: '+210%', isPositive: true },
      { label: 'Chat Engagement Rate', value: '94%', change: '+145%', isPositive: true }
    ],
    testimonialQuote: 'The stream package feels like an ESPN or esports level broadcast now. My community loves the custom emotes and sub alerts!',
    beforeImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    timeframe: '30 Days Execution'
  },
  {
    id: 'cs-shopify-merch',
    clientName: 'Mythic Creator Apparel',
    clientHandle: 'mythicapparel.shop',
    platform: 'Shopify',
    serviceCategory: 'Graphics & Branding',
    title: 'Creator Merchandise Store Launch Generates $42,000 in First Month',
    summary: 'A turnkey Shopify creator store setup with custom apparel branding, mockups, high-converting product pages, and social media ad creatives.',
    challenge: 'A gaming creator with 300k followers wanted to launch a merch line but lacked e-commerce experience and had no high-converting store setup.',
    strategy: 'ApexCreator Studio handled end-to-end e-commerce branding: apparel artwork design, high-converting Shopify store build, automated checkout setup, and launch promotional graphics.',
    execution: [
      'Designed 6 custom streetwear apparel graphics for hoodies, tees, and caps',
      'Built a high-converting, mobile-first Shopify store with instant checkout & crypto/card gateways',
      'Created social media announcement video trailers & Instagram story ad templates',
      'Configured post-purchase upsells and email subscriber popup sequences'
    ],
    metrics: [
      { label: 'First Month Gross Revenue', value: '$42,500', change: 'Launch Success', isPositive: true },
      { label: 'Store Conversion Rate', value: '4.2%', change: '+110% vs avg', isPositive: true },
      { label: 'Total Merch Units Sold', value: '1,280 Units', change: 'Sold Out', isPositive: true }
    ],
    testimonialQuote: 'ApexCreator Studio made launching my merch completely stress-free. The store looks incredible and turned my audience into loyal customers!',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    timeframe: '45 Days Execution'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-apexcreator',
    name: 'ApexCreator',
    role: 'Founder & Executive Growth Director',
    specialty: 'Channel Scaling, Monetization & Brand Strategy',
    bio: 'Former creator turned agency director with over 8 years of experience building and scaling digital presences across YouTube, Twitch, and E-commerce. Has personally managed growth strategies for 500+ creator channels.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    experienceYears: '8+ Years'
  },
  {
    id: 'team-sarah',
    name: 'Sarah Vance',
    role: 'Lead Visual & Brand Designer',
    specialty: '3D Thumbnail Art, Stream Packages & Brand Identity',
    bio: 'Specializes in high-CTR thumbnail psychology, esport stream overlays, and vector branding. Sarah has designed visual assets generating over 100M total impressions.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    experienceYears: '6+ Years'
  },
  {
    id: 'team-marcus',
    name: 'Marcus Thorne',
    role: 'Senior Video Editor & Motion Lead',
    specialty: 'Shorts/Reels Pacing, Hook Optimization & VFX',
    bio: 'Expert in retention editing, fast-paced YouTube storytelling, motion graphics, and short-form viral clip editing for TikTok, Shorts, and Instagram Reels.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    experienceYears: '5+ Years'
  },
  {
    id: 'team-elena',
    name: 'Elena Rostova',
    role: 'E-commerce & Merch Lead',
    specialty: 'Shopify Store Architecture & Creator Merch',
    bio: 'Focuses on creator monetization, custom merchandise store development, funnel optimization, and conversion-focused social media advertising.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    experienceYears: '7+ Years'
  }
];

export const INITIAL_INSIGHTS: InsightArticle[] = [
  {
    id: 'art-yt-thumbnail-psychology',
    title: 'YouTube Thumbnail Psychology in 2026: 5 Click-Through Rules for Creators',
    slug: 'youtube-thumbnail-psychology-2026',
    category: 'YouTube Strategy',
    author: 'Sarah Vance (Lead Designer)',
    readTime: '5 min read',
    date: 'August 2026',
    summary: 'Discover the visual neuroscience and contrast rules driving 8%+ CTRs on competitive YouTube feeds today.',
    keyTakeaways: [
      'Use high-contrast subject isolation with 3-color maximum palettes',
      'Express clear emotion or intrigue in 1 second without visual clutter',
      'Keep text to 3 words max — let the image deliver the curiosity hook',
      'Test mobile viewport rendering before publishing'
    ],
    content: [
      'In today’s fast-paced YouTube feed, your thumbnail has less than 0.8 seconds to capture a viewer’s attention before they scroll past.',
      'Rule #1: High Contrast Isolation. Ensure your primary subject (whether a face, product, or game element) pops distinctly from the background using rim lighting or bold stroke accents.',
      'Rule #2: The Emotional Hook. Viewers connect with human expressions — curiosity, shock, or determination. If using faces, ensure eye contact is slightly directed towards the curiosity point.',
      'Rule #3: Minimalist Typography. Never repeat the exact title on the thumbnail. Instead, add a 2-3 word intriguing compliment that creates a curiosity gap.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-twitch-sponsorship-guide',
    title: 'How to Setup Your Twitch & Kick Stream to Attract High-Paying Sponsors',
    slug: 'twitch-kick-stream-sponsorship-guide',
    category: 'Twitch & Gaming',
    author: 'ApexCreator',
    readTime: '6 min read',
    date: 'July 2026',
    summary: 'Sponsors look beyond view counts. Here is how broadcast aesthetics and clean panels convert viewer loyalty into brand deals.',
    keyTakeaways: [
      'Clean broadcast overlays signal professional reliability to brand managers',
      'Standardized channel panels make pitch decks and media kits easy to verify',
      'Consistent stream schedules build predictable CCV metrics for campaigns',
      'Monetize with custom creator merchandise alongside affiliate sponsors'
    ],
    content: [
      'Brand managers reviewing potential stream partnerships evaluate your channel aesthetics within 10 seconds of entering your live stream or VODs.',
      'If your stream overlay is cluttered with low-resolution widgets or mismatched graphics, sponsors assume your audience perception is low value.',
      'Step 1: Broadcast Polish. Invest in a custom stream package with cohesive starting scenes, subtle chat overlays, and branded stingers.',
      'Step 2: Structured Media Kit. Organize your Twitch panels with clear business contact details, official social links, and key demographic highlights.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'art-shopify-creator-merch-blueprint',
    title: 'The Ultimate Shopify Merch Blueprint for Social Media Creators & Streamers',
    slug: 'shopify-creator-merch-blueprint',
    category: 'E-commerce & Merch',
    author: 'Elena Rostova (E-commerce Lead)',
    readTime: '7 min read',
    date: 'June 2026',
    summary: 'How to turn audience loyalty into a $10k/month merchandise brand without holding inventory or taking upfront financial risk.',
    keyTakeaways: [
      'Design streetwear apparel that fans wear out of pride, not just logo stickers',
      'Optimize your Shopify checkout for 1-click mobile payment gateways',
      'Utilize drop releases and limited countdown timers to create FOMO',
      'Integrate merchandise links directly into YouTube Shopping & Twitch panels'
    ],
    content: [
      'Merchandise is no longer just about slapping a logo on a basic t-shirt. Modern audiences expect streetwear-grade aesthetic designs and premium apparel quality.',
      'Building a successful creator brand requires a streamlined e-commerce experience that converts high-intent social traffic into orders in 2 clicks or less.',
      'Key Strategy: Limited Drop Releases. Instead of keeping 50 items in stock indefinitely, release 3 signature items with a 7-day countdown clock to drive urgency.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80'
  }
];
