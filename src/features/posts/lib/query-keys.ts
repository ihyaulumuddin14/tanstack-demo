export const postKeys = {
  all: ["posts"] as const,
  feed: () => [...postKeys.all, "feed"] as const,
  search: (query: string) => [...postKeys.all, "search", query] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
};
