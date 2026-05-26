# NIT Raipur Open Source Organization Website

> A modern, performant website for the NIT Raipur Open Source Organization - showcasing projects, contributors, events, and fostering open source culture.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

![](public/images/assets/image.png)
![](public/images/assets/image2.png)

## 🌟 Features

- **📊 Analytics Dashboard**: Real-time stats on projects, contributors, and PRs
- **🏆 Leaderboard**: Reputation-based rankings for meaningful contributions
- **📅 Events**: Showcase upcoming contribution drives and past events
- **🚀 Projects**: Browse all organization projects with filters and search
- **📚 Research**: Display research papers and documentation
- **👥 Team**: Meet the core team and faculty trustees
- **🌙 Dark Mode**: Full dark mode support
- **📱 Responsive**: Mobile-first design
- **⚡ Fast**: Optimized with ISR and caching

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS 4.1](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **GitHub API**: [@octokit/rest](https://github.com/octokit/rest.js)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Charts**: [Recharts](https://recharts.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account (free tier)
- GitHub Personal Access Token

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-org/nitrr-oss-website.git
cd nitrr-oss-website/nitrr-oss-website
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file:

```env
# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_ORG_NAME=nitrr-oss

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nitrr-oss

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cache Update Secret
CACHE_UPDATE_SECRET=your_random_secret_key
```

4. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
nitrr-oss-website/
├── public/               # Static assets
│   └── images/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── projects/    # Projects page
│   │   ├── leaderboard/ # Leaderboard page
│   │   └── ...
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   ├── home/        # Homepage components
│   │   └── ...
│   ├── lib/             # Utilities and helpers
│   │   ├── db/          # Database models and connection
│   │   ├── github/      # GitHub API integration
│   │   └── utils/       # Utility functions
│   ├── data/            # JSON data files
│   ├── types/           # TypeScript type definitions
│   └── ...
├── .env.example         # Environment variables template
├── ROADMAP.md           # Project roadmap with tasks
└── package.json
```

## 🚀 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code with Prettier
pnpm type-check   # Check TypeScript types
```

## 🔄 Data Flow

```
GitHub API → Sync Service → MongoDB → Frontend
    ↓            ↓             ↓          ↓
  (Source)   (Processor)   (Storage)  (Consumer)
```

### Caching Strategy

- **Projects**: Update every 12 hours
- **Stats**: Update every 12 hours
- **Leaderboard**: Sync hourly (incremental)

### Scheduled Leaderboard Sync (GitHub Actions)

The repo includes an hourly GitHub Actions workflow that triggers the leaderboard sync endpoint.
Configure these repository secrets:

- `CACHE_UPDATE_SECRET` (same as your `.env.local` value)
- `LEADERBOARD_SYNC_URL` (e.g., `https://your-domain.com/api/leaderboard/sync`)

The workflow runs every hour and calls the `/api/leaderboard/sync` endpoint via POST with the secret.

## 🎨 Customization

### Adding New Components

Use shadcn/ui CLI to add components:

```bash
pnpm dlx shadcn@latest add [component-name]
```

### Updating Manual Data

Edit JSON files in `src/data/`:

- `events.json` - Event information
- `team.json` - Team members
- `researches.json` - Research papers
- `faq.json` - FAQ entries

### Modifying Constants

Edit `src/lib/constants.ts` for site-wide settings:

- Site name and URLs
- Cache durations
- Point values
- Team roles

## 📊 MongoDB Collections

The app uses these main collections:

1. **users**: Reputation profiles for contributors
2. **reputationcontributions**: Scored contribution history
3. **syncstates**: Incremental sync checkpoints
4. **orgStats**: Organization-wide statistics

## 🔐 Environment Variables

| Variable               | Description                                                  | Required |
| ---------------------- | ------------------------------------------------------------ | -------- |
| `GITHUB_TOKEN`         | GitHub Personal Access Token                                 | Yes      |
| `GITHUB_ORG_NAME`      | GitHub organization name                                     | Yes      |
| `MONGODB_URI`          | MongoDB connection string                                    | Yes      |
| `NEXT_PUBLIC_SITE_URL` | Public site URL                                              | Yes      |
| `CACHE_UPDATE_SECRET`  | Secret for cache update API                                  | Yes      |
| `MAINTAINER_USERNAMES` | Comma-separated GitHub usernames to exclude from leaderboard | No       |

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically:

- Build the project
- Set up CDN
- Enable automatic deployments

### GitHub Actions

The project includes workflows for:

- CI/CD pipeline (linting, type checking)
- Scheduled cache updates (3x daily)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a new branch
2. Make your changes
3. Run linting and type checks
4. Submit a pull request

Pre-commit hooks will automatically:

- Format code with Prettier
- Lint with ESLint

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Contact

- **Email**: To be added
- **GitHub**: [github.com/nitrr-oss](https://github.com/NITRR-Official)
- **Discord**: [Join our server](https://discord.gg/nitrr-oss)

---

Made with ❤️ by the NIT Raipur Open Source Community
