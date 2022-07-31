import { useState } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { default as MuiCard } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Typography, Button } from '@mui/material/';
import { StyledCard } from "./CardStyles";
import Tags from "../Tags"


const Card = (props) => {
	const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null)
	const [story, setStory] = useState({})
	
	// Pass story info in and render
	const title = props.title
	const author = props.author
	const tags = props.tags

	const testGetStory = async () => {
    // Testing jwt Bearer API call
    try {
      const resStory = await msmAPI.get('/research_stories')
      setStory(resStory.data)
			console.log(story, typeof story)
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

    return (
			<StyledCard>
				<CardMedia
					component="img"
					height="140"
					image="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
					alt="cat"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{author}
					</Typography>
				</CardContent>
				<CardActions>
					<Tags tags={tags}/>
				</CardActions>
			</StyledCard>
    );
  }
  
export default Card;

