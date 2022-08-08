import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi"
import { CarouselContainer, CarouselTitle} from "../../layout/StoryCards/CardStyles"
import ResearcherCard from "./ResearcherCard"
import { ResearcherCarousel as StyledResearcherCarousel, ResearcherContainer } from "./ResearcherStyles"


const ResearcherCarousel = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const [errorMsg, setErrorMsg] = useState(null)

  const [researchers, setResearchers] = useState({})

  const getResearchers = async () => {
    try {
      const resResearcher = await msmAPI.get(`/researchers`)
      setResearchers(resResearcher.data)
      console.log(resResearcher, researchers)
      //console.log("researchers",resResearcher.data.items, typeof(researchers))
      setErrorMsg(null)
    }
    catch (err) {
      if (!err?.response) {
        setErrorMsg('No Server Response')
      } else {
        setErrorMsg('Could not reach backend server')
      }
    }
  }

  useEffect(() => {
    getResearchers()
  }, [])


  return(
    <ResearcherContainer>
      <h2>Researchers</h2>
      <StyledResearcherCarousel>
        {(researchers.items && researchers.items.length!==0) ? Object.entries(researchers.items).map(([key,value], idx) => {
          console.log(key,value, idx)
          return (<ResearcherCard key={key} value={value}/>)
        })
          : <p>Nothin</p>
        }
      </StyledResearcherCarousel>
    </ResearcherContainer>
  )
}

export default ResearcherCarousel