import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useMsmApi from "../hooks/useMsmApi"
import Page from "../components/layout/Page"
import Tags from "../components/layout/Tags"
import { FlexBox } from "../components/styles/util.styled"
import {
  Autocomplete,
  Button,
  IconButton,
  InputAdornment,
  Popper,
  TextField,
  Tooltip,
  Typography
} from "@mui/material"
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const CustomerPopper = function (props) {
  return (
    <Popper
      {...props}
      placement="bottom-start"
      sx={{
        '.MuiAutocomplete-paper': { height: '250px', overflow: 'hidden' },
      }}
    />
  );
};


const UploadStoryScreen = ({ researcher }) => {
  const navigate = useNavigate()
  const msmApi = useMsmApi()
  const vidLink = useRef('')
  const [videoLink, setVideoLink] = useState(null)
  const [selectedTopics, setSelectedTopics] = useState(new Set())
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [unSelect, setUnSelect] = useState('')
  const [inputValue, setInputValue] = useState(null)
  const [AllTopics, setAllTopics] = useState([])
  const [AllTopicsLookup, setAllTopicsLookup] = useState([])
  const [formErrors, setFormErrors] = useState({
    error: false,
    videoLink: null,
    storyTitle: null,
    storyPaper: null,
    storyTags: null,
    storyDesc: null
  })

  const addSelected = (selected) => {
    setSelectedTopic(selected);
    if (selected) {
      setSelectedTopics(selectedTopics.add(selected))
    }
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && selectedTopic) {
      addSelected(selectedTopic)
    }
  }

  const validateYTLink = (link) => {
    console.log('validation::: ', link)
    if (/^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$/.test(link)) {
      return true
    }    
    setFormErrors(prevState => { return { ...prevState, videoLink: true } })
    setVideoLink(null)
    return false
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const videoLink = data.get('videoLink');
    const storyTitle = data.get('storyTitle');
    const storyPaper = data.get('storyPaper');
    const storyDesc = data.get('storyDesc');

    formErrors.error = false;

    if (!validateYTLink(videoLink)) {
      setFormErrors(prevState => {
        return { ...prevState, videoLink: true }
      })
      formErrors.error = true
    }
    if (!/^[\w]+(\s[\w]+)*$/.test(storyTitle)) {
      setFormErrors(prevState => {
        return { ...prevState, storyTitle: true }
      })
      formErrors.error = true
    }
    if (!/^https?:\/\/.+$/.test(storyPaper)) {
      setFormErrors(prevState => {
        return { ...prevState, storyPaper: true }
      })
      formErrors.error = true
    }
    if (!storyDesc) {
      setFormErrors(prevState => {
        return { ...prevState, storyDesc: true }
      })
      formErrors.error = true
    }
    if (!selectedTopics.size) {
      setFormErrors(prevState => {
        return { ...prevState, storyTags: true }
      })
      formErrors.error = true
    }

    if (!formErrors.error) {
      const body = {
        title: storyTitle,
        summary: storyDesc,
        papers: storyPaper,
        thumbnail: "string",
        video_link: videoLink,
        transcript: "string",
        authors: [
          researcher.id
        ],
        institutions: [
          researcher.institution_id
        ],
        tags: Array.from(selectedTopics).map((tagName) => AllTopicsLookup[tagName]),
        content_body: "string"
      }
      msmApi.post('/research_stories', body)
      .then((res) => {
        navigate(`/research-story/${res.data.id}`)
      })
      .catch((err) => console.error(err))
    }
  }

  useEffect(() => {
    if (unSelect) {
      selectedTopics.delete(unSelect)
      setSelectedTopics(selectedTopics)
      setUnSelect('')
    }
  }, [unSelect])

  useEffect(() => {
    // no time to utilise the pagination sorry
    msmApi.get('/tags/?page_size=1000')
      .then((res) => {
        setAllTopics(res.data.items.map((tag) => tag.name))
        const tagMap = {}
        res.data.items.forEach((tag) => {
          tagMap[tag.name] = tag.id
        })
        setAllTopicsLookup(tagMap)
      })
      .catch((err) => console.error(err))
  }, [])

  console.log(videoLink)

  return (
    <Page>
      <FlexBox component="form" noValidate onSubmit={handleSubmit} gap='4rem' sx={{ width: '100%' }}>
        <FlexBox direction='column' gap='1rem'>
          <Typography variant='h3' sx={{ ml: -2.5, mb: 5 }}>
            Create New Story
          </Typography>
          <TextField
            autoFocus
            required
            name="videoLink"
            label="Link to existing video"
            placeholder="Enter the URL where your video content is hosted then press the link button"
            fullWidth
            inputRef={vidLink}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title='link video'>
                    <IconButton onClick={() => validateYTLink(vidLink.current?.value) && setVideoLink(vidLink.current?.value)}>
                      <InsertLinkIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            onChange={() => {
              formErrors.videoLink && setFormErrors(prevState => {
                return { ...prevState, videoLink: false }
              })
            }}
            error={formErrors.videoLink}
            helperText={formErrors.videoLink ? 'Must be a valid youtube link.' : ''}
          />
          <FlexBox justify='center' align='center'
            sx={{ bgcolor: videoLink ? '' : 'msm.dull', width: '671px', height: '343px' }}
          >
            {videoLink
              ? <iframe width="671px" height="343px" src={videoLink} title="YouTube video player" frameBorder="0" />
              : <PlayArrowIcon color='disabled' fontSize='large' />
            }
          </FlexBox>
          <TextField
            required
            name="storyTitle"
            label="Story Title"
            placeholder="Enter a clear and catchy title"
            fullWidth
            onChange={() => {
              formErrors.storyTitle && setFormErrors(prevState => {
                return { ...prevState, storyTitle: false }
              })
            }}
            error={formErrors.storyTitle}
            helperText={formErrors.storyTitle ? 'Must be a valid story title.' : ''}
          />
          <TextField
            required
            name="storyPaper"
            label="Link to Published Paper"
            placeholder="Enter the URL for the related researcher paper"
            fullWidth
            onChange={() => {
              formErrors.storyPaper && setFormErrors(prevState => {
                return { ...prevState, storyPaper: false }
              })
            }}
            error={formErrors.storyPaper}
            helperText={formErrors.storyPaper ? 'Must be a valid url.' : ''}
          />
          <FlexBox sx={{ mt: '1rem' }}>
            <IconButton sx={{ pt: 0 }}>
              <CheckBoxIcon />
            </IconButton>
            <Typography variant='subtitle1' color='primary'>
              <b>Generate Transcript</b> (Recommended)
            </Typography>
          </FlexBox>
        </FlexBox>
        <FlexBox direction='column' gap='1rem' sx={{ mt: '7rem', width: '100%', maxWidth: '806px' }}>
          <Typography variant='h4' sx={{ mb: -1, mt: -1 }}>
            Research Topics
          </Typography>
          <FlexBox sx={{ overflowX: 'auto' }}>
            {selectedTopics.size
              ? <Tags tags={Array.from(selectedTopics)} tagSize="medium" disable={true} setUnSelect={setUnSelect} />
              : <Typography sx={{ ml: 1, color: 'msm.dull' }}>
                No topics selected..
              </Typography>
            }
          </FlexBox>
          <Autocomplete
            disablePortal
            id="add-story-tags"
            name="storyTags"
            value={selectedTopic}
            onChange={(e, newValue) => {
              addSelected(newValue)
              formErrors.storyTags && setFormErrors(prevState => {
                return { ...prevState, storyTags: false }
              })
            }}
            inputValue={inputValue}
            onInputChange={(e, newInputValue) => {
              setInputValue(newInputValue);
            }}
            onKeyDown={handleEnterPress}
            options={AllTopics}
            renderInput={
              (params) => 
              <TextField 
                {...params}
                label="Research Topics"
                InputLabelProps={{ shrink: true }}
                error={formErrors.storyTags}
                helperText={formErrors.storyTags ? 'Need to have at least one topic selected.' : ''}
              />}
            PopperComponent={CustomerPopper}
            sx={{ mt: -1, mb: 2 }}
          />
          <Typography variant='h4'>
            Research Story Description
          </Typography>
          <TextField
            required
            name="storyDesc"
            label="Research Story Description"
            placeholder="Describe your research!"
            multiline
            rows={12}
            fullWidth
            onChange={() => {
              formErrors.storyDesc && setFormErrors(prevState => {
                return { ...prevState, storyDesc: false }
              })
            }}
            error={formErrors.storyDesc}
            helperText={formErrors.storyDesc ? 'Cannot be empty.' : ''}
          />
          <FlexBox sx={{ mt: '1rem', mb: '1rem' }}>
            <IconButton sx={{ pt: 0 }}>
              <CheckBoxIcon />
            </IconButton>
            <Typography variant='subtitle1' color='primary'>
              <b>Allow Comments</b> (Recommended)
            </Typography>
          </FlexBox>
          <FlexBox justify='flex-end'>
            <Button type='submit' variant='contained' sx={{ borderRadius: '50px', fontSize: '20px' }}>
              Publish Story
            </Button>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Page>
  )
}

export default UploadStoryScreen