# TanStack Demo Workshop

Modern social media demo application built for frontend workshop:
"Consume API with Caching using TanStack Query"

## Tech Stack

- Next.js App Router
- TypeScript
- MongoDB
- Mongoose
- Better Auth
- TanStack Query
- TailwindCSS

---

# Project Goals

This project is designed to demonstrate:
- Server State Management
- Client-side Caching
- Optimistic UI
- Infinite Query
- Query Invalidation
- Background Refetching
- Polling
- Query Key Architecture
- Cache Synchronization

This is NOT a production-scale social media app.

Keep implementation:
- simple
- educational
- observable
- workshop-friendly

---

# Core Features

## Feed Posts
- Infinite scrolling feed
- useInfiniteQuery
- Cursor-based pagination

## Like / Unlike
- Optimistic UI updates
- Rollback on failure

## Follow / Unfollow
- Optimistic mutation

## Explore / Search
- Debounced query
- Dynamic query keys

## Notification Badge
- Polling
- Background refetch

## Compose Post
- Mutation
- Cache invalidation
- setQueryData

## Edit / Delete Post
- Manual cache updates

## User Suggestions
- Parallel queries
- useQueries

---

# Architecture Principles

## Feature-Based Structure

Each feature should contain:
- api/
- hooks/
- components/
- lib/
- types/

Example:

src/features/posts/
├── api/
├── hooks/
├── components/
├── lib/
└── types/

---

# TanStack Rules

## Query Keys MUST use factories

Use:

```ts
export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => ['posts', id] as const,
}
```

Avoid hardcoded keys.

---

## NEVER fetch directly inside components

Bad:

```ts
useQuery({
  queryFn: async () => axios.get(...)
})
```

Good:

```ts
queryFn: getPosts
```

Use api/ layer.

---

## Mutations should handle:
- optimistic update
- rollback
- invalidation

Whenever possible.

---

# Database Rules

## Use Mongoose only for app models

Examples:
- posts
- comments
- notifications

## Better Auth manages auth collections itself

DO NOT create custom auth schemas unless necessary.

---

# Styling Rules

Keep UI:
- minimal
- clean
- readable

This project focuses on async-state behavior,
NOT visual complexity.

---

# Workshop Priorities

The workshop should emphasize:
- understanding cache behavior
- server state lifecycle
- stale vs fresh data
- optimistic UI experience
- UX improvements from caching

NOT:
- backend complexity
- authentication complexity
- advanced infrastructure

---

# Teaching Philosophy

Always demonstrate:
1. Traditional fetching problem
2. TanStack solution
3. UX improvement

Example:
- useEffect → useQuery
- manual loading → automatic cache lifecycle
- delayed response → optimistic UI

---

# Development Notes

## Use fake latency when useful

Example:

```ts
await new Promise((r) => setTimeout(r, 1500))
```

This helps demonstrate:
- loading states
- optimistic updates
- background refetching

---

# Important

This project is educational-first.

Code clarity is more important than:
- abstraction perfection
- enterprise patterns
- premature optimization