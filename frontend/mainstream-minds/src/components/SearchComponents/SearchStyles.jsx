import { Grid, styled } from "@mui/material"

export const SearchContainer = styled('div')`
  width: 100%;
  padding: 16px 12px;
  display: flex;
  flex-direction: row;
`

export const ResultsContainer = styled('div')`
  width: 100%;
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
`
export const ResultsGrid = styled(Grid)`
  align-content: center;
  justify-content: stretch;
`

// Center items
export const ResultsGridItem = styled(Grid)`
`