'use client';

import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaUserCheck } from 'react-icons/fa';
import AdminSidebar from "../../../components/LecturerSidebar";
import AdminTopbar from "../../../components/LecturerTopbar";

export default function AdminContact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Always show success on submit
    setStatus('Message sent successfully!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Admin Contact</h1>
          <div className="bg-white p-6 rounded shadow-md space-y-4">
            {/* Contact Info */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
              <p className="text-gray-600">Phone: +94750906149</p>
              <p className="text-gray-600">Email: shafiyasha0036@gmail.com</p>
              <p className="text-gray-600">Address: 245/D2, Eladhaththa, Handessa - Kandy - Central Province - Sri Lanka</p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-md"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="3"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 py-2 px-6 rounded-md text-white transition duration-300 transform hover:scale-105"
              >
                Send Message
              </button>
              {status && (
                <p className="text-sm font-medium text-green-600 mt-2">
                  ✅ {status}
                </p>
              )}
            </form>
          </div>

          {/* Footer Social Icons */}
          <footer className="bg-white py-6 border-t border-gray-200 text-center mt-8">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Me</h3>
              <div className="flex justify-center space-x-6 text-2xl mb-2">
                <a
                  href="https://github.com/Safeeya-Munawwar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-black transition duration-300"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/safeeya-munawwar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-700 transition duration-300"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="mailto:shafiyasha0036@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-red-500 transition duration-300"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://wa.me/94750906149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-green-600 transition duration-300"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://safeeya-munawwar-personal-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-green-600 transition duration-300"
                >
                  <FaUserCheck />
                </a>
              </div>
              <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Safeeya Munawwar. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
