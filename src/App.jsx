import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Phone, MessageCircle, FileText, Menu, X, Truck, Send, Mail, MessageSquare } from 'lucide-react';
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
              className="font-heading text-xl md:text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white">Quick</span>
              <span className="text-orange-500">Haul</span>
              <span className="text-white">Xpress</span>
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

      {/* Truck Animation Section */}
      <section className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Breaking Through the <span className="text-orange-500">Dead Zone</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our dispatch service power through the garbage load zone to deliver you premium freight opportunities.
          </p>
        </motion.div>
        
        <TruckAnimation />
      </section>

      {/* Feature Highlights Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Why <span className="text-orange-500">QuickHaulXpress</span> Dominates
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              We don't just find loads – we engineer your success with cutting-edge technology and premium partnerships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Smart Load Matching */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Load Matching</h3>
                <p className="text-gray-300 mb-4">AI-powered algorithm matches you with high-paying loads based on your route, equipment, and preferences.</p>
                <div className="text-orange-500 font-semibold">+35% Revenue Increase</div>
              </div>
            </motion.div>

            {/* Max Rate Bookings */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Max Rate Bookings</h3>
                <p className="text-gray-300 mb-4">We negotiate the highest rates and never settle for garbage loads. Premium freight only.</p>
                <div className="text-orange-500 font-semibold">$2.50+ Per Mile Average</div>
              </div>
            </motion.div>

            {/* 24/7 Dispatch Support */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">24/7 Dispatch Support</h3>
                <p className="text-gray-300 mb-4">Round-the-clock support from experienced dispatchers who understand the trucking business.</p>
                <div className="text-orange-500 font-semibold">Always Available</div>
              </div>
            </motion.div>

            {/* Zero Dead Miles */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Zero Dead Miles</h3>
                <p className="text-gray-300 mb-4">Strategic route planning ensures you're always loaded and making money on every mile.</p>
                <div className="text-orange-500 font-semibold">95% Load Efficiency</div>
              </div>
            </motion.div>
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
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Who This Is <span className="text-orange-500">For</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              We work with serious owner-operators who are ready to level up their business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* This is for you if... */}
            <motion.div
              className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-2xl p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-white">This is for you if...</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You're tired of low-paying loads under $2.00/mile
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You want consistent, high-quality freight
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You're ready to invest in professional dispatch
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You have your own authority (MC number)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You want to focus on driving, not load hunting
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  You're serious about growing your business
                </li>
              </ul>
            </motion.div>

            {/* This is NOT for you if... */}
            <motion.div
              className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 rounded-2xl p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-2xl font-bold text-white">This is NOT for you if...</h3>
              </div>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You're happy with $1.50/mile garbage loads
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You don't have your own MC authority
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You're not willing to invest in quality dispatch
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You prefer to find loads yourself
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You're looking for free services
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  You're not committed to long-term success
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
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Freight Types We <span className="text-orange-500">Handle</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Premium rates across all equipment types. We specialize in high-value freight that pays what you deserve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚛", name: "Dry Van", rate: "$2.20-$3.50/mile", description: "Standard freight, consistent loads" },
              { icon: "❄️", name: "Reefer", rate: "$2.50-$4.00/mile", description: "Temperature-controlled cargo" },
              { icon: "🔗", name: "Power Only", rate: "$2.00-$3.20/mile", description: "Pull customer trailers" },
              { icon: "🏗️", name: "Flatbed", rate: "$2.80-$4.50/mile", description: "Construction & heavy equipment" },
              { icon: "📦", name: "LTL", rate: "$2.30-$3.80/mile", description: "Less-than-truckload shipments" },
              { icon: "🚚", name: "Box Truck", rate: "$2.10-$3.40/mile", description: "Local & regional delivery" },
              { icon: "⚡", name: "Expedited", rate: "$3.00-$5.00/mile", description: "Time-sensitive freight" },
              { icon: "🏭", name: "Specialized", rate: "$3.50-$6.00/mile", description: "Oversized & heavy haul" }
            ].map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <div className="text-orange-500 font-semibold text-lg mb-2">{service.rate}</div>
                  <p className="text-gray-400 text-sm">{service.description}</p>
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
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Real Results from <span className="text-orange-500">Real Drivers</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              See how QuickHaulXpress transformed these owner-operators' businesses and income.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Mike Rodriguez",
                location: "Dallas, TX",
                equipment: "Dry Van",
                quote: "Went from $1.80/mile to $2.65/mile average. Made an extra $45K last year!",
                avatar: "👨‍🚛",
                increase: "+47% Revenue"
              },
              {
                name: "Sarah Johnson",
                location: "Atlanta, GA",
                equipment: "Reefer",
                quote: "No more dead miles! QuickHaul keeps me loaded and profitable every week.",
                avatar: "👩‍🚛",
                increase: "+38% Efficiency"
              },
              {
                name: "Carlos Martinez",
                location: "Phoenix, AZ",
                equipment: "Flatbed",
                quote: "Best dispatch service I've used. They actually care about my success.",
                avatar: "👨‍🚛",
                increase: "+52% Income"
              },
              {
                name: "David Thompson",
                location: "Nashville, TN",
                equipment: "Power Only",
                quote: "Finally found a dispatch that gets me premium loads consistently.",
                avatar: "👨‍🚛",
                increase: "+41% Profit"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-sm">
                    {testimonial.equipment}
                  </span>
                </div>
                <blockquote className="text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-green-500 font-semibold">
                  {testimonial.increase}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-orange-500">Escape</span> Garbage Loads?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Fill out the form below and we'll get you started with premium freight immediately.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form action="https://formspree.io/f/xanjolal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">Full Name *</label>
                    <input
                      type="text"
                      name="full_name"
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
                      placeholder="(555) 123-4567"
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
                  <ZipCodeLookup />
                </div>

                {/* File Upload Section */}
                <div className="space-y-6">
                  <h3 className="text-white font-semibold text-xl">Required Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* W-9 Upload */}
                    <div className="space-y-2">
                      <label className="text-white font-semibold">Upload W-9 *</label>
                      <input
                        type="file"
                        name="w9"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Certificate of Insurance Upload */}
                    <div className="space-y-2">
                      <label className="text-white font-semibold">Certificate of Insurance *</label>
                      <input
                        type="file"
                        name="coi"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
                        required
                      />
                    </div>

                    {/* MC Authority Upload */}
                    <div className="space-y-2">
                      <label className="text-white font-semibold">MC Authority *</label>
                      <input
                        type="file"
                        name="mc_authority"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
                        required
                      />
                    </div>

                    {/* Factoring NOA or Voided Check Upload */}
                    <div className="space-y-2">
                      <label className="text-white font-semibold">Factoring NOA or Voided Check *</label>
                      <input
                        type="file"
                        name="factoring_doc"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Current Rate */}
                <div className="space-y-4">
                  <label className="text-white font-semibold text-lg">What's your current average rate per mile?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: "under_1_50", label: "Under $1.50" },
                      { value: "1_50_2_00", label: "$1.50-$2.00" },
                      { value: "2_00_2_50", label: "$2.00-$2.50" },
                      { value: "over_2_50", label: "Over $2.50" }
                    ].map((rate) => (
                      <label key={rate.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="current_rate"
                          value={rate.value}
                          className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
                          required
                        />
                        <span className="text-white">{rate.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div className="space-y-4">
                  <label className="text-white font-semibold text-lg">How soon do you need loads?</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: "immediately", label: "🚨 Immediately" },
                      { value: "this_week", label: "📅 This Week" },
                      { value: "next_week", label: "⏰ Next Week" }
                    ].map((urgency) => (
                      <label key={urgency.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={urgency.value}
                          className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 focus:ring-orange-500"
                          required
                        />
                        <span className="text-white">{urgency.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <label className="text-white font-semibold text-lg">Additional Comments</label>
                  <textarea
                    name="comments"
                    rows="4"
                    placeholder="Tell us about your preferred lanes, any special requirements, or questions you have..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full gradient-orange text-white font-bold py-4 px-8 rounded-lg hover:scale-105 transition-all duration-300 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5 mr-3 inline" />
                  Get Started with Premium Loads
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Call Us</h4>
                <p className="text-gray-300">(614) 714-6637</p>
                <p className="text-sm text-gray-400">Mon-Fri 7AM-7PM EST</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Email Us</h4>
                <p className="text-gray-300">lucas.otrdispatch@gmail.com</p>
                <p className="text-sm text-gray-400">24/7 Response</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold">Text Us</h4>
                <p className="text-gray-300">(614) 714-6637</p>
                <p className="text-sm text-gray-400">Instant Response</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Onboarding Popup */}
      <AnimatePresence>
        {showOnboardingPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-orange-500 max-w-md w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowOnboardingPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Escape Garbage Loads?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join 500+ owner-operators making $2.50+ per mile with premium freight.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      handleCallNow();
                      setShowOnboardingPopup(false);
                    }}
                    className="w-full gradient-orange"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now: (614) 714-6637
                  </Button>
                  <Button
                    onClick={() => {
                      handleTextDispatch();
                      setShowOnboardingPopup(false);
                    }}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Text Us Now
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
            className="fixed bottom-4 right-4 z-40"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCallNow}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                  title="Call Now"
                >
                  <Phone className="w-6 h-6 text-orange-500" />
                </button>
                <button
                  onClick={handleTextDispatch}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                  title="Text Us"
                >
                  <MessageCircle className="w-6 h-6 text-orange-500" />
                </button>
                <button
                  onClick={() => window.open("mailto:lucas.otrdispatch@gmail.com", "_blank")}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
                  title="Email Us"
                >
                  <Mail className="w-6 h-6 text-orange-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

