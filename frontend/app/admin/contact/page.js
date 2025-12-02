'use client';

import { FaUserCheck, FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

export default function AdminProfile() {
  // Hardcoded admin data
  const admin = {
    name: "Safeeya Munawwar",
    email: "shafiyasha0036@gmail.com",
    phone: "+94750906149",
    address: "245/D2, Eladhaththa, Handessa - Kandy - Central Province - Sri Lanka",
    bio: "Passionate about building user-friendly applications and solving coding challenges, I am currently pursuing an HNDIT at ATI-Kandy with a strong focus on PHP, Python, Java, and JavaScript. I have experience developing web and mobile applications, managing databases, and mentoring ICT students.",
    bio1: "My technical expertise includes frontend technologies like React.js and Tailwind CSS, backend development with PHP, Java, Python, and C#, and database management with MySQL. I am also skilled in Git version control and frameworks like Laravel and Swing.",
    bio2: "In addition to my technical skills, I excel in communication, teamwork, problem-solving, and leadership. I continuously upskill through certifications and projects, including Microsoft Learn Student Ambassadors, SkillEcted, and Udemy courses.",
    bio3: "I am eager to collaborate on exciting projects and explore opportunities in full-stack development. Feel free to connect!",
    profilePicture: "/profile.JPG",
    socialLinks: {
      github: "https://github.com/Safeeya-Munawwar",
      linkedin: "https://www.linkedin.com/in/safeeya-munawwar/",
      email: "mailto:shafiyasha0036@gmail.com",
      whatsapp: "https://wa.me/94750906149",
    },
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminTopbar />
        <div className="ml-64 mt-16 p-6 bg-gray-100 min-h-screen text-gray-900">
          <h1 className="text-3xl font-bold mb-4">Admin Contact</h1>
          
          {/* Profile Details */}
          <div className="bg-white p-6 rounded shadow-md space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <img
                src={admin.profilePicture}
                alt="Admin Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
              />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">{admin.name}</h2>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Full Stack Developer | Web & Mobile App Developer | UI Designer | ICT Tutor</h3>
              <p className="text-gray-600">{admin.email}</p>
              <p className="text-gray-600">{admin.phone}</p>
              <p className="text-gray-600">Kandy District, Central Province, Sri Lanka</p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-600">Phone: {admin.phone}</p>
              <p className="text-gray-600">Email: {admin.email}</p>
              <p className="text-gray-600">Address: {admin.address}</p>
            </div>

            {/* Social Icons */}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">My Social Links:</h3>
              <div className="flex justify-start space-x-6 text-3xl">
                <a
                  href={admin.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 transition duration-300"
                >
                  <FaGithub />
                </a>
                <a
                  href={admin.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 transition duration-300"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={admin.socialLinks.email}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 transition duration-300"
                >
                  <FaEnvelope />
                </a>
                <a
                  href={admin.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-green-600 transition duration-300"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
            
              <Link href="/admin/editcontact">
                <button className="bg-blue-600 hover:bg-blue-500 py-2 px-6 rounded-md text-white transition duration-300 transform hover:scale-105">
                  Edit Contact Info
                </button>
              </Link>
            </div>

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
    </div>
  );
}
