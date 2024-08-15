import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Avatar, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

function Login() {
    const [details, setDetails] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = details;

        try {
            const res = await fetch("https://classroom-e617f-default-rtdb.firebaseio.com/register.json");
            const data = await res.json();
            
            const user = Object.values(data).find(user => user.email === email && user.password === password);

            if (user) {
                setError('');
                localStorage.setItem('userEmail', email); // Store email in local storage
                localStorage.setItem('username', `${user.fName} ${user.lName}`); // Store username in local storage
                navigate('/home'); // Redirect to home page
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        backgroundColor: '#fff',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main',backgroundColor: '#008080', color: '#fff'  }}>
                        <PersonOutlineIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            onChange={(e) => setDetails({ ...details, password: e.target.value })}
                        />
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, py: 1.5, backgroundColor: '#008080', color: '#fff'  }}
                        >
                            Sign In
                        </Button>
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href="/register" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                                    {"New here? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
