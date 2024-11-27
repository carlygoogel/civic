import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Flag, ChevronDown } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Inquiry {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  needs_processing?: boolean;
  topics?: string[];
  sentiment?: number;
  relevant_bills?: string;
  needs_manual_topic_classification?: boolean;
}

const InquiryCenter = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [allInquiries, setAllInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("Emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (timeFilter) {
        const now = new Date();
        const startDate = new Date();

        switch (timeFilter) {
          case "today":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        query = query.gte("created_at", startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        setAllInquiries(data);
        setInquiries(data);
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching inquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterInquiries = () => {
    if (selectedTopics.length === 0) {
      setInquiries(allInquiries);
    } else {
      const filtered = allInquiries.filter((inquiry) =>
        // Check if any of the selected topics exist in the inquiry's topics array
        inquiry.topics?.some((topic) => selectedTopics.includes(topic))
      );
      setInquiries(filtered);
    }
  };

  // Change how we get unique topics
  const uniqueTopics = Array.from(
    new Set(allInquiries.flatMap((inquiry) => inquiry.topics || []))
  ).filter(Boolean);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchInquiries();
  }, [timeFilter]);

  useEffect(() => {
    if (allInquiries.length > 0) {
      filterInquiries();
    }
  }, [selectedTopics, allInquiries]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-2xl font-semibold text-gray-800">Inquiry Center</h1>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex-1 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-2 border border-gray-300 rounded-md text-left flex justify-between items-center bg-white"
            >
              <span>
                {selectedTopics.length === 0
                  ? "All Topics"
                  : `${selectedTopics.length} topic${
                      selectedTopics.length === 1 ? "" : "s"
                    } selected`}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {uniqueTopics.map((topic) => (
                  <div
                    key={topic}
                    className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : inquiries.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No inquiries found
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedInquiry?.id === inquiry.id ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    {formatDate(inquiry.created_at)}
                  </span>
                  <div className="flex gap-2">
                    {inquiry.needs_processing && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        Needs Processing
                      </span>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Flag className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <h3 className="font-medium text-gray-900">
                    {inquiry.subject}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedInquiry && (
          <div className="w-2/5 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Raw Inquiry Panel</h2>
                {selectedInquiry.sentiment && (
                  <span className="text-sm text-gray-500">
                    Sentiment Score +{selectedInquiry.sentiment}%
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Subject
                  </label>
                  <p className="text-gray-900">{selectedInquiry.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedInquiry.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    City
                  </label>
                  <p className="text-gray-900">{selectedInquiry.city}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900">{selectedInquiry.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedInquiry.relevant_bills && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Relevant Bills
                    </label>
                    <p className="text-gray-900">
                      {selectedInquiry.relevant_bills}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Message
                  </label>
                  <p className="text-gray-900 mt-2 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryCenter;
