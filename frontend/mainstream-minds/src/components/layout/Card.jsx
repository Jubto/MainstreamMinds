import { default as MuiCard } from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


const Card = (props) => {

	// Pass story info in and render
	const title = "props.title here"
	const author = "props.link to verified researcher - component"
	const tags = "props.tags here"

    return (
			<MuiCard sx={{ maxWidth: 340, border: "none", boxShadow: "none" }}>
				<CardMedia
					component="img"
					height="140"
					image="/static/images/cards/contemplative-reptile.jpg"
					alt="green iguana"
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
					{tags}
				</CardActions>
			</MuiCard>
    );
  }
  
export default Card;

