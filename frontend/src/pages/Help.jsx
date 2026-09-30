import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CreditCardIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const faqs = [
  {
    category: 'Orders & Delivery',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay using various methods including UPI, cards, or cash on delivery.'
      },
      {
        q: 'What are the delivery timings?',
        a: 'We deliver from 8 AM to 10 PM. You can select your preferred delivery slot during checkout. Express delivery (within 2 hours) is available in select areas.'
      },
      {
        q: 'Is there a minimum order value?',
        a: 'The minimum order value is ₹200. Orders above ₹500 qualify for free delivery.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is confirmed, you can track it in real-time from the "My Orders" section in your account.'
      },
      {
        q: 'What if I\'m not available during delivery?',
        a: 'Our delivery partner will call you before arriving. You can also provide alternative contact details or leave instructions during checkout.'
      }
    ]
  },
  {
    category: 'Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery.'
      },
      {
        q: 'Is it safe to save my card details?',
        a: 'Yes, we use industry-standard encryption and are PCI-DSS compliant. Your card details are tokenized and stored securely.'
      },
      {
        q: 'Can I pay cash on delivery?',
        a: 'Yes, Cash on Delivery (COD) is available for orders up to ₹5,000. Please keep exact change ready.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns for damaged or incorrect items within 24 hours of delivery. Perishable items must be reported immediately upon delivery.'
      },
      {
        q: 'How do I return an item?',
        a: 'Go to "My Orders", select the item you want to return, and choose the reason. Our team will arrange a pickup or you can drop it at a nearby hub.'
      },
      {
        q: 'How long does it take to get a refund?',
        a: 'Refunds are processed within 3-5 business days after we receive the returned item. The amount will be credited to your original payment method.'
      }
    ]
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click on "Sign In" and then "Create Account". You can register with your email or phone number.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Forgot Password" on the login page and enter your registered email. You\'ll receive a link to reset your password.'
      },
      {
        q: 'Can I have multiple delivery addresses?',
        a: 'Yes, you can save multiple addresses in your account and choose the appropriate one during checkout.'
      }
    ]
  }
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-300 mb-8">
            Find answers to your questions
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-amazon-orange"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <TruckIcon className="h-8 w-8 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold">Track Order</h3>
            <p className="text-sm text-gray-600">Check delivery status</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <ArrowPathIcon className="h-8 w-8 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold">Returns</h3>
            <p className="text-sm text-gray-600">Easy return process</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <CreditCardIcon className="h-8 w-8 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold">Payments</h3>
            <p className="text-sm text-gray-600">Payment methods</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <ShieldCheckIcon className="h-8 w-8 text-amazon-orange mx-auto mb-3" />
            <h3 className="font-bold">Security</h3>
            <p className="text-sm text-gray-600">Account safety</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFaqs.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-bold text-amazon-navy mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.questions.map((item) => {
                    const key = `${category.category}-${item.q}`;
                    return (
                      <div key={key} className="bg-white rounded-lg shadow">
                        <button
                          onClick={() => toggleQuestion(key)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{item.q}</span>
                          {openIndex === key ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {openIndex === key && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="bg-amazon-navy/5 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is available 24/7 to assist you.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
