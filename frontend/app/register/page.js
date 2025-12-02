// 'use client';

// import { useState, useEffect } from 'react';
// import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { useRouter } from 'next/navigation';

// export default function RegisterPage() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [role, setRole] = useState('Select Role');
//   const [institute, setInstitute] = useState('');
//   const [institutes, setInstitutes] = useState([]);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const router = useRouter();

//   // Fetch institutes on component mount
//   useEffect(() => {
//     const fetchInstitutes = async () => {
//       try {
//         const res = await fetch('http://localhost:5000/api/institutes');
//         if (!res.ok) throw new Error('Failed to fetch institutes');
//         const data = await res.json();
//         setInstitutes(data.map((inst) => inst.name)); // Set only the names of institutes
//       } catch (err) {
//         setError('Unable to load institutes. Please try again later.');
//       }
//     };

//     fetchInstitutes();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role === 'Select Role') {
//       setError('Please select a role before submitting.');
//       return;
//     }

//     const formData = {
//       username,
//       email,
//       password,
//       role,
//       institute
//     };

//     try {
//       const response = await fetch('http://localhost:5000/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // Read the error as text
//         setError(errorText || 'Registration failed. Please try again later.');
//         console.error('Error response:', errorText); // Log for debugging
//         return;
//       }

//       const data = await response.json(); // Read the JSON response here
//       setSuccessMessage('Registration successful! Redirecting to login...');
//       setTimeout(() => {
//         const loginPath = `/${role.toLowerCase().replace(' ', '')}/login`;
//         router.push(loginPath);
//       }, 2000); // Redirect after 2 seconds
//     } catch (error) {
//       console.error('Error during registration:', error);
//       setError('Registration failed. Please try again later.');
//     }
//   };

//   // Handle back to login
//   const handleBack = () => {
//     if (!role || role === 'Select Role') {
//       setError('Please select a role before going back to login.');
//       return;
//     }
//     const loginPath = `/${role.toLowerCase().replace(' ', '')}/login`; // Dynamic path
//     router.push(loginPath);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
//       <div className="w-full max-w-md p-8 bg-[#1e293b] rounded-2xl shadow-2xl">
//         <h2 className="text-3xl font-bold text-center text-white mb-6">Register</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="username" className="block text-white mb-1">Username</label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
//               placeholder="Enter username"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label htmlFor="email" className="block text-white mb-1">Email</label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
//               placeholder="Enter email"
//               required
//             />
//           </div>

//           <div className="mb-4 relative">
//             <label htmlFor="password" className="block text-white mb-1">Password</label>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white pr-10"
//               placeholder="Enter password"
//               required
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 p-4"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <EyeIcon className="w-5 h-5 text-gray-400" />
//               ) : (
//                 <EyeSlashIcon className="w-5 h-5 text-gray-400" />
//               )}
//             </button>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="role" className="block text-white mb-1">Role</label>
//             <select
//               id="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
//               required
//             >
//               <option disabled>Select Role</option>
//               <option value="institute-admin">Institute Admin</option>
//               <option value="lecturer">Lecturer</option>
//               <option value="student">Student</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="institute" className="block text-white mb-1">Institute</label>
//             <select
//               id="institute"
//               value={institute}
//               onChange={(e) => setInstitute(e.target.value)}
//               className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
//               required
//             >
//               <option value="" disabled>Select Institute</option>
//               {institutes.length > 0 ? (
//                 institutes.map((inst, index) => (
//                   <option key={index} value={inst}>{inst}</option>
//                 ))
//               ) : (
//                 <option disabled>No institutes available</option>
//               )}
//             </select>
//             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//           </div>

//           <div className="flex flex-col space-y-3 mt-6">
//             {successMessage && (
//               <p className="text-green-400 text-sm mb-4">{successMessage}</p>
//             )}
//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
//             >
//               Register
//             </button>

//             <div className="text-center mt-4">
//               <p className="text-white text-sm">
//                 Already have an account?{' '}
//                 <button
//                   className="w-full mt-4 bg-gray-600 hover:bg-gray-700 p-3 rounded font-bold text-white transition duration-300"
//                   onClick={handleBack}
//                 >
//                   Back to Login
//                 </button>
//               </p>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
