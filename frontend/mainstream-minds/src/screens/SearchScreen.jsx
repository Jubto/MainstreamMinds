import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import Page from "../components/layout/Page"
import Card from "../components/layout/StoryCards/Card"
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { ResultsContainer, ResultsContents, ResultsGrid, ResultsGridItem, SearchContainer } from "../components/SearchComponents/SearchStyles"
import SearchStack from "../components/SearchComponents/SearchStack"
import { useLocation, useNavigate } from "react-router-dom"
//import {searchTags} from "../components/SearchComponents/searchTags"
import { appendKeywordSearch, extractQuery, getTags } from "../components/SearchComponents/searchHelpers"
import ResearcherCarousel from "../components/SearchComponents/ResearcherSearch/ResearcherCarousel"
import { grey } from "@mui/material/colors"
import { getStoredTags, storeTags } from "../components/SearchComponents/tagStore"
import { Autocomplete } from "@mui/material"
import SelectedTagStack from "../components/SearchComponents/SelectedTagStack"


const SearchScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const nav = useNavigate()
  const { auth, setAuth } = useAuth()
  const [story, setStory] = useState({})
  const [errorMsg, setErrorMsg] = useState(null)
  const location = useLocation()

  // Tag Search
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([]) 
  const [selectedTag, setSelectedTag] = useState(null)
  const [inputTag, setInputTag] = useState(null)

  // Get all stories
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

  // Get all tags
  const storeAllTags = async () => {
    try {
      const resTags = await msmAPI.get('/tags/?page_size=1000')
      const tagMap = {}
      resTags.data.items.forEach((t) => {
        tagMap[t.name] = t.id
      })
      console.log(tagMap)
      storeTags(tagMap)
    }
    catch (err) {
      console.log(err)
    }
  }

  const getTagsAndSearch = () => {
    const queryArr = extractQuery(location.search)
    setSelectedTags(getTags(queryArr))
  }

  const addSelected = (selected) => {
    setSelectedTag(selected);
    if (selected) {
      console.log(selected, typeof(selected))
      setSelectedTags(selectedTags.push(selected))
    }
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && selectedTag) {
      addSelected(selectedTag)
    }
  }

  const searchKeyword = (e) => {
    if (e.key === "Enter") {
      console.log("search", e.target.value);
      const newPath = appendKeywordSearch(location.search, e.target.value)
      nav(`/search${newPath}`)
    }
  }

  useEffect(() => {
    getStories(location.search)
    getTagsAndSearch()

    const storedTags = getStoredTags()
    if (storedTags) {
      setAllTags(getStoredTags)
      console.log(allTags)
    } else {
      storeAllTags()
    }
    
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
            onKeyDown={searchKeyword}
        />
        <Autocomplete
          disablePortal
          options={Object.keys(allTags)}
          onKeyDown={handleEnterPress}
          size="small"
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Tags" />}
          onChange={(e,newValue) => {
            addSelected(newValue)
          }}
          inputValue={inputTag}
            onInputChange={(e, newInputValue) => {
              setInputTag(newInputValue);
            }}
        />
        <SelectedTagStack tags={selectedTags} />
      </SearchContainer>
      <ResearcherCarousel extension={location.search}/>
      <ResultsContainer >
        <h2>Results</h2>
        <ResultsContents>
          <ResultsGrid container rowSpacing={3} columnSpacing={{xs:'auto', sm:2, md:3}} >
            {(story && story.length!==0) ? Object.entries(story).map(([key, value], idx) => (
                  <ResultsGridItem item>
                    <Card 
                      key={idx} 
                      title={value.title} 
                      tags={value.tags}
                      researcher={value.researchers[0]}
                      storyId={value.id}
                      showLikes={!!auth.accessToken}
                      thumbnail={value.thumbnail}
                    />
                  </ResultsGridItem>
                  
                )) : <p sx={{margin: '0 0 0 60px', color:`${grey[700]}`}}>No stories to show</p>
            }
          </ResultsGrid>
        </ResultsContents>
      </ResultsContainer>
      
    </Page>
  )
}

export default SearchScreen