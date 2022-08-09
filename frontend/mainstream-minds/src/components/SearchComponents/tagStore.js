export const storeTags = (tags) => {
  const tagString = JSON.stringify(tags)
  console.log(tagString)
  localStorage.setItem('tagStorage', tagString)
}

export const getStoredTags = () => {
  const tags = localStorage.getItem('tagStorage')
  if (tags) {
    const parseTags = JSON.parse(tags)
    //console.log(parseTags)
    return (parseTags)
  } else {
    return (null)
  }
}