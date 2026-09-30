import { Link } from 'react-router-dom';
import { ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Conditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-amazon-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <DocumentTextIcon className="h-16 w-16 mx-auto mb-6 text-amazon-orange" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conditions of Use</h1>
          <p className="text-xl text-gray-300">
            Last updated: February 1, 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Welcome to GroceryShop</h2>
            <p className="text-gray-600 leading-relaxed">
              GroceryShop provides its services to you subject to the conditions listed on this page. 
              By visiting or shopping at GroceryShop, you agree to these conditions. Please read them carefully. 
              We offer a wide range of GroceryShop Services, and sometimes additional terms may apply. 
              When you use a GroceryShop Service, you also will be subject to the guidelines, terms, 
              and agreements applicable to that service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Please review our <Link to="/privacy" className="text-amazon-orange hover:underline font-medium">Privacy Notice</Link>, 
              which also governs your visit to GroceryShop, to understand our practices regarding 
              the collection and use of your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Electronic Communications</h2>
            <p className="text-gray-600 leading-relaxed">
              When you visit GroceryShop or send emails to us, you are communicating with us electronically. 
              You consent to receive communications from us electronically. We will communicate with you by 
              email or by posting notices on this site. You agree that all agreements, notices, disclosures, 
              and other communications that we provide to you electronically satisfy any legal requirement 
              that such communications be in writing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Account</h2>
            <p className="text-gray-600 leading-relaxed">
              If you use this site, you are responsible for maintaining the confidentiality of your account 
              and password and for restricting access to your computer. You agree to accept responsibility 
              for all activities that occur under your account or password. GroceryShop reserves the right 
              to refuse service, terminate accounts, remove or edit content at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Product Information & Pricing</h2>
            <p className="text-gray-600 leading-relaxed">
              We attempt to be as accurate as possible with product descriptions, images, and pricing. 
              However, we do not warrant that product descriptions, images, pricing, or other content is 
              accurate, complete, reliable, current, or error-free. If a product offered by GroceryShop 
              is listed at an incorrect price, we reserve the right to refuse or cancel orders placed 
              for the product at the incorrect price.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Orders & Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              All orders are subject to availability and confirmation of the order price. We accept 
              various payment methods including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. 
              Prices for products are described on our website and are incorporated into these Terms. 
              All prices include applicable taxes unless otherwise stated. Delivery charges may apply 
              based on order value and delivery location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns & Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Please review our <Link to="/returns" className="text-amazon-orange hover:underline font-medium">Returns Policy</Link> for 
              details on returning products purchased from GroceryShop. Refunds will be processed 
              within 3-7 business days depending on your payment method after the returned item 
              has been received and inspected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content included on this site, such as text, graphics, logos, button icons, images, 
              audio clips, digital downloads, and data compilations is the property of GroceryShop 
              or its content suppliers and protected by Indian and international copyright laws. 
              The compilation of all content on this site is the exclusive property of GroceryShop.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              GroceryShop will not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses, resulting from your access to or use of or inability to 
              access or use the services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These conditions of use are governed by and construed in accordance with the laws of India, 
              and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Conditions of Use, please{' '}
              <Link to="/contact" className="text-amazon-orange hover:underline font-medium">contact us</Link>.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <ShieldCheckIcon className="h-5 w-5" />
            <span>Your rights are protected under Consumer Protection Act, 2019</span>
          </div>
        </div>
      </div>
    </div>
  );
}
