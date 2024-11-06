// app/components/maindashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, ChevronDown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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

interface DashboardMetric {
  title: string;
  value: string | number;
  trend?: number[];
}

interface TopicCount {
  name: string;
  value: number;
}

const MainDashboard = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [sentimentData, setSentimentData] = useState<{ name: string; value: number; }[]>([]);
  const [commonTopics, setCommonTopics] = useState<{ topic: string; approval: number; }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all emails
      const { data: emailsData, error: emailsError } = await supabase
        .from('Emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (emailsError) throw emailsError;

      if (emailsData) {
        setEmails(emailsData);

        // Calculate metrics
        const totalEmails = emailsData.length;
        const answeredEmails = emailsData.filter(email => email.status === 'answered').length;
        const flaggedEmails = emailsData.filter(email => email.flagged).length;

        setMetrics([
          {
            title: 'Number of Emails',
            value: totalEmails,
         //   trend: calculateTrend(emailsData, 'total')
          },
          {
            title: 'Emails Answered',
            value: answeredEmails,
        //    trend: calculateTrend(emailsData, 'answered')
          },
          {
            title: 'Flagged Emails',
            value: flaggedEmails,
        //    trend: calculateTrend(emailsData, 'flagged')
          }
        ]);

        // Calculate sentiment breakdown
        // const sentiments = calculateSentimentBreakdown(emailsData);
        // setSentimentData(sentiments);

        // Calculate common topics
        const topics = calculateTopicBreakdown(emailsData);
        setCommonTopics(topics);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data: Email[], type: 'total' | 'answered' | 'flagged') => {
    // Get last 9 days of data for trend
    const last9Days = Array.from({ length: 9 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last9Days.map(date => {
      const dayData = data.filter(email => 
        email.created_at.startsWith(date)
      );

      // switch (type) {
      //   case 'total':
      //     return dayData.length;
      //   case 'answered':
      //     return dayData.filter(email => email.status === 'answered').length;
      //   case 'flagged':
      //     return dayData.filter(email => email.flagged).length;
      //   default:
      //     return 0;
      // }
    });
  };

  // const calculateSentimentBreakdown = (data: Email[]) => {
  //   const positive = data.filter(email => email.sentiment > 0).length;
  //   const negative = data.filter(email => email.sentiment < 0).length;
  //   const neutral = data.length - positive - negative;

  //   return [
  //     { name: 'Positive', value: positive },
  //     { name: 'Neutral', value: neutral },
  //     { name: 'Negative', value: negative }
  //   ];
  // };

  const calculateTopicBreakdown = (data: Email[]) => {
    const topicCounts: { [key: string]: number } = {};
    data.forEach(email => {
      const topic = email.subject || 'Uncategorized';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    return Object.entries(topicCounts)
      .map(([topic, count]) => ({
        topic,
        approval: Math.round((count / data.length) * 100)
      }))
      .sort((a, b) => b.approval - a.approval)
      .slice(0, 3);
  };

  const COLORS = ['#4B83E5', '#93C5FD', '#1E3A8A'];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <select className="border rounded-md p-2">
            <option>All-time</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <select className="border rounded-md p-2">
            <option>All Locations</option>
          </select>
          <select className="border rounded-md p-2">
            <option>All Topics</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-md">
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm text-gray-500 font-medium">{metric.title}</h3>
            <p className="text-2xl font-semibold mt-2">{metric.value}</p>
            {metric.trend && (
              <div className="h-12 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.trend.map((value, i) => ({ value, index: i }))}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4B83E5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 font-medium mb-4">Sentiment Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm text-gray-500 font-medium mb-4">Common Topics</h3>
          <div className="space-y-4">
            {commonTopics.map((topic, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span>{topic.topic}</span>
                  <span>{topic.approval}% of Messages</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${topic.approval}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;