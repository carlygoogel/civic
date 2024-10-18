'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Typography, 
  Box 
} from '@mui/material';

const CivicContactForm = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');
      };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
          Contact Civic
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
          <TextField
            fullWidth
            required
            id="name"
            name="name"
            label="Name"
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            id="email"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
          />
          <TextField
            fullWidth
            select
            id="subject"
            name="subject"
            label="Subject"
            variant="outlined"
            defaultValue=""
          >
            <MenuItem value="">Select a subject</MenuItem>
            <MenuItem value="quote">Quote</MenuItem>
            <MenuItem value="project">Project</MenuItem>
            <MenuItem value="job">Job Opportunity</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            required
            id="message"
            name="message"
            label="Message"
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
            Submit
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CivicContactForm;