import { useState } from "react"
import { Chip } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { appendTagSearch, removeTagFromSearch } from "./searchHelpers"

const SearchChip = (props) => {
  const nav = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState(false)
  const name = props.name

  const handleClick = () => {
    setSelected(true)
    const newPath = appendTagSearch(location.search, name)
    nav(`/search${newPath}`)
  }

  const handleDelete = () => {
    setSelected(false)
    const newPath = removeTagFromSearch(location.search, name)
    nav(`/search${newPath}`)
  }

  const selectedChip = (
    <Chip 
      label={name}
      onDelete={handleDelete}
      color="primary"
    />
  )
  const unselectedChip = (
    <Chip
      label={name}
      onClick={handleClick}
    />
  )

  return (
    <>
    {selected ? selectedChip : unselectedChip}
    </>
  )
}

export default SearchChip