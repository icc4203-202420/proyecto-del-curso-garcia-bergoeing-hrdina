import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import Home from './components/Home';
import BeerList from './components/BeerList';
import BarList from './components/BarList';
import Events from './components/Events';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [value, setValue] = React.useState('home');

  const handleChange = (menu, newValue) => {
    setValue(newValue);
  };

  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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
        </List>
      </Drawer>

      <Container sx={{ mt: 10 }}> {/* Adjusted padding to avoid content being hidden */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/bars" element={<BarList />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Container>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={value} onChange={handleChange} showLabels>
            <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />}  component={Link} to="/" />
            <BottomNavigationAction label="Beers" value="beers"icon={<SportsBarIcon/>} component={Link} to="/beers" />
            <BottomNavigationAction label="Bars" value="bars" icon={<LocalBarIcon />} component={Link} to="/bars" />
            <BottomNavigationAction label="Events" value="events" icon={<CampaignIcon />} component={Link} to="/events" />
        </BottomNavigation>
      </Paper>
    </Router>
  );
}

export default App;

