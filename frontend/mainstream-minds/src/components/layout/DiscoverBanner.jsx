import { styled, Button } from "@mui/material"
import { blue } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"

const Banner = styled('div')`
  background-color: ${blue[800]};
  width: 90%;
  display: flex;
  flex-direction: row;
  margin: 0 0 40px 0;
  border-radius: 4px;
  padding: 32px;
  color: white;
`

const BannerImage = styled('img')`
  height: 200px;
  margin: 0 40px;
  filter: invert(1);
`

const BannerContents = styled('div')`
  padding: 12px;
`

const Strike = styled('span')`
  text-decoration: line-through
`

const DiscoverBanner = () => {
  const nav = useNavigate()

  return(
    <Banner>
      <BannerImage src={process.env.PUBLIC_URL + '/knowledge-icon.png'} alt={'BannerImage'}/>
      <BannerContents>
        <h1>Welcome!</h1>
        <p>Mainstream Minds is bridging the gap between research and the people. Get involved now because great minds <Strike>think alike</Strike> share their knowlege.</p>
        <Button variant="outlined" sx={{backgroundColor: 'white'}} onClick={nav('/login')}>
          Log In
        </Button>
        <Button variant="outlined" sx={{color: 'white', margin: '0 0 0 12px'}} onClick={nav('/sign-up')}>
          Sign Up
        </Button>
      </BannerContents>
    </Banner>
  )
}

export default DiscoverBanner