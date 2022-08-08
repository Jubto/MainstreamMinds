import React from 'react';
import ContextProvider from './context/ContextProvider';
import AuthProvider from './context/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AccountScreen from './screens/AccountScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import LogInScreen from './screens/LogInScreen';
import PreviewStoryScreen from './screens/PreviewStoryScreen';
import ResearchStoryScreen from './screens/ResearchStoryScreen';
import ResearcherProfileScreen from './screens/ResearcherProfileScreen';
import ResearcherRegScreen from './screens/ResearcherRegScreen';
import SearchScreen from './screens/SearchScreen';
import SignUpScreen from './screens/SignUpScreen';
import Unauthorized from './screens/Unauthorized';
import UploadStoryScreen from './screens/UploadStoryScreen';
import AppBar from './components/layout/AppBar';
import Footer from './components/layout/Footer';
import LogInModal from './components/account/modals/LogInModal';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ROLES = {
  'admin': 0,
  'researcher': 1,
  'user': 2
}

// might not need
const theme = createTheme({
  palette: {
    msm: {
      main: '#1976D2',
      dark: '#0E4DA4',
      light: '#559ADE',
      dull: '#b5b5b5'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ContextProvider>
          <Router>
            <AppBar hideForRoutes={['/login', '/sign-up']} />
            <Routes>
              <Route path='/' element={<DiscoverScreen />} />
              <Route path='/search' element={<SearchScreen />} />
              <Route path='/search/:tags' element={<SearchScreen/>} />
              <Route path='/login' element={<LogInScreen />} />
              <Route path='/sign-up' element={<SignUpScreen />} />
              <Route path='/researcher/:id' element={<ResearcherProfileScreen />} />
              <Route path='/research-story/:id' element={<ResearchStoryScreen />} />
              <Route path='/unauthorized' element={<Unauthorized />} />
              <Route element={<ProtectedRoute allowedRole={[ROLES.user]} />}>
                <Route path='/account' element={<AccountScreen />} />
                <Route path='/researcher/registration' element={<ResearcherRegScreen />} />
              </Route>
              <Route element={<ProtectedRoute allowedRole={[ROLES.researcher]} />}>
                <Route path='/upload-story' element={<UploadStoryScreen />} />
                <Route path='/preview-story' element={<PreviewStoryScreen />} />
              </Route>
            </Routes>
            <Footer />
            <LogInModal />
          </Router>
        </ContextProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
