import React from "react";
import logo from "../assets/logo.png"; // ✅ adjust path if needed

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo + Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="CareLink AI Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold">HealthSphare</span>
            </div>
            <p className="text-gray-400">
              Your trusted AI-powered health companion for families.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#hipaa" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} HealthSphare. All rights reserved.
            <span className="mx-1">❤️</span> Made with love for families everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
