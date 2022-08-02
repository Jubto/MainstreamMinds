import { styled } from "@mui/material"
import { default as MuiCard } from '@mui/material/Card';

export const CardCarousel = styled('div')`
  display: flex;
  flex-direction: row;
  overflow: scroll;
  width: 100%;
  > * { 
    margin: 0 40px 0 0;
  }
`

export const CarouselContainer = styled('div')`
  width: 90vw;
  margin: 0 0 40px 0;
`

export const StyledCard = styled(MuiCard)`
  max-width: 260px;
  min-width: 260px;
  border: none; 
  box-shadow: none; 
`

export const CarouselTitle = styled('h2')`
  margin: 0 0 16px 0;
`

export const CardTitle = styled('h4')`
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CardContent = styled('div')`
  padding: 12px 0 0 0;
`