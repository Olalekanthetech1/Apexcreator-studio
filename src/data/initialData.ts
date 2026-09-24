import { ServiceItem, ProofItem, Testimonial, FAQItem, Order } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // ==========================================
  // YOUTUBE SERVICES
  // ==========================================
  {
    id: 'yt-channel-setup',
    category: 'YouTube',
    title: 'Channel Setup & Optimization',
    shortDesc: 'Complete YouTube channel configuration, branding integration, keywords, and structural setup for maximum channel clarity.',
    fullDesc: 'Transform your raw YouTube channel into a highly professional content hub. We handle your channel layout, upload defaults, niche category tags, custom channel URL configuration, verified contact links, and keyword optimization to present a polished presence to viewers and search engines.',
    iconName: 'Youtube',
    deliveryInfo: 'Standard delivery in 3-5 business days depending on chosen package.',
    whatIsIncluded: [
      'Comprehensive YouTube channel setting configuration',
      'Targeted channel keywords & niche metadata setup',
      'Custom layout structure (Featured video, playlists, sections)',
      'Upload defaults & license default configurations',
      'Professional channel description & social link routing',
      'Brand consistency audit across channel assets'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'yt-setup-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Essential Channel Configuration',
          'Basic Channel Description & Tags',
          'Standard Layout Setup',
          '1 Revision',
          'Standard Customer Support'
        ]
      },
      STANDARD: {
        id: 'yt-setup-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Advanced Channel Keyword Research',
          'Custom Channel Section Layouts',
          'Upload Defaults Setup',
          '2 Revisions',
          'Priority Customer Support'
        ]
      },
      PREMIUM: {
        id: 'yt-setup-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete End-to-End Channel Architecture',
          'Competitive Niche Benchmark Analysis',
          'Custom Playlist Strategy & Organization',
          '3 Revisions',
          'Priority Express Delivery & Dedicated Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Do I need to give you my YouTube password?',
        answer: 'No. You can easily grant us Manager or Editor access via YouTube Studio Permissions using your email address, keeping your password 100% private and secure.'
      },
      {
        question: 'Will this guarantee YouTube views or subscribers?',
        answer: 'No. ApexCreator Studio provides professional channel setup, optimization, and design. Viewers and subscribers depend on your ongoing content quality, niche appeal, and viewer engagement.'
      }
    ]
  },
  {
    id: 'yt-channel-audit',
    category: 'YouTube',
    title: 'Channel Audit',
    shortDesc: 'Deep-dive analysis of your existing YouTube channel performance, content strategy, retention metrics, and branding consistency.',
    fullDesc: 'Get an objective, data-driven diagnostic report on your YouTube channel. We analyze your click-through rates (CTR), viewer retention patterns, title structures, thumbnail effectiveness, and audience demographics to provide actionable, step-by-step recommendations for content improvement.',
    iconName: 'BarChart3',
    deliveryInfo: 'In-depth PDF diagnostic report delivered within 2-4 business days.',
    whatIsIncluded: [
      'Comprehensive channel performance evaluation report',
      'CTR & Thumbnail impact assessment',
      'Title, Tag, and Description structure review',
      'Audience retention & drop-off analysis breakdown',
      'Competitor benchmark & niche opportunity analysis',
      'Prioritized action plan for immediate growth improvement'
    ],
    packages: {
      BASIC: {
        id: 'yt-audit-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          '10-Point Channel Health Overview',
          'Metadata & Title Format Review',
          'Actionable PDF Summary',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-audit-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Deep Analytics & Retention Diagnostic',
          'Thumbnail CTR Breakdown',
          'Niche Competitor Comparison Report',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-audit-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Channel Audit & Video Breakdown',
          '1-on-1 Video Strategy Consultation Review',
          'Custom Action Plan Roadmap (PDF + Checklist)',
          '3 Revisions',
          'Dedicated 1-on-1 Support'
        ]
      }
    },
    faqs: [
      {
        question: 'What analytics data do you need for the audit?',
        answer: 'We review your public channel assets alongside YouTube Studio analytics screenshots or temporary Manager access provided by you.'
      }
    ]
  },
  {
    id: 'yt-seo-optimization',
    category: 'YouTube',
    title: 'SEO & Metadata Optimization',
    shortDesc: 'Search-focused keyword research, optimized title templates, rich descriptions, and strategic tags for YouTube search visibility.',
    fullDesc: 'Maximize video indexability and search discoverability with high-intent keyword research and optimized metadata. We craft compelling video titles, search-engine-friendly descriptions, structured chapters/timestamps, and precise tags tailored to YouTube and Google search algorithms.',
    iconName: 'Search',
    deliveryInfo: 'Delivered in formatted spreadsheets and ready-to-copy metadata templates.',
    whatIsIncluded: [
      'High-intent niche keyword research & volume mapping',
      'Click-optimized video title variations',
      'Rich, keyword-targeted video description drafting',
      'Video timestamps & chapter structure planning',
      'Targeted video tag suites & channel category tags',
      'Best practices guide for video metadata maintenance'
    ],
    packages: {
      BASIC: {
        id: 'yt-seo-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'SEO Package for up to 3 Videos',
          'Target Keyword List & Titles',
          'Optimized Description & Tags',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-seo-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'SEO Package for up to 10 Videos',
          'Competitive Search Volume Mapping',
          'Timestamp / Chapter Architecture',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-seo-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full Channel / 25 Video SEO Overhaul',
          'Custom YouTube Search Keyword Strategy Vault',
          'Master Metadata Template System',
          '3 Revisions',
          'Dedicated Priority Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Does SEO guarantee my video will rank #1 on YouTube?',
        answer: 'No. YouTube search rankings depend on multiple factors including watch time, click-through rate, user engagement, and competition. Our SEO services ensure your video metadata is structured for optimal discoverability.'
      }
    ]
  },
  {
    id: 'yt-thumbnail-design',
    category: 'YouTube',
    title: 'Thumbnail Design',
    shortDesc: 'Eye-catching, high-CTR custom YouTube thumbnails engineered to capture viewer attention and boost click-through rates.',
    fullDesc: 'Stand out in the YouTube feed with custom, high-contrast visual thumbnails. Our professional graphic designers craft vibrant, high-resolution 1080p thumbnails utilizing expressive typography, clean focal hierarchy, subject isolation, and color psychology engineered to maximize CTR.',
    iconName: 'Image',
    deliveryInfo: 'High-resolution PNG and JPG files formatted precisely for YouTube guidelines.',
    whatIsIncluded: [
      'Custom 1920x1080 high-contrast thumbnail graphics',
      'Subject cutout, lighting enhancement, & facial expression tuning',
      'Bold, legible typography styled for mobile & desktop feeds',
      'Psychological color grading & visual depth layers',
      'Multiple concept variations depending on chosen package',
      'Editable source files available upon request'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'yt-thumb-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '2 Custom High-CTR Thumbnails',
          '1920x1080 High Resolution PNG/JPG',
          'Mobile & Desktop Feed Optimization',
          '1 Revision',
          'Standard Customer Support'
        ]
      },
      STANDARD: {
        id: 'yt-thumb-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '6 Custom High-CTR Thumbnails',
          'A/B Testing Concept Variations',
          'Raw Source PSD Files Included',
          '2 Revisions',
          'Priority Customer Support'
        ]
      },
      PREMIUM: {
        id: 'yt-thumb-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '15 Custom High-CTR Thumbnails',
          'Complete Creator Style Guide & Asset Library',
          '24-Hour Express Turnaround per Batch',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'What do I need to provide for thumbnail design?',
        answer: 'Provide your video topic, title idea, high-resolution photo cutouts of yourself (if desired), and any specific text or color preferences.'
      }
    ]
  },
  {
    id: 'yt-banner-design',
    category: 'YouTube',
    title: 'Banner Design',
    shortDesc: 'Professional multi-device YouTube channel header banners tailored for Desktop, Mobile, and TV displays.',
    fullDesc: 'Make an immediate impression when new visitors click onto your YouTube channel. We design custom, high-resolution YouTube banners that adapt flawlessly across desktop screens, mobile devices, tablets, and smart TVs, showcasing your brand identity, upload schedule, and social handles.',
    iconName: 'LayoutGrid',
    deliveryInfo: 'Standard delivery in 2-3 days with safe-area aligned PNG files.',
    whatIsIncluded: [
      'Pixel-perfect 2560x1440 YouTube Banner Graphic',
      'Strict adherence to Mobile & Desktop safe-zone dimensions',
      'Branded typography, color palette, & logo integration',
      'Social media callout handles & upload schedule badges',
      'High-resolution export ready for immediate upload'
    ],
    packages: {
      BASIC: {
        id: 'yt-banner-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '1 Custom YouTube Banner',
          'Mobile & Desktop Safe-Zone Aligned',
          'High Resolution PNG Export',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-banner-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '2 Custom Banner Design Concepts',
          'Matching Channel Profile Avatar Graphic',
          'PSD Source Files Included',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-banner-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Channel Graphics Suite (Banner + Avatar + Watermark)',
          'Social Media Header Banner Adaptations (X, Twitch, Facebook)',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Will the banner look good on mobile phones?',
        answer: 'Yes! We design every banner strictly adhering to YouTube safe area guidelines, ensuring core text and visuals remain perfectly centered on mobile screens.'
      }
    ]
  },
  {
    id: 'yt-channel-branding',
    category: 'YouTube',
    title: 'Channel Branding',
    shortDesc: 'Unified visual branding identity package including logo, banner, watermark, video end-screens, and brand guidelines.',
    fullDesc: 'Establish a cohesive, instantly recognizable creator brand across YouTube. Our complete YouTube branding package combines a custom channel logo, multi-device banner, video branding watermark, end-screen templates, lower-thirds overlays, and color palette guidelines.',
    iconName: 'Sparkles',
    deliveryInfo: 'Complete branding package delivered within 3-5 business days.',
    whatIsIncluded: [
      'Custom Channel Logo / Profile Avatar',
      'High-Resolution YouTube Banner Graphic',
      'Custom Video Watermark & Lower-Third Overlays',
      'Branded Video End-Screen Elements (16:9)',
      'Creator Brand Style Sheet (Fonts, Hex Codes, Usage Rules)'
    ],
    packages: {
      BASIC: {
        id: 'yt-brand-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Channel Logo & Matching Banner',
          'Branding Watermark Graphic',
          'Standard Export Files',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-brand-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '3 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Custom Video End-Screen Graphic Overlays',
          'Lower-Third Title Graphic Templates',
          'Full Creator Brand Style Guide',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-brand-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '2 Days',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete YouTube & Social Cross-Platform Branding Kit',
          'All Editable Vector & Photoshop Source Files',
          '3 Revisions',
          'Express Delivery & VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Can I request specific color themes or gaming styles?',
        answer: 'Absolutely. We tailor every branding design specifically to your niche—whether esports gaming, tech reviews, luxury lifestyle, fitness, or corporate education.'
      }
    ]
  },
  {
    id: 'yt-content-strategy',
    category: 'YouTube',
    title: 'Content Strategy',
    shortDesc: 'Custom content calendar, video topic roadmap, hook structure guides, and audience targeting for YouTube creators.',
    fullDesc: 'Stop guessing what videos to make next. Our YouTube Content Strategy service delivers a structured video roadmap built on market trend analysis, viewer interest research, content pillar mapping, hook framework scripting guidelines, and upload consistency calendars.',
    iconName: 'Compass',
    deliveryInfo: 'Comprehensive PDF Strategy Document & Content Calendar Sheet.',
    whatIsIncluded: [
      'Niche content pillar mapping & audience profiling',
      'Curated video topic idea vault with search intent analysis',
      'Video hook & intro structuring frameworks (0-30 sec retention)',
      '30-day or 90-day upload content schedule calendar',
      'Call-to-Action (CTA) strategy for subscriber & community building'
    ],
    packages: {
      BASIC: {
        id: 'yt-strat-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          '10 Validated Video Topic Concepts',
          'Basic Content Pillar Outline',
          'Hook Framework Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-strat-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '3 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '25 Validated Video Topic Concepts',
          '30-Day Upload Content Calendar Plan',
          'Retention-Focused Scripting Checklist',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-strat-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '2 Days',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '90-Day Master Content Strategy Blueprint',
          'Competitor Content Gap Analysis Report',
          '1-on-1 Content Strategy Review Call',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Is this strategy tailored to my specific niche?',
        answer: 'Yes! Every strategy is custom-built after researching your specific content vertical, target demographic, and competing channels.'
      }
    ]
  },
  {
    id: 'yt-monetization-consultation',
    category: 'YouTube',
    title: 'Monetization Readiness Consultation',
    shortDesc: 'Preparation guidance for official YouTube Partner Program guidelines, copyright safety, policy review, and revenue stream planning.',
    fullDesc: 'Ensure your channel is prepared for official YouTube Partner Program application. We audit your channel for reused content risks, copyright compliance, community guidelines adherence, advertiser-friendly content standards, and structure strategic secondary revenue streams (sponsorships, memberships, merchandise).',
    iconName: 'DollarSign',
    deliveryInfo: 'Detailed Channel Audit Checklist & Video Strategy Consultation.',
    whatIsIncluded: [
      'YouTube Partner Program (YPP) policy readiness review',
      'Reused content & copyright risk identification',
      'Advertiser-friendly content checklist review',
      'Channel metadata & thumbnail compliance check',
      'Multiple revenue stream roadmap (Memberships, Merch, Affiliates)',
      'Official YPP application preparation guide'
    ],
    packages: {
      BASIC: {
        id: 'yt-mon-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'YPP Policy Compliance Audit',
          'Copyright Risk Spot-Check',
          'Monetization Readiness Checklist',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-mon-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'In-Depth Channel Reused Content Analysis',
          'Revenue Stream Diversification Blueprint',
          'Advertiser Guidelines Optimization',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-mon-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Monetization & Brand Sponsorship Kit',
          'Sponsorship Pitch Deck Template & Rate Card Guide',
          'Direct Consultation Call',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Do you guarantee YouTube monetization approval?',
        answer: 'No. YouTube monetization decisions are made solely by YouTube according to their official Partner Program policies. ApexCreator Studio provides guidance, audit review, and preparation best practices to help you meet official standards.'
      }
    ]
  },
  {
    id: 'yt-analytics-review',
    category: 'YouTube',
    title: 'Analytics & Performance Review',
    shortDesc: 'In-depth analysis of YouTube Studio metrics, audience retention curves, traffic sources, and growth bottlenecks.',
    fullDesc: 'Unlock actionable insights hidden within your YouTube Studio analytics. We decode your click-through rates, impression funnels, traffic sources (Suggested, Browse, Search), returning viewer ratios, and subscriber conversion rates to turn confusing charts into a clear growth strategy.',
    iconName: 'LineChart',
    deliveryInfo: 'Comprehensive PDF report delivered within 2-3 days.',
    whatIsIncluded: [
      'YouTube Studio analytics breakdown & explanation',
      'Impression-to-view conversion funnel diagnostic',
      'Traffic source breakdown (Browse Features vs. Search vs. Suggested)',
      'Returning vs. New viewer retention trends analysis',
      'Clear, actionable performance optimization steps'
    ],
    packages: {
      BASIC: {
        id: 'yt-ana-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '30-Day Channel Metric Diagnostic',
          'Traffic Source Summary',
          'Actionable Insight Summary PDF',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'yt-ana-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '90-Day Analytics Trend Diagnostic',
          'Audience Retention Curve Deep-Dive',
          'CTR & Impression Optimization Roadmap',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'yt-ana-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full-Year Channel Performance Retrospective',
          'Custom Analytics Dashboard Setup Guide',
          'Direct Strategy Call to Review Growth Bottlenecks',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'How do I share my analytics securely?',
        answer: 'You can export PDF reports from YouTube Studio or grant temporary Viewer access via channel permissions.'
      }
    ]
  },

  // ==========================================
  // TWITCH SERVICES
  // ==========================================
  {
    id: 'tw-channel-setup',
    category: 'Twitch',
    title: 'Twitch Channel Setup',
    shortDesc: 'Complete Twitch profile configuration, bio organization, social media link integration, and chat command setup.',
    fullDesc: 'Build a polished, welcoming Twitch live stream destination. We configure your Twitch Creator Dashboard settings, offline banner presentation, custom channel info panels, social link routing, chat auto-moderation settings, and essential Nightbot / StreamElements chat commands.',
    iconName: 'Tv',
    deliveryInfo: 'Complete setup delivered within 2-3 business days.',
    whatIsIncluded: [
      'Twitch Creator Dashboard & Profile Configuration',
      'Custom Channel Info Panels & Markdown Layout',
      'Social links & donation/tip link integration',
      'Essential Chat Bot Setup (Nightbot / StreamElements)',
      'AutoMod & Safety Filter Configuration',
      'Offline Screen & Channel Trailer integration'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'tw-setup-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Twitch Profile & Bio Setup',
          'Up to 4 Custom Channel Info Panels',
          'Basic Chat Bot Commands Setup',
          '1 Revision',
          'Standard Customer Support'
        ]
      },
      STANDARD: {
        id: 'tw-setup-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Up to 8 Custom Graphic Channel Panels',
          'Advanced Chat Bot Commands & Timer Rules',
          'Twitch AutoMod Safety Rules Config',
          '2 Revisions',
          'Priority Customer Support'
        ]
      },
      PREMIUM: {
        id: 'tw-setup-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete End-to-End Twitch Channel Infrastructure',
          'Channel Point Rewards Configuration Guide',
          'OBS / Streamlabs Scene Integration Support',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Do I need to give you my Twitch password?',
        answer: 'No. You can add us as an Editor in Twitch Dashboard permissions or receive step-by-step installation guides.'
      }
    ]
  },
  {
    id: 'tw-branding',
    category: 'Twitch',
    title: 'Twitch Branding',
    shortDesc: 'Unified Twitch channel visual identity including profile logo, offline banner, info panels, and chat graphics.',
    fullDesc: 'Give your live stream a consistent, high-end broadcast identity. We design a complete Twitch visual brand suite consisting of custom channel logo, offline screen graphic, header banner, matching info panels, and chat badges tailored to your gaming or streaming persona.',
    iconName: 'Palette',
    deliveryInfo: 'Delivered in high-quality PNG graphics ready for Twitch upload.',
    whatIsIncluded: [
      'Twitch Profile Avatar Logo',
      '1920x1080 Offline Screen Graphic',
      'Twitch Header Profile Banner',
      'Matching Channel About Info Panels (About, Rules, Specs, Socials)',
      'Branding Color Palette & Asset Guide'
    ],
    packages: {
      BASIC: {
        id: 'tw-brand-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Profile Avatar & Offline Screen',
          '4 Graphic Info Panels',
          'High Resolution PNG Files',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-brand-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Header Banner + 8 Graphic Info Panels',
          'Matching Chat Watermark Graphic',
          'Photoshop PSD Source Files',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-brand-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Cross-Platform Stream & Social Branding Suite',
          'Animated Offline Screen Graphic',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Can I choose my own colors and theme?',
        answer: 'Yes! We customize every visual branding package around your desired color palette, character avatar, or esports theme.'
      }
    ]
  },
  {
    id: 'tw-verification-guidance',
    category: 'Twitch',
    title: 'Twitch Verification Guidance',
    shortDesc: 'Legitimate preparation, policy compliance review, and application roadmap for official Twitch Partner/Affiliate criteria.',
    fullDesc: 'Prepare your channel for official Twitch Affiliate and Partner application benchmarks. We perform a thorough audit of your average concurrent viewership trends, chat engagement levels, broadcast consistency, and community guidelines compliance to ensure your application meets official platform criteria.',
    iconName: 'CheckCircle',
    deliveryInfo: 'Delivered as a detailed audit report & application readiness checklist.',
    whatIsIncluded: [
      'Official Twitch Affiliate / Partner eligibility audit',
      'Concurrent viewership (CCV) & broadcast analytics diagnostic',
      'Community Guidelines & Terms of Service safety check',
      'Stream schedule consistency & retention planning',
      'Official application submission preparation guide',
      'Community growth strategy to build authentic engagement'
    ],
    packages: {
      BASIC: {
        id: 'tw-verif-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Twitch Eligibility Audit Summary',
          'Broadcast Metric Check',
          'Official Application Checklist',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-verif-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'In-Depth Concurrent Viewer Growth Strategy',
          'Community Engagement Blueprint',
          'TOS & Content Policy Safety Review',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-verif-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Twitch Creator Growth Roadmap',
          'Direct 1-on-1 Stream Strategy Consultation Call',
          'Custom Partner Pitch Preparation Deck',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Do you guarantee Twitch verification or Partner status?',
        answer: 'No. Twitch Partner and verification decisions are solely made by Twitch based on official criteria. ApexCreator Studio provides legitimate preparation, metric analysis, and strategy guidance to help you meet official requirements.'
      }
    ]
  },
  {
    id: 'tw-stream-overlay',
    category: 'Twitch',
    title: 'Stream Overlay Design',
    shortDesc: 'Custom live stream overlay frames, webcam borders, alert popups, and HUD elements for OBS/Streamlabs.',
    fullDesc: 'Elevate your live stream broadcast quality with custom OBS/Streamlabs overlays. Designed to fit seamlessly without obscuring gameplay, our overlay suites include webcam frames, recent follower/sub labels, top donation HUDs, chat boxes, and alert popups.',
    iconName: 'Layers',
    deliveryInfo: 'High-quality PNG & WEBM files formatted for immediate OBS drag-and-drop.',
    whatIsIncluded: [
      'Custom Live Gameplay Overlay (16:9 / 21:9)',
      'Matching Webcam Border Frame (16:9 & 4:3 options)',
      'Recent Follower, Subscriber, Tip & Cheer Event Bar Labels',
      'Custom Transparent Chat Box Overlay',
      'OBS / Streamlabs setup instructions'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'tw-over-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Static Webcam Border & Event Label Bar',
          'Transparent PNG Files',
          'OBS Installation Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-over-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Complete Game HUD Overlay + Chat Box Frame',
          'Animated Webcam Border Frame (WEBM)',
          'Custom Alert Popups (New Sub, Follower, Raid)',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-over-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full Animated Stream Overlay Package (OBS Overlay + Alerts + Audio Reactive FX)',
          'Complete Streamlabs / Streamelements Import File',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Are the overlay files compatible with OBS Studio and Streamlabs?',
        answer: 'Yes! We deliver optimized WEBM and PNG files that import effortlessly into OBS Studio, Streamlabs Desktop, and Twitch Studio.'
      }
    ]
  },
  {
    id: 'tw-starting-soon-screen',
    category: 'Twitch',
    title: 'Starting Soon Screen',
    shortDesc: 'Engaging broadcast countdown screen graphic designed to build hype before your live stream begins.',
    fullDesc: 'Hook your viewers the moment your live stream goes live. We design custom static or animated "Stream Starting Soon" screens equipped with stylish background visuals, social handle overlays, dynamic music wave graphics, and integrated countdown timers.',
    iconName: 'PlayCircle',
    deliveryInfo: 'Delivered in 1080p MP4 or WEBM video format for seamless OBS looping.',
    whatIsIncluded: [
      'Custom 1080p "Starting Soon" Broadcast Screen',
      'Countdown Timer Space / Graphic Integration',
      'Social Media Handle Callouts',
      'Seamless Looping MP4 / WEBM Video Export',
      'High-Resolution Static PNG Image Included'
    ],
    packages: {
      BASIC: {
        id: 'tw-start-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Static "Starting Soon" Screen Graphic',
          '1920x1080 PNG Export',
          'Social Handles Overlay',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-start-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Smoothly Animated "Starting Soon" Screen (WEBM/MP4)',
          'Integrated Animated Countdown Timer Loop',
          'Custom Background Motion FX',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-start-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '3D Motion Animated Starting Soon Screen',
          'Custom Royalty-Free Background Audio Track Sync',
          'Full Source Project Files',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'How do I loop the video in OBS Studio?',
        answer: 'We include a simple 1-step guide: add a Media Source in OBS and check the "Loop" box.'
      }
    ]
  },
  {
    id: 'tw-brb-screen',
    category: 'Twitch',
    title: 'BRB Screen',
    shortDesc: 'Professional "Be Right Back" screen graphic maintaining viewer engagement during stream breaks.',
    fullDesc: 'Keep your live audience entertained when taking a quick break. Our "Be Right Back" (BRB) stream screens match your stream branding perfectly, featuring smooth subtle animations, recent chat message space, or clip reel placeholder frames.',
    iconName: 'PauseCircle',
    deliveryInfo: 'Delivered in high-definition video and image formats.',
    whatIsIncluded: [
      'Custom "Be Right Back" Stream Screen (1920x1080)',
      'Branded color aesthetics & creator logo placement',
      'Subtle motion loop animation effects',
      'Social media handles & community callout text',
      'OBS Media Source ready export'
    ],
    packages: {
      BASIC: {
        id: 'tw-brb-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Static BRB Screen Image',
          '1920x1080 High Resolution PNG',
          'Branded Layout',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-brb-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Animated BRB Screen Loop (WEBM/MP4)',
          'Subtle Particle & Motion Lighting FX',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-brb-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete 3-Screen Animated Pack (Starting Soon + BRB + Ending)',
          'Full Source Files & Streamlabs Integration',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'tw-ending-screen',
    category: 'Twitch',
    title: 'Ending Screen',
    shortDesc: 'Polished stream ending screen thanking viewers, showcasing top supporters, and directing raids.',
    fullDesc: 'Conclude your broadcasts on a high note. We design custom "Stream Ending / Thanks For Watching" screens featuring credit rolls for recent subscribers/donors, social media callouts, and clean raiding instructions.',
    iconName: 'StopCircle',
    deliveryInfo: 'Delivered ready for live broadcast conclusion.',
    whatIsIncluded: [
      'Custom "Stream Ending" Screen Graphic',
      'Credit space for top supporters & subscribers',
      'Social handles & YouTube channel callouts',
      'Looping video & static image versions'
    ],
    packages: {
      BASIC: {
        id: 'tw-end-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Static Ending Screen Graphic',
          'High Resolution PNG',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-end-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Animated Ending Screen Loop',
          'Credit Roll Text Box Layout',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-end-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Custom Outro Animation + Raid Callout Banner',
          'Master OBS Broadcast Scene Suite',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'tw-banner-graphics',
    category: 'Twitch',
    title: 'Twitch Banner & Profile Graphics',
    shortDesc: 'Eye-catching header banners and avatar graphics for Twitch profiles.',
    fullDesc: 'Make your Twitch channel homepage visually stunning. We craft custom Twitch header banners and profile avatar icons that communicate your stream schedule, main games/topics, and community social links.',
    iconName: 'Image',
    deliveryInfo: 'High-resolution PNG graphics formatted for Twitch upload specs.',
    whatIsIncluded: [
      'Twitch Header Profile Banner (1200x480)',
      'Twitch Avatar / Profile Picture Logo',
      'Twitch Offline Player Banner (1920x1080)',
      'High-resolution PNG exports'
    ],
    packages: {
      BASIC: {
        id: 'tw-ban-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Twitch Header Banner',
          'High Resolution PNG',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-ban-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Header Banner + Offline Banner + Profile Avatar',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-ban-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Social Banners Suite (X, YouTube, Discord Header)',
          'Photoshop Source PSDs',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'tw-emote-badge-design',
    category: 'Twitch',
    title: 'Emote & Badge Design',
    shortDesc: 'Custom subscriber emotes and loyalty sub badges designed to excite chat and drive subscriptions.',
    fullDesc: 'Reward your Twitch subscribers with expressive, custom-designed channel emotes and subscriber badges. Designed to be ultra-legible at small Twitch chat pixel sizes (28x28, 56x56, 112x112), our emotes incorporate expressive meme faces, character art, and community inside jokes.',
    iconName: 'Smile',
    deliveryInfo: 'Auto-resized PNG files ready for direct Twitch emote portal upload.',
    whatIsIncluded: [
      'Custom Subscriber Emotes / Bit Badges',
      'Delivered in required Twitch sizes (28x28, 56x56, 112x112)',
      'Original 500x500 high-res master PNG files',
      'Transparent background formatting'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'tw-emo-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '2 Custom Twitch Emotes OR Sub Badges',
          'Auto-sized for Twitch upload',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-emo-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '6 Custom Twitch Emotes OR Sub Badges',
          'High-Res Master Artwork',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-emo-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '15 Custom Twitch Emotes + 6 Subscriber Loyalty Badges',
          'Animated Emote Options (GIF/WEBP)',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: [
      {
        question: 'Are the emotes already resized for Twitch upload?',
        answer: 'Yes! We provide all three standard Twitch dimensions (28px, 56px, 112px) plus the original 500px high-resolution PNG file.'
      }
    ]
  },
  {
    id: 'tw-stream-optimization',
    category: 'Twitch',
    title: 'Stream Optimization',
    shortDesc: 'Bitrate, encoder, audio balance, and latency configuration for OBS Studio and Streamlabs.',
    fullDesc: 'Eliminate stream lag, dropped frames, and muffled audio. We optimize your OBS Studio or Streamlabs settings according to your PC hardware specs and internet upload bandwidth—configuring x264 / NVENC encoding settings, audio compressor filters, and Twitch ingest server routing.',
    iconName: 'Sliders',
    deliveryInfo: 'Delivered as a step-by-step setup guide or remote setup session.',
    whatIsIncluded: [
      'OBS / Streamlabs Encoder Settings Optimization (NVENC / x264)',
      'Bitrate & Resolution calibration for Twitch ingest',
      'Audio Noise Suppression & Compressor Filter setup',
      'Game Capture & Display Capture performance tuning'
    ],
    packages: {
      BASIC: {
        id: 'tw-opt-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Hardware-specific OBS Settings Blueprint',
          'Bitrate & Resolution Config Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-opt-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Advanced Microphone Audio Filter Setup (VST/Noise Gate)',
          'Dual PC or Single PC Performance Diagnostic',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-opt-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Broadcast Engine & Audio Mixer Calibration',
          '1-on-1 Live Setup & Stream Stress Test',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'tw-growth-strategy',
    category: 'Twitch',
    title: 'Growth Strategy',
    shortDesc: 'Off-platform funneling, networking protocols, raid strategies, and audience retention for live streamers.',
    fullDesc: 'Discover how top streamers convert casual viewers into dedicated community members. Our Twitch Growth Strategy focuses on off-platform audience acquisition (TikTok, YouTube Shorts, X), community Discord structure, networking protocols with peer streamers, and broadcast raid strategies.',
    iconName: 'TrendingUp',
    deliveryInfo: 'Comprehensive Growth Blueprint PDF Document.',
    whatIsIncluded: [
      'Off-Platform Short-Form Content Funnel Blueprint',
      'Community Discord Architecture & Event Strategy',
      'Live Raid & Streamer Networking Guidelines',
      'Stream Schedule & Niche Category Selection Analysis'
    ],
    packages: {
      BASIC: {
        id: 'tw-gro-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Twitch Growth Principles Guide',
          'Off-Platform Repurposing Checklist',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'tw-gro-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Custom Niche Category & Stream Schedule Strategy',
          'Discord Community Building Framework',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'tw-gro-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Master Streamer Accelerator Roadmap',
          '1-on-1 Growth Consultation & Channel Review Call',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },

  // ==========================================
  // SOCIAL MEDIA SERVICES
  // ==========================================
  {
    id: 'sm-instagram-opt',
    category: 'Social Media',
    title: 'Instagram Optimization',
    shortDesc: 'Profile bio optimization, highlight covers, Grid layout strategy, and link-in-bio architecture.',
    fullDesc: 'Turn profile visits into followers on Instagram. We transform your Instagram profile with a keyword-optimized bio, cohesive aesthetic highlights, custom highlight covers, strategically pinned posts, and an organized link-in-bio hub.',
    iconName: 'Instagram',
    deliveryInfo: 'Complete setup delivered within 2-3 business days.',
    whatIsIncluded: [
      'Keyword-Optimized Bio Copywriting',
      'Custom Instagram Highlight Covers (Up to 6)',
      'Profile Picture & Aesthetic Grid Alignment',
      'Link-in-Bio Setup & Contact Button Config'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'sm-ig-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Instagram Bio Copywriting',
          '4 Custom Highlight Covers',
          'Profile Layout Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-ig-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '8 Custom Highlight Covers + Pinned Post Templates',
          'Aesthetic Feed Grid Layout Blueprint',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-ig-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full Instagram Brand Kit (Bio + Covers + 9 Grid Graphics + Reel Covers)',
          'Hashtag & SEO Keywords Vault',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-tiktok-opt',
    category: 'Social Media',
    title: 'TikTok Optimization',
    shortDesc: 'Profile bio copywriting, playlist structuring, thumbnail covers, and TikTok algorithm optimization.',
    fullDesc: 'Optimize your TikTok profile for viral reach and profile conversions. We optimize your TikTok bio text, profile picture, category tagging, video playlists, and custom video thumbnail covers designed to maximize watch time and follower conversion.',
    iconName: 'Video',
    deliveryInfo: 'Delivered in 2-3 business days.',
    whatIsIncluded: [
      'High-conversion TikTok Bio Copywriting',
      'Niche Category Tagging & Search Keyword Optimization',
      'Custom Video Cover Thumbnail Templates',
      'TikTok Playlist Architecture Plan'
    ],
    packages: {
      BASIC: {
        id: 'sm-tt-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'TikTok Bio Copywriting',
          'Profile Picture Optimization',
          'Basic Playlist Setup Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-tt-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '5 Custom Video Cover Templates',
          'TikTok Search SEO & Keyword Strategy',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-tt-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete TikTok Growth & Content Strategy Suite',
          'Hook & Trending Sound Research Framework',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-facebook-setup',
    category: 'Social Media',
    title: 'Facebook Page Setup',
    shortDesc: 'Professional Facebook business page creation, custom cover graphic, automated messaging, and Call-To-Action buttons.',
    fullDesc: 'Establish a credible, fully branded Facebook business page or creator page. We handle cover graphic design, page profile avatar, business details, messaging automated instant replies, call-to-action button links, and category optimization.',
    iconName: 'Facebook',
    deliveryInfo: 'Complete page setup delivered in 2-3 days.',
    whatIsIncluded: [
      'Facebook Business / Creator Page Creation & Config',
      'Custom High-Resolution Facebook Cover Graphic',
      'Automated Instant Messenger Greeting Setup',
      'Call-To-Action (CTA) Button Configuration'
    ],
    packages: {
      BASIC: {
        id: 'sm-fb-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Facebook Page Configuration',
          'Custom Cover Banner',
          'CTA Button Setup',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-fb-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Automated Messenger FAQ Bot Setup',
          'Page Tab Customization & Services List',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-fb-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full Facebook & Instagram Meta Business Suite Integration',
          '5 Promotional Post Templates',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-twitter-opt',
    category: 'Social Media',
    title: 'X/Twitter Profile Optimization',
    shortDesc: 'X/Twitter bio copywriting, header banner design, pinned post structure, and niche networking framework.',
    fullDesc: 'Build authority and personal brand influence on X (formerly Twitter). We write a sharp, compelling profile bio, craft a high-impact 1500x500 header banner, structure your pinned tweet framework, and optimize your profile for search discoverability.',
    iconName: 'Twitter',
    deliveryInfo: 'Delivered in 2-3 business days.',
    whatIsIncluded: [
      'Compelling X/Twitter Bio Copywriting',
      'Custom 1500x500 X Header Banner Graphic',
      'Pinned Post Copywriting & Formatting Strategy',
      'Niche Keyword Profile Tagging'
    ],
    packages: {
      BASIC: {
        id: 'sm-twit-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'X/Twitter Bio Copywriting',
          '1 Custom Header Banner',
          'Pinned Tweet Formula',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-twit-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '2 Header Banner Concepts',
          'High-Engagement Thread Template System',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-twit-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Master Thought Leadership & Creator Authority Kit',
          '30-Day Tweet Content Calendar',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-branding',
    category: 'Social Media',
    title: 'Social Media Branding',
    shortDesc: 'Cross-platform graphic branding suite aligning banners and avatars across Instagram, TikTok, Facebook, and X.',
    fullDesc: 'Ensure your brand looks identical across every social platform. We design a unified graphics kit including matching banners, avatars, cover art, and profile graphics customized for Instagram, TikTok, Facebook, X, and LinkedIn.',
    iconName: 'Share2',
    deliveryInfo: 'Complete social media kit delivered within 3-4 days.',
    whatIsIncluded: [
      'Multi-Platform Profile Avatars (All Dimensions)',
      'YouTube, Facebook, X & LinkedIn Header Banners',
      'Cohesive Color Palette & Typography Guidelines',
      'High-Resolution Ready-to-Upload PNG Files'
    ],
    packages: {
      BASIC: {
        id: 'sm-brand-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Matching Banners for 2 Platforms',
          'Profile Avatar Graphic',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-brand-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Matching Banners for 4 Platforms (YouTube, X, FB, LinkedIn)',
          'Social Story & Reel Templates',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-brand-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Master Social Media Visual Identity Suite',
          'Full PSD & Canva Template Source Files',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-content-strategy',
    category: 'Social Media',
    title: 'Content Strategy',
    shortDesc: 'Multi-platform social media content calendar, hook scripts, hashtag systems, and publishing schedule.',
    fullDesc: 'Build a predictable social media content engine. Our Social Media Content Strategy outlines content pillars, short-form video hooks, carousel post concepts, engagement triggers, and a structured monthly publication calendar.',
    iconName: 'Calendar',
    deliveryInfo: 'Delivered as a structured Strategy Vault & Excel/Notion Content Calendar.',
    whatIsIncluded: [
      'Content Pillar Architecture for your Niche',
      '30 Short-Form Hook & Video Script Ideas',
      'Targeted Hashtag & Keyword Vaults',
      '30-Day Cross-Platform Publishing Calendar'
    ],
    packages: {
      BASIC: {
        id: 'sm-strat-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          '15 Content Ideas & Hook Scripts',
          'Basic Publishing Schedule',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-strat-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '30-Day Multi-Platform Content Calendar',
          'Carousel & Short-Form Scripting Frameworks',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-strat-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '90-Day Master Content Blueprint & Repurposing System',
          '1-on-1 Content Strategy Call',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-profile-banner-design',
    category: 'Social Media',
    title: 'Profile/Banner Design',
    shortDesc: 'Custom visual header banners for X, LinkedIn, Facebook, and Twitch.',
    fullDesc: 'Make your social profiles look high-budget and authoritative. We design custom header banners tailored specifically for X, LinkedIn, Facebook, Discord, and Twitch.',
    iconName: 'Layout',
    deliveryInfo: 'Delivered in high-res PNG files within 2 days.',
    whatIsIncluded: [
      'Custom Header Banner Graphic',
      'Target Platform Dimensions Alignment',
      'High Resolution PNG/JPG Export'
    ],
    packages: {
      BASIC: {
        id: 'sm-pbd-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '1 Custom Banner Graphic',
          'High Resolution Export',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-pbd-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '3 Banners for 3 Platforms',
          'Matching Profile Avatar Graphic',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-pbd-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Banner Suite for 6 Platforms',
          'Photoshop Source Files',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'sm-growth-consulting',
    category: 'Social Media',
    title: 'Social Media Growth Consulting',
    shortDesc: 'Direct strategic guidance for organic social media audience acquisition and brand positioning.',
    fullDesc: 'Get tailored advisory on how to position your brand, convert social traffic into customers, and grow organic reach. We analyze your accounts, pinpoint growth bottlenecks, and map out sustainable engagement habits.',
    iconName: 'UserCheck',
    deliveryInfo: 'Delivered as a diagnostic review report & strategic action call.',
    whatIsIncluded: [
      'Social Profile Audit & Positioning Diagnosis',
      'Organic Reach Bottleneck Analysis',
      'Monetization & Conversion Funnel Framework',
      'Action Plan Action Items PDF'
    ],
    packages: {
      BASIC: {
        id: 'sm-gc-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Social Profile Diagnostic Report',
          '3 Core Focus Recommendations',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'sm-gc-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'In-Depth Cross-Platform Diagnostic',
          '1-on-1 Strategy Video Consultation',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'sm-gc-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Comprehensive Creator Accelerator Advisory Program',
          'Bi-Weekly Strategic Check-ins',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },

  // ==========================================
  // GRAPHICS & BRANDING
  // ==========================================
  {
    id: 'gb-logo-design',
    category: 'Graphics & Branding',
    title: 'Logo Design',
    shortDesc: 'Custom professional vector logo design for creators, streamers, esports teams, and businesses.',
    fullDesc: 'Build a timeless visual identity starting with a custom logo. We design clean, versatile vector logos—whether mascot logos for streamers, minimalist wordmarks for creators, or corporate marks for modern brands.',
    iconName: 'PenTool',
    deliveryInfo: 'Complete vector suite delivered in AI, EPS, PNG, SVG, and JPG formats.',
    whatIsIncluded: [
      'Custom Vector Logo Design Concept',
      'Transparent PNG, Vector SVG, AI, & EPS Files',
      'High-Resolution Monochrome & Color Variations',
      'Commercial Usage License Rights'
    ],
    popular: true,
    packages: {
      BASIC: {
        id: 'gb-logo-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          '1 Logo Concept',
          'Transparent PNG & JPG Exports',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-logo-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '3 Custom Logo Concepts',
          'Vector Source Files (AI, SVG, EPS)',
          'Social Media Profile Avatar Sizes',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-logo-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '5 Custom Logo Concepts + Mascot Option',
          'Complete Brand Style Guide Booklet',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-yt-thumbnail-design',
    category: 'Graphics & Branding',
    title: 'YouTube Thumbnail Design',
    shortDesc: 'High-impact standalone or bulk thumbnail graphics for YouTube creators.',
    fullDesc: 'Get graphic designer quality thumbnails tailored to your gaming, tech, podcast, or business videos. High contrast, mobile-readable text, subject isolation, and vibrant color grading.',
    iconName: 'Image',
    deliveryInfo: 'Delivered in 1080p PNG & JPG formats.',
    whatIsIncluded: [
      'Custom 1920x1080 High-CTR Thumbnail Design',
      'Subject Cutout & Lighting Enhancement',
      'Bold Typography & Visual Effects'
    ],
    packages: {
      BASIC: {
        id: 'gb-th-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '2 High-CTR Thumbnails',
          '1920x1080 PNG Format',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-th-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '6 High-CTR Thumbnails',
          'PSD Source Files Included',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-th-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          '15 High-CTR Thumbnails + Custom PSD Template System',
          '24-Hour Batch Turnaround',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-social-media-banner',
    category: 'Graphics & Branding',
    title: 'Social Media Banner',
    shortDesc: 'Multi-device responsive header banners for YouTube, Twitter/X, Facebook, and LinkedIn.',
    fullDesc: 'Make every profile look cohesive and professional with custom social media banners engineered to fit exact platform safe-zones.',
    iconName: 'Image',
    deliveryInfo: 'Delivered ready for immediate social profile upload.',
    whatIsIncluded: [
      'Custom Banner Graphic Design',
      'Platform Safe Area Alignment',
      'High-Resolution PNG File Export'
    ],
    packages: {
      BASIC: {
        id: 'gb-smb-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '1 Platform Header Banner',
          'High Resolution PNG',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-smb-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '3 Platform Banners (YouTube, X, Facebook)',
          'Matching Avatar Graphic',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-smb-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete 5-Platform Banner Package',
          'Source Photoshop Files',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-twitch-overlay',
    category: 'Graphics & Branding',
    title: 'Twitch Overlay',
    shortDesc: 'Custom live stream HUD overlays, webcam borders, and chat box graphic frames.',
    fullDesc: 'Custom graphic stream overlays tailored to your broadcast theme and game genres. Lightweight PNG / WEBM files that don\'t clutter your stream or drop PC frames.',
    iconName: 'Layers',
    deliveryInfo: 'OBS and Streamlabs ready graphics delivered within 2-3 days.',
    whatIsIncluded: [
      'Custom Game Overlay Frame',
      'Webcam Border Graphic',
      'Top Event Labels (Sub, Tip, Follower)'
    ],
    packages: {
      BASIC: {
        id: 'gb-ov-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Static Webcam Border & Event Label Bar',
          'Transparent PNG Files',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-ov-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Animated Webcam Border + Stream Alerts Pack',
          'Custom Chat Frame Overlay',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-ov-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Full Animated Stream Overlay Suite + Audio FX',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-stream-package',
    category: 'Graphics & Branding',
    title: 'Stream Package',
    shortDesc: 'Comprehensive all-in-one broadcast package including overlays, scenes, alerts, screens, and info panels.',
    fullDesc: 'The ultimate streaming upgrade. Get everything you need for a broadcast studio setup: Logo, Banners, Overlay, Webcam Frame, Alerts, Starting/BRB/Ending Screens, and Info Panels.',
    iconName: 'Box',
    popular: true,
    deliveryInfo: 'Complete master stream suite delivered in 3-5 days.',
    whatIsIncluded: [
      'Twitch Profile Avatar & Header Banner',
      '3 Animated Broadcast Screens (Starting, BRB, Ending)',
      'Animated Overlay & Webcam Border',
      'Subscriber & Donation Alert Popups Pack',
      '8 Channel Info Panels Graphic Pack'
    ],
    packages: {
      BASIC: {
        id: 'gb-sp-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Static Stream Suite (Avatar + Banner + Overlay + 4 Panels)',
          'PNG Graphics Pack',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-sp-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '3 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Animated Screens (Starting, BRB, Ending)',
          'Animated Overlay & Custom Alert Popups',
          '8 Graphic Panels',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-sp-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '2 Days',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Master 3D Animated Stream Suite + Custom Emote Set',
          'Full OBS One-Click Setup File & Source Photoshop/After Effects Project Files',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-brand-kit',
    category: 'Graphics & Branding',
    title: 'Brand Kit',
    shortDesc: 'Complete corporate or creator branding style guide with logos, typography, color palettes, and asset guidelines.',
    fullDesc: 'Establish a rock-solid, professional brand identity with an official Brand Kit booklet. Includes logo usage rules, primary/secondary color palettes with hex/RGB codes, font pairings, visual asset guidelines, and social media mockups.',
    iconName: 'BookOpen',
    deliveryInfo: 'Delivered as a high-resolution Brand PDF & Asset Folder.',
    whatIsIncluded: [
      'Master Vector Logo Suite (Primary, Secondary, Monogram)',
      'Official Brand Style Guide PDF Booklet',
      'Color Palette System (HEX, RGB, CMYK codes)',
      'Typography Pairings & Usage Rules',
      'Social Media & Email Signature Mockups'
    ],
    packages: {
      BASIC: {
        id: 'gb-bk-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '3 Days',
        revisions: '1 Revision',
        features: [
          'Basic Logo + Color Palette Sheet',
          'Typography Guide',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-bk-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '3 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Complete Brand Guidelines Booklet (PDF)',
          'Vector Logo Package + Social Asset Mockups',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-bk-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '2 Days',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Master Enterprise Brand System (Logo, Guidelines, Social Kit, Stationery, Email Signatures)',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-promotional-graphics',
    category: 'Graphics & Branding',
    title: 'Promotional Graphics',
    shortDesc: 'Eye-catching marketing graphics for product launches, events, stream announcements, and merchandise.',
    fullDesc: 'Announce your product launches, tournament streams, merchandise drops, or community giveaways with high-impact promotional graphics engineered for max click-through rate.',
    iconName: 'Megaphone',
    deliveryInfo: 'Delivered in high-res social media optimized formats.',
    whatIsIncluded: [
      'Custom Promotional Graphic Design',
      'Sized for Instagram Posts/Stories, X, Facebook',
      'High-Resolution PNG/JPG Export'
    ],
    packages: {
      BASIC: {
        id: 'gb-pg-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          '1 Promotional Banner / Graphic',
          'High Resolution Export',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-pg-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          '4 Promotional Graphics / Story Formats',
          'Source PSD Files Included',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-pg-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Launch Campaign Graphics Pack (10 Assets + Short Video Teaser)',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  },
  {
    id: 'gb-business-flyer',
    category: 'Graphics & Branding',
    title: 'Business Flyer',
    shortDesc: 'Professional print-ready digital flyers and poster graphics for promotional events and business marketing.',
    fullDesc: 'Promote your brand in digital and physical channels with high-resolution business flyers, posters, and digital PDF brochures created by expert graphic designers.',
    iconName: 'FileText',
    deliveryInfo: 'Delivered in print-ready 300 DPI PDF and digital PNG files.',
    whatIsIncluded: [
      'Single or Double-Sided Business Flyer Design',
      'Print-Ready 300 DPI CMYK PDF File',
      'Digital Web-Optimized RGB File'
    ],
    packages: {
      BASIC: {
        id: 'gb-bf-basic',
        name: 'BASIC',
        price: 70,
        deliveryDays: '2 Days',
        revisions: '1 Revision',
        features: [
          'Single-Sided Business Flyer Design',
          'Print-Ready 300 DPI PDF',
          '1 Revision',
          'Standard Support'
        ]
      },
      STANDARD: {
        id: 'gb-bf-standard',
        name: 'STANDARD',
        price: 230,
        badge: 'Most Popular',
        deliveryDays: '2 Days',
        revisions: '2 Revisions',
        features: [
          'Everything in Basic',
          'Double-Sided Flyer Design',
          'Editable Source Vector Files',
          '2 Revisions',
          'Priority Support'
        ]
      },
      PREMIUM: {
        id: 'gb-bf-premium',
        name: 'PREMIUM',
        price: 460,
        deliveryDays: '1 Day',
        revisions: '3 Revisions',
        features: [
          'Everything in Standard',
          'Complete Event & Business Print Suite (Flyer + Poster + Digital PDF Brochure)',
          '3 Revisions',
          'Dedicated VIP Support'
        ]
      }
    },
    faqs: []
  }
];

// INITIAL PROOF ITEMS (Proof & Results)
export const INITIAL_PROOFS: ProofItem[] = [
  {
    id: 'proof-yt-1',
    title: 'YouTube Creator Channel Architecture & SEO Overhaul',
    platform: 'YouTube',
    category: 'YouTube',
    serviceProvided: 'Channel Setup & SEO Optimization',
    beforeImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80',
    resultImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    description: 'Complete channel restructuring including keyword targeting, upload defaults, playlist navigation, and high-CTR thumbnail redesign.',
    dateCompleted: '2026-07-15'
  },
  {
    id: 'proof-tw-1',
    title: 'Twitch Esports Broadcast Suite & Overlay Rebrand',
    platform: 'Twitch',
    category: 'Twitch',
    serviceProvided: 'Stream Package & Overlay Design',
    beforeImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    resultImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    description: 'Designed animated 3D starting screen, webcam borders, custom subscriber emotes, and alert popups for a high-intensity live stream channel.',
    dateCompleted: '2026-07-28'
  },
  {
    id: 'proof-sm-1',
    title: 'Multi-Platform Creator Branding & Social Funnel',
    platform: 'Instagram',
    category: 'Social Media',
    serviceProvided: 'Social Media Branding & Content Strategy',
    beforeImage: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=80',
    resultImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    description: 'Aligned bio positioning, highlight covers, and short-form video hooks across Instagram and TikTok for a creator brand.',
    dateCompleted: '2026-08-02'
  },
  {
    id: 'proof-gb-1',
    title: 'Digital Agency Brand Kit & Vector Logo Design',
    platform: 'Branding',
    category: 'Graphics & Branding',
    serviceProvided: 'Logo Design & Brand Kit',
    beforeImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    resultImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    description: 'Developed an official enterprise brand identity booklet, vector mascot logo, color palette rules, and typography pairings.',
    dateCompleted: '2026-08-05'
  }
];

// INITIAL TESTIMONIALS
export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alex "Vortex" Rivera',
    handle: '@VortexLive',
    role: 'Twitch Partner & Content Creator',
    text: 'ApexCreator Studio transformed my stream identity completely. The animated stream overlays, starting screen, and custom sub emotes look like a million-dollar broadcast studio production.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    platform: 'Twitch'
  },
  {
    id: 'test-2',
    name: 'Sarah Chen',
    handle: '@TechDrivenOfficial',
    role: 'YouTube Educator (250K+ Subs)',
    text: 'The Channel Audit and SEO Optimization service was an eye-opener. Their team provided clear, actionable metadata tweaks that instantly improved our video indexing in search results.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    platform: 'YouTube'
  },
  {
    id: 'test-3',
    name: 'Marcus Vance',
    handle: '@VanceMediaGroup',
    role: 'Digital Agency Director',
    text: 'ApexCreator Studio is our secret weapon for client branding. The turnaround time on vector logos, social kits, and thumbnail design batches is remarkably fast and always top quality.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    platform: 'Agency'
  }
];

// INITIAL FAQS
export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-payment',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Cryptocurrency (USDT, BTC, ETH, etc. via our Crypto Gateway) as well as global credit and debit cards.'
  },
  {
    id: 'faq-1',
    category: 'General',
    question: 'How do I place an order?',
    answer: 'Browse our service catalog, choose the service that matches your goal, select your desired package (Basic $70, Standard $230, or Premium $460) or offer a custom price, fill out the project order form, and proceed through our secure checkout.'
  },
  {
    id: 'faq-negotiate',
    category: 'Pricing',
    question: 'How does price negotiation work?',
    answer: 'ApexCreator Studio allows customers to propose custom prices for services. Choose a package tier, check "Offer custom negotiated price" during checkout, and enter your proposed price offer and note for review!'
  },
  {
    id: 'faq-2',
    category: 'Packages',
    question: 'How do I choose a package?',
    answer: 'Our Basic package ($70) is ideal for essential single-focus projects. Our Standard package ($230) is our most popular all-around solution with advanced revisions and priority support. Our Premium package ($460) is designed for creators and businesses needing a complete, end-to-end master strategy.'
  },
  {
    id: 'faq-3',
    category: 'Delivery',
    question: 'How long does an order take?',
    answer: 'Standard turnaround time ranges from 1 to 3 business days depending on the selected package and project complexity. Delivery dates are clearly stated on your order confirmation.'
  },
  {
    id: 'faq-4',
    category: 'Upgrades',
    question: 'Can I upgrade my package later?',
    answer: 'Yes! If you start with a Basic or Standard package and need additional deliverables, you can contact our team directly through your Customer Dashboard order message board to upgrade.'
  },
  {
    id: 'faq-5',
    category: 'Tracking',
    question: 'How do I track my order?',
    answer: 'Every order generates a unique Order ID (e.g. APX-2026-00001). You can log into your Customer Dashboard at any time to view real-time status updates, delivery timelines, and direct messages.'
  },
  {
    id: 'faq-6',
    category: 'Policy & Safety',
    question: 'Do you guarantee monetization or verification?',
    answer: 'No. Platform monetization and verification approvals are determined solely by YouTube, Twitch, Meta, and official platform reviewers. ApexCreator Studio provides legitimate preparation, auditing, optimization, and strategy guidance to help you meet official requirements.'
  },
  {
    id: 'faq-7',
    category: 'Security',
    question: 'Do I need to provide my account password?',
    answer: 'Never! We never ask for your account password or login credentials. Channel optimization is managed securely via official platform manager permissions or structured delivery guides.'
  },
  {
    id: 'faq-8',
    category: 'Payment',
    question: 'How does payment work?',
    answer: 'We accept major credit cards and digital payment methods through our secure checkout page. Payments are processed safely, and raw card details are never stored.'
  },
  {
    id: 'faq-9',
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'You can submit an inquiry on our Contact Page, email support@apexcreator.studio, or use the direct message board inside your Customer Order Dashboard.'
  }
];

// DEFAULT SAMPLE ORDERS
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'APX-2026-00001',
    customerName: 'Jordan Taylor',
    email: 'jordan.taylor@example.com',
    category: 'YouTube',
    serviceId: 'yt-channel-setup',
    serviceTitle: 'Channel Setup & Optimization',
    packageType: 'STANDARD',
    price: 230,
    socialUrl: 'https://youtube.com/@JordanTaylorGaming',
    projectDescription: 'Need a complete channel setup for my gaming channel, keyword optimization, and upload default templates.',
    preferredDeliveryDate: '2026-08-12',
    createdAt: '2026-08-07',
    expectedDeliveryDate: '2026-08-09',
    paymentStatus: 'Paid',
    status: 'In Progress',
    deliverables: [],
    messages: [
      {
        id: 'msg-1',
        sender: 'admin',
        senderName: 'ApexCreator Studio Support',
        text: 'Thank you for your order Jordan! Our team has begun analyzing your channel setup requirements.',
        timestamp: '2026-08-07 14:30'
      }
    ]
  },
  {
    id: 'APX-2026-00002',
    customerName: 'Mia Rodriguez',
    email: 'mia.rodriguez@example.com',
    category: 'Graphics & Branding',
    serviceId: 'gb-stream-package',
    serviceTitle: 'Stream Package',
    packageType: 'PREMIUM',
    price: 460,
    socialUrl: 'https://twitch.tv/mia_streamz',
    projectDescription: 'Complete animated stream package with cyber-purple aesthetic, starting soon screen, webcam frame, and custom emotes.',
    preferredDeliveryDate: '2026-08-10',
    createdAt: '2026-08-05',
    expectedDeliveryDate: '2026-08-07',
    paymentStatus: 'Paid',
    status: 'Completed',
    deliverables: [
      {
        id: 'deliv-1',
        title: 'Master_Stream_Package_Mia.zip',
        downloadUrl: 'https://example.com/downloads/Master_Stream_Package_Mia.zip',
        fileSize: '48.2 MB',
        uploadedAt: '2026-08-07',
        note: 'Includes animated screens, OBS scene setup file, and Twitch overlay assets.'
      }
    ],
    messages: [
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'ApexCreator Studio Support',
        text: 'Your completed stream package deliverables have been uploaded! Please let us know if you need any adjustments.',
        timestamp: '2026-08-07 10:15'
      }
    ]
  }
];

export const DEFAULT_CHAT_CONFIG = {
  enabled: true,
  businessHours: {
    enabled: true,
    timezone: 'UTC',
    schedule: [
      { day: 'Monday', start: '08:00', end: '18:00', closed: false },
      { day: 'Tuesday', start: '08:00', end: '18:00', closed: false },
      { day: 'Wednesday', start: '08:00', end: '18:00', closed: false },
      { day: 'Thursday', start: '08:00', end: '18:00', closed: false },
      { day: 'Friday', start: '08:00', end: '18:00', closed: false },
      { day: 'Saturday', start: '09:00', end: '14:00', closed: false },
      { day: 'Sunday', start: '00:00', end: '00:00', closed: true },
    ]
  },
  offlineMessage: "We're currently offline. Please leave your message and email, and we'll get back to you as soon as we're back!",
  welcomeMessage: "👋 Welcome to ApexCreator Studio! I am your live growth assistant. How can we help scale your channel today?"
};
