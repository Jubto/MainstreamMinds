import { useState, createContext } from 'react';

export const StoreContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null);
  const [account, setAccount] = useState({});
  const [LogInModal, setLogInModal] = useState(false);

  const states = {
    jwt: [jwt, setJwt],
    account: [account, setAccount],
    logInModal: [LogInModal, setLogInModal]
  };

  return (
    <StoreContext.Provider value={states}>
      {children}
    </StoreContext.Provider>
  )
};

export default ContextProvider;
