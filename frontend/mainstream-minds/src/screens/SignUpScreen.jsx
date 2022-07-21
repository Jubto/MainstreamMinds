import useGlobal from "../hooks/useGlobal";

const SignUpScreen = () => {
  const context = useGlobal();
  const [account, setAccount] = context.account;

  return (
    <div>SignUpScreen</div>
  )
}

export default SignUpScreen