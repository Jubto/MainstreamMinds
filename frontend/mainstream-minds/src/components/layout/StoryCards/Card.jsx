import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { default as MuiCard } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import { Typography, Button } from '@mui/material/';
import { CardTitle, StyledCard, CardContent } from "./CardStyles";
import Tags from "../Tags"
import BookmarkIcon from '@mui/icons-material/Bookmark';


const Card = (props) => {
	const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null)
	const [story, setStory] = useState({})
	const [liked, setLiked] = useState(false)
	
	// Pass story info in and render
	const title = props.title
	const tags = props.tags
	const researcherId = props.researcher
	const storyId = props.storyId

	const getLiked = async () => {
		try {
			const result = await msmAPI.get(`research_stories/like?story_id=${storyId}`)
			console.log(result)
			setLiked(result.data)
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
	/* const getResearcher = async (id) => {
    try {
      const result = await msmAPI.get(`researchers/${id}`)
    }
  }
  } */

	useEffect(() => {
    if (props.showLikes) {
			getLiked()
		}
  }, [])

	return (
		<StyledCard>
			<CardMedia
				component="img"
				height="140"
				image="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
				alt="cat"
			/>
			<CardContent>
				<CardTitle>
					{title}
				</CardTitle>
				<Typography variant="body2" color="text.secondary">
					researcher
				</Typography>
			</CardContent>
			<div>
				<Tags tags={tags}/>
			</div>
		</StyledCard>
	);
}
  
export default Card;

