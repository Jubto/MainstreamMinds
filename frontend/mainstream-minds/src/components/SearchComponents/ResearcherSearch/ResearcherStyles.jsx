import { styled } from "@mui/material"
import { grey } from "@mui/material/colors"

export const researcherCardSize = 260

export const ResearcherContainer = styled('div')`
  width: 100%;
  padding: 16px 12px;
`

export const ResearcherCarousel = styled('div')`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  scroll-behavior: smooth;
  width: 90vw;
  padding: 12px 0;
`

export const ResearcherCardContainer = styled('div')`
  margin: 12px 16px;
  min-width: ${260}px;
  border: 0.5px solid ${grey[300]};
  border-radius: 4px;
  &:hover {
    box-shadow: 0px 10px 22px -19px rgba(0,0,0,0.5);
  }
`
export const ResearcherCardContents = styled('div')`
  display: flex;
  flex-direction: row;
  padding: 12px 12px 0 12px;
`

export const ResearcherDetails = styled('div')`
  
`

export const ResearcherTags = styled('div')`
  margin: 0 12px;
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

export const ScrollResearchers = styled('div')`
  display: flex;
  flex-direction: row;
`