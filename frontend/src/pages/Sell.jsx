import { Link, useNavigate } from 'react-router-dom';
import { 
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const benefits = [
  {
    icon: UserGroupIcon,
    title: 'Reach Millions',
    description: 'Access our growing customer base of 5M+ active shoppers across 100+ cities.'
  },
  {
    icon: CurrencyRupeeIcon,
    title: 'Low Commission',
    description: 'Competitive commission rates starting at just 5% to maximize your profits.'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into sales, inventory, and customer behavior.'
  },
  {
    icon: TruckIcon,
    title: 'Logistics Support',
    description: 'Optional fulfillment services - we handle storage, packing, and delivery.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description: 'Weekly settlements directly to your bank account with full transparency.'
  },
  {
    icon: BuildingStorefrontIcon,
    title: 'Brand Visibility',
    description: 'Feature in promotions and get exposure through our marketing channels.'
  }
];

const steps = [
  { step: 1, title: 'Register', description: 'Sign up with your business details and documents' },
  { step: 2, title: 'List Products', description: 'Add your products with photos, descriptions, and pricing' },
  { step: 3, title: 'Go Live', description: 'Once approved, your products are live for millions to see' },
  { step: 4, title: 'Start Selling', description: 'Receive orders and grow your business with FreshMart' }
];

const requirements = [
  'Valid GST registration',
  'PAN card and bank account details',
  'FSSAI license (for food products)',
  'Product catalog with images',
  'Ability to fulfill orders within 24-48 hours'
];

export default function Sell() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amazon-navy to-gray-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sell on FreshMart
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of sellers and reach millions of customers. 
                Start selling your products on India's fastest-growing grocery platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                  className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
                >
                  Start Selling Now
                </button>
                <button
                  onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-amazon-navy transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
                alt="Seller success"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amazon-orange">50K+</div>
            <div className="text-gray-600">Active Sellers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amazon-orange">5M+</div>
            <div className="text-gray-600">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amazon-orange">100+</div>
            <div className="text-gray-600">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amazon-orange">5%</div>
            <div className="text-gray-600">Starting Commission</div>
          </div>
        </div>
      </div>

      {/* Why Sell */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Why Sell on FreshMart?</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We provide everything you need to grow your business online
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

      {/* How It Works */}
      <div className="bg-amazon-navy/5 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-amazon-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Requirements</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-600 mb-6">To become a seller on FreshMart, you'll need:</p>
          <ul className="space-y-4">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amazon-orange py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow Your Business?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join FreshMart today and start reaching millions of customers. Our team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
              className="bg-white text-amazon-orange px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Register as Seller
            </button>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-amazon-orange transition-colors"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
