import { Link } from 'react-router-dom';
import {
  ShieldExclamationIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';

export default function InterestAds() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShieldExclamationIcon className="h-16 w-16 mx-auto mb-6 text-amazon-orange" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Interest-Based Ads</h1>
          <p className="text-xl text-gray-300">
            Understanding how we personalize your advertising experience
          </p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AdjustmentsHorizontalIcon className="h-10 w-10 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">You're in Control</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your ad preferences anytime</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <InformationCircleIcon className="h-10 w-10 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Transparent</h3>
            <p className="text-sm text-gray-600 mt-1">We explain what data we use and why</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <CogIcon className="h-10 w-10 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Opt-Out Available</h3>
            <p className="text-sm text-gray-600 mt-1">Choose to opt out of personalized ads</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Interest-Based Ads?</h2>
            <p className="text-gray-600 leading-relaxed">
              Interest-based advertising (also called personalized or targeted advertising) uses 
              information collected about your browsing behavior, purchase history, and interests 
              to show you ads that are more relevant to you. Instead of showing random ads, we try 
              to show you products and offers that match your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Does It Work?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you browse GroceryShop, we may collect information about:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Products you've viewed or searched for</li>
              <li>Categories you've browsed</li>
              <li>Items you've added to your cart or wishlist</li>
              <li>Your purchase history</li>
              <li>Pages you've visited on our website</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              This information helps us show you relevant product recommendations, deals, 
              and promotional offers that align with your shopping interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Information Do We Use?</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-green-600">✓ We DO Use</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Browsing history on GroceryShop</li>
                    <li>• Purchase history</li>
                    <li>• Search queries on our platform</li>
                    <li>• Product category preferences</li>
                    <li>• General location (city level)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-red-600">✗ We DON'T Use</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Health or medical information</li>
                    <li>• Financial information</li>
                    <li>• Precise location tracking</li>
                    <li>• Third-party browsing data</li>
                    <li>• Information from children under 18</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have several options to control interest-based advertising:
            </p>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">Browser Settings</h3>
                <p className="text-sm text-gray-600">
                  Most browsers allow you to block or delete cookies. Check your browser's 
                  help section for instructions on managing cookies and tracking.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">Account Settings</h3>
                <p className="text-sm text-gray-600">
                  Visit your GroceryShop account settings to manage your communication 
                  preferences and opt out of promotional communications.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-1">Opt-Out</h3>
                <p className="text-sm text-gray-600">
                  You can opt out of interest-based ads by contacting our support team. 
                  Note that opting out doesn't mean you won't see ads — they just won't 
                  be personalized to your interests.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Advertising</h2>
            <p className="text-gray-600 leading-relaxed">
              We may work with third-party advertising partners to display ads on other websites. 
              These partners may use cookies and similar technologies to collect information about 
              your visits to our website and other sites. We do not control these third-party 
              technologies and their use is governed by those parties' privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Notice</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Interest-Based Ads notice from time to time. Any changes will be 
              posted on this page with an updated revision date. We encourage you to review this 
              page periodically.
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/privacy"
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Privacy Notice
          </Link>
          <Link
            to="/conditions"
            className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Conditions of Use
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-amazon-orange text-white rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
