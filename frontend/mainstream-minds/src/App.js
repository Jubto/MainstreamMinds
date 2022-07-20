import React from 'react';
import ContextProvider from './utils/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AccountScreen from './screens/AccountScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import LogInScreen from './screens/LogInScreen';
import PreviewStoryScreen from './screens/PreviewStoryScreen';
import ResearchStoryScreen from './screens/ResearchStoryScreen';
import ResearcherProfileScreen from './screens/ResearcherProfileScreen';
import ResearcherRegScreen from './screens/ResearcherRegScreen';
import SearchScreen from './screens/SearchScreen';
import SignUpScreen from './screens/SignUpScreen';
import UploadStoryScreen from './screens/UploadStoryScreen';
import AppBar from './components/layout/AppBar';
import Footer from './components/layout/Footer';
import LogInModal from './components/account/modals/LogInModal';

// might not need
const theme = createTheme({
  palette: {
    msm: {
      main: '#1976D2',
      dark: '#0E4DA4',
      light: '#559ADE'
    }
  }
})

console.log('APP')

function App() {
  return (
    <ThemeProvider theme={theme}>
    <ContextProvider>
    <Router>
      <AppBar />
        <Routes>
          <Route path='/' element={<DiscoverScreen/>}/>
          <Route exact path='/search' element={<SearchScreen/>}/>
          <Route exact path='/login' element={<LogInScreen/>}/>
          <Route exact path='/sign-up' element={<SignUpScreen/>}/>
          <Route exact path='/account' element={<AccountScreen/>}/>
          <Route exact path='/researcher/registration' element={<ResearcherRegScreen/>}/>
          <Route exact path='/researcher/:name' element={<ResearcherProfileScreen/>}/>
          <Route exact path='/upload-story' element={<UploadStoryScreen/>}/>
          <Route exact path='/preview-story' element={<PreviewStoryScreen/>}/>
          <Route exact path='/research-story/:id' element={<ResearchStoryScreen/>}/>
        </Routes>
      <Footer />
      <LogInModal/>
    </Router>
    </ContextProvider>
    </ThemeProvider>
  );
}

export default App;
