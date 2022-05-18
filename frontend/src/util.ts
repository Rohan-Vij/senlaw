export const filterTags = (tags: string[], query: string) => {
  if (!query) return tags;

  return tags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase()));
};
