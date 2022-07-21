import useGlobal from '../../../hooks/useGlobal';
import { Dialog } from "@mui/material"

const LogInModal = () => {
  const context = useGlobal();
  const [open, setOpen] = context.logInModal;

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="login modal">
      LogInModal
    </Dialog>
  )
}

export default LogInModal