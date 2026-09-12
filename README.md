# Verity

> Confirms aren't dialogs. They're how you don't lose the customer's data — or their money.

**Verity** is a paid library of 8 high-stakes confirmation interactions for React applications. Built for production systems where default `AlertDialog` fails to match the risk of destructive or irreversible actions.

Inspired by [bencho.dev](https://bencho.dev), Verity prioritizes interaction honesty: linear progress, zero bounce on destructive animations, accessible live region announcements, and copy-paste simplicity.

---

## The 8 Confirmation Interactions

| Component | Risk Tier | Typical Use Case | Key Behavior |
| :--- | :--- | :--- | :--- |
| **`HoldToConfirm`** | Irreversible / Financial | Drop database cluster, purge backups | Linear SVG progress ring, cancellation on early release, keyboard hold support. |
| **`TypeToConfirm`** | Irreversible | Delete production repository, revoke org | Exact case-sensitive match verification before submit unlocks. |
| **`UndoToast`** | Low | Archive logs, disconnect non-critical service | Optimistic execution with honest linear countdown bar and instant rollback. |
| **`SlideToDelete`** | Irreversible | Revoke live API secret keys | Friction slider with 80% threshold and zero-bounce spring return. |
| **`TwoStepReview`** | Financial / Irreversible | Teardown team workspace, plan downgrade | Step 1 consequence itemization list, Step 2 final confirmation. |
| **`InlineRowConfirm`** | Irreversible | Terminate single DB replica or VM instance | Row morphs in-place to prevent layout shift; defaults focus to cancel. |
| **`BulkConfirm`** | Irreversible | Bulk purge files, links, and credentials | Explicit breakdown chips categorized by resource type. |
| **`DangerousToggle`** | Irreversible | Disable 2FA or hardware FIDO2 key | Prevents accidental click with hold duration and inline confirmation popup. |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Motion**: `motion` (Framer Motion v13)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Theme**: `next-themes` (Dark/Light mode support)
- **Database Schema**: Drizzle ORM + Neon Serverless PostgreSQL
- **Security**: Strict CSP headers, XSS prevention, zero runtime telemetry

---

## Getting Started

### 1. Installation

```bash
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your Neon database URL and optional OAuth credentials:
```env
DATABASE_URL="postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live confirmation playground.

### 4. Production Build

```bash
pnpm build
pnpm start
```

---

## Usage Example

```tsx
import { HoldToConfirm } from "@/components/confirms";

export function DeleteClusterStage() {
  return (
    <HoldToConfirm
      risk="irreversible"
      title="Drop production cluster"
      consequence="Cluster db-prod-01 and all replicas will be deleted immediately."
      confirmLabel="Hold to drop"
      holdDuration={1200}
      onConfirm={async () => {
        await api.deleteCluster("db-prod-01");
      }}
    />
  );
}
```

---

## Deployment (Vercel)

Verity is configured for zero-config deployment on Vercel:

1. Push your repository to GitHub / GitLab.
2. Import the repository into [Vercel](https://vercel.com).
3. Set your `DATABASE_URL` environment variable.
4. Deploy!

---

## License

Commercial license. See [License](app/license/page.tsx) for details.
