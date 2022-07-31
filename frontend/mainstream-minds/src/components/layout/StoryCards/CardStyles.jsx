import { styled } from "@mui/material"
import { default as MuiCard } from '@mui/material/Card';

export const CardCarousel = styled('div')`
  display: flex;
  flex-direction: row;
  overflow: scroll;
  width: 100%;
`

export const CarouselContainer = styled('div')`
  width: 90vw;
  margin: 0 0 48px 0;
`

export const StyledCard = styled(MuiCard)`
  max-width: 320px;
  min-width: 260px;
  border: none; 
  box-shadow: none; 
  margin-right: 40px;
`