import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, CssBaseline, Tooltip, Dialog, DialogContent, DialogTitle, Typography as MuiTypography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Layout() {
    const [userEmail, setUserEmail] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // Fetch user email from local storage or any other source
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || '');  // Set default value if email is not found
    }, []);
    

    const handleIconClick = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: '#008080'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        edge="start"
                        sx={{ marginRight: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        ClassZone
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Tooltip title={userEmail}>
                        <IconButton
                            color="inherit"
                            aria-label="user"
                            edge="end"
                            onClick={handleIconClick}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: 50,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <List>
                    <ListItem button component={Link} to="/home">
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} to="calendar">
                        <ListItemText primary="Calendar" />
                    </ListItem>
                    <ListItem button component={Link} to="teacher">
                        <ListItemText primary="Teacher" />
                    </ListItem>
                    <ListItem button component={Link} to="student">
                        <ListItemText primary="Student" />
                    </ListItem>
                    <ListItem button component={Link} to="/">
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    ml: 30,
                    transition: 'margin 0.3s ease',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>User Email</DialogTitle>
                <DialogContent>
                    <MuiTypography variant="body1">
                        {userEmail}
                    </MuiTypography>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default Layout;
