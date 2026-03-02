# 🚀 Setup Guide - Lifestyle Super App Web

## ✅ Files Created

### Core Application Files
- ✅ `app/layout.tsx` - Root layout with SEO, Inter font, Google Analytics
- ✅ `app/page.tsx` - Homepage with hero section and features
- ✅ `app/loading.tsx` - Loading state UI
- ✅ `app/error.tsx` - Error boundary
- ✅ `app/global-error.tsx` - Global error handler
- ✅ `app/not-found.tsx` - 404 page

### SEO & Metadata Files
- ✅ `app/robots.ts` - Robots.txt configuration
- ✅ `app/sitemap.ts` - Dynamic sitemap generation
- ✅ `app/manifest.ts` - PWA manifest
- ✅ `app/opengraph-image.tsx` - Dynamic OG image generation

### Components
- ✅ `components/header.tsx` - Header with responsive menu & CTA
- ✅ `components/google-analytics.tsx` - GA4 integration with utilities

### Styles
- ✅ `styles/globals.css` - Tailwind CSS with custom theme

### Configuration Files
- ✅ `package.json` - Dependencies and scripts
- ✅ `tsconfig.json` - TypeScript strict configuration
- ✅ `tailwind.config.ts` - Tailwind CSS configuration
- ✅ `next.config.js` - Next.js configuration
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `.eslintrc.json` - ESLint rules
- ✅ `.prettierrc.json` - Prettier formatting rules
- ✅ `.gitignore` - Git ignore patterns
- ✅ `.env.local.example` - Environment variables template

### Utilities
- ✅ `lib/utils.ts` - Common utility functions

### Documentation
- ✅ `README.md` - Project documentation
- ✅ `SETUP.md` - This setup guide

---

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd apps/web
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your values:
# - NEXT_PUBLIC_BASE_URL
# - NEXT_PUBLIC_GA_MEASUREMENT_ID
# - NEXT_PUBLIC_GOOGLE_VERIFICATION
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Start production server
npm start
```

---

## 🎨 Key Features Implemented

### ✅ SEO Optimization (Complete)
- [x] Comprehensive metadata configuration
- [x] Open Graph tags for social media
- [x] Twitter Card meta tags
- [x] Dynamic sitemap generation (`/sitemap.xml`)
- [x] Robots.txt configuration (`/robots.txt`)
- [x] PWA manifest (`/manifest.json`)
- [x] Dynamic OG image generation
- [x] Canonical URLs
- [x] Structured data ready

### ✅ Font Configuration (Complete)
- [x] Inter font from Google Fonts
- [x] Vietnamese + Latin subsets
- [x] Display swap for performance
- [x] CSS variable: `--font-inter`
- [x] Applied globally via Tailwind

### ✅ Google Analytics (Complete)
- [x] GA4 integration component
- [x] Environment-based loading (production only)
- [x] Privacy-focused (anonymize IP)
- [x] Custom event tracking utilities
- [x] Page view tracking
- [x] TypeScript types

### ✅ Header Component (Complete)
- [x] Responsive design (mobile + desktop)
- [x] Gradient CTA button with animations
- [x] Mobile hamburger menu
- [x] Sticky positioning
- [x] Smooth transitions
- [x] Navigation links
- [x] Accessible (ARIA labels)

### ✅ Additional Features
- [x] Error boundaries (error.tsx, global-error.tsx)
- [x] Loading states (loading.tsx)
- [x] 404 page with custom design
- [x] Utility functions (formatting, date, currency)
- [x] TypeScript strict mode
- [x] ESLint + Prettier configured
- [x] Tailwind CSS custom theme
- [x] Dark mode support (CSS variables ready)

---

## 🧪 Testing Checklist

### SEO Testing
- [ ] Check metadata in browser DevTools
- [ ] Validate OG tags with [OpenGraph Debugger](https://www.opengraph.xyz/)
- [ ] Test Twitter Card with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Verify sitemap at `/sitemap.xml`
- [ ] Check robots.txt at `/robots.txt`
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Performance Testing
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Test with slow 3G network
- [ ] Verify image optimization
- [ ] Check Core Web Vitals

### Functionality Testing
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify header navigation
- [ ] Test CTA button clicks
- [ ] Check mobile menu toggle
- [ ] Test error boundaries (trigger an error)
- [ ] Verify 404 page (visit non-existent route)
- [ ] Test loading states

### Analytics Testing
- [ ] Verify GA script loads in production
- [ ] Test custom event tracking
- [ ] Check GA dashboard for data

---

## 🔧 Customization Guide

### Change Theme Colors

Edit `styles/globals.css` and update CSS variables:

```css
:root {
  --primary: 271.5 81.3% 55.9%; /* Purple */
  /* ... other colors */
}
```

### Add New Pages

Create files in `app/` directory:

```bash
# Example: Create an About page
apps/web/app/about/page.tsx
```

### Add Custom Fonts

Update `app/layout.tsx`:

```typescript
import { Inter, Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});
```

### Modify Header Links

Edit `components/header.tsx` and update navigation items.

---

## 📚 Architecture Compliance

This implementation follows the guidelines from:
- ✅ `docs/architecture/README_ARCHITECTURE.md`

### Compliance Checklist
- [x] TypeScript strict mode enabled
- [x] Next.js 14 App Router
- [x] Functional components with hooks
- [x] Server Components by default
- [x] Proper error handling
- [x] Clean Code principles (naming, functions, etc.)
- [x] ESLint + Prettier configured
- [x] Workspace packages structure ready

---

## 🐛 Troubleshooting

### Issue: TypeScript errors about missing packages

**Solution:** The workspace packages (`@lifestyle/*`) need to be created. Until then, you can comment out the imports in `package.json` or create placeholder packages.

### Issue: Tailwind classes not applying

**Solution:**
1. Ensure `globals.css` is imported in `layout.tsx`
2. Check `tailwind.config.ts` content paths
3. Restart dev server

### Issue: Google Analytics not loading

**Solution:**
1. Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in `.env.local`
2. Check that `NODE_ENV=production` for testing GA
3. Check browser console for errors

---

## 📝 Next Steps

1. **Create workspace packages** as defined in architecture:
   - `@lifestyle/shared`
   - `@lifestyle/types`
   - `@lifestyle/utils`
   - `@lifestyle/design-system`
   - etc.

2. **Add more pages**:
   - About page
   - Contact page
   - Service pages (food delivery, ride hailing, etc.)
   - Auth pages (login, signup)

3. **Integrate APIs**:
   - Connect to backend services
   - Implement authentication
   - Add state management (Redux/Zustand)

4. **Performance optimization**:
   - Add image optimization
   - Implement lazy loading
   - Add service worker for offline support

5. **Testing**:
   - Add unit tests (Jest + Testing Library)
   - Add E2E tests (Playwright)
   - Add integration tests

---

## 🎯 Quick Reference

### Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Type checking
npm run type-check

# Clean
npm run clean
```

### Folder Structure

```
apps/web/
├── app/                    # App Router pages & layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error boundary
│   ├── not-found.tsx      # 404 page
│   ├── global-error.tsx   # Global error
│   ├── robots.ts          # Robots.txt
│   ├── sitemap.ts         # Sitemap
│   ├── manifest.ts        # PWA manifest
│   └── opengraph-image.tsx # OG image
├── components/            # React components
│   ├── header.tsx
│   └── google-analytics.tsx
├── lib/                   # Utilities
│   └── utils.ts
├── styles/               # Global styles
│   └── globals.css
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 📞 Support

For issues or questions:
- Check the [Architecture Documentation](../../docs/architecture/README_ARCHITECTURE.md)
- Review this setup guide
- Check Next.js [documentation](https://nextjs.org/docs)

---

**✨ Setup Complete! Happy Coding! ✨**
