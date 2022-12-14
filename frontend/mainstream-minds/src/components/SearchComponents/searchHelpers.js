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

export const tagToStringArr = (array) => {
  const tagList = []
  array.forEach(element => {
    if (element.startsWith("tags=")) {
      const string = decodeSpaces(element.slice(5))
      tagList.push(string)
    }
  });
  console.log(tagList)
  return tagList
}

export const getSearch = (array) => {
  let search = ""
  array.forEach(element => {
    if (element.startsWith("search=")) {
      search = element.slice(7)
    }
  })
  return search
}

export const appendTagSearch = (searchPath, addTag) => {
  let newPath
  if (searchPath.length !== 0) {
    newPath = searchPath.concat(`&tags=${addTag}`)
  } else {
    newPath = "?tags=".concat(addTag)
  }
  console.log(newPath)
  return newPath
}

const removeKeywordFromSearch = (searchPath) => {
  let newPath
  const listItems = searchPath.substring(1).split('&')
  const newList = listItems.filter((x) => x.startsWith('search=') !== true)
  newPath = newList.join('&')
  console.log(newList, newPath)
  return('?'.concat(newPath))
}

export const appendKeywordSearch = (searchPath, keyword) => {
  const clearedPath = removeKeywordFromSearch(searchPath)
  let newPath
  if (clearedPath.length !== 0) {
    newPath = clearedPath.concat(`&search=${keyword}`)
  } else {
    newPath = "?search=".concat(keyword)
  }
  console.log(newPath)
  return newPath
}

export const removeTagFromSearch = (searchPath, removeTag) => {
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

const decodeSpaces = (string) => {
  const strArr = string.split('%20')
  return(strArr.join(' '))
}