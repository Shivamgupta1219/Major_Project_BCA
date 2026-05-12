import React from "react";
import { Linkedin, Github, Twitter, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0f172a] to-black text-gray-300 mt-32 border-t border-gray-800">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Logo & About */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Resume<span className="text-green-500">AI</span>
          </h1>

          <p className="mt-5 text-sm leading-6 text-gray-400">
            Build professional resumes instantly using AI-powered tools.
            Create modern, ATS-friendly resumes that help you stand out.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-6">
            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition duration-300"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition duration-300"
            >
              <Github size={18} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition duration-300"
            >
              <Twitter size={18} />
            </a>

            <a
              href="#"
              className="p-2 rounded-full bg-gray-800 hover:bg-green-500 transition duration-300"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-5">
            Quick Links
          </h2>

          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="hover:text-green-400 transition">
                Home
              </a>
            </li>

            <li>
              <a href="#features" className="hover:text-green-400 transition">
                Features
              </a>
            </li>

            <li>
              <a
                href="#templates"
                className="hover:text-green-400 transition"
              >
                Templates
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:text-green-400 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-5">
            Resources
          </h2>

          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="hover:text-green-400 transition">
                Resume Tips
              </a>
            </li>

            <li>
              <a href="/" className="hover:text-green-400 transition">
                Career Guide
              </a>
            </li>

            <li>
              <a href="/" className="hover:text-green-400 transition">
                Interview Prep
              </a>
            </li>

            <li>
              <a href="/" className="hover:text-green-400 transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

     
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          
          <p>
            © 2026 ResumeAI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-green-400 transition">
              Privacy Policy
            </a>

            <a href="/" className="hover:text-green-400 transition">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;