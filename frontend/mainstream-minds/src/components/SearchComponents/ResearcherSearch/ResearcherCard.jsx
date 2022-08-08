import { ResearcherCardContainer } from "./ResearcherStyles"

const ResearcherCard = (props) => {

  return(
    <ResearcherCardContainer>
      {props.value}
    </ResearcherCardContainer>

  )
}

export default ResearcherCard