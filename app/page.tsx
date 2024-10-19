import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { ArrowRight, BarChart2, Mail, MessageSquare } from 'lucide-react';
import civic_logo from '../app/images/civic_logo.png';


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={civic_logo}
            alt="Civic Logo"
            width={150}
            height={40}
            priority
          />
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition">Home</a></li>
            <li><a href="#" className="text-gray-600 hover:text-indigo-600 transition">About</a></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-center text-indigo-800 mb-6">
          Government Relations Reimagined
        </h1>
        <p className="text-xl text-center text-gray-600 max-w-2xl mb-8">
          Transforming constituent communication with cutting-edge AI technology. Streamline your workflow and enhance engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition flex items-center">
            Get Started <ArrowRight className="ml-2" size={20} />
          </button>
          <Link href="/contact" passHref>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition border border-indigo-600">
            Contact Senator
            </button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 size={40} className="text-indigo-500" />}
              title="AI-Powered Analytics"
              description="Gain insights into constituent sentiment and trending issues with our advanced analytics dashboard."
            />
            <FeatureCard
              icon={<Mail size={40} className="text-indigo-500" />}
              title="Automated Email Management"
              description="Efficiently sort and manage incoming emails with AI-assisted categorization and response generation."
            />
            <FeatureCard
              icon={<MessageSquare size={40} className="text-indigo-500" />}
              title="Improved Constituent Engagement"
              description="Foster better relationships with constituents through timely and personalized communication."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 sm:mb-0">Civic</div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-indigo-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-indigo-300 transition">Terms of Service</Link>
            <Link href="/contact" className="hover:text-indigo-300 transition">Contact Senator</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { [key: string]: any }) => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;