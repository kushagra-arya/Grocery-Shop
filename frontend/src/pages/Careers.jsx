import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  AcademicCapIcon,
  SparklesIcon,
  RocketLaunchIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const benefits = [
  {
    icon: HeartIcon,
    title: 'Health Insurance',
    description: 'Comprehensive medical coverage for you and your family'
  },
  {
    icon: AcademicCapIcon,
    title: 'Learning Budget',
    description: 'Annual budget for courses, certifications, and conferences'
  },
  {
    icon: SparklesIcon,
    title: 'Flexible Hours',
    description: 'Work when you\'re most productive with flexible schedules'
  },
  {
    icon: RocketLaunchIcon,
    title: 'Growth Opportunities',
    description: 'Clear career paths and mentorship programs'
  }
];

const openPositions = [
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    type: 'Full-time',
    slug: 'senior-software-engineer',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Mumbai',
    type: 'Full-time',
    slug: 'product-manager',
  },
  {
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    slug: 'ux-designer',
  },
  {
    title: 'Operations Manager',
    department: 'Operations',
    location: 'Delhi',
    type: 'Full-time',
    slug: 'operations-manager',
  },
  {
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Bangalore',
    type: 'Full-time',
    slug: 'data-analyst',
  },
  {
    title: 'Delivery Partner Manager',
    department: 'Logistics',
    location: 'Multiple Cities',
    type: 'Full-time',
    slug: 'delivery-partner-manager',
  }
];

const values = [
  {
    icon: UserGroupIcon,
    title: 'Customer First',
    description: 'Every decision starts with how it benefits our customers'
  },
  {
    icon: GlobeAltIcon,
    title: 'Think Big',
    description: 'We dream big and work together to achieve the impossible'
  },
  {
    icon: BuildingOfficeIcon,
    title: 'Ownership',
    description: 'We take ownership of our work and its impact'
  },
  {
    icon: BriefcaseIcon,
    title: 'Bias for Action',
    description: 'Speed matters. We value calculated risk-taking.'
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amazon-navy to-gray-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build the Future of Grocery Shopping
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Join our team of innovators, dreamers, and doers who are transforming 
              how India buys groceries.
            </p>
            <a 
              href="#positions" 
              className="inline-block bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
            alt="Team collaboration"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do and shape our culture.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amazon-orange/10 rounded-full mb-4">
                <value.icon className="h-8 w-8 text-amazon-orange" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-amazon-navy/5 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in taking care of our team members so they can focus on doing their best work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-xl shadow-lg">
                <benefit.icon className="h-10 w-10 text-amazon-orange mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div id="positions" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your next opportunity with us. We're always looking for talented people.
          </p>
        </div>
        <div className="space-y-4">
          {openPositions.map((position, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">{position.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span>{position.department}</span>
                  <span>•</span>
                  <span>{position.location}</span>
                  <span>•</span>
                  <span>{position.type}</span>
                </div>
              </div>
              <Link 
                to={`/careers/${position.slug}`}
                className="bg-amazon-orange text-white px-6 py-2 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors whitespace-nowrap inline-block text-center"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and 
            we'll reach out when we have an opening that matches your skills.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-white text-amazon-navy px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
