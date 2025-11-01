import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import heroFamily from '../assets/hero-family.jpg';
import logo from '../assets/logo.png';
import Stats from '../components/Stats';
import RoleSelection from '../components/RoleSelection';

// Global style reset using JS (removes body margin)
const removeBodyMargin = () => {
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.boxSizing = "border-box";
};

// Reusable Button component with theme support
const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200";
  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-primary text-primary hover:bg-muted",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const HomePage = () => {
  // Apply body style reset when component mounts
  useEffect(() => {
    removeBodyMargin();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section - Merged from Hero.jsx */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block m-[5px]"
              >
                <span className="px-4 py-2 bg-muted text-primary rounded-full text-sm font-semibold">
                  AI-Powered Healthcare Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl lg:text-7xl font-bold text-foreground leading-tight"
              >
                Connecting Families,{" "}
                <span className="text-primary">Simplifying Healthcare</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
              >
                Your AI-powered health companion that bridges patients, families,
                and doctors. Monitor, understand, and manage your family's health
                with confidence.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button size="lg" className="shadow-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  <Play className="mr-2 h-5 w-5" />
                  View Dashboard Demo
                </Button>
              </motion.div>

              {/* Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>End-to-End Encrypted</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Section (Image) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={heroFamily}
                  alt="Happy family using CareLink AI healthcare platform"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>

              {/* Floating Info Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">10,000+ Families</p>
                    <p className="text-sm text-muted-foreground">Trust CareLink AI</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -top-6 -right-6 bg-card p-6 rounded-2xl shadow-xl border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">AI-Powered</p>
                    <p className="text-sm text-muted-foreground">Smart Insights</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of the page content */}
      <div className="container pt-24">
        <Stats />
        <RoleSelection />
      </div>

      {/* Footer Section - Merged from Footer.jsx */}
      <footer className="pt-12 px-4">
        <div className="container mx-auto">
          {/* Top Section */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo + Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="CareLink AI Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-foreground">HealthSphare</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted AI-powered health companion for families.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#careers" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#hipaa" className="hover:text-foreground transition-colors">HIPAA Compliance</a></li>
                <li><a href="#security" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} HealthSphare. All rights reserved.
              <span className="mx-1">❤️</span> Made with love for families everywhere.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;