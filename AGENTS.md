# AI Agent Instructions

This repository is a workshop/demo project for teaching TanStack Query in modern Next.js applications.

Agents should prioritize:
- readability
- educational value
- observable async behavior

over:
- overengineering
- excessive abstraction
- production micro-optimizations

---

# Main Purpose

The project demonstrates:
- caching
- server state
- optimistic UI
- infinite query
- mutation lifecycle
- cache synchronization

Everything added should support those goals.

---

# Stack

- Next.js App Router
- TypeScript
- MongoDB
- Mongoose
- Better Auth
- TanStack Query

---

# Folder Conventions

## Features

Feature modules live in:

src/features/

Each feature should contain:

- api/
- hooks/
- components/
- lib/
- types/

---

# API Layer Rules

All server requests MUST live inside:
- feature/api/

Avoid inline fetches inside hooks/components.

Preferred:

```ts
export async function getPosts() {}
```

---

# Query Hooks Rules

TanStack hooks belong in:
- feature/hooks/

Examples:
- usePosts
- useLikePost
- useInfinitePosts

---

# Query Key Rules

Always use query key factories.

Good:

```ts
postKeys.feed()
postKeys.detail(id)
```

Bad:

```ts
['posts']
['posts', id]
```

scattered everywhere.

---

# Mutation Rules

Mutations should:
1. cancel queries
2. snapshot previous cache
3. optimistic update
4. rollback on error
5. invalidate on settle

Whenever appropriate.

---

# UI Philosophy

This is NOT a design showcase.

Keep components:
- simple
- small
- workshop-readable

Avoid:
- excessive animations
- over-complicated abstractions
- giant reusable systems

---

# Database Rules

## Mongoose

Use Mongoose only for app entities:
- posts
- comments
- notifications

## Better Auth

Better Auth handles:
- users
- sessions
- accounts

Do not manually recreate auth collections.

---

# Important Teaching Concepts

Agents should preserve and reinforce:

## Server State vs Client State

## Cache Lifecycle
- fresh
- stale
- inactive
- garbage collected

## UX Benefits
- instant navigation
- optimistic UI
- background refetching

---

# Preferred Patterns

## Good

- feature-based architecture
- query key factories
- isolated api layer
- reusable query hooks

## Avoid

- deeply nested abstractions
- premature optimization
- unnecessary global state
- Redux-like patterns for server state

---

# Devtools

React Query Devtools should remain enabled during development.

This project is intended for educational visualization.

---

# Educational Priority

If there are multiple implementation choices:
prefer the version that is:
- easier to explain
- easier to visualize
- easier for workshop participants to follow

even if slightly less "enterprise-grade".