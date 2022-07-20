import { useContext } from 'react';
import { StoreContext } from '../utils/context';

const LogInScreen = () => {
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;

  return (
    <div>LogInScreen</div>
  )
}

export default LogInScreen