# eSIMwallet

## Overview

eSIMwallet is a full-stack e-commerce platform for purchasing and managing eSIM products. Built with Next.js 14 (App Router) and PayloadCMS as the headless CMS, it enables users to browse eSIM plans by destination/region, add products to cart, and complete purchases via Stripe. The application supports internationalization (i18n) with multiple locales and includes a blog system for content marketing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router and React Server Components (RSC)
- **Styling**: Vanilla Extract for CSS-in-JS with type-safe styles, plus shadcn/ui components
- **State Management**: Redux Toolkit with RTK Query for API data fetching and caching
- **Internationalization**: next-intl for multi-language support (en, es, de, fr, pl, ru)
- **Component Development**: Storybook for isolated component development and documentation

### Backend Architecture
- **CMS**: PayloadCMS 3.x integrated directly into the Next.js application
- **Database**: MongoDB (required by PayloadCMS) - run locally via Docker Compose
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

### Database
- **MongoDB**: Primary database for PayloadCMS (local via Docker, production via cloud provider)
- **Connection**: Set via `PAYLOAD_DATABASE_URI` environment variable

### External Data Sources
- **MobiMatter**: eSIM product supplier - products imported via `payload:import-mm` CLI command

### Key Environment Variables Required
- `NEXT_PUBLIC_WEBSITE_URL`: Public URL of the application
- `PAYLOAD_DATABASE_URI`: MongoDB connection string
- `PAYLOAD_SECRET`: Secret for PayloadCMS authentication
- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
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
- **To run locally**: Provide a MongoDB Atlas connection string in `PAYLOAD_DATABASE_URI`
- **Alternative**: Would require significant refactoring to use PostgreSQL adapter for PayloadCMS

### Running on Replit
1. Set `PAYLOAD_DATABASE_URI` to a MongoDB Atlas connection string
2. Configure required Stripe and reCAPTCHA credentials
3. Run: `cd esimwallet.io-master && pnpm next:dev -p 5000`