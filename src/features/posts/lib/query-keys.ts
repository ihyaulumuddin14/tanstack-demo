export const postKeys = {
  all: ["posts"] as const,

  detail: (id: string) => ["posts", id] as const,

  search: (query: string) => ["posts", "search", query] as const,
};
