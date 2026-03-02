# Lifestyle Super App - Web

Web application built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
apps/web/
├── app/                    # Next.js App Router pages
│   └── layout.tsx         # Root layout with SEO, fonts, GA
├── components/            # React components
│   ├── header.tsx        # Main header with CTA
│   └── google-analytics.tsx
├── styles/               # Global styles
│   └── globals.css       # Tailwind CSS + custom styles
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── store/                # State management (Redux/Zustand)
└── public/               # Static assets
```

## 🎨 Features

### SEO Optimization
- Complete metadata configuration (title, description, keywords)
- Open Graph tags for social media
- Twitter Card meta tags
- Structured data ready
- Sitemap and robots.txt support
- Canonical URLs

### Font Configuration
- **Inter font** from Google Fonts
- Vietnamese and Latin subsets
- Display swap for better performance
- CSS variable: `--font-inter`

### Google Analytics
- GA4 integration ready
- Privacy-focused (anonymize IP)
- Custom event tracking utilities
- Environment-based loading (production only)

### Header Component
- Responsive design (mobile & desktop)
- Gradient CTA button with hover effects
- Mobile hamburger menu
- Sticky positioning
- Smooth transitions

## ⚙️ Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_BASE_URL` - Your production domain
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID
- `NEXT_PUBLIC_GOOGLE_VERIFICATION` - Search Console verification

### Google Analytics Setup

1. Get your GA4 Measurement ID from [Google Analytics](https://analytics.google.com/)
2. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Track custom events:
   ```typescript
   import { trackEvent } from '@/components/google-analytics';

   trackEvent('button_click', {
     location: 'header',
     label: 'Sign Up'
   });
   ```

## 🎯 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS |
| Font | Inter (Google Fonts) |
| Analytics | Google Analytics 4 |
| State | Redux Toolkit / Zustand |

## 📝 Code Standards

Following the architecture guidelines from `docs/architecture/README_ARCHITECTURE.md`:

- ✅ TypeScript strict mode enabled
- ✅ Functional components with hooks
- ✅ Server Components by default
- ✅ CSS-in-JS with Tailwind
- ✅ Proper error handling
- ✅ SEO best practices

## 🔗 Links

- [Architecture Documentation](../../docs/architecture/README_ARCHITECTURE.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License

Copyright © 2026 Lifestyle Super App. All rights reserved.
