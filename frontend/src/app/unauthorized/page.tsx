'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define styled components
const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Card = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: 400,
  width: '100%',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '2rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const Message = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontSize: '1rem',
  color: theme.palette.text.secondary,
}));

const LoginLink = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Component that renders the Unauthorized (Access Denied) page
const UnauthorizedPage = () => {
  return (
    <Container>
      <Card>
        <Title variant="h1">Access Denied</Title>
        <Message variant="body1">You do not have the necessary permissions to view this page.</Message>
        <Link href="/login" passHref>
          <LoginLink variant="contained" color="primary">
            Go to Login
          </LoginLink>
        </Link>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;
