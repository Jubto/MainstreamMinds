import { useState } from "react"
import { Chip } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { appendTagSearch, removeTagFromSearch } from "../searchHelpers"

const SelectedChip = (props) => {
  const nav = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState(true)
  const name = props.name

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

  return (
    <>
    {selected && selectedChip}
    </>
  )
}

export default SelectedChip