import { Link } from 'react-router-dom';
import { 
  GlobeAltIcon,
  TruckIcon,
  SunIcon,
  ArrowPathIcon,
  SparklesIcon,
  HeartIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const initiatives = [
  {
    icon: TruckIcon,
    title: 'Electric Delivery Fleet',
    description: 'We\'re transitioning our entire delivery fleet to electric vehicles. Currently, 60% of our deliveries are made with EVs.',
    stat: '60%',
    statLabel: 'EV Deliveries'
  },
  {
    icon: ArrowPathIcon,
    title: 'Zero Plastic Packaging',
    description: 'We\'ve eliminated single-use plastic from our packaging. All our bags are made from recycled or biodegradable materials.',
    stat: '100%',
    statLabel: 'Plastic-Free'
  },
  {
    icon: BuildingStorefrontIcon,
    title: 'Local Sourcing',
    description: 'We partner with local farmers within 100km radius, reducing transportation emissions and supporting local communities.',
    stat: '10K+',
    statLabel: 'Local Partners'
  },
  {
    icon: SunIcon,
    title: 'Solar-Powered Warehouses',
    description: 'Our warehouses and dark stores run on renewable energy, with solar panels installed across all major facilities.',
    stat: '80%',
    statLabel: 'Renewable Energy'
  }
];

const goals = [
  {
    year: '2025',
    goal: '100% electric delivery fleet in all metro cities'
  },
  {
    year: '2026',
    goal: 'Carbon neutral operations across all facilities'
  },
  {
    year: '2027',
    goal: 'Zero waste to landfill from all warehouses'
  },
  {
    year: '2030',
    goal: 'Net-zero carbon emissions across entire supply chain'
  }
];

const impact = [
  { value: '50,000', label: 'Tons of CO₂ Saved', description: 'Through EV fleet and renewable energy' },
  { value: '10M', label: 'Plastic Bags Eliminated', description: 'Replaced with eco-friendly alternatives' },
  { value: '100K', label: 'Trees Planted', description: 'Through our reforestation partnership' },
  { value: '5M', label: 'Liters of Water Saved', description: 'Through efficient cold-chain systems' }
];

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <GlobeAltIcon className="h-12 w-12 text-green-200" />
              <span className="text-green-200 font-medium">Sustainability</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Building a Greener Future, One Delivery at a Time
            </h1>
            <p className="text-xl text-green-100">
              We're committed to reducing our environmental impact while bringing 
              fresh, quality groceries to your doorstep.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
            alt="Nature and sustainability"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
      </div>

      {/* Our Commitment */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          At GroceryShop, sustainability isn't just a buzzword—it's at the core of everything we do. 
          From how we source our products to how they reach your home, we're constantly finding 
          ways to reduce our environmental footprint while maintaining the quality you expect.
        </p>
      </div>

      {/* Initiatives */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Our Initiatives</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <item.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-600">{item.stat}</span>
                      <span className="text-gray-500">{item.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Numbers */}
      <div className="bg-green-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impact.map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2">{item.value}</div>
                <div className="font-medium mb-1">{item.label}</div>
                <div className="text-sm text-green-200">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Sustainability Roadmap</h2>
        <div className="space-y-4">
          {goals.map((item, index) => (
            <div key={index} className="flex items-center gap-6 bg-white p-6 rounded-xl shadow">
              <div className="flex-shrink-0 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">{item.year}</span>
              </div>
              <p className="text-lg text-gray-700">{item.goal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How You Can Help */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <SparklesIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Choose No-Rush Delivery</h3>
              <p className="text-gray-600">
                Selecting flexible delivery options helps us optimize routes and reduce emissions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <ArrowPathIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Return Our Bags</h3>
              <p className="text-gray-600">
                Our delivery bags are reusable. Return them to our delivery partner for recycling.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <HeartIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Support Local</h3>
              <p className="text-gray-600">
                Choose locally-sourced products to reduce transportation and support farmers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Us on This Journey</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Every order you place with us is a step toward a more sustainable future. 
          Together, we can make a difference.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Shop Sustainably
        </Link>
      </div>
    </div>
  );
}
