import { useState } from "react"
import { CarouselContainer, CarouselTitle} from "../../layout/StoryCards/CardStyles"
import ResearcherCard from "./ResearcherCard"
import { ResearcherCarouselTitle, ResearcherContainer } from "./ResearcherStyles"


const ResearcherCarousel = (props) => {
  const [researchers, setResearchers] = useState({})

  return(
    <ResearcherContainer>
      <h2>Researchers</h2>
      <CarouselContainer>
        {(researchers && researchers.length!==0) ? Object.entries(researchers).map(([key, value], idx) => (
          <ResearcherCard value={value}/>
        ))
          : <p>Nothin</p>
        }
      </CarouselContainer>
    </ResearcherContainer>
  )
}

export default ResearcherCarousel