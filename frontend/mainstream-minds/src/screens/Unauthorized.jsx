import { useNavigate } from "react-router-dom"
import { Button } from "@mui/material";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>Unauthorized</h2>
      <br />
      <p>You do not have access to the requested page.</p>
      <Button variant='contained' onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </section>
  )
}

export default Unauthorized