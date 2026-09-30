import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const jobListings = {
  'senior-software-engineer': {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Bangalore, India',
    type: 'Full-time',
    experience: '5-8 years',
    salary: '₹25L - ₹45L per annum',
    posted: 'January 10, 2026',
    description: `We're looking for a Senior Software Engineer to join our engineering team and help build the next generation of GroceryShop's platform. You'll work on high-impact projects that serve millions of customers across India.`,
    responsibilities: [
      'Design and develop scalable microservices using Node.js and Python',
      'Lead technical architecture discussions and mentor junior engineers',
      'Optimize application performance and database queries for scale',
      'Implement CI/CD pipelines and ensure high code quality standards',
      'Collaborate with product and design teams to deliver user-centric features',
      'Participate in on-call rotations and incident management',
      'Write clean, testable, and well-documented code',
    ],
    requirements: [
      'B.Tech/M.Tech in Computer Science or equivalent experience',
      '5+ years of experience in backend development (Node.js, Python, or Java)',
      'Strong proficiency with databases (PostgreSQL, Redis, MongoDB)',
      'Experience with cloud services (AWS/GCP) and containerization (Docker, Kubernetes)',
      'Understanding of system design principles and distributed systems',
      'Excellent problem-solving skills and attention to detail',
      'Strong communication and teamwork abilities',
    ],
    niceToHave: [
      'Experience with e-commerce or grocery delivery platforms',
      'Knowledge of ML/data pipelines',
      'Open source contributions',
      'Experience with real-time systems (WebSockets, event-driven architecture)',
    ],
    benefits: [
      'Competitive salary with annual bonuses',
      'Health insurance for you and family',
      'Flexible work hours and remote options',
      'Learning & development budget of ₹1L/year',
      'Free GroceryShop credits every month',
      'Stock options (ESOPs)',
    ],
  },
  'product-manager': {
    title: 'Product Manager',
    department: 'Product',
    location: 'Mumbai, India',
    type: 'Full-time',
    experience: '4-7 years',
    salary: '₹22L - ₹40L per annum',
    posted: 'January 15, 2026',
    description: `Join our product team to define and drive the roadmap for GroceryShop's consumer-facing products. You'll own key product areas and work cross-functionally to deliver experiences that delight millions of shoppers.`,
    responsibilities: [
      'Define product vision and strategy aligned with business goals',
      'Gather and prioritize product requirements from stakeholders and users',
      'Create detailed product specifications and user stories',
      'Work closely with engineering, design, and data teams',
      'Analyze user behavior and metrics to drive product decisions',
      'Conduct A/B tests and measure impact of product changes',
      'Present product roadmap and updates to leadership',
    ],
    requirements: [
      'MBA or B.Tech with 4+ years product management experience',
      'Experience in consumer internet or e-commerce products',
      'Strong analytical skills with proficiency in SQL and data tools',
      'Excellent communication and stakeholder management',
      'User-centric mindset with design thinking approach',
      'Ability to balance speed with quality in fast-paced environment',
      'Track record of shipping successful products',
    ],
    niceToHave: [
      'Experience in grocery/food-tech industry',
      'Knowledge of marketplace dynamics',
      'Experience with growth and retention strategies',
      'Familiarity with mobile-first product development',
    ],
    benefits: [
      'Competitive salary with performance bonuses',
      'Health insurance coverage for family',
      'Flexible working arrangements',
      'Conference and training sponsorship',
      'Free GroceryShop credits',
      'Stock options (ESOPs)',
    ],
  },
  'ux-designer': {
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote, India',
    type: 'Full-time',
    experience: '3-6 years',
    salary: '₹18L - ₹32L per annum',
    posted: 'January 18, 2026',
    description: `Design intuitive and beautiful experiences for millions of GroceryShop users. We're looking for a talented UX Designer who can translate complex workflows into simple, delightful interfaces.`,
    responsibilities: [
      'Design end-to-end user experiences for web and mobile platforms',
      'Conduct user research, interviews, and usability testing',
      'Create wireframes, prototypes, and high-fidelity designs in Figma',
      'Develop and maintain our design system and component library',
      'Collaborate with product managers and engineers on feasibility',
      'Analyze user feedback and iterate on designs based on data',
      'Ensure accessibility standards (WCAG) are met across all designs',
    ],
    requirements: [
      'Bachelor\'s degree in Design, HCI, or related field',
      '3+ years of UX/UI design experience for digital products',
      'Strong portfolio demonstrating problem-solving through design',
      'Proficiency in Figma, Adobe Creative Suite, and prototyping tools',
      'Understanding of design systems and component-based design',
      'Knowledge of front-end development basics (HTML, CSS)',
      'Excellent visual design skills and attention to detail',
    ],
    niceToHave: [
      'Experience designing for e-commerce platforms',
      'Knowledge of motion design and micro-interactions',
      'Experience with design thinking workshops',
      'Familiarity with analytics tools (Hotjar, Mixpanel)',
    ],
    benefits: [
      'Fully remote position with flexible hours',
      'Health insurance and wellness benefits',
      'Annual design conference sponsorship',
      'Latest MacBook Pro and design tools provided',
      'Free GroceryShop credits',
      'Stock options (ESOPs)',
    ],
  },
  'operations-manager': {
    title: 'Operations Manager',
    department: 'Operations',
    location: 'Delhi, India',
    type: 'Full-time',
    experience: '5-10 years',
    salary: '₹20L - ₹35L per annum',
    posted: 'January 20, 2026',
    description: `Lead and optimize our last-mile delivery operations in the NCR region. You'll be responsible for ensuring timely deliveries, managing delivery partners, and driving operational excellence.`,
    responsibilities: [
      'Manage day-to-day delivery operations for the Delhi NCR region',
      'Optimize delivery routes and logistics to improve efficiency',
      'Recruit, train, and manage a team of delivery partners',
      'Monitor KPIs including delivery times, customer satisfaction, and costs',
      'Handle escalations and resolve operational issues promptly',
      'Implement process improvements and SOPs',
      'Coordinate with warehousing and supply chain teams',
    ],
    requirements: [
      'MBA or equivalent with 5+ years in operations management',
      'Experience in logistics, supply chain, or delivery operations',
      'Strong analytical and problem-solving abilities',
      'Excellent leadership and people management skills',
      'Proficiency in data analysis and reporting tools',
      'Ability to work in a fast-paced, high-pressure environment',
      'Knowledge of Delhi NCR geography and logistics infrastructure',
    ],
    niceToHave: [
      'Experience in food/grocery delivery operations',
      'Knowledge of fleet management systems',
      'Experience with warehouse management',
      'Background in Six Sigma or Lean operations',
    ],
    benefits: [
      'Competitive salary with quarterly performance bonuses',
      'Company vehicle or travel allowance',
      'Health insurance for family',
      'Career growth to regional leadership',
      'Free GroceryShop credits',
      'Stock options (ESOPs)',
    ],
  },
  'data-analyst': {
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Bangalore, India',
    type: 'Full-time',
    experience: '2-5 years',
    salary: '₹12L - ₹25L per annum',
    posted: 'January 22, 2026',
    description: `Join our analytics team to uncover insights that drive business decisions. You'll work with large datasets to identify trends, measure impact, and help GroceryShop grow smarter.`,
    responsibilities: [
      'Analyze large datasets to identify business trends and opportunities',
      'Build dashboards and automated reports for business stakeholders',
      'Design and analyze A/B experiments for product features',
      'Develop predictive models for demand forecasting and personalization',
      'Collaborate with product, marketing, and operations teams',
      'Maintain data quality and documentation standards',
      'Present insights and recommendations to leadership',
    ],
    requirements: [
      'Bachelor\'s degree in Statistics, Mathematics, CS, or related field',
      '2+ years of data analysis experience',
      'Strong SQL skills and experience with large databases',
      'Proficiency in Python/R for data analysis and visualization',
      'Experience with BI tools (Tableau, Metabase, or Power BI)',
      'Strong statistical knowledge and analytical thinking',
      'Excellent communication skills for presenting to non-technical audience',
    ],
    niceToHave: [
      'Experience with e-commerce analytics',
      'Knowledge of machine learning techniques',
      'Experience with cloud data platforms (BigQuery, Redshift)',
      'Understanding of web analytics (GA4, Mixpanel)',
    ],
    benefits: [
      'Competitive salary with learning opportunities',
      'Health insurance coverage',
      'Flexible work hours',
      'Conference and course sponsorship',
      'Free GroceryShop credits',
      'Stock options (ESOPs)',
    ],
  },
  'delivery-partner-manager': {
    title: 'Delivery Partner Manager',
    department: 'Logistics',
    location: 'Multiple Cities, India',
    type: 'Full-time',
    experience: '3-6 years',
    salary: '₹10L - ₹20L per annum',
    posted: 'January 25, 2026',
    description: `Manage and grow our network of delivery partners across your assigned city. You'll be the bridge between GroceryShop and our valued delivery fleet, ensuring partner satisfaction and delivery excellence.`,
    responsibilities: [
      'Recruit and onboard new delivery partners in your city',
      'Manage relationships with active delivery partners',
      'Handle partner grievances and provide timely resolutions',
      'Conduct regular training sessions on service quality and safety',
      'Monitor partner performance metrics and provide coaching',
      'Implement incentive programs to improve retention and quality',
      'Coordinate with operations team for capacity planning',
    ],
    requirements: [
      'Graduate with 3+ years in fleet/partner management',
      'Experience in gig economy or delivery logistics',
      'Strong interpersonal and conflict resolution skills',
      'Ability to communicate in local language and Hindi/English',
      'Willingness to travel within the city frequently',
      'Basic data analysis skills (Excel, Google Sheets)',
      'Valid two-wheeler driving license',
    ],
    niceToHave: [
      'Experience in food delivery or ride-hailing platforms',
      'Knowledge of local labor laws and regulations',
      'Background in HR or people operations',
      'Experience with partner engagement programs',
    ],
    benefits: [
      'Competitive salary with city-level incentives',
      'Travel and phone allowance',
      'Health insurance',
      'Performance-based growth opportunities',
      'Free GroceryShop credits',
      'Festival bonuses',
    ],
  },
};

export default function JobDetail() {
  const { jobSlug } = useParams();
  const job = jobListings[jobSlug];

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The position you're looking for doesn't exist or has been filled.</p>
          <Link
            to="/careers"
            className="inline-block bg-amazon-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors"
          >
            View All Positions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amazon-navy to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/careers"
            className="inline-flex items-center text-gray-300 hover:text-white text-sm mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Careers
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <BuildingOfficeIcon className="h-4 w-4" /> {job.department}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="h-4 w-4" /> {job.type}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" /> {job.experience}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-amazon-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to Have */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nice to Have</h2>
              <ul className="space-y-3">
                {job.niceToHave.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">✦</span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium text-gray-900">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-medium text-gray-900">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Salary</span>
                  <span className="font-medium text-amazon-orange">{job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted</span>
                  <span className="font-medium text-gray-900">{job.posted}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-amazon-orange text-white py-3 rounded-lg font-bold hover:bg-amazon-orange-dark transition-colors">
                Apply Now
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Or send your resume to <span className="text-amazon-orange">careers@groceryshop.com</span>
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits & Perks</h3>
              <ul className="space-y-3">
                {job.benefits.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Share This Job</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: job.title, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Other Positions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Other Open Positions</h2>
            <Link to="/careers" className="text-amazon-orange font-medium hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(jobListings)
              .filter(([slug]) => slug !== jobSlug)
              .slice(0, 4)
              .map(([slug, otherJob]) => (
                <Link
                  key={slug}
                  to={`/careers/${slug}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-bold text-gray-900 group-hover:text-amazon-orange transition-colors">
                    {otherJob.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>{otherJob.department}</span>
                    <span>•</span>
                    <span>{otherJob.location}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
