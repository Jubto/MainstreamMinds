import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi"
import { CarouselContainer, CarouselTitle} from "../../layout/StoryCards/CardStyles"
import ResearcherCard from "./ResearcherCard"
import { ResearcherCarouselTitle, ResearcherContainer } from "./ResearcherStyles"


const ResearcherCarousel = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const [errorMsg, setErrorMsg] = useState(null)

  const [researchers, setResearchers] = useState({})

  const getResearchers = async () => {
    try {
      const resResearcher = await msmAPI.get(`/researchers`)
      setResearchers(resResearcher.data.items)
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
      <CarouselContainer>
        {/* {(researchers && researchers.length!==0) ? Object.entries(researchers).map(([key,value]) => {
          <ResearcherCard key={key} value={value}/>
          console.
          //if (key == "")
        })
          : <p>Nothin</p>
        } */}
      </CarouselContainer>
    </ResearcherContainer>
  )
}

export default ResearcherCarousel