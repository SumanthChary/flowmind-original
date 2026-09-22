# FlowMind

FlowMind is a modern, visual workflow automation platform designed to help users build, collaborate on, and execute automated processes using an intuitive canvas interface. Powered by React, Tailwind CSS, and Supabase, it provides real-time collaboration, state persistence, and seamless integrations.

---

## Key Features

- **Visual Workflow Builder:** Drag-and-drop node interface to design complex logic and automation flows.
- **Real-Time Collaboration:** Work together with team members on shared workflows with live state updates.
- **Auto-Save & Versioning:** Continuous background saves powered by Supabase to ensure no progress is lost.
- **AI Integration Capabilities:** Smart nodes to incorporate AI-assisted actions directly into your automation pipelines.
- **Reusable Templates:** Save custom workflows as reusable templates across projects.

---

## Tech Stack

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Code Quality:** [ESLint](https://eslint.org/)

---

## Project Structure

```text
├── .bolt/                # Platform configuration
├── public/               # Static assets
├── src/                  # Application source code
│   ├── components/       # UI and workflow canvas components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and Supabase client
│   └── types/            # TypeScript definitions
├── supabase/
│   └── migrations/       # Database schemas and RLS policies
├── MIGRATION_INSTRUCTIONS.md
└── package.json

```

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:

* [Node.js](https://www.google.com/search?q=https://nodejs.org/&utm_source=gemini) (v18 or higher)
* `npm` or `pnpm`

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/SumanthChary/flowmind-original.git](https://github.com/SumanthChary/flowmind-original.git)
cd flowmind-original

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

```


4. **Set Up the Database:**
Follow the instructions in [`MIGRATION_INSTRUCTIONS.md`](https://www.google.com/search?q=./MIGRATION_INSTRUCTIONS.md&utm_source=gemini) to apply the database migrations located in `supabase/migrations`.
5. **Start the Development Server:**
```bash
npm run dev

```



---

## Scripts

* `npm run dev` — Launch the local Vite development server
* `npm run build` — Build the application for production
* `npm run lint` — Run ESLint checks across the codebase
* `npm run preview` — Preview the production build locally

---

## License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE&utm_source=gemini).

```

```
