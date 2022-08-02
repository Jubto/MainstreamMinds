import { styled } from "@mui/material"

const maxWidth = 1500
const minWidth = 600

export const SearchContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  max-width: ${maxWidth}px;
  min-width: ${minWidth}px;
`

export const ResearcherCarousel = styled('div')`
  display: flex;
  flex-direction: row;
`

export const ResultsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: ${maxWidth}px;
  min-width: ${minWidth}px;
  gap: 28px 0;
  > * { 
    margin: 0 40px 0 0;
  }
`