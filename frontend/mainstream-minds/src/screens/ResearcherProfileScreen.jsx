import Page from "../components/layout/Page";
import {Avatar, Grid, Typography} from '@mui/material';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useMsmApi from "../hooks/useMsmApi";
import {useEffect, useState} from "react";
import {getColourForString} from "../components/styles/colours";
import {Box} from "@mui/system";
import Tags from "../components/layout/Tags";
import Card from "../components/layout/StoryCards/Card";
import {styled} from "@mui/material";

const StyledBox = styled('div')`
  display: flex;
  flex-direction: row;
  width: 90vw;
  flex-wrap: wrap;
  > * { 
    margin: 0 40px 0 0;
  }
`

const ResearcherProfileScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [researcher, setResearcher] = useState({});
  const [institution, setInstitution] = useState({});
  const [stories, setStories] = useState([]);
  const {auth} = useAuth();
  const msmAPI = useMsmApi();
  const {id} = useParams();

  useEffect(() => {
    msmAPI.get(`/researchers/${id}`)
      .then((res) => {
        setResearcher(res.data);
        if (res.data.institution_id) {
          msmAPI.get(`/institutions/${res.data.institution_id}`)
            .then((res) => {
              setInstitution(res.data);
            });
        }
        setIsLoading(false);
      })
      .catch((err) => console.error(err));


    msmAPI.get(`/researchers/${id}/stories`)
      .then((res) => {
        setStories(res.data.items);
      })
      .catch((err) => console.error(err));

  }, [])

  if (Object.keys(researcher).length === 0) {
    return (
      <Page align={'left'}>
        <Typography variant='h4'>
          {isLoading ? '' : 'Could not find researcher'}
        </Typography><br/>
      </Page>
    );
  }

  const bgColour = getColourForString(researcher.user.first_name + researcher.user.last_name);

  const storyCards = stories.map((value, idx) => {
    return <Card
        key={idx}
        title={value.title}
        tags={value.tags}
        researcher={value.researchers[0]}
        storyId={value.id}
        thumbnail={value.thumbnail}
      />
  })

  return (
    <Page align={'left'}>


      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <Avatar sx={{bgcolor: bgColour, width: 220, height: 220, mr: 2, marginRight: '48px'}}/>

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Typography variant='h3'>
            {`${researcher.user.first_name} ${researcher.user.last_name}`}
          </Typography><br/>

          {Object.keys(institution).length !== 0 ?
            <>
              <Typography variant='h5' sx={{mt: 2, color: 'rgba(0,0,0,0.6)'}}>
                {institution.name}
              </Typography>
              <Typography variant='subtitle1' sx={{mt: 2}}>
                {researcher.institution_position}
              </Typography>
              <Typography variant='subtitle1' sx={{mt: 2}}>
                {researcher.institution_email}
              </Typography>
            </>
            :
            ''
          }
          <Tags tags={researcher.user.preference_tags} tagSize="medium"/>
        </Box>

      </Box>

      <h2 style={{marginTop: '48px'}}>
        Research Stories
      </h2>

      {storyCards.length ?
        <StyledBox >
        
          {storyCards}
        </StyledBox>
        :
        <Typography variant='h5' sx={{color: 'rgba(0,0,0,0.6)'}}>
          No Research Stories
        </Typography>
      }


    </Page>
  )
}

export default ResearcherProfileScreen
