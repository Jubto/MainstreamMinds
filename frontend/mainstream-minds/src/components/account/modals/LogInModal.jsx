import { useContext } from 'react';
import { StoreContext } from '../../../utils/context';
import { Dialog } from "@mui/material"

const LogInModal = () => {
  const context = useContext(StoreContext);
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