import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  HeartIcon, 
  GlobeAltIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About GroceryShop</h1>
          <p className="text-xl text-gray-300">
            Bringing fresh groceries to your doorstep since 2020
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-4">
              At GroceryShop, we believe everyone deserves access to fresh, quality groceries 
              without the hassle of crowded stores or long checkout lines. Our mission is to 
              make grocery shopping convenient, affordable, and enjoyable.
            </p>
            <p className="text-gray-600 text-lg">
              We partner with local farmers and trusted suppliers to bring you the freshest 
              produce, dairy, and everyday essentials delivered right to your door.
            </p>
          </div>
          <div className="bg-amazon-orange/10 rounded-2xl p-8">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500" 
              alt="Fresh groceries" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-amazon-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                We never compromise on the quality of products we deliver to our customers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="h-8 w-8 text-amazon-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Customer Focus</h3>
              <p className="text-gray-600 text-sm">
                Your satisfaction is our priority. We're always here to help.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-amazon-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We're committed to eco-friendly packaging and reducing food waste.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-amazon-orange" />
              </div>
              <h3 className="font-bold text-lg mb-2">Local Support</h3>
              <p className="text-gray-600 text-sm">
                We partner with local farmers and businesses to support our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amazon-orange mb-2">50K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange mb-2">1000+</div>
              <div className="text-gray-300">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange mb-2">50+</div>
              <div className="text-gray-300">Cities Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amazon-orange mb-2">99%</div>
              <div className="text-gray-300">On-time Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Shop?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers who trust GroceryShop for their daily essentials.
          </p>
          <Link 
            to="/products" 
            className="inline-block bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
