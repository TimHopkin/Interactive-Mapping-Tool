import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Material UI imports
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// Import pages and components
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import Navbar from './components/layout/Navbar';
import AccessibilityPanel from './components/accessibility/AccessibilityPanel';
import { ThemeProvider } from './context/ThemeContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import WelcomeGuide from './components/onboarding/WelcomeGuide';

function App() {
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(() => {
    return localStorage.getItem('welcomeGuideCompleted') !== 'true';
  });

  const dismissWelcomeGuide = () => {
    localStorage.setItem('welcomeGuideCompleted', 'true');
    setShowWelcomeGuide(false);
  };

  // Create a Material UI theme that matches Google's Material Design
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: '#1a73e8', // Google blue
        light: '#4285f4',
        dark: '#0d47a1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#34a853', // Google green
        light: '#66bb6a',
        dark: '#2e7d32',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ea4335', // Google red
      },
      warning: {
        main: '#fbbc04', // Google yellow
      },
      info: {
        main: '#4285f4', // Google blue
      },
      success: {
        main: '#34a853', // Google green
      },
      background: {
        default: '#ffffff',
        paper: '#f8f9fa',
      },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Arial", sans-serif',
      h1: {
        fontSize: '2.125rem',
        fontWeight: 400,
      },
      h2: {
        fontSize: '1.875rem',
        fontWeight: 400,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 400,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 24px',
          },
          containedPrimary: {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            '&:hover': {
              boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 8,
          },
          elevation1: {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#ffffff',
            color: '#202124',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider>
      <UserPreferencesProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Router>
            <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <AccessibilityPanel />
              <Container component="main" sx={{ flex: 1, py: 4 }} maxWidth="lg">
                {showWelcomeGuide && <WelcomeGuide onDismiss={dismissWelcomeGuide} />}
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/map" element={<MapView />} />
                  <Route path="/upload" element={<DataUpload />} />
                  <Route path="/analysis" element={<Analysis />} />
                  {/* Add routes for footer links */}
                  <Route 
                    path="/accessibility" 
                    element={
                      <Box sx={{ my: 4 }}>
                        <Typography variant="h3">Accessibility Information</Typography>
                      </Box>
                    } 
                  />
                  <Route 
                    path="/help" 
                    element={
                      <Box sx={{ my: 4 }}>
                        <Typography variant="h3">Help Resources</Typography>
                      </Box>
                    } 
                  />
                  <Route 
                    path="/feedback" 
                    element={
                      <Box sx={{ my: 4 }}>
                        <Typography variant="h3">Provide Feedback</Typography>
                      </Box>
                    } 
                  />
                  {/* Add a 404 route */}
                  <Route 
                    path="*" 
                    element={
                      <Box sx={{ my: 4, textAlign: 'center' }}>
                        <Typography variant="h3">404 - Page Not Found</Typography>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          component={Link} 
                          to="/"
                          sx={{ mt: 3 }}
                        >
                          Return to Dashboard
                        </Button>
                      </Box>
                    } 
                  />
                </Routes>
              </Container>
              <Box 
                component="footer" 
                sx={{ 
                  py: 3, 
                  px: 2, 
                  mt: 'auto',
                  backgroundColor: theme => theme.palette.grey[100]
                }}
              >
                <Container maxWidth="lg">
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      © 2025 Interactive Land Analysis Mapping Tool
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Link to="/accessibility" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">Accessibility</Typography>
                      </Link>
                      <Link to="/help" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">Help Resources</Typography>
                      </Link>
                      <Link to="/feedback" style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" color="primary">Provide Feedback</Typography>
                      </Link>
                    </Stack>
                  </Box>
                </Container>
              </Box>
            </Box>
          </Router>
        </MuiThemeProvider>
      </UserPreferencesProvider>
    </ThemeProvider>
  );
}

export default App;