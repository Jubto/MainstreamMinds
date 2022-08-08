import { Avatar, Typography } from "@mui/material"
import { useState } from "react"
import { ResearcherCardContainer, ResearcherCardContents, ResearcherDetails, ResearcherInstitution, ResearcherName, ResearcherTags } from "./ResearcherStyles"
import { getColourForString } from "../../../components/styles/colours"
import { useEffect } from "react"
import msmAPI from "../../../api/msmAPI"
import Tags from "../../layout/Tags"

const ResearcherCard = (props) => {
  const user = props.value.user
  const institution_id = props.value.institution_id
  const institutionPosition = props.value.institution_position
  const preferences = user.preference_tags
  const [institutionName, setIntitutionName] = useState('')

  const avatarSize = '70px'

  
  const bgColour = getColourForString(user.first_name+user.last_name)
  console.log(props.value)
  console.log(user.first_name, user.last_name)
  console.log(institutionName, institutionPosition)

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
    <ResearcherCardContainer>
      <ResearcherCardContents>
        {/* <p>{props.value}</p> */}
        <Avatar sx={{ bgcolor: bgColour, width: avatarSize, height: avatarSize, mr: 1, marginRight: '16px' }} />
        <ResearcherDetails>
          <ResearcherName>
            {user.first_name} {user.last_name}
          </ResearcherName>
          <Typography variant="body2" color="text.secondary" sx={{margin: '4px 0'}}>
            {institutionName || "_"}
          </Typography>
          <Typography variant="body2">
            {institutionPosition || "_"}
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