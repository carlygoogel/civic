'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Container,
  LinearProgress,
  Alert 
} from '@mui/material';
import Image from 'next/image';
import civic_logo from '/app/images/civic_logo.png';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Email {
  id: string;
  subject: string;
  message: string;
  name: string;
  city: string;
  phone: string;
  address: string;
  created_at: string;
}

interface TopicCount {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MainDashboard = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [topicCounts, setTopicCounts] = useState<TopicCount[]>([]);
  const [totalEmails, setTotalEmails] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<string>('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
  
      // Debug log
      console.log('Fetching emails...');
  
      // Fetch data ordered by created_at in descending order
      const { data, error } = await supabase
        .from('Emails')
        .select('*')
        .order('created_at', { ascending: false }); // This will show most recent first
  
      // Debug log
      console.log('Raw response:', { data, error });
  
      // Store raw data for debugging
      setRawData(JSON.stringify(data, null, 2));
  
      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        return;
      }
  
      if (data) {
        // Format the timestamps for display
        const formattedData = data.map(email => ({
          ...email,
          created_at: new Date(email.created_at).toLocaleString() // Format the timestamp
        }));
  
        console.log('Setting emails data:', formattedData);
        setEmails(formattedData);
        setTotalEmails(formattedData.length);
        calculateTopicBreakdown(formattedData);
      }
    } catch (error) {
      console.error('Error in fetchEmails:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
 

  const calculateTopicBreakdown = (emailData: Email[]) => {
    const topics: { [key: string]: number } = {};
    
    emailData.forEach(email => {
      const subject = email.subject || 'Uncategorized';
      topics[subject] = (topics[subject] || 0) + 1;
    });

    const topicArray = Object.entries(topics)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    setTopicCounts(topicArray);
  };

  // Debug section at the top of the dashboard
  const DebugSection = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Debug Information</Typography>
        <Typography variant="body2">Supabase URL exists: {supabaseUrl ? 'Yes' : 'No'}</Typography>
        <Typography variant="body2">Supabase Key exists: {supabaseAnonKey ? 'Yes' : 'No'}</Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Raw Data:</Typography>
        <Box sx={{ 
          maxHeight: '200px', 
          overflow: 'auto', 
          bgcolor: '#f5f5f5',
          p: 2,
          borderRadius: 1
        }}>
          <pre>{rawData || 'No data fetched yet'}</pre>
        </Box>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
        <DebugSection />
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, bgcolor: 'white' }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Image
              src={civic_logo}
              alt="Civic Logo"
              width={100}
              height={40}
              priority
            />
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Messages
                  </Typography>
                  <Typography variant="h3">
                    {totalEmails}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Messages This Week
                  </Typography>
                  <Typography variant="h3">
                    {emails.filter(email => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(email.created_at) > weekAgo;
                    }).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Topics Breakdown Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Topics Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart width={400} height={400}>
                      <Pie
                        data={topicCounts}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {topicCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Submissions */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Recent Submissions
                  </Typography>
                  <Box sx={{ 
                    maxHeight: 600, 
                    overflow: 'auto',
                    '& > div': { mb: 2 }
                  }}>
                    {emails.map((email) => (
                      <Card key={email.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {email.subject || 'No Subject'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(email.created_at).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1
                          }}>
                            {email.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                              From: {email.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {email.city}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default MainDashboard;