"use client";

import React, { useEffect, useState } from "react";
import { Search, Send, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface EmailBatch {
  id: string;
  title: string;
  message_count: number;
  messages: EmailMessage[];
  created_at: string;
}

interface EmailMessage {
  id: string;
  subject: string;
  content: string;
  preview?: string;
  created_at: string;
}

const ActionButton: React.FC<{
    children: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
  }> = ({ children, icon, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm border border-gray-200 transition-colors mb-2"
    >
      <span>{children}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );

const ResponseCenter: React.FC = () => {
  const [batches, setBatches] = useState<EmailBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<EmailBatch | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch email batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        
        // Sample data structure while fixing Supabase connection
        const sampleBatches: EmailBatch[] = [
          {
            id: "1",
            title: "LGBTQ Curriculum in Primary Schools",
            message_count: 24,
            created_at: new Date().toISOString(),
            messages: [
              {
                id: "1",
                subject: "Concern about inclusivity in lesson plans",
                content: "I'm worried that the curriculum might not...",
                preview: "I'm worried that the curriculum might not...",
                created_at: new Date().toISOString(),
              },
              {
                id: "2",
                subject: "Support for inclusive education policies",
                content: "As a parent, I fully support adding these...",
                preview: "As a parent, I fully support adding these...",
                created_at: new Date().toISOString(),
              },
              // More messages...
            ],
          },
          {
            id: "2",
            title: "Community Input on Zoning Reforms",
            message_count: 15,
            created_at: new Date().toISOString(),
            messages: [],
          },
          {
            id: "3",
            title: "Accessibility Issues in Public Parks",
            message_count: 32,
            created_at: new Date().toISOString(),
            messages: [],
          },
          {
            id: "4",
            title: "Feedback on Local Recycling Programs",
            message_count: 10,
            created_at: new Date().toISOString(),
            messages: [],
          },
        ];

        // Attempt to fetch from Supabase
        const { data: batchData, error: batchError } = await supabase
          .from("email_batches")
          .select(`
            *,
            messages:email_messages(*)
          `)
          .order('created_at', { ascending: false });

        if (batchError) {
          console.error("Supabase Error:", batchError);
          // Fall back to sample data if there's an error
          setBatches(sampleBatches);
          setSelectedBatch(sampleBatches[0]);
        } else if (batchData && batchData.length > 0) {
          setBatches(batchData);
          setSelectedBatch(batchData[0]);
        } else {
          // Use sample data if no data is returned
          setBatches(sampleBatches);
          setSelectedBatch(sampleBatches[0]);
        }
      } catch (err) {
        console.error("Error fetching batches:", err);
        // Still show UI with sample data
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchBatches();
  }, []);

  const handleBatchSelect = (batch: EmailBatch) => {
    setSelectedBatch(batch);
    setSelectedMessage(null);
  };

  const handleMessageSelect = (message: EmailMessage) => {
    setSelectedMessage(message);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold">Email Batching</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Batches */}
        <div className="w-1/3 border-r overflow-y-auto p-6">
          {batches.map(batch => (
            <div
              key={batch.id}
              className="mb-6 bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => handleBatchSelect(batch)}
            >
              <h3 className="font-medium text-lg mb-2">{batch.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {batch.message_count} messages
              </p>
              <button
                className="flex items-center text-blue-600 text-sm"
                onClick={() => handleBatchSelect(batch)}
              >
                Reply to Batch <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Middle Column - Messages */}
        {selectedBatch && (
          <div className="w-1/3 border-r overflow-y-auto p-6">
            {selectedBatch.messages.map(message => (
              <div
                key={message.id}
                className="mb-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => handleMessageSelect(message)}
              >
                <h4 className="font-medium mb-2">{message.subject}</h4>
                <p className="text-sm text-gray-600">{message.preview}</p>
              </div>
            ))}
          </div>
        )}

        {/* Right Column - Selected Message */}
        <div className="flex-1 p-6">
          {selectedMessage ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Subject: {selectedMessage.subject}
              </h2>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Message:</h3>
                <p className="text-gray-600">{selectedMessage.content}</p>
              </div>
                <div className="space-y-2">
                    <ActionButton icon={<ChevronRight className="w-4 h-4" />}>
                    Reply
                    </ActionButton>
                    <ActionButton icon={<ChevronRight className="w-4 h-4" />}>
                    Forward
                    </ActionButton>
                    <ActionButton icon={<ChevronRight className="w-4 h-4" />}>
                    Mark as important
                    </ActionButton>
                </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a message to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponseCenter;