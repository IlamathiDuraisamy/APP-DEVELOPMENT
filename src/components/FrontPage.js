import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const RootContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  //backgroundImage: 'url(https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600)',
  backgroundColor: '#f5f5f5',
  backgroundSize: 'cover',
  backgroundRepeat:'no-repeat'
  
});

const Title = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#3f51b5',
  animation: 'fadeIn 2s ease-in-out',
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
});

const Subtitle = styled(Typography)({
  fontSize: '1.5rem',
  color: '#3f51b5',
  marginTop: '10px',
  animation: 'slideIn 2s ease-in-out',
  '@keyframes slideIn': {
    '0%': {
      transform: 'translateX(-100%)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
});

const ButtonsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
  animation: 'slideUp 2s ease-in-out',
  '@keyframes slideUp': {
    '0%': {
      transform: 'translateY(100%)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
});

const StyledButton = styled(Button)({
  margin: '0 10px',
  padding: '10px 20px',
  fontSize: '1rem',
  color: '#fff',
  backgroundColor: '#3f51b5',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

const FrontPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <RootContainer>
      <Title sx={{color:'#008080'}}>
        ClassZone
      </Title>
      <Subtitle>
        The Ultimate Learning Platform
      </Subtitle>
      <ButtonsContainer>
        <StyledButton variant="contained" sx={{ backgroundColor: '#008080', color: '#fff' }}  onClick={handleLoginClick} >
          Login
        </StyledButton>
        <StyledButton variant="contained" sx={{ backgroundColor: '#008080', color: '#fff' }} onClick={handleSignUpClick}>
          Sign Up
        </StyledButton>
      </ButtonsContainer>
    </RootContainer>
  );
};

export default FrontPage;
