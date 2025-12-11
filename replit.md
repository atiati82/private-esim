# Private eSIM

## Overview

Private eSIM (formerly eSIMwallet) is a full-stack e-commerce platform for purchasing and managing eSIM products. Built with Next.js 14 (App Router) and PayloadCMS as the headless CMS, it enables users to browse eSIM plans by destination/region, add products to cart, and complete purchases via Stripe. The application supports internationalization (i18n) with multiple locales and includes a blog system for content marketing.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (December 2024)

### Rebranding Completed
- **Brand Name**: Changed from "eSIMwallet" to "Private eSIM"
- **Domain**: Updated from esimwallet.io to private-esim.com
- **Admin Credentials**: admin@private-esim.com / password: admin
- **Email Addresses**: All internal emails updated to @private-esim.com domain
- **UI Text**: All user-facing branding updated across the application
- **Cookie Prefix**: Changed from "eSIMwallet" to "PrivateESIM"

### MobiMatter API Integration
- **Status**: Verified and working
- **Products Available**: 1,447 eSIM products ready to import
- **Credentials**: Configured via MOBIMATTER_MERCHANT_ID and MOBIMATTER_API_KEY secrets

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router and React Server Components (RSC)
- **Styling**: Vanilla Extract for CSS-in-JS with type-safe styles, plus shadcn/ui components
- **State Management**: Redux Toolkit with RTK Query for API data fetching and caching
- **Internationalization**: next-intl for multi-language support (en, es, de, fr, pl, ru)
- **Component Development**: Storybook for isolated component development and documentation

### Backend Architecture
- **CMS**: PayloadCMS 3.x integrated directly into the Next.js application
- **Database**: MongoDB (required by PayloadCMS) - requires MongoDB Atlas connection
- **API Routes**: 
  - PayloadCMS REST API at `/api/*`
  - Custom Next.js route handlers at `/esim-api/*`
- **Authentication**: PayloadCMS built-in auth with JWT tokens and cookie-based sessions

### Data Layer
- **Collections**: Users, Destinations, Regions, EsimProducts, EsimProviders, BlogPosts, Orders
- **Data Transformation**: DTOs from Payload are converted to client-side objects via `make*Obj()` functions
- **Caching**: Memoization with `memoizee` for expensive database queries

### Payment Processing
- **Provider**: Stripe for payment processing
- **Webhooks**: Stripe webhook events forwarded to `/api/transactions/stripe-events`
- **Local Development**: Use `stripe listen` CLI for webhook forwarding

### Key Design Patterns
- **Repository Pattern**: Data access functions in `src/data/` (e.g., `findProducts`, `findDestinations`)
- **Store Slices**: Redux slices for cart, messages, destinations, and router state
- **API Slices**: RTK Query slices for auth, destinations, and products
- **Feature Folders**: Major features organized in `feat-*` directories (e.g., `feat-cart`, `feat-blog`)

### Testing Strategy
- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright with Page Object pattern
- **Mocking**: MSW for API mocking in Storybook, in-memory MongoDB for unit tests

## External Dependencies

### Third-Party Services
- **PayloadCMS**: Headless CMS for content management and admin UI at `/payload`
- **Stripe**: Payment processing with webhook integration
- **Google reCAPTCHA Enterprise**: Form protection and bot detection
- **Vercel**: Hosting platform with deployment to Singapore region (sin1)
- **Chromatic**: Visual regression testing for Storybook components
- **Vercel Blob Storage**: Media file storage (configured via PayloadCMS plugin)
- **MobiMatter**: eSIM product supplier - products imported via `payload:import-mm` CLI command

### Database
- **MongoDB**: Primary database for PayloadCMS (requires MongoDB Atlas for Replit)
- **Connection**: Set via `PAYLOAD_DATABASE_URI` environment variable

### Key Environment Variables Required
- `NEXT_PUBLIC_WEBSITE_URL`: Public URL of the application
- `PAYLOAD_DATABASE_URI`: MongoDB Atlas connection string (required to run)
- `PAYLOAD_SECRET`: Secret for PayloadCMS authentication
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `MOBIMATTER_MERCHANT_ID`: MobiMatter supplier merchant ID
- `MOBIMATTER_API_KEY`: MobiMatter API key
- `RECAPTCHA_*`: Google reCAPTCHA credentials

## Code Quality Scan (December 2024)

### Scan Results
- **TypeScript**: Clean - No type errors
- **ESLint**: Clean - No warnings or errors
- **Test Suite**: 30+ test files - Infrastructure-blocked in Replit (MongoDB Memory Server incompatibility)

### Architecture Quality
- Well-organized feature-based folder structure
- Type-safe CSS with Vanilla Extract
- Comprehensive test coverage for core business logic
- Clean separation of concerns between data, UI, and business logic

### Replit Environment Notes
- **Database Requirement**: This project requires MongoDB (used by PayloadCMS). Replit provides PostgreSQL natively, not MongoDB.
- **To run**: Provide a MongoDB Atlas connection string in `PAYLOAD_DATABASE_URI` secret
- **Middleware**: Updated `src/middleware.ts` to allow requests from Replit domains (*.replit.dev, *.repl.co) without authentication
- **Alternative**: Would require significant refactoring to use PostgreSQL adapter for PayloadCMS

### Running on Replit
1. Set `PAYLOAD_DATABASE_URI` secret to a MongoDB Atlas connection string (with IP whitelist set to 0.0.0.0/0)
2. Set `MOBIMATTER_MERCHANT_ID` and `MOBIMATTER_API_KEY` secrets for eSIM product import
3. Configure required Stripe and reCAPTCHA credentials (optional for initial testing)
4. Run: `cd esimwallet.io-master && pnpm next:dev -p 5000`
5. After database connected, run `pnpm payload:import-mm` to import MobiMatter products

## AI CMS System (BigMind) - December 2024

### Overview
AI-powered content management system integrated with PayloadCMS. Uses Replit AI Integrations (OpenAI) for content generation - no API keys required, charges billed to Replit credits.

### Features
- **BigMind Chat**: AI assistant with function calling for managing CMS content
- **Magic Page Generator**: Converts text descriptions into complete pages with HTML, SEO, and visual config
- **Motion Layout Engine**: 10 motion archetypes for animated page sections (Framer Motion)
- **BigMind Response Parser**: Extracts structured data from AI responses
- **Andara Page Renderer**: React component that renders AI-generated HTML with animations

### AI CMS File Structure
```
src/ai-cms/
├── index.ts                 # Main exports
├── services/
│   ├── ai-client.ts         # OpenAI client with function calling support
│   ├── bigmind-cms.ts       # CMS manager with AI function tools
│   ├── ai-pages-storage.ts  # AI Pages storage adapter (NEW)
│   └── payload-storage.ts   # PayloadCMS storage adapter (legacy)
├── lib/
│   ├── bigmind-parser.ts    # AI response parser with visual config extraction
│   └── motion.ts            # Motion archetypes and animations
└── components/
    └── andara-page-renderer.tsx  # Animated page renderer

src/payload/
├── collections/
│   └── ai-pages/            # AI Pages Collection (NEW)
│       └── ai-pages.collection.ts
├── components/              # Custom admin components
│   ├── AIPageBuilder.tsx    # Chat interface for AI content generation
│   └── VisualConfigField.tsx # Motion designer modal
└── admin/
    └── custom.css           # Andara dark theme styling
```

### AI Pages Collection (NEW)
Dedicated PayloadCMS collection for AI-generated content with:
- **Page Metadata**: Title, key, URL path, page type, template, status
- **Content Clusters**: blog, support, about, legal, science, products, destinations
- **SEO Settings**: Focus keyword, title, description, featured image
- **Visual Config**: Vibe keywords, emotional tone, animation ideas, motion presets
- **Motion Designer**: Entrance, hover, ambient, hero section, content sections, cards/boxes motion
- **AI Prompts**: Image prompts, video prompts, designer notes
- **AI Page Builder**: Chat history, last prompt (sidebar)

### Andara Design System
- **Theme**: PayloadCMS dark mode enabled via `payload.config.ts`
- **Colors**: Deep blue/purple backgrounds (#0a0a14, #1a1a2e), teal accent (#00d4aa)
- **Custom CSS**: Located at `src/app/(payload)/custom.scss` (PayloadCMS 3.x standard location)
- **Custom Components**: AIPageBuilder, VisualConfigField with inline Andara styling

### Styling Implementation
The Andara dark theme is applied through:
1. **PayloadCMS Dark Mode**: Enabled in `payload.config.ts` with `admin.theme: 'dark'`
2. **Custom SCSS**: `src/app/(payload)/custom.scss` overrides CSS variables for the Andara color palette
3. **Inline Styles**: Custom React components (AIPageBuilder, VisualConfigField) use inline styles for the Andara design

Key CSS Variables:
- `--theme-elevation-0`: #0a0a14 (deepest background)
- `--theme-elevation-200`: #1a1a2e (card/panel background)
- `--theme-success-500`: #00d4aa (teal accent color)
- `--theme-warning-500`: #ff9500 (warning/missing badge color)

### API Endpoints
- `POST /esim-api/ai-chat` - BigMind chat with function calling
- `POST /esim-api/ai-generate` - Generate page content from topic

### Motion Archetypes
1. liquid-crystal-float - Soft floating movement
2. energetic-pulse - Rhythmic pulsing
3. magnetic-drift - Elements attract/repel
4. krystal-bloom - Glow expansion
5. scalar-slide - Linear acceleration
6. vortex-reveal - Spiral staggered motion
7. parallax-depth - Multi-layer scroll
8. ripple-emergence - Wave-like reveal
9. subtle-shimmer - Gentle brightness
10. layered-parallax - 3D scroll effect

### Content Clusters (AI-Managed)
- blog: News, guides, and articles
- support: FAQ, help, and support pages
- about: Company information
- legal: Terms, privacy, legal pages

Note: Destinations and products are managed via PayloadCMS admin due to complex schema requirements.

### Known Limitations
- AI CMS uses flat URL structure (e.g., /en/blog/my-post, /en/support/faq)
- Nested paths beyond the cluster are not preserved in PayloadCMS storage
- For complex page hierarchies, use PayloadCMS admin directly

### Token Costs (Estimated)
- Light use (10 pages/day): ~$3-10/month with GPT-4.1-mini
- Heavy use (50 pages/day): ~$15-50/month
- Uses Replit AI Integrations - billed to your Replit credits
