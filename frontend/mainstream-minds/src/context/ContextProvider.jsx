import { useState, createContext } from 'react';

export const GlobalContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [account, setAccount] = useState({});
  const [LogInModal, setLogInModal] = useState(false);

  const states = {
    account: [account, setAccount],
    logInModal: [LogInModal, setLogInModal]
  };

  return (
    <GlobalContext.Provider value={states}> 
      {children}
    </GlobalContext.Provider>
  )
};

export default ContextProvider;
