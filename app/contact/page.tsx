'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);




import { 
  Card, 
  CardContent, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Typography, 
  Box,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0e1e5b', 
    },
    secondary: {
      main: '#b22234', 
    },
  },
  
});

const states = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
  { name: 'District of Columbia', abbreviation: 'DC' },
];

const CivicContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    addressLine2: '',
    city: '',
    state: 'PA',
    zip: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);


    // Format name with prefix, first name, and last name
    const fullName = [
      formData.get('prefix'),
      formData.get('firstName'),
      formData.get('lastName')
    ].filter(Boolean).join(' ').trim();

    // Format complete address
    const fullAddress = [
      formData.get('streetAddress'),
      formData.get('addressLine2')
    ].filter(Boolean).join(', ').trim();

    // Format phone number as numeric
    const phoneString = formData.get('phone') as string;
    const phoneNumeric = phoneString ? parseInt(phoneString.replace(/\D/g, '')) : null;

    const now = new Date().toISOString();

    const formPayload = {
      name: fullName,
      address: fullAddress,
      city: formData.get('city'),
      phone: phoneNumeric,
      subject: formData.get('subject'),
      message: formData.get('message')?.toString().substring(0, 1200),
      created_at: now
    };

    try {
      const { error } = await supabase
        .from('Emails')
        .insert([formPayload]);

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      // Reset form values
      setFormValues({
        prefix: '',
        firstName: '',
        lastName: '',
        streetAddress: '',
        addressLine2: '',
        city: '',
        state: 'PA',
        zip: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, backgroundColor: '#f9f7f1' }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom sx={{ color: 'primary.main', textAlign: 'center', fontWeight: 'bold' }}>
            Share Your Thoughts with Your Senator
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            For general comments, please use the form below.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { mb: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  id="prefix"
                  name="prefix"
                  label="Prefix"
                  variant="outlined"
                 // defaultValue=""
                  value={formValues.prefix}
                  onChange={(e) => setFormValues({...formValues, prefix: e.target.value})}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Ms">Ms</MenuItem>
                  <MenuItem value="Dr">Dr</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  value={formValues.firstName}
                  onChange={(e) => setFormValues({...formValues, firstName: e.target.value})}
              />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  value={formValues.lastName}
                  onChange={(e) => setFormValues({...formValues, lastName: e.target.value})}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              required
              id="streetAddress"
              name="streetAddress"
              label="Street Address"
              variant="outlined"
              value={formValues.streetAddress}
              onChange={(e) => setFormValues({...formValues, streetAddress: e.target.value})}
            />
            <TextField
              fullWidth
              id="addressLine2"
              name="addressLine2"
              label="Address Line 2"
              variant="outlined"
              value={formValues.addressLine2}
              onChange={(e) => setFormValues({...formValues, addressLine2: e.target.value})}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="city"
                  name="city"
                  label="City"
                  variant="outlined"
                  value={formValues.city}
                  onChange={(e) => setFormValues({...formValues, city: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  required
                  id="state"
                  name="state"
                  label="State"
                  variant="outlined"
                  defaultValue="PA"
                  value={formValues.state}
                  onChange={(e) => setFormValues({...formValues, state: e.target.value})}
                >
                  {states.map((state) => (
                    <MenuItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              required
              id="zip"
              name="zip"
              label="ZIP Code"
              variant="outlined"
              value={formValues.zip}
              onChange={(e) => setFormValues({...formValues, zip: e.target.value})}
            />
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone"
              variant="outlined"
              value={formValues.phone}
              onChange={(e) => setFormValues({...formValues, phone: e.target.value})}
            />
            <TextField
              fullWidth
              required
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              value={formValues.email}
              onChange={(e) => setFormValues({...formValues, email: e.target.value})}
            />
            <TextField
              fullWidth
              select
              required
              id="subject"
              name="subject"
              label="Subject"
              variant="outlined"
              defaultValue=""
              value={formValues.subject}
              onChange={(e) => setFormValues({...formValues, subject: e.target.value})}
            >
              <MenuItem value="">Select a subject</MenuItem>
            <MenuItem value="Agriculture">Agriculture</MenuItem>
            <MenuItem value="Animals">Animals</MenuItem>
            <MenuItem value="Arts and Humanities">Arts and Humanities</MenuItem>
            <MenuItem value="Banking">Banking</MenuItem>
            <MenuItem value="Budget and Economy">Budget and Economy</MenuItem>
            <MenuItem value="Campaign Finance">Campaign Finance</MenuItem>
            <MenuItem value="Civil Rights/Humanities">Civil Rights/Humanities</MenuItem>
            <MenuItem value="Congress">Congress</MenuItem>
            <MenuItem value="Child Tax Credit">Child Tax Credit</MenuItem>
            <MenuItem value="Defense and Military">Defense and Military</MenuItem>
            <MenuItem value="Economy">Economy</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Energy">Energy</MenuItem>
            <MenuItem value="Climate Change">Climate Change</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
            <MenuItem value="Federal Employees">Federal Employees</MenuItem>
            <MenuItem value="Food Safety">Food Safety</MenuItem>
            <MenuItem value="Foreign Relations">Foreign Relations</MenuItem>
            <MenuItem value="Guns">Guns</MenuItem>
            <MenuItem value="Health">Health</MenuItem>
            <MenuItem value="Homeland Security">Homeland Security</MenuItem>
            <MenuItem value="Housing">Housing</MenuItem>
            <MenuItem value="Immigration">Immigration</MenuItem>
            <MenuItem value="Infrastructure">Infrastructure</MenuItem>
            <MenuItem value="International Relations">International Relations</MenuItem>
            <MenuItem value="Internal Revenue Service (IRS)">Internal Revenue Service (IRS)</MenuItem>
            <MenuItem value="Jobs">Jobs</MenuItem>
            <MenuItem value="Judiciary">Judiciary</MenuItem>
            <MenuItem value="Labor">Labor</MenuItem>
            <MenuItem value="LGBT">LGBT</MenuItem>
            <MenuItem value="Postal">Postal</MenuItem>
            <MenuItem value="Science and Technology">Science and Technology</MenuItem>
            <MenuItem value="Senior Citizens">Senior Citizens</MenuItem>
            <MenuItem value="Small Business">Small Business</MenuItem>
            <MenuItem value="Social Services">Social Services</MenuItem>
            <MenuItem value="Social Security">Social Security</MenuItem>
            <MenuItem value="Tax">Tax</MenuItem>
            <MenuItem value="Telecommunications">Telecommunications</MenuItem>
            <MenuItem value="Transportation">Transportation</MenuItem>
            <MenuItem value="Trade">Trade</MenuItem>
            <MenuItem value="Veterans">Veterans</MenuItem>
            <MenuItem value="Women's Issues">Women's Issues</MenuItem>
          </TextField>
          <TextField
              fullWidth
              required
              id="message"
              name="message"
              label="What's your message? (1,200 characters or less)"
              multiline
              rows={4}
              variant="outlined"
              inputProps={{ maxLength: 1200 }}
              value={formValues.message}
              onChange={(e) => setFormValues({...formValues, message: e.target.value})}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
            >
              SUBMIT
            </Button>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
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