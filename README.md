![BeerBot Logo](logo.svg)

# 🍺 BeerBot Frontend

[![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

**Modern React dashboard for BeerBot analytics and team appreciation insights! 📊**

A sleek, responsive web interface built with Next.js and Tailwind CSS that provides comprehensive analytics for your team's virtual beer giving activities. Features interactive charts, user profiles, and real-time statistics.

---

## 🌟 Overview

The BeerBot Frontend is a modern web application that visualizes beer giving patterns, tracks team engagement, and provides insights into workplace appreciation trends. Built with performance and user experience in mind, it offers an intuitive dashboard for managers and team members alike.

## ✨ Features

### 📊 Analytics Dashboard
- **Real-time Statistics**: Live beer giving/receiving counts
- **Interactive Charts**: Visual representation of appreciation trends
- **Date Range Filtering**: Flexible time period analysis
- **User Leaderboards**: Top givers and receivers

### 👥 User Management
- **Profile Integration**: Slack profile photos and names
- **Individual Stats**: Personal giving/receiving history  
- **Team Overview**: Complete user directory with statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: System preference detection and manual toggle
- **Smooth Animations**: Polished micro-interactions
- **Accessible**: WCAG 2.1 compliant interface

### 🔧 Technical Features
- **Server-Side Rendering**: Fast initial page loads with Next.js
- **API Integration**: Seamless communication with BeerBot backend
- **Optimized Performance**: Lazy loading and code splitting
- **Type Safety**: Full TypeScript integration

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 13.4+ with App Router
- **Language**: TypeScript 5.9+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Custom components with Headless UI
- **Date Handling**: React DatePicker for range selection
- **HTTP Client**: Fetch API with custom hooks
- **State Management**: React hooks and context

### Project Structure
```
BeerBot-frontend/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.jsx         # Root layout component
│   └── page.jsx          # Home page component
├── components/           # Reusable UI components
│   ├── DateRangePicker.jsx  # Date selection component
│   ├── UsersList.jsx       # User directory component
│   └── UsersPage.jsx       # Main users page layout
├── lib/                  # Utility functions and configurations
│   └── authOptions.js    # Authentication configuration
├── pages/api/           # API routes and proxies
│   ├── health.js        # Health check endpoint
│   ├── auth/           # Authentication handlers
│   └── proxy/          # Backend API proxy
├── public/             # Static assets
├── scripts/           # Build and deployment scripts
└── docker/           # Docker configurations
```

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/) or [Bun](https://bun.sh/) runtime
- [Docker](https://www.docker.com/) (optional, for containerized development)
- Running BeerBot Backend instance

### Local Development

1. **Clone and navigate:**
   ```bash
   git clone https://github.com/DanielWeeber/BeerBot.git
   cd BeerBot/BeerBot-frontend
   ```

2. **Install dependencies:**
   ```bash
   # Using npm
   npm install
   
   # Using bun (recommended)
   bun install
   ```

3. **Configure environment:**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_BASE=http://localhost:8080
   NEXT_PUBLIC_API_TOKEN=your-api-token-here
   ```

4. **Start development server:**
   ```bash
   # Using npm
   npm run dev
   
   # Using bun
   bun run dev
   ```

5. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

### Docker Development

```bash
# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Production build
docker-compose up -d

# Testing
docker-compose -f docker-compose.test.yml up
```

## 🛠️ Usage

### Dashboard Navigation

**Home Page (`/`)**
- Overview statistics and charts
- Recent activity feed
- Quick user search

**Users Page (`/users`)**
- Complete user directory
- Individual user statistics
- Filter and sort capabilities

### API Integration

The frontend communicates with the BeerBot backend through:

**Proxy Endpoints** (`/api/proxy/[...path]`)
- Automatic authentication header injection
- Request/response logging
- Error handling and retry logic

**Direct Integration**
```javascript
// Example: Fetch user statistics
const response = await fetch('/api/proxy/given?user=U1234567890&start=-7d');
const data = await response.json();
```

### Date Range Selection

Flexible date queries supported:
- **Specific dates**: `2024-10-19`
- **Relative ranges**: `-7d`, `-1m`, `-1y`
- **Custom ranges**: Interactive date picker

## 🎨 Customization

### Theme Configuration

Tailwind CSS configuration in `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'beer-gold': '#FFD700',
        'beer-amber': '#FFA500',
        // Add custom colors
      }
    }
  }
}
```

### Component Styling

Components use Tailwind utility classes:
```jsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Beer Statistics
  </h2>
</div>
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Production

```bash
# Build production image
docker build -t beerbot-frontend .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_BASE=https://your-backend.com \
  -e NEXT_PUBLIC_API_TOKEN=your-token \
  beerbot-frontend
```

### Static Export

```bash
# Generate static files
npm run build
npm run export

# Serve static files
npx serve out/
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_BACKEND_BASE` | ✅ | `http://localhost:8080` | BeerBot backend base URL |
| `NEXT_PUBLIC_API_TOKEN` | ✅ | - | API authentication token |
| `NODE_ENV` | ❌ | `development` | Environment mode |
| `PORT` | ❌ | `3000` | Server port |

### Build Configuration

**Next.js Config** (`next.config.js`):
```javascript
module.exports = {
  output: 'standalone', // For Docker deployments
  images: {
    domains: ['avatars.slack-edge.com'], // Slack avatars
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_BASE}/api/:path*`
      }
    ];
  }
};
```

## 🧪 Testing

### Development Testing

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

### Component Testing

```bash
# Run component tests (when implemented)
npm test

# Visual regression tests
npm run test:visual
```

## 🔧 Troubleshooting

### Common Issues

**API Connection Errors:**
```bash
# Check backend connectivity
curl http://localhost:8080/api/health

# Verify environment variables
echo $NEXT_PUBLIC_BACKEND_BASE
```

**Build Failures:**
```bash
# Clear cache
rm -rf .next
npm run build

# Check dependencies
npm audit
```

**Styling Issues:**
```bash
# Rebuild Tailwind
npx tailwindcss -i ./app/globals.css -o ./dist/output.css --watch
```

## 🤝 Contributing

We welcome contributions to improve the frontend experience!

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-ui`
3. Make changes and test locally
4. Commit with conventional messages
5. Push and create Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement responsive design (mobile-first)
- Add JSDoc comments for complex components
- Test components before submitting

### UI/UX Guidelines
- Maintain consistent spacing using Tailwind scale
- Use semantic HTML elements
- Ensure keyboard navigation support
- Test with screen readers
- Optimize for Core Web Vitals

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

---

**Ready to visualize your team's appreciation? Deploy the BeerBot Frontend and start exploring! 📈🍻**
