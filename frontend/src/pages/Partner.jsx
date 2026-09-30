import { Link, useNavigate } from 'react-router-dom';
import { 
  TruckIcon,
  BuildingOffice2Icon,
  CubeIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const partnerTypes = [
  {
    icon: TruckIcon,
    title: 'Delivery Partner',
    description: 'Join our delivery fleet and earn with flexible hours. Be your own boss while delivering happiness to customers.',
    benefits: ['Flexible working hours', 'Weekly payments', 'Incentives & bonuses', 'Insurance coverage'],
    cta: 'Join as Delivery Partner'
  },
  {
    icon: BuildingOffice2Icon,
    title: 'Warehouse Partner',
    description: 'Partner with us to provide storage space. Ideal for property owners with spare commercial space.',
    benefits: ['Steady rental income', 'Long-term contracts', 'Professional maintenance', 'Growth opportunity'],
    cta: 'Partner Your Space'
  },
  {
    icon: CubeIcon,
    title: 'Supply Partner',
    description: 'Become a supplier and provide quality products to millions of customers through our platform.',
    benefits: ['Bulk orders', 'Timely payments', 'Wide distribution', 'Marketing support'],
    cta: 'Become a Supplier'
  }
];

const deliveryStats = [
  { value: '₹25K+', label: 'Avg. Monthly Earnings' },
  { value: '10K+', label: 'Active Delivery Partners' },
  { value: '4.5★', label: 'Partner Satisfaction' },
  { value: '7 Days', label: 'Payment Cycle' }
];

const requirements = {
  delivery: [
    'Valid driving license (two-wheeler)',
    'Own vehicle (bike/scooter)',
    'Smartphone with internet',
    'Age 18-50 years',
    'Know your city well'
  ],
  warehouse: [
    'Minimum 2000 sq ft space',
    'Good road connectivity',
    'Power backup facility',
    'Valid property documents',
    'Commercial zone location'
  ],
  supply: [
    'FSSAI registration (food items)',
    'GST registration',
    'Quality certifications',
    'Consistent supply capability',
    'Competitive pricing'
  ]
};

export default function Partner() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amazon-navy to-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Partner with FreshMart</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join India's fastest-growing grocery platform. Multiple partnership 
            opportunities to grow together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#delivery" className="bg-amazon-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors">
              Delivery Partner
            </a>
            <a href="#warehouse" className="bg-white text-amazon-navy px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Warehouse Partner
            </a>
            <a href="#supply" className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-amazon-navy transition-colors">
              Supply Partner
            </a>
          </div>
        </div>
      </div>

      {/* Partner Types */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {partnerTypes.map((partner) => (
            <div key={partner.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-amazon-navy/5 p-6">
                <partner.icon className="h-12 w-12 text-amazon-orange mb-4" />
                <h3 className="text-xl font-bold text-gray-900">{partner.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{partner.description}</p>
                <ul className="space-y-2 mb-6">
                  {partner.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                  className="w-full bg-amazon-orange text-white py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
                >
                  {partner.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Partner Section */}
      <div id="delivery" className="bg-amazon-orange/10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <TruckIcon className="h-12 w-12 text-amazon-orange mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Delivery Partner</h2>
              <p className="text-gray-600 mb-6">
                Earn money on your own schedule. Deliver groceries to customers and 
                be part of India's logistics revolution. No fixed working hours - 
                you decide when and how much you work.
              </p>
              
              <h4 className="font-bold text-gray-900 mb-3">Requirements:</h4>
              <ul className="space-y-2 mb-6">
                {requirements.delivery.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
              >
                Apply Now
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {deliveryStats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-xl shadow text-center">
                  <div className="text-2xl font-bold text-amazon-orange">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Partner Section */}
      <div id="warehouse" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600"
                alt="Warehouse"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <BuildingOffice2Icon className="h-12 w-12 text-amazon-orange mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Warehouse Partnership</h2>
              <p className="text-gray-600 mb-6">
                Have commercial space in a prime location? Partner with us to set up 
                dark stores. Earn steady rental income while we handle operations.
              </p>
              
              <h4 className="font-bold text-gray-900 mb-3">Requirements:</h4>
              <ul className="space-y-2 mb-6">
                {requirements.warehouse.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
              >
                Submit Property Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Partner Section */}
      <div id="supply" className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <CubeIcon className="h-12 w-12 text-amazon-orange mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Supply Partnership</h2>
              <p className="text-gray-600 mb-6">
                Are you a manufacturer or distributor? Supply your products to our 
                network of warehouses and reach millions of customers.
              </p>
              
              <h4 className="font-bold text-gray-900 mb-3">Requirements:</h4>
              <ul className="space-y-2 mb-6">
                {requirements.supply.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/contact', { state: { subject: 'Partnership' } })}
                className="bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
              >
                Register as Supplier
              </button>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600"
                alt="Supply chain"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-gray-300 mb-8">
            Our partnership team is here to help you get started.
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-amazon-orange text-white px-8 py-4 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Contact Partnership Team
          </Link>
        </div>
      </div>
    </div>
  );
}
