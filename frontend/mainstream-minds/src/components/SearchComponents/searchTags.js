const searchTags = []

export const addTag = (tag) => {
  searchTags.push(tag)
  return searchTags;
}

export const getTags = () => {
  return searchTags;
}