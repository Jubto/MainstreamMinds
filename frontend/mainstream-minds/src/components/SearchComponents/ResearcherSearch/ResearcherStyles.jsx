import { styled } from "@mui/material"
import { grey } from "@mui/material/colors"

export const ResearcherContainer = styled('div')`
  width: 100%;
  padding: 16px 12px;
`

export const ResearcherCarousel = styled('div')`
  display: flex;
  flex-direction: row;
`

export const ResearcherCardContainer = styled('div')`
  margin: 12px 16px;
  display: flex;
  flex-direction: row;
  min-width: 260px;
  border: 0.5px solid ${grey[300]};
  border-radius: 4px;
  padding: 12px;
`

export const ResearcherDetails = styled('div')`
  
`

export const ResearcherName = styled('h4')`
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ResearcherCarouselTitle = styled('h2')`
margin: 0;
`

export const ResearcherInstitution = styled('p')`
margin: 0;
color: ${grey[700]};
`