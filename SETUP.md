# Kealvi - Live Q&A Platform

A modern Next.js application for asking questions, voting, and real-time discussions.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in the details and create the project
4. Wait for it to initialize (2-3 minutes)

#### Get Your API Keys
1. Open your Supabase project
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (under "Project API")
   - **`anon` key** (under "Project API keys")
   - **`service_role` secret key** (under "Project API keys" - marked as "Secret")

#### Set Environment Variables
1. Create `.env.local` in the project root (copy from `.env.local.example` if available)
2. Fill in the values:

```env
# Public credentials (safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Private credentials (NEVER expose to client)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### Initialize Database Schema
1. Go to your Supabase project dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste it into the SQL editor
6. Click **Run** or press `Cmd+Enter`
7. Wait for the schema to be created

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### ✅ Implemented
- **Authentication** - Sign up, login, logout with Supabase Auth
- **Theme System** - Light/dark mode with localStorage persistence
- **Questions** - Create, view, and manage questions
- **Voting** - Upvote questions (powered by Supabase)
- **Search** - Debounced search across questions
- **Responsive UI** - Works on mobile, tablet, and desktop
- **User Profiles** - Store user information and settings

### 🚀 In Progress (Phases 4-11)
- Enhanced question features (titles, descriptions, edit/delete)
- Improved voting (upvote/downvote with vote tracking)
- Pin questions (admin feature)
- Poll system (multiple choice questions)
- Advanced search and filters
- Real-time updates (Supabase Realtime)
- Dashboard with statistics
- AI assistant (Google Gemini integration)

## Project Structure

```
app/
  ├── page.tsx              # Home page
  ├── layout.tsx            # Root layout with providers
  ├── globals.css           # Global styles & theme
  ├── providers.tsx         # Auth context provider
  ├── components/           # Reusable components
  │   ├── header.tsx
  │   ├── user-menu.tsx
  │   ├── theme-toggle.tsx
  │   └── ...
  ├── auth/
  │   ├── login/page.tsx
  │   └── signup/page.tsx
  └── api/
      └── questions/
          ├── route.ts
          └── [id]/vote/route.ts

lib/
  ├── supabase.ts           # Server-side Supabase client
  ├── supabase-browser.ts   # Client-side Supabase client
  ├── theme-context.tsx     # Theme provider
  ├── auth.ts               # Auth utilities
  ├── questions.ts          # Question queries
  └── voter.ts              # Voter utilities

supabase/
  └── schema.sql            # Database schema

.env.local                   # Environment variables (add these!)
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS v4** - Styling
- **Supabase** - Backend (Auth, Database, Real-time)
- **React 19** - UI library

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Troubleshooting

### "Supabase not configured" Error
- Make sure `.env.local` file exists
- Verify all environment variables are filled in
- Restart the dev server after updating `.env.local`

### "Failed to load questions" Error
- Ensure the database schema has been initialized
- Check that your Supabase project is running
- Verify the service role key is correct

### Can't Sign Up / Login
- Make sure Supabase Auth is enabled in your project
- Check that email/password auth is configured
- Try creating a test user in Supabase dashboard first

### Theme Not Saving
- Check if localStorage is enabled in your browser
- Try clearing browser cache and localStorage
- Look at browser DevTools Console for errors

## Next Steps

1. ✅ Complete initial setup above
2. 📝 Create your first account
3. 💬 Test creating and voting on questions
4. 🔧 Configure your Supabase settings (RLS, Auth)
5. 🚀 Deploy to Vercel

## Support

For issues:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Check browser console for detailed error messages

## License

MIT
