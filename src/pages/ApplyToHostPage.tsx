import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';

export const ApplyToHostPage: React.FC = () => {
  const [applicationStep, setApplicationStep] = useState<'form' | 'submitted'>('form');
  const [formData, setFormData] = useState({
    address: '',
    availability: '',
    experience: '',
    motivation: ''
  });
  const { user } = usePlaceholderAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Host application submitted:', formData);
    setApplicationStep('submitted');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (applicationStep === 'submitted') {
    return (
      <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-lg">
            <i className="ph-bold ph-check-circle text-success text-6xl"></i>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-lora text-evergreen mb-md">
            Application Submitted!
          </h1>
          
          <p className="text-body mb-xl">
            Thank you for your interest in becoming a neighborhood host, {user?.name}! 
            We've received your application and will review it within 3-5 business days.
          </p>
          
          <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm mb-xl">
            <h3 className="text-2xl font-lora text-evergreen mb-md">What happens next?</h3>
            <div className="space-y-md text-left">
              <div className="flex items-start gap-3">
                <i className="ph-bold ph-number-circle-one text-harvest-gold text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold">Background Check</h4>
                  <p className="text-sm text-charcoal/80">We'll verify your identity and address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ph-bold ph-number-circle-two text-harvest-gold text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold">Phone Interview</h4>
                  <p className="text-sm text-charcoal/80">A brief call to discuss hosting expectations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ph-bold ph-number-circle-three text-harvest-gold text-2xl mt-1"></i>
                <div>
                  <h4 className="font-semibold">Approval & Setup</h4>
                  <p className="text-sm text-charcoal/80">Get access to host tools and your first group</p>
                </div>
              </div>
            </div>
          </div>
          
          <Link
            to="/dashboard"
            className="h-14 px-lg inline-flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            <i className="ph-bold ph-arrow-left mr-2"></i>
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-2xl">
          <h1 className="text-4xl md:text-5xl font-lora text-evergreen">
            Apply to Become a Host
          </h1>
          <p className="text-body mt-md">
            Help build your local food community by providing a convenient pickup location for your neighbors.
          </p>
        </div>

        <div className="bg-white rounded-xl p-lg md:p-xl border border-stone/10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div>
              <label htmlFor="address" className="block font-semibold text-charcoal mb-2">
                Pickup Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, City, State 12345"
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                required
              />
              <p className="text-sm text-charcoal/60 mt-1">
                This will be where neighbors pick up their group buy orders
              </p>
            </div>

            <div>
              <label htmlFor="availability" className="block font-semibold text-charcoal mb-2">
                Preferred Pickup Times *
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                required
              >
                <option value="">Select your preferred times</option>
                <option value="weekday-evenings">Weekday Evenings (5-8 PM)</option>
                <option value="weekend-mornings">Weekend Mornings (8-11 AM)</option>
                <option value="weekend-afternoons">Weekend Afternoons (1-5 PM)</option>
                <option value="flexible">Flexible - I can accommodate various times</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block font-semibold text-charcoal mb-2">
                Community Involvement Experience
              </label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about any community organizing, volunteer work, or neighborhood involvement you've done..."
                className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
              />
            </div>

            <div>
              <label htmlFor="motivation" className="block font-semibold text-charcoal mb-2">
                Why do you want to be a host? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={4}
                placeholder="What motivates you to help connect your neighbors with local farmers?"
                className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                required
              />
            </div>

            <div className="bg-harvest-gold/10 rounded-lg p-md">
              <h3 className="font-semibold text-evergreen mb-2 flex items-center gap-2">
                <i className="ph-bold ph-info text-harvest-gold"></i>
                Host Requirements
              </h3>
              <ul className="text-sm space-y-1 text-charcoal/80">
                <li>• Must be 18+ years old</li>
                <li>• Reliable availability for scheduled pickup windows</li>
                <li>• Safe, accessible pickup location</li>
                <li>• Pass background verification</li>
                <li>• Commit to hosting for at least 6 months</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-sm pt-md">
              <button
                type="submit"
                className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                Submit Application
              </button>
              <Link
                to="/"
                className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};