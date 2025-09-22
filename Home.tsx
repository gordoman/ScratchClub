import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, CheckCircle } from 'lucide-react';

const ScratchClubWebsite = () => {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedMembership, setSelectedMembership] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    paymentType: 'monthly'
  });
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [enrollmentCount, setEnrollmentCount] = useState(1); // Starting at 1 for demo
  const [userType, setUserType] = useState(''); // 'paid' or 'reservation'

  const memberships = [
    {
      id: 'scratch1',
      name: 'Scratch 1',
      description: '10 hours per month off-peak members. Can buy more time.',
      price: 175,
      monthly: true
    },
    {
      id: 'scratch2',
      name: 'Scratch 2',
      description: '12 hours/month with 1 hour weekly of peak time. Can buy more time.',
      price: 300,
      monthly: true
    },
    {
      id: 'scratch3',
      name: 'Scratch 3',
      description: 'Priority booking, unlimited practice, 2 coaching hours per month, bring in up to 3 guests. Can buy more time.',
      price: 550,
      monthly: true
    },
    {
      id: 'scratch4',
      name: 'Scratch 4',
      description: 'Priority booking, unlimited practice, 2 PGA coaching hours per month, ability to bring up to 3 guests. Can buy more time.',
      price: 650,
      monthly: true
    },
    {
      id: 'founder',
      name: 'Founder',
      description: 'Lifetime Sim membership with up to 4 guest players on peak or non-peak hours with 2 hours max / day. Limited to 10 founder spots.',
      price: 7500,
      monthly: false,
      oneTime: true
    }
  ];

  const generateConfirmationNumber = (isReservation = false) => {
    const number = Math.floor(Math.random() * 100000);
    return isReservation ? `RES${String(number).padStart(5, '0')}` : String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  };

  const calculatePrice = (membership) => {
    if (membership.id === 'founder') return membership.price;
    
    const discount = enrollmentCount <= 50 ? 0.8 : 1; // 20% discount for first 50
    const basePrice = membership.price * discount;
    
    return formData.paymentType === 'yearly' ? basePrice * 12 * 0.9 : basePrice; // 10% discount for yearly
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnrollment = (isPaid = true) => {
    if (!selectedMembership) {
      alert('Please select a membership level.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const confirmation = generateConfirmationNumber(!isPaid);
    setConfirmationNumber(confirmation);
    setUserType(isPaid ? 'paid' : 'reservation');
    
    if (isPaid) {
      setEnrollmentCount(prev => prev + 1);
    }
    
    setCurrentPage('confirmation');
  };

  const MembershipTable = ({ showCheckboxes = false, showPayment = false }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <table className="w-full">
        <thead className="bg-green-800 text-white">
          <tr>
            {showCheckboxes && <th className="px-6 py-4">Select</th>}
            <th className="px-6 py-4 text-left">Membership Level</th>
            <th className="px-6 py-4 text-left">Description</th>
            <th className="px-6 py-4 text-left">Subscription</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership, index) => (
            <tr key={membership.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {showCheckboxes && (
                <td className="px-6 py-4 text-center">
                  <input
                    type="radio"
                    name="membership"
                    value={membership.id}
                    checked={selectedMembership === membership.id}
                    onChange={(e) => setSelectedMembership(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                </td>
              )}
              <td className="px-6 py-4 font-semibold text-green-800">{membership.name}</td>
              <td className="px-6 py-4">{membership.description}</td>
              <td className="px-6 py-4 font-semibold">
                {membership.oneTime ? (
                  `$${membership.price.toLocaleString()} - one-time enrollment for lifetime membership`
                ) : (
                  `$${membership.price}/month`
                )}
                {showPayment && selectedMembership === membership.id && (
                  <div className="mt-2 text-sm">
                    {enrollmentCount <= 50 && membership.id !== 'founder' && (
                      <div className="text-green-600 font-semibold">Early Bird Discount: 20% OFF!</div>
                    )}
                    <div className="font-bold text-lg">
                      Total: ${calculatePrice(membership).toLocaleString()}
                      {!membership.oneTime && ` ${formData.paymentType}`}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const UserForm = ({ showPayment = false, isReservation = false }) => (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h3 className="text-2xl font-bold text-green-800 mb-6">
        {isReservation ? 'Reserve Your Spot' : 'Complete Your Enrollment'}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {showPayment && (
        <div className="border-t pt-6">
          <h4 className="text-xl font-bold text-green-800 mb-4">Payment Information</h4>
          
          {selectedMembership !== 'founder' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly (10% discount)</option>
              </select>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-green-800 font-semibold">Payment Details:</p>
            <p className="text-sm text-green-600">Secure payment processing would be integrated here (Stripe, PayPal, etc.)</p>
            <div className="mt-2 p-3 bg-white rounded border-2 border-dashed border-green-300">
              <CreditCard className="inline mr-2" size={20} />
              Credit Card / PayPal Integration Placeholder
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800 text-sm">
              <strong>Refund Policy:</strong> All registrations are refundable until the company opens the location.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const MainPage = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-800 to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Scratch Club USA</h1>
            <p className="text-xl mb-8">Premium Golf Simulators & Training</p>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <p className="text-lg">Coming Soon to Howell-Brighton-Wixom Michigan Area</p>
            </div>
          </div>
        </div>
        {/* Simulated video/image placeholder */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
          Beautiful Golf Course → TrackMan IO Simulator Transition
        </div>
      </div>

      {/* Questions Section */}
      <div className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-green-50 rounded-lg p-8 mb-8 border-2 border-green-200">
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <p className="text-lg">Do you aspire to be the best golfer you can be?</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <p className="text-lg">Do you love to golf and want to year-round instead of just in the warm months?</p>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <p className="text-lg">Would you find value in a coach that helps you elevate your golf dramatically?</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-green-200">
            <p className="text-lg font-semibold text-green-800 mb-4">
              If you said yes to any of these questions, you're in the right place. Welcome to Scratch Club USA.
            </p>
            <p className="text-md mb-4">For the cost of a round of golf per week you can:</p>
            <ul className="space-y-2 text-green-700">
              <li>• Train at your pace</li>
              <li>• Grow your potential toward a scratch-level golfer</li>
              <li>• TrackMan golf simulators and training facilities with optional coaching</li>
              <li>• Coming soon to the Howell-Brighton-Wixom Michigan area</li>
              <li>• Limited to members and guests only</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-green-800 mb-6">
            To save your spot, you have two options:
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('enroll')}
              className="bg-green-800 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors border-2 border-yellow-400"
            >
              Select a membership level and enroll now with a discount!
            </button>
            <button
              onClick={() => setCurrentPage('reserve')}
              className="bg-green-800 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors border-2 border-yellow-400"
            >
              Hold my spot for later!
            </button>
          </div>
        </div>

        {/* Membership Table */}
        <MembershipTable />

        {/* Coach Image Placeholder */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="bg-green-100 h-64 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <User className="mx-auto mb-2" size={48} />
              <p className="text-green-800 font-semibold">Beautiful PGA Coach & TrackMan IO Simulator</p>
              <p className="text-sm text-green-600">Professional instruction in premium facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EnrollmentPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('main')}
            className="text-green-800 hover:text-green-600 font-semibold"
          >
            ← Back to Main Page
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Enroll with Early Bird Discount!
        </h2>

        <MembershipTable showCheckboxes={true} showPayment={true} />
        <UserForm showPayment={true} />

        <div className="text-center space-x-4">
          <button
            onClick={() => setCurrentPage('main')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => handleEnrollment(true)}
            className="bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );

  const ReservationPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('main')}
            className="text-green-800 hover:text-green-600 font-semibold"
          >
            ← Back to Main Page
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Reserve Your Spot
        </h2>

        <MembershipTable showCheckboxes={true} />
        <UserForm isReservation={true} />

        <div className="text-center space-x-4">
          <button
            onClick={() => {
              if (window.confirm('Do you wish to go back to the Main Page without saving your reservation?')) {
                setCurrentPage('main');
              }
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => handleEnrollment(false)}
            className="bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Submit My Reservation
          </button>
          <button
            onClick={() => handleEnrollment(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            Buy a Membership
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
          
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            Congratulations {formData.firstName} {formData.lastName}!
          </h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            {userType === 'paid' ? (
              <div>
                <p className="text-lg mb-4">
                  Thank you for starting your quest to become a Scratch-level golfer and golfing year-round with us.
                </p>
                <p className="text-xl font-bold text-green-800 mb-2">
                  Your confirmation number is: #{confirmationNumber}
                </p>
                <p className="text-sm text-gray-600">
                  An email has been sent to you with this information and instructions.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-4">
                  Thank you for reserving your spot for a membership at Scratch Club USA to work your way to a Scratch-level golfer.
                </p>
                <p className="text-xl font-bold text-green-800 mb-2">
                  Your reservation number is: #{confirmationNumber}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  An email has been sent to you with this information and instructions.
                </p>
                <p className="text-sm text-blue-600">
                  To reverse the reservation, please email your withdrawal request to info@scratchclubUSA.com and we'll make that happen.
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm">
              <strong>Contact Us:</strong><br />
              Email: info@scratchclubUSA.com<br />
              Phone: (801) 830-3401
            </p>
            {userType === 'paid' && (
              <p className="text-sm mt-2">
                To reverse the submission, please contact us at (801) 830-3401.
              </p>
            )}
          </div>

          <button
            onClick={() => setCurrentPage('main')}
            className="bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Continue to Main Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentPage === 'main' && <MainPage />}
      {currentPage === 'enroll' && <EnrollmentPage />}
      {currentPage === 'reserve' && <ReservationPage />}
      {currentPage === 'confirmation' && <ConfirmationPage />}
    </div>
  );
};

export default ScratchClubWebsite;