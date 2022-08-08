import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';


export const FlexBox = styled(Box)`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-grow: ${({ grow }) => grow};
  flex-wrap: ${({ wrap }) => wrap};
  gap: ${({ gap }) => gap};
`;
