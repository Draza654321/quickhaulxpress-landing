import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Phone, MessageCircle, FileText, Menu, X, Truck, Send, Mail, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './App.css';

// ZIP Code Lookup Component
const ZipCodeLookup = ({ onLocationChange }) => {
  const [zipCode, setZipCode] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupZipCode = async (zip) => {
    if (zip.length !== 5) {
      setLocation('');
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (response.ok) {
        const data = await response.json();
        const locationString = `${data.places[0]['place name']}, ${data.places[0]['state abbreviation']}`;
        setLocation(locationString);
        onLocationChange && onLocationChange(locationString);
      } else {
        setLocation('');
        setError('Invalid ZIP code or location not found');
      }
    } catch (err) {
      setLocation('');
      setError('Unable to lookup ZIP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    lookupZipCode(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-white font-semibold text-lg">ZIP Code *</label>
      <input
        type="text"
        name="zip_code"
        value={zipCode}
        onChange={handleZipChange}
        placeholder="12345"
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
        required
      />
      {isLoading && (
        <p className="text-sm text-gray-400">Looking up location...</p>
      )}
      {location && (
        <p className="text-sm text-green-400">📍 {location}</p>
      )}
      {error && (
        <p className="text-sm text-red-400">❌ {error}</p>
      )}
    </div>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    mc_number: '',
    equipment_type: '',
    zip_code: '',
    location: '',
    current_rate: '',
    urgency: '',
    comments: ''
  });
  const [files, setFiles] = useState({
    w9: null,
    coi: null,
    mc_authority: null,
    factoring_doc: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: fileList[0] || null
    }));
  };

  const handleLocationChange = (location) => {
    setFormData(prev => ({
      ...prev,
      location: location
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add files (only if they exist)
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });

      // For development, use localhost. For production, use your deployed backend URL
      const backendUrl = process.env.NODE_ENV === 'production' 
        ? "https://lnh8imcd0q78.manus.space" 
        : 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/contact/submit`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        setSubmitMessage('Thank you! Your form has been submitted successfully. We will contact you soon.');
        // Reset form
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          mc_number: '',
          equipment_type: '',
          zip_code: '',
          location: '',
          current_rate: '',
          urgency: '',
          comments: ''
        });
        setFiles({
          w9: null,
          coi: null,
          mc_authority: null,
          factoring_doc: null
        });
        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      } else {
        setSubmitSuccess(false);
        setSubmitMessage(result.message || 'There was an error submitting your form. Please try again.');
      }
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitMessage('There was an error submitting your form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-white font-semibold text-lg">Full Name *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-white font-semibold text-lg">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(614) 714-6637"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-white font-semibold text-lg">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            required
          />
        </div>

        {/* MC Number */}
        <div className="space-y-2">
          <label className="text-white font-semibold text-lg">MC Number *</label>
          <input
            type="text"
            name="mc_number"
            value={formData.mc_number}
            onChange={handleInputChange}
            placeholder="MC123456"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            required
          />
        </div>

        {/* Equipment Type */}
        <div className="space-y-2">
          <label className="text-white font-semibold text-lg">Equipment Type *</label>
          <select
            name="equipment_type"
            value={formData.equipment_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            required
          >
            <option value="">Select your equipment</option>
            <option value="dry_van">🚛 Dry Van</option>
            <option value="reefer">❄️ Reefer</option>
            <option value="flatbed">🏗️ Flatbed</option>
            <option value="power_only">🔗 Power Only</option>
            <option value="box_truck">🚚 Box Truck</option>
            <option value="specialized">🏭 Specialized</option>
          </select>
        </div>

        {/* ZIP Code with Location Lookup */}
        <ZipCodeLookup onLocationChange={handleLocationChange} />
      </div>

      {/* Optional Documents Section */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-xl">Optional Documents</h3>
        <p className="text-gray-400 text-sm">Upload these documents to speed up the onboarding process (optional)</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload W-9 */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">Upload W-9 (Optional)</label>
            <input
              type="file"
              name="w9"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
            />
          </div>

          {/* Certificate of Insurance */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">Certificate of Insurance (Optional)</label>
            <input
              type="file"
              name="coi"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
            />
          </div>

          {/* MC Authority */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">MC Authority (Optional)</label>
            <input
              type="file"
              name="mc_authority"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
            />
          </div>

          {/* Factoring NOA or Voided Check */}
          <div className="space-y-2">
            <label className="text-white font-semibold text-lg">Factoring NOA or Voided Check (Optional)</label>
            <input
              type="file"
              name="factoring_doc"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Rate and Urgency */}
      <div className="space-y-6">
        {/* Current Rate */}
        <div className="space-y-3">
          <label className="text-white font-semibold text-lg">What's your current average rate per mile?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'under_1_50', label: 'Under $1.50' },
              { value: '1_50_2_00', label: '$1.50-$2.00' },
              { value: '2_00_2_50', label: '$2.00-$2.50' },
              { value: 'over_2_50', label: 'Over $2.50' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="current_rate"
                  value={option.value}
                  checked={formData.current_rate === option.value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
                />
                <span className="text-white text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div className="space-y-3">
          <label className="text-white font-semibold text-lg">How soon do you need loads?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'immediately', label: '🚨 Immediately' },
              { value: 'this_week', label: '📅 This Week' },
              { value: 'next_week', label: '⏰ Next Week' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={formData.urgency === option.value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
                />
                <span className="text-white text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <label className="text-white font-semibold text-lg">Additional Comments</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleInputChange}
          rows={4}
          placeholder="Tell us about your preferred lanes, any special requirements, or questions you have..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-orange text-lg py-4 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5 mr-3" />
        {isSubmitting ? 'Submitting...' : 'Get Started with Premium Loads'}
      </Button>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`p-4 rounded-lg ${submitSuccess ? 'bg-green-600/20 border border-green-500 text-green-400' : 'bg-red-600/20 border border-red-500 text-red-400'}`}>
          {submitMessage}
        </div>
      )}
    </form>
  );
};

// Truck Animation Component
const TruckAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const truckX = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const roadSignOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.3, 0]);

  return (
    <div ref={ref} className="relative h-96 overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 my-16 rounded-lg">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-700">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 transform -translate-y-1/2 opacity-60">
          <div className="flex justify-around h-full">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-yellow-400" />
            ))}
          </div>
        </div>
      </div>

      {/* Dead Zone Road Sign */}
      <motion.div
        className="absolute top-16 right-20 z-10"
        style={{ opacity: roadSignOpacity }}
      >
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg transform rotate-12 shadow-lg">
          <div className="font-bold text-lg">DEAD ZONE</div>
          <div className="text-sm">Garbage Loads Ahead</div>
        </div>
        <div className="w-2 h-16 bg-gray-600 mx-auto"></div>
      </motion.div>

      {/* Animated Truck */}
      <motion.div
        className="absolute bottom-20 z-20"
        style={{ x: truckX }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Truck SVG */}
        <svg width="120" height="60" viewBox="0 0 120 60" className="truck-svg">
          {/* Truck Body */}
          <rect x="20" y="15" width="60" height="25" fill="#ff4500" rx="3" />
          <rect x="80" y="20" width="25" height="20" fill="#ff6b35" rx="2" />
          
          {/* Truck Cab */}
          <rect x="85" y="10" width="20" height="15" fill="#ff4500" rx="2" />
          
          {/* Windows */}
          <rect x="87" y="12" width="6" height="8" fill="#87ceeb" rx="1" />
          <rect x="95" y="12" width="6" height="8" fill="#87ceeb" rx="1" />
          
          {/* Wheels */}
          <circle cx="35" cy="45" r="8" fill="#2d2d2d" />
          <circle cx="35" cy="45" r="5" fill="#666" />
          <circle cx="65" cy="45" r="8" fill="#2d2d2d" />
          <circle cx="65" cy="45" r="5" fill="#666" />
          <circle cx="95" cy="45" r="8" fill="#2d2d2d" />
          <circle cx="95" cy="45" r="5" fill="#666" />
          
          {/* Exhaust Smoke */}
          <motion.g
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <circle cx="25" cy="8" r="3" fill="#666" opacity="0.4" />
            <circle cx="22" cy="5" r="2" fill="#999" opacity="0.3" />
            <circle cx="28" cy="4" r="2.5" fill="#777" opacity="0.35" />
          </motion.g>
          
          {/* QuickHaulXpress Logo on Truck */}
          <text x="50" y="30" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">QHX</text>
        </svg>
      </motion.div>

      {/* Breaking Through Effect */}
      {isInView && (
        <motion.div
          className="absolute top-16 right-20 z-30"
          initial={{ scale: 1, rotate: 12 }}
          animate={{ scale: 0.8, rotate: 25, x: 50, y: 20 }}
          transition={{ duration: 2, delay: 1.5 }}
        >
          <div className="text-orange-500 text-4xl">💥</div>
        </motion.div>
      )}

      {/* Success Message */}
      <motion.div
        className="absolute top-8 left-8 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="font-bold">PREMIUM ZONE</div>
          <div className="text-sm">Top-Paying Loads Only</div>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Show onboarding popup after 5 seconds
    const popupTimer = setTimeout(() => {
      setShowOnboardingPopup(true);
    }, 5000);

    // Show sticky bar after 10 seconds
    const stickyTimer = setTimeout(() => {
      setShowStickyBar(true);
    }, 10000);

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(stickyTimer);
    };
  }, []);
  
  // Transform values for parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCallNow = () => {
    window.open("tel:(614)714-6637","_self");
  };

  const handleTextDispatch = () => {
    window.open("https://wa.me/16147146637?text=I%20need%20dispatch%20services", "_blank");
  };

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Sticky Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-md border-b border-orange-500/20' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="font-heading text-xl md:text-2xl font-bold flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src="/logo.png" 
                alt="QuickHaulXpress Logo" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex">
                <span className="text-white">Quick</span>
                <span className="text-orange-500">Haul</span>
                <span className="text-white">Xpress</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
              <a href="#testimonials" className="hover:text-orange-500 transition-colors">Reviews</a>
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
              <Button 
                onClick={handleCallNow}
                className="gradient-orange hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 py-4 border-t border-orange-500/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
                <a href="#testimonials" className="hover:text-orange-500 transition-colors">Reviews</a>
                <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
                <Button 
                  onClick={handleCallNow}
                  className="gradient-orange w-full"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff4500' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Main Headline */}
          <motion.h1
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Still Getting</span>
            <br />
            <span className="text-orange-500 pulse-glow">Garbage Loads?</span>
            <br />
            <span className="text-white">Never Again.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We hand-pick top-paying loads. <span className="text-orange-500 font-semibold">No dead miles.</span> <span className="text-orange-500 font-semibold">No delays.</span>
            <br />
            Join the Anti-Garbage Load Movement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleCallNow}
              size="lg"
              className="gradient-orange text-lg px-6 md:px-8 py-3 md:py-4 hover:scale-105 transition-all duration-300 pulse-glow w-full md:w-auto"
            >
              <Phone className="w-5 h-5 mr-3" />
              📞 Call Now
            </Button>

            <Button
              onClick={handleTextDispatch}
              variant="outline"
              size="lg"
              className="text-lg px-6 md:px-8 py-3 md:py-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 hover:scale-105 w-full md:w-auto"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              💬 Text Dispatch
            </Button>

            <Button
              onClick={scrollToForm}
              variant="ghost"
              size="lg"
              className="text-lg px-6 md:px-8 py-3 md:py-4 text-white hover:text-orange-500 transition-all duration-300 hover:scale-105 w-full md:w-auto"
            >
              <FileText className="w-5 h-5 mr-3" />
              ✍️ Start Form
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-gray-400 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>500+ Active Owner-Operators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>$2.50+ Average Rate Per Mile</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span>24/7 Dispatch Support</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Truck Animation */}
      <TruckAnimation />

      {/* Feature Highlights Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Why <span className="text-orange-500">QuickHaulXpress</span> Drivers Earn More
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We don't just find loads. We find the RIGHT loads that maximize your revenue and minimize your stress.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎯",
                title: "Smart Load Matching",
                description: "AI-powered system matches you with loads that fit your route, equipment, and rate requirements.",
                stat: "+47% Revenue",
                delay: 0.1
              },
              {
                icon: "💰",
                title: "Max Rate Bookings",
                description: "We negotiate the highest rates and never settle for cheap freight. Your time is valuable.",
                stat: "+38% Efficiency",
                delay: 0.2
              },
              {
                icon: "📈",
                title: "Premium Load Network",
                description: "Exclusive access to high-paying shippers who value reliable owner-operators like you.",
                stat: "+52% Income",
                delay: 0.3
              },
              {
                icon: "🚀",
                title: "24/7 Dispatch Support",
                description: "Real human dispatchers available around the clock. No bots, no delays, just results.",
                stat: "+41% Profit",
                delay: 0.4
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: feature.delay }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                <div className="text-green-400 font-bold text-lg">{feature.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Is <span className="text-orange-500">QuickHaulXpress</span> Right for You?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* This is for you */}
            <motion.div
              className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 p-8 rounded-2xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400">This IS for you if...</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  You're tired of $1.50/mile garbage loads
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  You want consistent, high-paying freight
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  You're ready to work with a professional dispatch team
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  You have your own authority (MC number)
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  You want to focus on driving, not load hunting
                </li>
              </ul>
            </motion.div>

            {/* This is NOT for you */}
            <motion.div
              className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-500/30 p-8 rounded-2xl"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">❌</div>
                <h3 className="text-2xl font-bold text-red-400">This is NOT for you if...</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  You're happy with cheap freight
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  You don't have your own MC authority
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  You prefer to find your own loads
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  You're not serious about growing your business
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3 mt-1">•</span>
                  You don't want to pay for premium service
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Offered Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">Premium Freight</span> We Handle
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We specialize in high-value freight across all equipment types. See our current rate ranges below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { type: "🚛 Dry Van", rate: "$2.20-$3.50/mi", demand: "High" },
              { type: "❄️ Reefer", rate: "$2.50-$4.00/mi", demand: "Very High" },
              { type: "🏗️ Flatbed", rate: "$2.80-$4.20/mi", demand: "High" },
              { type: "🔗 Power Only", rate: "$2.00-$3.20/mi", demand: "Medium" },
              { type: "🚚 Box Truck", rate: "$2.10-$3.00/mi", demand: "Medium" },
              { type: "🏭 Specialized", rate: "$3.00-$5.00/mi", demand: "Very High" },
              { type: "🚛 Step Deck", rate: "$2.90-$4.50/mi", demand: "High" },
              { type: "🏗️ Heavy Haul", rate: "$3.50-$6.00/mi", demand: "Very High" }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="text-2xl mb-3">{service.type}</div>
                <div className="text-green-400 font-bold text-lg mb-2">{service.rate}</div>
                <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                  service.demand === 'Very High' ? 'bg-red-600/20 text-red-400' :
                  service.demand === 'High' ? 'bg-orange-600/20 text-orange-400' :
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {service.demand} Demand
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Real Drivers, <span className="text-orange-500">Real Results</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how QuickHaulXpress has transformed the businesses of owner-operators just like you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "I went from making $3,200/week to $5,800/week in just 2 months. The difference is night and day. No more cheap freight!",
                name: "Mike Rodriguez",
                location: "Dallas, TX",
                equipment: "Dry Van",
                avatar: "👨‍🚛",
                increase: "+81% Weekly Revenue"
              },
              {
                quote: "QuickHaulXpress found me consistent $3.50+/mile reefer loads. I'm finally making the money I deserve after 15 years of trucking.",
                name: "Sarah Johnson",
                location: "Phoenix, AZ", 
                equipment: "Reefer",
                avatar: "👩‍🚛",
                increase: "+67% Rate Per Mile"
              },
              {
                quote: "Best decision I ever made. Their dispatch team treats me like family and always has my back. Premium loads every week.",
                name: "Carlos Martinez",
                location: "Miami, FL",
                equipment: "Flatbed",
                avatar: "👨‍🚛",
                increase: "+94% Monthly Profit"
              },
              {
                quote: "I was skeptical at first, but after my first month earning $22,000, I'm a believer. These guys know what they're doing.",
                name: "David Thompson",
                location: "Atlanta, GA",
                equipment: "Power Only",
                avatar: "👨‍🚛",
                increase: "+73% Income Growth"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="flex items-start mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.location}</p>
                    <p className="text-orange-500 text-sm">{testimonial.equipment}</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-green-400 font-bold text-lg">
                  {testimonial.increase}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-orange-500">Escape</span> Garbage Loads?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fill out the form below and we'll get you started with premium freight immediately.
            </p>
          </motion.div>

          <motion.div
            id="contact-form"
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-300">(614) 714-6637</p>
              <p className="text-sm text-gray-400">Mon-Fri 7AM-7PM EST</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">dispatch@quickhaulxpressllc.dpdns.org</p>
              <p className="text-sm text-gray-400">24/7 Response</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Text Us</h3>
              <p className="text-gray-300">(614) 714-6637</p>
              <p className="text-sm text-gray-400">Instant Response</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/logo.png" 
                alt="QuickHaulXpress Logo" 
                className="h-8 w-8 object-contain"
              />
              <div className="flex text-lg font-bold">
                <span className="text-white">Quick</span>
                <span className="text-orange-500">Haul</span>
                <span className="text-white">Xpress</span>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <a 
                href="https://facebook.com/quickhaulxpress" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300"
                title="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://twitter.com/quickhaulxpress" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300"
                title="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/quickhaulxpressllc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300"
                title="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://linkedin.com/company/quickhaulxpress" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-300"
                title="Connect with us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 QuickHaulXpress. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Premium dispatch services for professional owner-operators
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Popup */}
      <AnimatePresence>
        {showOnboardingPopup && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-orange-500/50 max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setShowOnboardingPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-2xl font-bold mb-4">Ready to Escape Garbage Loads?</h3>
                <p className="text-gray-300 mb-6">
                  Join 500+ owner-operators earning $2.50+ per mile with premium freight.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowOnboardingPopup(false);
                      handleCallNow();
                    }}
                    className="w-full gradient-orange"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now: (614) 714-6637
                  </Button>
                  <Button
                    onClick={() => {
                      setShowOnboardingPopup(false);
                      scrollToForm();
                    }}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Fill Out Form
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Social Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            className="fixed bottom-4 right-4 z-40 flex flex-col gap-3"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            <Button
              onClick={handleCallNow}
              className="w-14 h-14 rounded-full gradient-orange shadow-lg hover:scale-110 transition-transform"
              title="Call Now"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleTextDispatch}
              className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:scale-110 transition-transform"
              title="Text Us"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => window.open("mailto:dispatch@quickhaulxpressllc.dpdns.org", "_blank")}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:scale-110 transition-transform"
              title="Email Us"
            >
              <Mail className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

