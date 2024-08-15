import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';

function Home() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const email = localStorage.getItem('userEmail');

            if (email) {
                try {
                    const res = await fetch("https://classroom-e617f-default-rtdb.firebaseio.com/register.json");
                    const data = await res.json();

                    const user = Object.values(data).find(user => user.email === email);
                    if (user) {
                        setUsername(`${user.fName} ${user.lName}`);
                    }
                } catch (error) {
                    console.error('Failed to fetch user details:', error);
                }
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div>
            <Box
                sx={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '70vh',
                    width: '150vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'gray',
                    textAlign: 'center',
                    paddingLeft: 0,
                }}
            >
                <Box>
                    <Typography variant="h3" component="div" sx={{ mb: 2 }}>
                        {username ? `Welcome, ${username}` : 'The Ultimate Learning Platform'}
                    </Typography>
                </Box>
            </Box>
        </div>
    );
}

export default Home;
