import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Avatar, Grid, Link } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

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

function Register() {
    const [details, setDetails] = useState({
        fName: '',
        lName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const PostData = async (e) => {
        e.preventDefault();

        const { fName, lName, email, password, confirmPassword } = details;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch("https://classroom-e617f-default-rtdb.firebaseio.com/register.json", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fName,
                    lName,
                    email,
                    password,
                })
            });

            if (res.ok) {
                setError('');
                navigate('/login'); // Redirect to login page upon successful registration
            } else {
                setError('Registration failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CssBaseline />
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 480,
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
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={PostData} noValidate sx={{ mt: 3 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setDetails({ ...details, fName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setDetails({ ...details, lName: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setDetails({ ...details, password: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setDetails({ ...details, confirmPassword: e.target.value })}
                                />
                            </Grid>
                            {error && (
                                <Grid item xs={12}>
                                    <Typography color="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2, py: 1.5, backgroundColor: '#008080', color: '#fff'  }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href="/login" variant="body2" color="primary" underline="none">
                                    Already a learner? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Register;
