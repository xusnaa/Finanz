import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-slate-900 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">
            Finance Dashboard
          </h4>
          <p className="text-sm">Empowering you to make better financial decisions.</p>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="/docs" className="hover:underline">
                Documentation
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-lg font-semibold mb-2 text-black dark:text-white">Connect</h4>
          <div className="flex space-x-4 mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="h-5 w-5 hover:text-black dark:hover:text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="h-5 w-5 hover:text-blue-500" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="h-5 w-5 hover:text-blue-700" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} Finance Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
