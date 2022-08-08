import { ResearcherCardContainer } from "./ResearcherStyles"

const ResearcherCard = (props) => {

  return(
    <ResearcherCardContainer>
      <p>{props.value}</p>
    </ResearcherCardContainer>

  )
}

export default ResearcherCard