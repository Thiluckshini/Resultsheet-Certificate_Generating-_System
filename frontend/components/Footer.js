'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaUser, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto"> {/* Adjust padding and margin */}
      <div className="container mx-auto flex justify-center space-x-6">
        <Link href="https://github.com/Safeeya-Munawwar" target="_blank" className="hover:text-blue-400 flex items-center space-x-2">
          <FaGithub size={30} />
        </Link>
        <Link href="https://www.linkedin.com/in/safeeya-munawwar/" target="_blank" className="hover:text-blue-400 flex items-center space-x-2">
          <FaLinkedin size={30} />
        </Link>
        <Link href="https://safeeya-munawwar-personal-portfolio.vercel.app/" target="_blank" className="hover:text-blue-400 flex items-center space-x-2">
          <FaUser size={30} />
        </Link>
 <a
      href="mailto:shafiyasha0036@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 hover:text-blue-600 transition duration-300"
    >
      <FaEnvelope />
    </a>
    <a
      href="https://wa.me/94750906149"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 hover:text-green-600 transition duration-300"
    >
      <FaWhatsapp />
    </a>
     </div>
      <div className="text-center mt-4 font-roboto">
        <p className="text-lg font-bold tracking-wide">© 2025 Shafiya Munawwar</p>
        <p className="text-lg font-bold tracking-wide">All rights reserved</p>
      </div>
   </footer>
 );
 }
 
