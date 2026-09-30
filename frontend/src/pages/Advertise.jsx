import { Link, useNavigate } from 'react-router-dom';
import { 
  MegaphoneIcon,
  ChartBarIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const adFormats = [
  {
    icon: EyeIcon,
    title: 'Sponsored Products',
    description: 'Boost visibility of your products in search results and category pages.',
    features: ['Pay-per-click model', 'Keyword targeting', 'Performance tracking']
  },
  {
    icon: MegaphoneIcon,
    title: 'Banner Advertising',
    description: 'Premium banner placements on homepage and high-traffic pages.',
    features: ['Various sizes available', 'Geo-targeting', 'Time-based scheduling']
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'App Push Notifications',
    description: 'Reach customers directly with personalized push notifications.',
    features: ['Segmented audiences', 'High engagement rates', 'A/B testing']
  },
  {
    icon: CursorArrowRaysIcon,
    title: 'Email Campaigns',
    description: 'Feature in our weekly newsletters and promotional emails.',
    features: ['5M+ subscribers', 'Custom templates', 'Performance reports']
  }
];

const stats = [
  { value: '5M+', label: 'Active Users' },
  { value: '50M+', label: 'Monthly Impressions' },
  { value: '15%', label: 'Avg. CTR' },
  { value: '3x', label: 'ROAS' }
];

const targetingOptions = [
  'Demographics (age, gender, location)',
  'Purchase history and behavior',
  'Category affinity',
  'Cart value segments',
  'Time-based targeting',
  'Device type (mobile, web)',
  'New vs returning customers',
  'Geographic micro-targeting'
];

const process = [
  { step: 1, title: 'Contact Us', description: 'Share your advertising goals and budget' },
  { step: 2, title: 'Strategy', description: 'Our team creates a customized media plan' },
  { step: 3, title: 'Launch', description: 'Campaigns go live with real-time tracking' },
  { step: 4, title: 'Optimize', description: 'Continuous optimization for best results' }
];

export default function Advertise() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-amazon-navy text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <MegaphoneIcon className="h-16 w-16 text-amazon-orange mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Advertise on FreshMart
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with millions of grocery shoppers at the moment they're ready to buy. 
              Powerful targeting, measurable results.
            </p>
            <button
              onClick={() => navigate('/contact', { state: { subject: 'Advertising' } })}
              className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-amazon-orange">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Advertise */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Advertise With Us?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <UserGroupIcon className="h-8 w-8 text-amazon-orange flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">High-Intent Audience</h3>
                  <p className="text-gray-600">Reach customers who are actively shopping, not just browsing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ChartBarIcon className="h-8 w-8 text-amazon-orange flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">Data-Driven Targeting</h3>
                  <p className="text-gray-600">Leverage our rich first-party data for precise audience targeting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CursorArrowRaysIcon className="h-8 w-8 text-amazon-orange flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900">Full-Funnel Solutions</h3>
                  <p className="text-gray-600">From awareness to conversion, we have solutions for every goal.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-orange-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Targeting Options</h3>
            <ul className="space-y-2">
              {targetingOptions.map((option, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{option}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ad Formats */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Advertising Solutions</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Multiple formats to reach your audience at every touchpoint
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {adFormats.map((format) => (
              <div key={format.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <format.icon className="h-12 w-12 text-amazon-orange mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{format.title}</h3>
                <p className="text-gray-600 mb-4">{format.description}</p>
                <ul className="space-y-2">
                  {format.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {process.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-amazon-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Preview */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amazon-orange font-medium">SUCCESS STORY</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                "FreshMart advertising helped us increase sales by 300% in just 3 months"
              </h2>
              <p className="text-gray-300 mb-4">
                - Marketing Director, Leading FMCG Brand
              </p>
              <p className="text-gray-400">
                See how brands like yours are achieving exceptional results with 
                FreshMart's advertising solutions.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-amazon-orange mb-2">300%</div>
              <div className="text-xl mb-4">Sales Increase</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold">15M</div>
                  <div className="text-gray-300">Impressions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">12%</div>
                  <div className="text-gray-300">Conversion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Reach More Customers?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Our advertising team will help you create a strategy that delivers results. 
          Get in touch for a free consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/contact"
            state={{ subject: 'Advertising' }}
            className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors text-center"
          >
            Get Started
          </Link>
          <Link 
            to="/contact"
            className="border-2 border-amazon-navy text-amazon-navy px-8 py-4 rounded-lg font-bold hover:bg-amazon-navy hover:text-white transition-colors text-center"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
