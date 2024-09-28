import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added confirmPassword
    photo: null,
    gender: '',
    role: 'patient',
  });

  const [passwordError, setPasswordError] = useState(''); // State for password validation

  const handleInputChanges = (e) => {
    const { name, value } = e.target;

    // If the user is updating password or confirmPassword, perform validation
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

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, photo: file });

      // Generate a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Final validation before submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Proceed with form submission
    console.log('Form Data:', formData);

    // Example: Using FormData to handle file upload
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      console.log("okela")

      //UNCOMMENT TO PERFORM LOG IN
      /*
      const response = await fetch('/api/signup', { // Replace with your API endpoint
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        // Handle errors
        const errorData = await response.json();
        console.error('Error:', errorData);
        // Optionally, set error messages in state to display to the user
      } else {
        // Handle successful signup, e.g., redirect to login
        console.log('Signup successful!');
      }
        */
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors
    }
      
  };

  return (
    <section className='px-5 lg:px-0'>
      <div className='w-full max-w-[550px] mx-auto rounded-lg shadow-md md:p-10'>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 sm:pl-5 sm:pt-5'>
          Create your new <span className='text-primaryColor'>Account</span>
        </h3>
        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          {/* Full Name */}
          <div className='mb-5'>
            <input 
              type="text" 
              placeholder='Your Full Name' 
              name='name' 
              value={formData.name}
              onChange={handleInputChanges} // Changed from onClick to onChange
              className='pr-4 w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
              required
            />
          </div>

          {/* Email Address */}
          <div className='mb-5'>
            <input 
              type="email" 
              placeholder='Your Email Address' 
              name='email' 
              value={formData.email}
              onChange={handleInputChanges}
              className='pr-4 w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
              required
            />
          </div>

          {/* Password */}
          <div className='mb-5'>
            <input 
              type="password" 
              placeholder='Enter Your Password' 
              name='password' 
              value={formData.password}
              onChange={handleInputChanges}
              className='pr-4 w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
              required
            />
          </div>

          {/* Confirm Password */}
          <div className='mb-5'>
            <input 
              type="password" 
              placeholder='Confirm Your Password' 
              name='confirmPassword' 
              value={formData.confirmPassword}
              onChange={handleInputChanges}
              className={`pr-4 w-full px-4 py-4 border-b border-solid ${passwordError ? 'border-red-500' : 'border-[#0066ff60]'} focus:outline-none focus:border-b-primaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md`}
              required
            />
            {passwordError && (
              <p className='text-red-500 text-sm mt-1'>{passwordError}</p>
            )}
          </div>

          {/* Role and Gender Selection */}
          <div className='mb-1 flex items-center justify-between'>
            {/* Role Selection */}
            <label htmlFor="role" className='text-headingColor font-bold text-[16px] leading-7'>
              Are you a:
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChanges} 
                className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 focus:outline-none'
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>

            {/* Gender Selection */}
            <label htmlFor="gender" className='text-headingColor font-bold text-[16px] leading-7'>
              Select your Gender:
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChanges} 
                className='text-textColor font-semibold text-[15px] leading-7 px-4 focus:outline-none'
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
          </div>

          {/* File Upload */}
          <div className='mb-3 flex items-center gap-3'>
            <div className='text-headingColor font-bold leading-7'>Upload Avatar:</div>
            <input 
              type="file" 
              name="photo" 
              onChange={handleFileInputChange} 
              id='customfile' 
              accept='.jpg,.heic,.png' 
              className='top-0 left-0 w-full h-full hidden' 
            />
            <label 
              htmlFor="customfile" 
              className='top-0 left-0 w-[120px] h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer'
            >
              Upload Photo
            </label>
          </div>

          {/* Image Preview */}
          {previewURL && (
            <div className='mb-5'>
              <img src={previewURL} alt="Avatar Preview" className='w-24 h-24 object-cover rounded-full' />
            </div>
          )}

          {/* Submit Button */}
          <div className='mt-7'>
            <button 
              type='submit' 

              className={`w-full bg-primaryColor rounded-lg text-white text-[18px] leading-[30px] px-4 py-4  transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700 ${
                passwordError ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={passwordError !== ''}
            >
              Sign Up
            </button>
          </div>

          {/* Login Link */}
          <p className='mt-5 text-textColor text-center'>
            Already have an account?{' '}
            <Link to='/login' className='text-primaryColor font-medium ml-1'>Log In</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;
