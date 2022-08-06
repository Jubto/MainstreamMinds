/* Returns array of tags if tags exist in path, false if not */
export const checkPathForTag = (path) => {
  const exist = path ? path.split('&') : false
  return exist
}

export const extractQuery = (path) => {
  // Remove '?' at beginning
  const toExtract = path.slice(1)
  const arr = toExtract.split('&')
  console.log(arr)
  return arr
}

export const getTags = (array) => {
  const tagList = []
  array.forEach(element => {
    if (element.startsWith("tags=")) {
      tagList.push(element.slice(5))
    }
  });
  console.log(tagList)
  return tagList
}

export const appendToSearch = (searchPath, addTag) => {
  let newPath
  if (searchPath.length !== 0) {
    newPath = searchPath.concat(`&tags=${addTag}`)
  } else {
    newPath = "?tags=".concat(addTag)
  }
  console.log(newPath)
  return newPath
}

export const removeFromSearch = (searchPath, removeTag) => {
  const tagName = encodeSpaces(removeTag)
  let newPath
  console.log(searchPath.substring(1))
  const listTags = searchPath.substring(1).split('&')
  const newList = listTags.filter((x) => x!==`tags=${tagName}`)
  newPath = newList.join('&')

  console.log(newList, newPath)
  return('?'.concat(newPath))
}

export const encodeSpaces = (string) => {
  const strArr = string.split(' ')
  return(strArr.join('%20'))
}