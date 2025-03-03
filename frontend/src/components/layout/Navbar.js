import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// Material UI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MapIcon from '@mui/icons-material/Map';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';

const Navbar = () => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for user profile menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  
  // Navigation items with their icons
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { name: 'Map View', path: '/map', icon: <MapIcon /> },
    { name: 'Upload Data', path: '/upload', icon: <UploadFileIcon /> },
    { name: 'Analysis', path: '/analysis', icon: <AnalyticsIcon /> },
  ];
  
  // User menu items
  const userMenuItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'Account', path: '/account' },
    { name: 'Settings', path: '/settings' },
    { name: 'Logout', path: '/logout' },
  ];
  
  // Help menu items
  const helpMenuItems = [
    { name: 'Documentation', path: '/docs' },
    { name: 'Tutorials', path: '/tutorials' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact Support', path: '/support' },
  ];
  
  // Menu control functions
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };
  
  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="static"
      elevation={1}
      sx={{ 
        mb: 2,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            LandMap
          </Typography>

          {/* Mobile menu toggle */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleMobileMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          {/* Logo for mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            LandMap
          </Typography>
          
          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={RouterLink}
                to={item.path}
                sx={{
                  my: 2,
                  mx: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'rgba(66, 133, 244, 0.08)'
                  }
                }}
                startIcon={item.icon}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          
          {/* Help Button */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <Tooltip title="Help & Resources">
              <IconButton 
                onClick={handleOpenHelpMenu} 
                color="primary"
                aria-label="Help resources"
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="help-menu"
              anchorEl={anchorElHelp}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElHelp)}
              onClose={handleCloseHelpMenu}
            >
              {helpMenuItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={handleCloseHelpMenu}
                  component={RouterLink}
                  to={item.path}
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* User Profile */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/images/avatar.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userMenuItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={handleCloseUserMenu}
                  component={RouterLink}
                  to={item.path}
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile navigation drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive(item.path) ? 'primary.main' : 'inherit' 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;