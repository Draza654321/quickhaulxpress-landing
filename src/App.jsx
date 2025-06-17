import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Phone, MessageCircle, FileText, Menu, X, Truck, Send, Mail, MessageSquare } from 'lucide-react';
import './App.css';

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
    window.open('tel:+1-800-QUICKHAUL', '_self');
  };

  const handleTextDispatch = () => {
    window.open('https://wa.me/18005555555?text=I%20need%20dispatch%20services', '_blank');
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
              className="font-heading text-2xl font-bold"
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
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
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
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
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
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={handleCallNow}
              size="lg"
              className="gradient-orange text-lg px-8 py-4 hover:scale-105 transition-all duration-300 pulse-glow"
            >
              <Phone className="w-5 h-5 mr-3" />
              📞 Call Now
            </Button>

            <Button
              onClick={handleTextDispatch}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              💬 Text Dispatch
            </Button>

            <Button
              onClick={scrollToForm}
              variant="ghost"
              size="lg"
              className="text-lg px-8 py-4 text-white hover:text-orange-500 transition-all duration-300 hover:scale-105"
            >
              <FileText className="w-5 h-5 mr-3" />
              ✍️ Start Form
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 flex flex-col md:flex-row justify-center items-center gap-8 text-gray-400"
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
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Breaking Through the <span className="text-orange-500">Dead Zone</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Why <span className="text-orange-500">QuickHaulXpress</span> Dominates
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We don't just find loads – we engineer your success with cutting-edge technology and premium partnerships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Smart Load Matching */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">
                  🧠 Smart Load Matching
                </h3>
                
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
                  AI-powered algorithm matches your truck specs, preferred lanes, and rate requirements to premium loads.
                </p>
                
                <div className="flex items-center text-orange-500 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Max Rate Bookings */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4 group-hover:text-green-500 transition-colors">
                  💸 Max Rate Bookings
                </h3>
                
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
                  We negotiate the highest rates in the market. Average $2.50+ per mile with premium shippers only.
                </p>
                
                <div className="flex items-center text-green-500 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>See Rates</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Live GPS Load Planning */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">
                  📍 Live GPS Load Planning
                </h3>
                
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
                  Real-time route optimization and load planning based on your exact location and destination preferences.
                </p>
                
                <div className="flex items-center text-blue-500 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Track Now</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Paperwork Handled */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4 group-hover:text-purple-500 transition-colors">
                  📝 Paperwork? Handled.
                </h3>
                
                <p className="text-gray-300 mb-4 group-hover:text-white transition-colors">
                  Complete BOL management, rate confirmations, and invoicing. Focus on driving, we handle the rest.
                </p>
                
                <div className="flex items-center text-purple-500 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Get Started</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-300">On-Time Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-500 mb-2">$2.50+</div>
              <div className="text-gray-300">Average Rate Per Mile</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-gray-300">Dispatch Support</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Is <span className="text-orange-500">QuickHaulXpress</span> Right for You?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're selective about who we work with. Here's the truth about our ideal partners.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* This IS for you */}
            <motion.div
              className="relative bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-500/30 rounded-2xl p-8 backdrop-blur-sm"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-green-400">
                    ✅ This IS for you if...
                  </h3>
                </div>

                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You have an <strong className="text-green-400">active MC authority</strong> for 5-6+ months</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You're <strong className="text-green-400">tired of garbage loads</strong> and low-paying freight</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You want <strong className="text-green-400">premium rates</strong> ($2.50+ per mile consistently)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You value <strong className="text-green-400">professional communication</strong> and quick responses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You're ready to <strong className="text-green-400">scale your operation</strong> with the right partner</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You want <strong className="text-green-400">paperwork handled</strong> so you can focus on driving</span>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-green-300 font-semibold text-center">
                    🎯 "I'm ready to join the elite owner-operators making real money!"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* This is NOT for you */}
            <motion.div
              className="relative bg-gradient-to-br from-red-900/30 to-red-800/20 border-2 border-red-500/30 rounded-2xl p-8 backdrop-blur-sm"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-red-400">
                    ❌ This is NOT for you if...
                  </h3>
                </div>

                <ul className="space-y-4 text-gray-200">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You're <strong className="text-red-400">brand new</strong> to trucking (less than 5 months)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You're happy with <strong className="text-red-400">$1.50/mile loads</strong> from load boards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You want to <strong className="text-red-400">micromanage</strong> every load decision</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You expect <strong className="text-red-400">instant responses</strong> at 3 AM on weekends</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You're looking for <strong className="text-red-400">free dispatch services</strong></span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span>You don't have <strong className="text-red-400">proper insurance</strong> and documentation</span>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-red-300 font-semibold text-center">
                    🚫 "I'm not ready to invest in premium dispatch services."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-2xl text-gray-300 mb-8">
              Ready to join the <span className="text-orange-500 font-bold">Anti-Garbage Load Movement</span>?
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={handleCallNow}
                size="lg"
                className="gradient-orange text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-3" />
                📞 Call Now - Let's Talk
              </Button>
              <Button
                onClick={scrollToForm}
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300"
              >
                <FileText className="w-5 h-5 mr-3" />
                ✍️ Apply Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Offered Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Freight Types We <span className="text-orange-500">Dominate</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From dry van to specialized freight, we have the connections and expertise to get you premium loads across all equipment types.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Dry Van */}
            <motion.div
              className="group relative bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm1 1h12v6H6V9z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  🚛 Dry Van
                </h3>
                <p className="text-gray-300 mb-4">
                  Standard freight, retail goods, consumer products. High-volume lanes with consistent rates.
                </p>
                <div className="text-blue-400 font-semibold">
                  $2.20 - $2.80/mile
                </div>
              </div>
            </motion.div>

            {/* Reefer */}
            <motion.div
              className="group relative bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 6h18v12H3V6zm2 2v8h14V8H5zm1 1h12v6H6V9zm2 1v4h8v-4H8z"/>
                    <circle cx="10" cy="12" r="1"/>
                    <circle cx="14" cy="12" r="1"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  🧊 Reefer
                </h3>
                <p className="text-gray-300 mb-4">
                  Temperature-controlled freight, food products, pharmaceuticals. Premium rates for specialized equipment.
                </p>
                <div className="text-cyan-400 font-semibold">
                  $2.50 - $3.20/mile
                </div>
              </div>
            </motion.div>

            {/* Power Only */}
            <motion.div
              className="group relative bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12h6v6H3v-6zm8-6h6v12h-6V6zm-8-4h6v4H3V2z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  🔌 Power Only
                </h3>
                <p className="text-gray-300 mb-4">
                  Drop and hook operations, pre-loaded trailers. Quick turnaround with excellent rates.
                </p>
                <div className="text-green-400 font-semibold">
                  $2.30 - $2.90/mile
                </div>
              </div>
            </motion.div>

            {/* Hot Shot */}
            <motion.div
              className="group relative bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-500/30 rounded-2xl p-6 hover:border-red-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 12h4v8H2v-8zm6-6h4v14H8V6zm6-4h4v18h-4V2z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  🔥 Hot Shot
                </h3>
                <p className="text-gray-300 mb-4">
                  Expedited freight, time-sensitive deliveries. Premium emergency rates for urgent shipments.
                </p>
                <div className="text-red-400 font-semibold">
                  $2.80 - $4.00/mile
                </div>
              </div>
            </motion.div>

            {/* Box Truck */}
            <motion.div
              className="group relative bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6h16v12H4V6zm2 2v8h12V8H6z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  📦 Box Truck
                </h3>
                <p className="text-gray-300 mb-4">
                  Local and regional deliveries, furniture, appliances. High-frequency short-haul opportunities.
                </p>
                <div className="text-yellow-400 font-semibold">
                  $2.00 - $2.60/mile
                </div>
              </div>
            </motion.div>

            {/* Step Deck */}
            <motion.div
              className="group relative bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 14h8v4H2v-4zm10-6h8v10h-8V8zm-10-4h8v4H2V4z"/>
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  🏗️ Step Deck
                </h3>
                <p className="text-gray-300 mb-4">
                  Heavy machinery, construction equipment, oversized freight. Specialized high-value loads.
                </p>
                <div className="text-purple-400 font-semibold">
                  $2.60 - $3.50/mile
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <p className="text-xl text-gray-300 mb-8">
              Don't see your equipment type? We handle <span className="text-orange-500 font-bold">ALL freight types</span> with premium rates.
            </p>
            <Button
              onClick={handleCallNow}
              size="lg"
              className="gradient-orange text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-5 h-5 mr-3" />
              📞 Discuss Your Equipment
            </Button>
          </motion.div>
        </div>
      </section>

      <div id="testimonials" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              What Our <span className="text-orange-500">Elite Drivers</span> Say
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real testimonials from owner-operators who escaped the garbage load trap and joined the premium freight movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold text-xl">MR</span>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-white mb-1">Mike Rodriguez</h4>
                  <p className="text-orange-500 font-semibold">Dry Van • Dallas, TX</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 text-lg leading-relaxed">
                  "I was stuck running $1.80/mile loads for months. QuickHaulXpress got me on a dedicated lane at $2.65/mile within the first week. My monthly revenue jumped 40%!"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>6 months with QHX</span>
                <span className="text-green-400 font-semibold">+$3,200/month</span>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold text-xl">SJ</span>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-white mb-1">Sarah Johnson</h4>
                  <p className="text-blue-500 font-semibold">Reefer • Atlanta, GA</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 text-lg leading-relaxed">
                  "The paperwork alone was killing me. Now QHX handles everything - BOLs, rate confirmations, invoicing. I just drive and collect checks. Best decision ever!"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>8 months with QHX</span>
                <span className="text-green-400 font-semibold">+$2,800/month</span>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold text-xl">DT</span>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-white mb-1">David Thompson</h4>
                  <p className="text-green-500 font-semibold">Power Only • Phoenix, AZ</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 text-lg leading-relaxed">
                  "I was skeptical about dispatch services, but QHX proved me wrong. They found me drop-and-hook loads paying $2.85/mile. No more waiting around for hours!"
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>4 months with QHX</span>
                <span className="text-green-400 font-semibold">+$4,100/month</span>
              </div>
            </motion.div>

            {/* Testimonial 4 */}
            <motion.div
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white font-bold text-xl">LM</span>
                </div>
                <div>
                  <h4 className="font-heading text-xl font-bold text-white mb-1">Lisa Martinez</h4>
                  <p className="text-purple-500 font-semibold">Hot Shot • Houston, TX</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 text-lg leading-relaxed">
                  "Emergency loads at $3.50/mile? Yes please! QHX has connections I never knew existed. My hot shot business doubled in 3 months. These guys are the real deal."
                </blockquote>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>3 months with QHX</span>
                <span className="text-green-400 font-semibold">+$5,200/month</span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">4.9/5</div>
                <div className="text-gray-300">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">+$3,800</div>
                <div className="text-gray-300">Average Monthly Increase</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">97%</div>
                <div className="text-gray-300">Driver Retention Rate</div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-xl text-gray-300 mb-8">
                Ready to join these <span className="text-orange-500 font-bold">success stories</span>?
              </p>
              <Button
                onClick={handleCallNow}
                size="lg"
                className="gradient-orange text-lg px-8 py-4 hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-3" />
                📞 Start Your Success Story
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="contact" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="text-orange-500">Escape the Garbage Load Trap</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fill out the form below and we'll contact you within 24 hours to discuss premium freight opportunities for your operation.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 md:p-12 rounded-3xl border border-gray-700"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* MC Number */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      MC Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="MC-123456"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Truck Type */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      Equipment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    >
                      <option value="">Select your equipment type</option>
                      <option value="dry-van">🚛 Dry Van</option>
                      <option value="reefer">🧊 Reefer</option>
                      <option value="power-only">🔌 Power Only</option>
                      <option value="hot-shot">🔥 Hot Shot</option>
                      <option value="box-truck">📦 Box Truck</option>
                      <option value="step-deck">🏗️ Step Deck</option>
                      <option value="flatbed">🚚 Flatbed</option>
                      <option value="lowboy">🚛 Lowboy</option>
                      <option value="other">🔧 Other</option>
                    </select>
                  </div>

                  {/* ZIP Code */}
                  <div className="space-y-2">
                    <label className="text-white font-semibold text-lg">
                      Home Base ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12345"
                      pattern="[0-9]{5}"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Current Rate */}
                <div className="space-y-2">
                  <label className="text-white font-semibold text-lg">
                    What's your current average rate per mile?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "under-1.50", label: "Under $1.50", color: "red" },
                      { value: "1.50-2.00", label: "$1.50 - $2.00", color: "yellow" },
                      { value: "2.00-2.50", label: "$2.00 - $2.50", color: "blue" },
                      { value: "over-2.50", label: "Over $2.50", color: "green" }
                    ].map((rate) => (
                      <label key={rate.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="current-rate"
                          value={rate.value}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span className={`text-${rate.color}-400 font-medium`}>{rate.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <label className="text-white font-semibold text-lg">
                    Tell us about your operation (Optional)
                  </label>
                  <textarea
                    placeholder="How many trucks do you operate? What lanes do you prefer? Any specific requirements?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <label className="text-white font-semibold text-lg">
                    How soon do you want to start? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "immediately", label: "🚀 Immediately", desc: "Ready to start this week" },
                      { value: "within-month", label: "📅 Within a month", desc: "Planning ahead" },
                      { value: "just-exploring", label: "🔍 Just exploring", desc: "Gathering information" }
                    ].map((urgency) => (
                      <label key={urgency.value} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-600 rounded-lg hover:border-orange-500 transition-colors">
                        <input
                          type="radio"
                          name="urgency"
                          value={urgency.value}
                          className="mt-1 text-orange-500 focus:ring-orange-500"
                          required
                        />
                        <div>
                          <div className="text-white font-medium">{urgency.label}</div>
                          <div className="text-gray-400 text-sm">{urgency.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-orange text-xl py-4 hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-6 h-6 mr-3" />
                    🚀 Get My Premium Freight Quote
                  </Button>
                  
                  <p className="text-center text-gray-400 mt-4 text-sm">
                    We respect your privacy. Your information will never be shared with third parties.
                  </p>
                </div>
              </form>

              {/* Contact Info */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Call Us</h4>
                    <p className="text-gray-300">(555) 123-4567</p>
                    <p className="text-sm text-gray-400">Mon-Fri 7AM-7PM EST</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Email Us</h4>
                    <p className="text-gray-300">dispatch@quickhaulxpress.com</p>
                    <p className="text-sm text-gray-400">24/7 Response</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">Text Us</h4>
                    <p className="text-gray-300">(555) 123-4567</p>
                    <p className="text-sm text-gray-400">Quick Questions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Onboarding Popup */}
      <AnimatePresence>
        {showOnboardingPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOnboardingPopup(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-orange-500 max-w-md w-full relative"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowOnboardingPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-white mb-4">
                  🚛 Still Getting Garbage Loads?
                </h3>
                
                <p className="text-gray-300 mb-6">
                  Join 500+ owner-operators who escaped the low-paying freight trap. Get premium loads at $2.50+ per mile!
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setShowOnboardingPopup(false);
                      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full gradient-orange text-lg py-3"
                  >
                    🚀 Get Premium Loads Now
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setShowOnboardingPopup(false);
                      window.open('tel:(555)123-4567', '_self');
                    }}
                    variant="outline"
                    className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                  >
                    📞 Call Now: (555) 123-4567
                  </Button>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  ✅ No spam, just premium freight opportunities
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Social Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 shadow-2xl border border-orange-400">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => window.open('tel:(555)123-4567', '_self')}
                  className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 group"
                >
                  <Phone className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Call Now</div>
                    <div className="text-orange-100 text-xs">(555) 123-4567</div>
                  </div>
                </button>

                <button
                  onClick={() => window.open('sms:(555)123-4567', '_self')}
                  className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 group"
                >
                  <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Text Us</div>
                    <div className="text-orange-100 text-xs">Quick Response</div>
                  </div>
                </button>

                <button
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 rounded-xl p-3 transition-all duration-300 group"
                >
                  <FileText className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">Apply</div>
                    <div className="text-orange-100 text-xs">Get Quote</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowStickyBar(false)}
                  className="self-center text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
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

