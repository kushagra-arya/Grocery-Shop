import { Link } from 'react-router-dom';
import { 
  NewspaperIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const pressReleases = [
  {
    date: 'January 15, 2025',
    title: 'GroceryShop Expands to 50 New Cities Across India',
    description: 'GroceryShop announces its expansion to 50 new tier-2 and tier-3 cities, bringing quality groceries to more households across India.',
    link: '#'
  },
  {
    date: 'December 10, 2024',
    title: 'GroceryShop Raises $100M in Series C Funding',
    description: 'The funding will be used to enhance technology infrastructure and expand cold-chain logistics network.',
    link: '#'
  },
  {
    date: 'November 5, 2024',
    title: 'GroceryShop Partners with 10,000 Local Farmers',
    description: 'New initiative to source directly from farmers, ensuring fresher produce and better prices for growers.',
    link: '#'
  },
  {
    date: 'October 20, 2024',
    title: 'GroceryShop Launches 10-Minute Delivery Service',
    description: 'Express delivery service now available in major metros, promising delivery within 10 minutes.',
    link: '#'
  },
  {
    date: 'September 1, 2024',
    title: 'GroceryShop Achieves Carbon-Neutral Deliveries',
    description: 'All deliveries in Bangalore now made using electric vehicles as part of sustainability initiative.',
    link: '#'
  }
];

const mediaKit = [
  { name: 'Brand Guidelines', size: '2.5 MB', type: 'PDF' },
  { name: 'Logo Pack', size: '5.0 MB', type: 'ZIP' },
  { name: 'Executive Photos', size: '15 MB', type: 'ZIP' },
  { name: 'Product Images', size: '25 MB', type: 'ZIP' },
  { name: 'Company Fact Sheet', size: '1.2 MB', type: 'PDF' }
];

const newsFeatures = [
  {
    outlet: 'Economic Times',
    title: '"GroceryShop is revolutionizing how India shops for groceries"',
    date: 'January 2025'
  },
  {
    outlet: 'TechCrunch',
    title: '"The startup bringing fresh produce to India\'s doorstep"',
    date: 'December 2024'
  },
  {
    outlet: 'YourStory',
    title: '"How GroceryShop built a ₹1000 Cr business in 3 years"',
    date: 'November 2024'
  },
  {
    outlet: 'Forbes India',
    title: '"30 Under 30: GroceryShop founders making waves"',
    date: 'October 2024'
  }
];

export default function Press() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <NewspaperIcon className="h-16 w-16 mx-auto mb-6 text-amazon-orange" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl text-gray-300">
            Latest news and media resources from GroceryShop
          </p>
        </div>
      </div>

      {/* Media Contact */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Media Inquiries</h2>
            <p className="text-gray-600">For press inquiries, please contact our media team</p>
          </div>
          <a 
            href="mailto:press@GroceryShop.com"
            className="bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            press@GroceryShop.com
          </a>
        </div>
      </div>

      {/* In the News */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">In the News</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {newsFeatures.map((news, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
              <span className="text-sm font-medium text-amazon-orange">{news.outlet}</span>
              <p className="text-lg font-bold text-gray-900 mt-2">{news.title}</p>
              <span className="text-sm text-gray-500">{news.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Press Releases */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  {release.date}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{release.title}</h3>
                <p className="text-gray-600 mb-4">{release.description}</p>
                <a 
                  href={release.link}
                  className="inline-flex items-center gap-2 text-amazon-orange font-medium hover:underline"
                >
                  Read More
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Media Kit */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Media Kit</h2>
        <p className="text-gray-600 mb-6">
          Download our brand assets and media resources for press coverage.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaKit.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                <span className="text-sm text-gray-500">{item.type} • {item.size}</span>
              </div>
              <button className="text-amazon-orange hover:text-amazon-orange-dark font-medium">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Company Facts */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Company at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amazon-orange">2021</div>
              <div className="text-gray-300 mt-2">Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">100+</div>
              <div className="text-gray-300 mt-2">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">5M+</div>
              <div className="text-gray-300 mt-2">Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange">10K+</div>
              <div className="text-gray-300 mt-2">Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Want to know more?</h3>
        <p className="text-gray-600 mb-4">
          Get in touch with our communications team for interviews, stories, and more.
        </p>
        <Link 
          to="/contact" 
          className="inline-block bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
