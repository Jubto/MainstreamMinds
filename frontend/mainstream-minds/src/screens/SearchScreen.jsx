import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import Page from "../components/layout/Page"
import Card from "../components/layout/StoryCards/Card"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { ResultsContainer, ResultsGrid, ResultsGridItem, SearchContainer } from "../components/SearchComponents/SearchStyles"
import SearchStack from "../components/SearchComponents/SearchStack"
import { useLocation } from "react-router-dom"
import searchTags from "../components/SearchComponents/searchTags"
import { extractQuery, getTags } from "../components/SearchComponents/searchHelpers"
import ResearcherCarousel from "../components/SearchComponents/ResearcherSearch/ResearcherCarousel"


const SearchScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const [story, setStory] = useState({})
  const [errorMsg, setErrorMsg] = useState(null)
  const location = useLocation()
  const [selectedTags, setSelectedTags] = useState([]) // todo: implement persisting selected tag style


  const getStories = async () => {
    try {
      console.log('getting stories',`/research_stories${location.search}`)
      const resStory = await msmAPI.get(`/research_stories${location.search}`)
      console.log(resStory)
      setStory(resStory.data.items)
      console.log(resStory.data)
      setErrorMsg(null)
    }
    catch (err) {
      if (!err?.response) {
        setErrorMsg('No Server Response')
      } else if (err.response?.status === 401) {
        setErrorMsg('Forbidden, try login')
      } else {
        setErrorMsg('Could not reach backend server')
      }
    }
  }

  const getSelectedTags = () => {
    const queryArr = extractQuery(location.search)
    setSelectedTags(getTags(queryArr))
  }

  useEffect(() => {
    getStories(location.search)
    getSelectedTags()
  }, [location.search])

  return (
    <Page mt={48} align="left" >
      <SearchContainer sx={{width: '90vw'}}>
        <TextField 
            id="outlined-search" 
            label="Search" 
            type="search" 
            size="small"
            fullWidth
            sx={{maxWidth: 720, marginRight: '8px'}}
        />
        <SearchStack tags={searchTags} selectedTags={[]}/>
      </SearchContainer>
      <p>Researcher Carousel</p>
      <ResultsContainer >
        <ResultsGrid container rowSpacing={3} columnSpacing={{xs:'auto', sm:2, md:3}} >
          {(story && story.length!==0) ? Object.entries(story).map(([key, value], idx) => (
                <ResultsGridItem item>

                  <Card 
                    key={idx} 
                    title={value.title} 
                    tags={value.tags}
                    researcherId={value.researchers[0]}
                    storyId={value.id}
                    showLikes={!!auth.accessToken}
                    thumbnail={value.thumbnail}
                  />
                
                </ResultsGridItem>
                
              )) : <p>No stories to show</p>
          }
        </ResultsGrid>
      </ResultsContainer>
      
    </Page>
  )
}

export default SearchScreen