import Image from "next/image";
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import CivicContactForm from './civic_contact_form';
import civic_logo from '../app/images/civic_logo.png'

export default function Home() {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 4, 
        backgroundColor: '#ffffff' 
      }}
    >
      {/* Logo Section */}
      <Box mb={4} textAlign="center">
        <Image
          src={civic_logo}
          alt="Civic Logo"
          width={200}
          height={50}
          priority
        />
      </Box>

      {/* Welcome Section */}
      <Box mb={4} textAlign="center">
        <Typography variant="h3" component="h1" color="primary" gutterBottom>
          Welcome to Civic
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Reimagining government relations with cutting-edge AI technology.
          Get in touch with us using the form below.
        </Typography>
      </Box>

      {/* Contact Form */}
      <CivicContactForm />

      {/* Footer Section */}
      <Box 
        mt={8} 
        display="flex" 
        justifyContent="center" 
        gap={2}
        sx={{ width: '100%', borderTop: '1px solid #e0e0e0', pt: 2 }}
      >
        <Button
          variant="contained"
          href="https://nextjs.org/learn"
          target="_blank"
          sx={{ textTransform: 'none' }}
        >
          Learn More
        </Button>
        <Button
          variant="outlined"
          href="https://vercel.com/templates"
          target="_blank"
          sx={{ textTransform: 'none' }}
        >
          Examples
        </Button>
        <Button
          variant="outlined"
          href="https://nextjs.org"
          target="_blank"
          sx={{ textTransform: 'none' }}
        >
          Visit Next.js
        </Button>
      </Box>
    </Box>
  );
}
