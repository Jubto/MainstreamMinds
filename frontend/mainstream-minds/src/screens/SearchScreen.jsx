import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import Page from "../components/layout/Page"
import Card from "../components/layout/StoryCards/Card"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { ResearcherCarousel, ResultsContainer, SearchContainer } from "../components/SearchComponents/SearchStyles"
import SearchStack from "../components/SearchComponents/SearchStack"

const SearchScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const [story, setStory] = useState({})
  const [errorMsg, setErrorMsg] = useState(null)

  const getAllStories = async () => {
    try {
      const resStory = await msmAPI.get(`/research_stories`)
      setStory(resStory.data)
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

  const showTags = [
    {
      name: "science"
    },
    {
      name: "psychology"
    },
    {
      name: "agriculture"
    },
    {
      name: "computers"
    },
    {
      name: "global issues"
    },
    {
      name: "law"
    },
    {
      name: "journalism"
    },
    {
      name: "robotics"
    },
  ]

  useEffect(() => {
    getAllStories()
    console.log(window.innerWidth)
  }, [])


  return (
    <Page mt={48}>
        <SearchContainer>
          <TextField 
            id="outlined-search" 
            label="Search" 
            type="search" 
            size="small"
            fullWidth
            sx={{maxWidth: 720, marginRight: '8px'}}
          />
          <SearchStack tags={showTags} />
          <Button variant="outlined" startIcon={<FilterAltIcon />} sx={{height:'40px', minWidth: '92px', marginLeft: '8px'}}>
            Filter
          </Button>
        </SearchContainer>
        <ResearcherCarousel />
        <p>Researchers</p>
        <ResultsContainer>
          {(story && story.length) ? Object.entries(story).map(([key, value], idx) => (
              <Card 
                key={idx} 
                title={value.title} 
                tags={value.tags}
                researcherId={value.researchers[0]}
                storyId={value.id}
                showLikes={!!auth.accessToken}
                thumbnail={value.thumbnail}
              />
            )) : <p>No stories to show</p>
            }
        </ResultsContainer>
    </Page>
  )
}

export default SearchScreen