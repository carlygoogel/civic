'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  TextField, 
  MenuItem, 
  Button, 
  Typography, 
  Box,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const CivicContactForm = () => {
  const [state, setState] = useState('');
  const [politician, setPolitician] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    // Here you would typically send the form data to your backend
  };

  // This is a placeholder. In a real application, you'd fetch this data from an API
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming'
  ];

  // This is a placeholder. In a real application, you'd fetch this data from an API based on the selected state
  const politicians = ['Senator A', 'Senator B', 'Representative C', 'Representative D'];

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
          Contact Your Politician
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label="Your Name"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            id="email"
            name="email"
            label="Your Email"
            type="email"
            variant="outlined"
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value as string)}
              label="State"
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="politician-label">Politician</InputLabel>
            <Select
              labelId="politician-label"
              id="politician"
              value={politician}
              onChange={(e) => setPolitician(e.target.value as string)}
              label="Politician"
            >
              {politicians.map((politician) => (
                <MenuItem key={politician} value={politician}>{politician}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            required
            id="subject"
            name="subject"
            label="Subject"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            id="message"
            name="message"
            label="Your Message"
            multiline
            rows={4}
            variant="outlined"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
          >
            Send Message
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition">
          ← Back to Home
        </Link>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <CivicContactForm />
      </main>
    </div>
  );
};

export default Page;