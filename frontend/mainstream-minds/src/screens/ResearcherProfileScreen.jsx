import Page from "../components/layout/Page";
import { Typography } from '@mui/material';
import {useNavigate, useLocation, Link} from 'react-router-dom';

const ResearcherProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  return (
    <Page align={'left'}>
      <Typography variant='h4'>
       Hi
      </Typography><br/>
    </Page>
  )
}

export default ResearcherProfileScreen
