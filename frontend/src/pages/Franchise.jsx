import { Link, useNavigate } from 'react-router-dom';
import { 
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const benefits = [
  {
    icon: BuildingStorefrontIcon,
    title: 'Proven Business Model',
    description: 'Leverage our tested and successful grocery retail model with established processes.'
  },
  {
    icon: ChartBarIcon,
    title: 'Strong Unit Economics',
    description: 'Attractive margins and quick break-even with our optimized supply chain.'
  },
  {
    icon: AcademicCapIcon,
    title: 'Complete Training',
    description: 'Comprehensive training program covering operations, technology, and customer service.'
  },
  {
    icon: TruckIcon,
    title: 'Supply Chain Support',
    description: 'Access to our established vendor network and logistics infrastructure.'
  },
  {
    icon: UserGroupIcon,
    title: 'Marketing Support',
    description: 'National brand campaigns plus local marketing assistance to drive footfall.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Ongoing Support',
    description: 'Dedicated franchise support team to help you succeed at every step.'
  }
];

const models = [
  {
    name: 'FreshMart Express',
    investment: '₹25-35 Lakhs',
    area: '500-800 sq ft',
    format: 'Small format convenience store',
    ideal: 'Residential areas, high footfall locations',
    roi: '18-24 months'
  },
  {
    name: 'FreshMart Store',
    investment: '₹50-75 Lakhs',
    area: '1000-1500 sq ft',
    format: 'Full-service grocery store',
    ideal: 'Main markets, shopping complexes',
    roi: '24-30 months'
  },
  {
    name: 'FreshMart Superstore',
    investment: '₹1-1.5 Crore',
    area: '2000-3000 sq ft',
    format: 'Large format supermarket',
    ideal: 'Tier-1 cities, premium locations',
    roi: '30-36 months'
  }
];

const requirements = [
  'Entrepreneurial mindset with commitment to customer service',
  'Net worth of minimum ₹50 Lakhs (varies by format)',
  'Ability to invest time in business operations',
  'Suitable retail space in high-traffic location',
  'Clean background and willingness to follow brand standards'
];

const process = [
  { step: 1, title: 'Apply', description: 'Fill the franchise inquiry form' },
  { step: 2, title: 'Review', description: 'Our team evaluates your application' },
  { step: 3, title: 'Discussion', description: 'Detailed presentation and Q&A' },
  { step: 4, title: 'Site Visit', description: 'Evaluate proposed location' },
  { step: 5, title: 'Agreement', description: 'Sign franchise agreement' },
  { step: 6, title: 'Launch', description: 'Training, setup, and grand opening' }
];

export default function Franchise() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amazon-navy to-gray-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <span className="bg-amazon-orange text-white px-4 py-2 rounded-full text-sm font-bold">
              FRANCHISE OPPORTUNITY
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
              Own a FreshMart Store
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Be part of India's grocery revolution. Start your own FreshMart franchise 
              with our proven business model and comprehensive support system.
            </p>
            <button
              onClick={() => navigate('/contact', { state: { subject: 'Franchise Inquiry' } })}
              className="inline-flex items-center gap-2 bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
            >
              Apply for Franchise
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800"
            alt="Grocery store"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Why FreshMart */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Why FreshMart Franchise?</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Partner with India's fastest-growing grocery brand and build a successful business
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <benefit.icon className="h-12 w-12 text-amazon-orange mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Franchise Models */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Franchise Models</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose the format that fits your investment capacity and location
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {models.map((model) => (
              <div key={model.name} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-amazon-navy text-white p-6 text-center">
                  <h3 className="text-xl font-bold">{model.name}</h3>
                  <div className="text-3xl font-bold text-amazon-orange mt-2">{model.investment}</div>
                  <div className="text-sm text-gray-300">Investment</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Space Required</span>
                    <span className="font-medium">{model.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Format</span>
                    <span className="font-medium text-right">{model.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ideal For</span>
                    <span className="font-medium text-right">{model.ideal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected ROI</span>
                    <span className="font-bold text-amazon-orange">{model.roi}</span>
                  </div>
                  <button
                    onClick={() => navigate('/contact', { state: { subject: 'Franchise Inquiry' } })}
                    className="w-full bg-amazon-orange text-white py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors mt-4"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Franchisee Requirements</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">We're looking for partners who share our passion for quality and customer service:</p>
          <ul className="space-y-4">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Process */}
      <div className="bg-amazon-orange/10 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">The Journey to Ownership</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amazon-orange text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-amazon-orange/30 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amazon-orange">200+</div>
              <div className="text-gray-300 mt-2">Franchise Stores</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">50+</div>
              <div className="text-gray-300 mt-2">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">95%</div>
              <div className="text-gray-300 mt-2">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">24M</div>
              <div className="text-gray-300 mt-2">Expected ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us CTA */}
      <div id="inquiry" className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Interested? Let's Talk!</h2>
        <p className="text-gray-600 mb-8">
          Get in touch with our franchise team. We'll respond within 48 hours.
        </p>
        <button
          onClick={() => navigate('/contact', { state: { subject: 'Franchise Inquiry' } })}
          className="inline-flex items-center gap-2 bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
        >
          Contact Us
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* CTA */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Have More Questions?</h3>
          <p className="text-gray-600 mb-4">Our franchise team is happy to help.</p>
          <Link 
            to="/contact"
            className="inline-block text-amazon-orange font-bold hover:underline"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
