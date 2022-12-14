import { styled, Typography } from "@mui/material"
import { CardMedia as MuiCardMedia, Card as MuiCard } from "@mui/material";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { grey } from "@mui/material/colors";

export const cardSize = 260

export const Scroll = styled('div')`
  display: flex;
  flex-direction: row;
`

export const CardCarouselStyle = styled('div')`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 100%;
  scroll-behavior: smooth;
  /* flex-wrap: wrap; */
  > * { 
    margin: 0 40px 0 0;
  }
`

export const CarouselContainer = styled('div')`
  width: 90vw;
  margin: 0 0 40px 0;
`

export const StyledCard = styled(MuiCard)`
  min-width: ${cardSize}px;
  width: ${cardSize}px;
  border: none; 
  box-shadow: none; 

  &:hover {
    box-shadow: 0px 10px 22px -10px rgba(0,0,0,0.5);
  }
`

export const CarouselTitle = styled('h2')`
  margin: 0 0 16px 60px;
`

export const CardTitle = styled('h4')`
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`

export const CardLink = styled(MuiCardMedia)`
  cursor: pointer;
`

export const CardContent = styled('div')`
  padding: 12px 8px 0 8px;
`

export const NextIcon = styled(ExpandCircleDownIcon)`
  color: ${grey[300]};
  transform: rotate(270deg);
  font-size: 44px;  
`
export const BackIcon = styled(ExpandCircleDownIcon)`
  color: ${grey[300]};
  transform: rotate(90deg);
  font-size: 44px;  
`

export const Subtitle = styled('p')`
  margin: 0 0 0 60px;
  color: ${grey[700]};
`

export const AddInterestBtn = styled(AddCircleOutlineIcon)`
  color: ${grey[300]};
`

export const AuthorText = styled(Typography)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`