import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';


const Profile = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photo: null,
    gender: '',
    bloodType: '',
  });

  const navigate = useNavigate();
  
  // Em ko biet tai sao user is not defined mac du em da 
  useEffect(() => {
    console.log('user in useEffect:', user); 
    if (user) {
      setFormData({ 
        name: user.name, 
        email: user.email, 
        photo: user.photo, 
        gender: user.gender, 
        bloodType: user.bloodType 
      });
    }
  }, [user]);
  
  const [passwordError, setPasswordError] = useState('');

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

  const handleFileInputChange = async event => {
    const file = event.target.files[0];

    const data = await uploadImageToCloudinary(file);


    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });

    console.log(data);

  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    // Final validation before submission
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      // Co the api ko dung 
      const res = await fetch(`${BASE_URL}/user/${user._id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      console.log(formData);
      const { message } = await res.json();
      console.log(message);

      if (!res.ok) {
        throw new Error(message);
      }
      setLoading(false);
      toast.success(message);
      navigate('/users/profile/me');

    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  

  return (
    <div className='mt-10'>
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
            placeholder='New Password'
            name='bloodType'
            value={formData.password}
            onChange={handleInputChanges}
            className='pr-4 w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md'
          />
        </div>

        {/* Blood Type */}
        <div className='mb-5'>
          <input
            type="text"
            placeholder='Blood Type'
            name='confirmPassword'
            value={formData.bloodType}
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
        <div className='mb-5 flex items-center gap-3'>
          {formData.photo && (<figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center"><img
            src={formData.photo}
            alt=""
            className="w-full rounded-full" /></figure>
          )}
          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png, .jpeg, .heic"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>


        {/* Submit Button */}
        <div className='mt-7'>
          <button
            disabled={passwordError !== '' || loading}
            type='submit'
            //onSubmit={submitHandler}
            className={`w-full bg-primaryColor rounded-lg text-white text-[18px] leading-[30px] px-4 py-4  transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700 ${passwordError ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? <HashLoader size={35} color='#ffffff' /> : 'Update'}
          </button>
        </div>


      </form>Ï
    </div>
  )
}

export default Profile