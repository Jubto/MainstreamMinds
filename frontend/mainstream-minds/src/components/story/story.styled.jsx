import { Box, styled } from "@mui/material"

export const StoryContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 1204px;
  padding: 12px 68px;
  gap: 10px;
`

export const StoryDetailsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 2rem;
  width: 100%;
`

export const StoryMetrics = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`

export const AuthorContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

export const StoryBody = styled(Box)`
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
`