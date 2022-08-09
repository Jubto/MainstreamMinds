import { Avatar, Typography } from "@mui/material"
import { useState } from "react"
import { ResearcherCardContainer, ResearcherCardContents, ResearcherDetails, ResearcherInstitution, ResearcherName, ResearcherTags } from "./ResearcherStyles"
import { getColourForString } from "../../../components/styles/colours"
import { useEffect } from "react"
import msmAPI from "../../../api/msmAPI"
import {Button} from "@mui/material";
import {useNavigate, useLocation, Link} from 'react-router-dom';

import Tags from "../../layout/Tags"

const ResearcherCard = (props) => {
  const user = props.value.user
  const institution_id = props.value.institution_id
  const institutionPosition = props.value.institution_position
  const id = props.value.id
  const preferences = user.preference_tags
  const [institutionName, setIntitutionName] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const avatarSize = '70px'

  // console.log(props.value)
  
  const bgColour = getColourForString(user.first_name+user.last_name)

  const toProfile = () =>{
   // event.preventDefault();
    const to = `/researcher/${id}`
    navigate(to, {replace: true});
  }


  useEffect(() => {
    if(institution_id) {
      msmAPI.get(`/institutions/${institution_id}`)
        .then((res) => {
          setIntitutionName(res.data.name)
        })
        .catch((err) => console.error(err))
    }
  })

  return(
    <ResearcherCardContainer onClick={toProfile}>
      <ResearcherCardContents>
        {/* <p>{props.value}</p> */}
        <Avatar sx={{ bgcolor: bgColour, width: avatarSize, height: avatarSize, mr: 1, marginRight: '16px' }} />
        <ResearcherDetails>
          <ResearcherName>
            {user.first_name} {user.last_name}
          </ResearcherName>
          <Typography variant="body2" color="text.secondary" sx={{margin: '4px 0'}}>
            {institutionName || "-"}
          </Typography>
          <Typography variant="body2">
            {institutionPosition || "-"}
          </Typography>
        </ResearcherDetails>
      </ResearcherCardContents>
      <ResearcherTags>
        <Tags tagSize="small" tags={preferences} />
      </ResearcherTags>
    </ResearcherCardContainer>

  )
}

export default ResearcherCard