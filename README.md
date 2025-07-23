# Phygen Web - Next.js Application

## 🚀 Setup Instructions for Co-workers

### Prerequisites
- Node.js (version 18 hoặc cao hơn)
- npm hoặc yarn package manager

### 🔧 Installation Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd phygen_web
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   **⚠️ Important:** Sử dụng `--legacy-peer-deps` để tránh conflicts với React version 19 và các packages khác.

3. **Environment Setup**
   - Đảm bảo có file `.env` với:
   ```env
   SESSION_SECRET=123
   ```

### 🔨 Available Scripts

- **Development**: `npm run dev` - Khởi chạy development server
- **Build**: `npm run build` - Build production  
- **Start**: `npm start` - Khởi chạy production server
- **Lint**: `npm run lint` - Chạy ESLint

### 📦 Dependencies đã cài đặt

- **Core Framework**: Next.js 15.3.3, React 19
- **UI Components**: ApexCharts, @react-jvectormap
- **Form & Date**: flatpickr, react-dropzone
- **Styling**: TailwindCSS 4.0
- **Authentication**: jose (JWT)
- **Validation**: zod

### 🐛 Common Issues & Solutions

#### Issue 1: Build Errors với Missing Dependencies
**Lỗi**: `Cannot find module 'flatpickr'` hoặc `Cannot find module 'react-dropzone'`

**Giải pháp**:
```bash
npm install flatpickr @types/flatpickr react-dropzone --legacy-peer-deps
```

#### Issue 2: React Version Conflicts
**Lỗi**: `ERESOLVE could not resolve` với React peer dependencies

**Giải pháp**: Luôn sử dụng `--legacy-peer-deps` khi install packages:
```bash
npm install <package-name> --legacy-peer-deps
```

#### Issue 3: SVG Import Issues
**Lỗi**: `Cannot find module '../../icons'`

**Giải pháp**: Đảm bảo import paths đúng:
```typescript
// Correct
import { CalenderIcon } from '../icons';
// hoặc  
import { CalenderIcon } from '../../icons';
```

#### Issue 4: TypeScript Errors
**Lỗi**: ESLint warnings về unused variables, any types

**Giải pháp**: 
- Prefix unused variables với `_` (ví dụ: `_data`)
- Thay thế `any` types với proper TypeScript types
- Sử dụng `unknown` thay vì `any` khi có thể

### 🏗️ Project Structure

```
src/
├── actions/          # Server actions
├── app/             # App router pages  
├── components/      # Reusable components
│   ├── common/      # Shared components
│   ├── form/        # Form components
│   ├── header/      # Header components
│   ├── icons/       # SVG icons
│   └── ui/          # UI components
├── context/         # React contexts
├── lib/            # Utility libraries
└── types/          # TypeScript definitions
```

### 🔐 Authentication

Project sử dụng JWT authentication với jose library. Session được manage trong `src/lib/session.ts`.

### 🎨 Styling

- **Framework**: TailwindCSS 4.0
- **Icons**: Custom SVG icons trong `src/components/icons/`
- **Components**: Custom UI components trong `src/components/ui/`

### 📊 Charts & Visualizations

- **Charts**: ApexCharts với React wrapper
- **Maps**: React JVectorMap
- **Date Picker**: Flatpickr

### 🚀 Deployment

1. Build project:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

### 📝 Development Guidelines

1. **Always run build** trước khi commit để đảm bảo không có lỗi
2. **Use TypeScript properly** - tránh `any` types
3. **Follow ESLint rules** - fix warnings trước khi push
4. **Use `--legacy-peer-deps`** khi install new packages
5. **Test locally** trước khi push changes

### ⚡ Quick Commands

```bash
# Setup từ đầu
npm install --legacy-peer-deps
npm run build
npm run dev

# Khi có lỗi build
npm install --legacy-peer-deps  
rm -rf .next
npm run build

# Thêm package mới
npm install <package-name> --legacy-peer-deps
```

### 🆘 Need Help?

Nếu gặp issues khác, check:
1. Node.js version (cần >= 18)
2. Clear `.next` folder: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install --legacy-peer-deps`
4. Check this README for common solutions

---
**Last Updated**: June 24, 2025  
**Build Status**: ✅ Successful

---

## Original Next.js Documentation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
