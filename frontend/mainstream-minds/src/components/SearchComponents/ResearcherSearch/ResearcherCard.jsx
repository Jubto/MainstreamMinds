import { Avatar, Typography } from "@mui/material"
import { useState } from "react"
import { ResearcherCardContainer, ResearcherDetails, ResearcherInstitution, ResearcherName } from "./ResearcherStyles"
import { getColourForString } from "../../../components/styles/colours"
import { useEffect } from "react"
import msmAPI from "../../../api/msmAPI"
import {Button} from "@mui/material";
import {useNavigate, useLocation, Link} from 'react-router-dom';


const ResearcherCard = (props) => {
  const user = props.value.user
  const institution_id = props.value.institution_id
  const [institutionName, setIntitutionName] = useState('')
  const [institutionPosition, setInstitutionPosition] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  const bgColour = getColourForString(user.first_name+user.last_name)
  const firstName = user.first_name
  console.log(props.value)
  console.log(user.first_name, user.last_name)
  console.log(institutionName)
  const toProfile = () =>{
   // event.preventDefault();
    const to = `/researcher/${firstName}`
    navigate(to, {replace: true});
  }


  useEffect(() => {
    if(institution_id) {
      msmAPI.get(`/institutions/${institution_id}`)
        .then((res) => {
          setIntitutionName(res.data.name)
          setInstitutionPosition(res.data.institution_postition)
        })
        .catch((err) => console.error(err))
    }
  })

  return(
    <ResearcherCardContainer>
      {/* <p>{props.value}</p> */}
      <Avatar sx={{ bgcolor: bgColour, width: 58, height: 58, mr: 1, marginRight: '16px' }} />
      <ResearcherDetails>
        <ResearcherName>
          {user.first_name} {user.last_name}
        </ResearcherName>
        {institutionName && <Typography variant="body2" color="text.secondary">
          {institutionName}
        </Typography>}
        {institutionPosition && <Typography variant="body2">
          {institutionPosition}
        </Typography>}
        <Button onClick={toProfile}>Go</Button>
      </ResearcherDetails>
    </ResearcherCardContainer>

  )
}

export default ResearcherCard