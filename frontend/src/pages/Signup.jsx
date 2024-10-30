import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import uploadImageToCloudinary from '../utils/uploadCloudinary';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import img from '../assets/images/signup.gif'; // Import the image

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: selectedFile,
    gender: 'male',
    role: 'patient',
  });

  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    if (name === 'password' || name === 'confirmPassword') {
      if (
        (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) ||
        (name === 'confirmPassword' && formData.password && value !== formData.password)
      ) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileInputChange = async (event) => {
    try {
      const file = event.target.files[0];
      const data = await uploadImageToCloudinary(file);
      setPreviewURL(data.url);
      setSelectedFile(data.url);
      setFormData({ ...formData, photo: data.url });
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();
      if (!res.ok) throw new Error(message);

      setLoading(false);
      toast.success(message);
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1100px] bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:block mr-5">
          <img src={img} alt="Signup" className="w-full h-full object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="p-8">
          <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
            Create your new <span className="text-primaryColor">Account</span>
          </h3>
          <form className="py-4" onSubmit={submitHandler}>
            <div className="mb-5">
              <input
                type="text"
                placeholder="Your Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChanges}
                className="w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor rounded-md"
                required
              />
            </div>

            <div className="mb-5">
              <input
                type="email"
                placeholder="Your Email Address"
                name="email"
                value={formData.email}
                onChange={handleInputChanges}
                className="w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor rounded-md"
                required
              />
            </div>

            <div className="mb-5">
              <input
                type="password"
                placeholder="Enter Your Password"
                name="password"
                value={formData.password}
                onChange={handleInputChanges}
                className="w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor rounded-md"
                required
              />
            </div>

            <div className="mb-5">
              <input
                type="password"
                placeholder="Confirm Your Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChanges}
                className={`w-full px-4 py-4 border-b border-solid ${
                  passwordError ? 'border-red-500' : 'border-[#0066ff60]'
                } focus:outline-none focus:border-b-primaryColor rounded-md`}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <div className="flex justify-between mb-5">
              <div>
                <label htmlFor="role">Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChanges}
                  className="ml-2"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div>
                <label htmlFor="gender">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChanges}
                  className="ml-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              {selectedFile && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-[60px] h-[60px] rounded-full"
                />
              )}
              <input
                type="file"
                onChange={handleFileInputChange}
                accept=".jpg, .png, .jpeg, .heic"
              />
            </div>

            <button
              disabled={passwordError !== '' || loading}
              type="submit"
              className="w-full bg-primaryColor text-white py-4 rounded-md"
            >
              {loading ? <HashLoader size={35} color="#ffffff" /> : 'Sign up'}
            </button>

            <p className="mt-5 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primaryColor">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
