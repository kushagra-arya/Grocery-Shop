import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const location = useLocation();
  const prefilledSubject = location.state?.subject || 'General Inquiry';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: prefilledSubject,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300">
            We're here to help! Reach out to us anytime.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amazon-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-amazon-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone</h3>
                  <p className="text-gray-600">+91 1800-123-4567 (Toll Free)</p>
                  <p className="text-gray-600">+91 98765-43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amazon-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-amazon-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-gray-600">support@groceryshop.com</p>
                  <p className="text-gray-600">orders@groceryshop.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amazon-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-amazon-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Address</h3>
                  <p className="text-gray-600">
                    GroceryShop Headquarters<br />
                    123 Commerce Street, Tech Park<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amazon-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-amazon-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Business Hours</h3>
                  <p className="text-gray-600">Monday - Saturday: 8:00 AM - 10:00 PM</p>
                  <p className="text-gray-600">Sunday: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                >
                  <option>General Inquiry</option>
                  <option>Order Issue</option>
                  <option>Delivery Problem</option>
                  <option>Product Quality</option>
                  <option>Franchise Inquiry</option>
                  <option>Partnership</option>
                  <option>Advertising</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea 
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amazon-orange focus:border-amazon-orange"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amazon-orange text-white py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="bg-amazon-navy/5 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-amazon-orange mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
          <p className="text-gray-600 mb-4">
            Check out our frequently asked questions for quick answers.
          </p>
          <Link 
            to="/help" 
            className="text-amazon-orange font-medium hover:underline"
          >
            Visit Help Center →
          </Link>
        </div>
      </div>
    </div>
  );
}
