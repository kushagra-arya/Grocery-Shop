import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, EyeIcon, FingerPrintIcon, ServerIcon } from '@heroicons/react/24/outline';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <LockClosedIcon className="h-16 w-16 mx-auto mb-6 text-amazon-orange" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Notice</h1>
          <p className="text-xl text-gray-300">
            Last updated: February 1, 2026
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <LockClosedIcon className="h-8 w-8 text-amazon-orange mx-auto mb-2" />
            <h3 className="font-bold text-sm">SSL Encrypted</h3>
            <p className="text-xs text-gray-500">256-bit encryption</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <ShieldCheckIcon className="h-8 w-8 text-amazon-orange mx-auto mb-2" />
            <h3 className="font-bold text-sm">PCI Compliant</h3>
            <p className="text-xs text-gray-500">Payment security</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <FingerPrintIcon className="h-8 w-8 text-amazon-orange mx-auto mb-2" />
            <h3 className="font-bold text-sm">Data Protected</h3>
            <p className="text-xs text-gray-500">DPDP Act compliant</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <ServerIcon className="h-8 w-8 text-amazon-orange mx-auto mb-2" />
            <h3 className="font-bold text-sm">Secure Storage</h3>
            <p className="text-xs text-gray-500">Indian data centers</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information to provide better services to our users. The types of 
              information we collect include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Personal Information:</strong> Name, email address, phone number, delivery addresses</li>
              <li><strong>Payment Information:</strong> Card details (tokenized), UPI IDs, bank details for refunds</li>
              <li><strong>Order Information:</strong> Purchase history, delivery preferences, return requests</li>
              <li><strong>Device Information:</strong> Browser type, IP address, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, search queries, interaction with products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Process and deliver your orders</li>
              <li>Send order confirmations and delivery updates</li>
              <li>Process payments and refunds</li>
              <li>Provide customer support</li>
              <li>Personalize your shopping experience</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Improve our services and website functionality</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li><strong>Delivery Partners:</strong> To fulfill and deliver your orders</li>
              <li><strong>Payment Processors:</strong> To process secure transactions</li>
              <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information. 
              This includes SSL encryption, secure server infrastructure, regular security audits, 
              and compliance with PCI-DSS standards for payment processing. Your password is stored 
              using bcrypt hashing and is never stored in plain text.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies & Tracking</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, 
              remember your preferences, and understand how you use our website. You can manage 
              cookie preferences through your browser settings. Essential cookies required for 
              site functionality cannot be disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Under the Digital Personal Data Protection Act (DPDP Act), 2023, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Access your personal data we hold</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (right to erasure)</li>
              <li>Withdraw consent for data processing</li>
              <li>Data portability — receive your data in a structured format</li>
              <li>Lodge a complaint with the Data Protection Board of India</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes 
              outlined in this privacy notice. Order records are retained for a minimum of 8 years 
              as required by tax regulations. You may request deletion of your account and associated 
              data at any time by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              GroceryShop does not knowingly collect personal information from children under 18. 
              If you are under 18, please use our services only with the involvement of a parent 
              or guardian. If we learn we have collected personal information from a child under 18, 
              we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Notice from time to time. We will notify you of any 
              significant changes by posting a prominent notice on our website or sending you 
              an email notification. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Notice or our data practices, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p><strong>Data Protection Officer</strong></p>
              <p>GroceryShop Headquarters</p>
              <p>123 Commerce Street, Tech Park</p>
              <p>Mumbai, Maharashtra 400001, India</p>
              <p className="mt-2">Email: <span className="text-amazon-orange">privacy@groceryshop.com</span></p>
              <p>Phone: +91 1800-123-4567</p>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Have questions about your privacy? We're here to help.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-amazon-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
