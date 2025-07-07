import React from 'react';
import { InfoIcon, LeafIcon, Egg, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-50 text-green-900 py-8 px-4 border-t border-green-200">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="flex items-center text-xl font-semibold text-green-700 mb-4">
              <LeafIcon className="mr-2 h-5 w-5" /> Farm Fresh
            </h3>
            <p className="text-green-800 mb-4">
              Providing fresh vegetables, organic produce, and quality poultry products.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-green-600 hover:text-green-800 cursor-pointer" />
              <Instagram className="h-5 w-5 text-green-600 hover:text-green-800 cursor-pointer" />
              <Twitter className="h-5 w-5 text-green-600 hover:text-green-800 cursor-pointer" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-medium text-green-700 mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <LeafIcon className="h-4 w-4 mr-2 text-green-600" /> Organic Vegetables
              </li>
              <li className="flex items-center">
                <LeafIcon className="h-4 w-4 mr-2 text-green-600" /> Fresh Herbs
              </li>
              <li className="flex items-center">
                <Egg className="h-4 w-4 mr-2 text-green-600" /> Free-Range Eggs
              </li>
              <li className="flex items-center">
                <Egg className="h-4 w-4 mr-2 text-green-600" /> Organic Poultry
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium text-green-700 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-600" /> (555) 123-4567
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-600" /> info@farmfresh.com
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-600" /> 123 Farm Road, Countryside
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-green-700 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li className="text-green-800 hover:text-green-600 cursor-pointer">About Us</li>
              <li className="text-green-800 hover:text-green-600 cursor-pointer">Products</li>
              <li className="text-green-800 hover:text-green-600 cursor-pointer">Delivery Areas</li>
              <li className="text-green-800 hover:text-green-600 cursor-pointer">Farm Tours</li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-6 border-t border-green-200 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-green-700 mb-4 sm:mb-0">© 2025   Farm Fresh. All rights reserved.</p>
          <div className="flex space-x-4 text-green-700">
            <span className="hover:text-green-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-green-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-green-600 cursor-pointer">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;