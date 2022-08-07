import { Box, Button, Typography, styled } from "@mui/material"

export const ForumContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0px 0px 0px 68px;
`

export const CommentFieldContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  /* padding: 24px 0px; */
  padding: ${({ reply }) => reply ? '' : '24px 0px' };
  gap: 12px;
`

export const CommentContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px 12px;
  gap: 4px;
`

export const CommentButton = styled(Button)`
  color: ${({ theme }) => theme.palette.msm.dull};
  text-transform: capitalize;
`


export const CommentHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`


export const CommentBody = styled(Typography)`
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
  padding-left: 0.5rem;
`


export const CommentFooter = styled(Box)`
  color: ${({ theme }) => theme.palette.msm.dull};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 0.25rem;
  margin-top: -0.5rem;
  gap: 12px;
`


export const CommentTreeContainer = styled(Box)`
  margin-bottom: 0.5rem;
`


export const CommentsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 50px;
  gap: 5px;
`