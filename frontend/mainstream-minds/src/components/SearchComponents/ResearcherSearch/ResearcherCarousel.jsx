import { useState, useEffect, useRef } from "react"
import useResize from "../../../hooks/useResize"
import useMsmApi from "../../../hooks/useMsmApi"
import { BackIcon, NextIcon} from "../../layout/StoryCards/CardStyles"
import ResearcherCard from "./ResearcherCard"
import { ResearcherCarousel as StyledResearcherCarousel, ResearcherContainer, ScrollResearchers, researcherCardSize as cardSize} from "./ResearcherStyles"
import IconButton from '@mui/material/IconButton';

const ResearcherCarousel = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const [errorMsg, setErrorMsg] = useState(null)
  const componentRef = useRef(null)
  const { width, height } = useResize(componentRef)

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

  const scroll = (scrollOffset) => {
    componentRef.current.scrollLeft += scrollOffset;
  };



  return(
    <ResearcherContainer>
      <h2>Researchers</h2>
      <ScrollResearchers>
        {(researchers.items && researchers.items.length!==0) &&
          <IconButton  sx={{borderRadius: '4px'}} onClick={() => scroll(-cardSize*3)}>
            <BackIcon />
          </IconButton>
        }
        <StyledResearcherCarousel ref={componentRef}>
          {(researchers.items && researchers.items.length!==0) ? Object.entries(researchers.items).map(([key,value], idx) => {
            console.log(key,value, idx)
            return (<ResearcherCard key={key} value={value}/>)
          })
            : <p>Nothin</p>
          }
        </StyledResearcherCarousel>

        {(researchers.items && researchers.items.length!==0) &&
          <IconButton  sx={{borderRadius: '4px'}} onClick={() => scroll(cardSize*3)}>
            <NextIcon />
          </IconButton>
        }
      </ScrollResearchers>
    </ResearcherContainer>
  )
}

export default ResearcherCarousel