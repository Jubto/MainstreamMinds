import { useContext } from 'react';
import { StoreContext } from '../utils/context';

const SignUpScreen = () => {
  const context = useContext(StoreContext);
  const [account, setAccount] = context.account;

  return (
    <div>SignUpScreen</div>
  )
}

export default SignUpScreen