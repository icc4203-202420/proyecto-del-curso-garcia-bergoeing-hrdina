import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Container, BottomNavigation, BottomNavigationAction, Paper 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Home from './components/Home';
import BeerList from './components/BeerList';
import BarList from './components/BarList';
import EventList from './components/EventList';
import UserSearch from './components/UserSearch';
import LoginForm from './components/Login';
import RegistrationForm from './components/SignUp';
import BeerDetails from './components/BeerDetails';
import ReviewForm from './components/ReviewForm';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();  // Initialize navigate here
  const location = useLocation();  // Initialize location here

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    const decodedToken = jwtDecode(token);
    localStorage.setItem('user_id', decodedToken.sub);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
  };

  // useEffect to check token validity on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout(); // Log out if token is expired
        } else {
          setUsername(decodedToken.username);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        handleLogout(); // Log out if token is invalid
      }
    }
  }, []);

  // useEffect to redirect unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    console.log('IsAuthenticated:', isAuthenticated);
    console.log('Current Path:', location.pathname);

    if (!isAuthenticated && !['/login', '/signup'].includes(location.pathname) && !token) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleChange = (menu, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isAuthenticated ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Beer App
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <List>
          {isAuthenticated ? (
            <>
              <ListItem button component={Link} to="/" onClick={toggleDrawer}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={Link} to="/beers" onClick={toggleDrawer}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Beers" />
              </ListItem>
              <ListItem button component={Link} to="/bars" onClick={toggleDrawer}>
                <ListItemIcon>
                  <SportsBarIcon />
                </ListItemIcon>
                <ListItemText primary="Bars" />
              </ListItem>
              <ListItem button component={Link} to="/user-search" onClick={toggleDrawer}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="User Search" />
              </ListItem>
              <ListItem button onClick={() => { handleLogout(); toggleDrawer(); }}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : null}
        </List>
      </Drawer>

      <Container sx={{ mt: 10 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/bars" element={<BarList />} />
          <Route path="/bars/:id/events" element={<EventList />} />
          <Route path="/user-search" element={<UserSearch />} />
          <Route path="/login" element={<LoginForm tokenHandler={handleLogin} />} />
          <Route path="/signup" element={<RegistrationForm />} />
          <Route path="/beers/:beerId/details" element={<BeerDetails />} />
          <Route path="/beers/:beerId/review" element={<ReviewForm />} />
        </Routes>
      </Container>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        {isAuthenticated ? ( 
          <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} component={Link} to="/" />
            <BottomNavigationAction label="Beers" value="beers" icon={<SportsBarIcon />} component={Link} to="/beers" />
            <BottomNavigationAction label="Bars" value="bars" icon={<LocalBarIcon />} component={Link} to="/bars" />
            <BottomNavigationAction label="Events" value="events" icon={<CampaignIcon />} component={Link} to="/bars/:id/events" />
          </BottomNavigation>
        ) : null}
      </Paper>
    </>
  );
}

export default App;

