import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config.js';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/HashLoader.js';
import img from '../assets/images/signup.gif'; // Import the image

const Login = () => {
  const [formData, SetFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const handleInputChanges = (e) => {
    SetFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: result.data.role,
        },
      });

      setLoading(false);
      toast.success(result.message);
      navigate('/home');
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[1100px] bg-white shadow-md rounded-lg overflow-hidden mt-[-40px]">
        {/* Left Side Image */}
        <div className="hidden md:block mr-5">
          <img src={img} alt="Login" className="w-full h-full object-cover" />
        </div>

        {/* Right Side Form */}
        <div className="p-8">
          <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
            Welcome <span className="text-primaryColor">Back 🥳</span>
          </h3>

          <form className="py-4" onSubmit={submitHandler}>
            <div className="mb-5">
              <input
                type="email"
                placeholder="Enter Your Email"
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

            {/* Error Message */}
            {errorMessage && <p className="text-red-500 text-sm mb-3">{errorMessage}</p>}

            {/* Success Message */}
            {successMessage && <p className="text-green-500 text-sm mb-3">{successMessage}</p>}

            <div className="mt-7">
              <button
                type="submit"
                className="w-full bg-primaryColor text-white py-4 rounded-md transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700"
              >
                {loading ? <HashLoader size={25} color="#ffffff" /> : 'Login'}
              </button>
            </div>

            <p className="mt-5 text-textColor text-center">
              Do not have an account?{' '}
              <Link to="/signup" className="text-primaryColor font-medium ml-1">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
