import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
import {toast} from 'react-toastify';
import {authContext} from '../context/AuthContext.jsx';

const Login = () => {

  const [formData, SetFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const{dispatch} = useContext(authContext)

  const handleInputChanges = e => {
    SetFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
``
    try{
      const res = await fetch(`${BASE_URL}/auth/login`,{ //http://localhost/hospitalWebPage/backend/api/v1/auth/login
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      });
      //console.log('Response status:', res.status)
      console.log(formData);
      const result = await res.json();
      console.log('Full response:', result); 

      if(!res.ok){
        throw new Error(result.message);
      }

      dispatch({
        type:'LOGIN_SUCCESS',
        payload:{
          user:result.data,
          token: result.token,
          role: result.data.role,
        }
      });
      //console.log(result, "login data");
      setLoading(false);
      toast.success(result.message);
      navigate('/home');

    }catch(err){
      console.error('Error:', err);
      toast.error(err.message);
      setLoading(false);
    }

      
  };

  return (
    <section className='px-5 lg:px-0'>
      <div className='w-full max-w-[550px] mx-auto rounded-lg shadow-md md:p-10'>
        <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10 sm:pl-5 sm:pt-5'>
          Welcome <span className='text-primaryColor'>Back 🥳</span>
        </h3>
        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          <div className='mb-5'>
            <input
              type="email"
              placeholder='Enter Your Email'
              name='email'
              value={formData.email}
              onChange={handleInputChanges}
              className='w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primiaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>

          <div className='mb-5'>
            <input
              type="password"
              placeholder='Enter Your Password'
              name='password'
              value={formData.password}
              onChange={handleInputChanges}
              className='w-full px-4 py-4 border-b border-solid border-[#0066ff60] focus:outline-none focus:border-b-primiaryColor text-[15px] leading-7 text-headingColor placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>

          {/* Display error message */}
          {errorMessage && <p className='text-red-500 text-sm mb-3'>{errorMessage}</p>}
          
          {/* Display success message */}
          {successMessage && <p className='text-green-500 text-sm mb-3'>{successMessage}</p>}

          <div className='mt-7'>
            <button type='submit' className={`w-full bg-primaryColor rounded-lg text-white text-[18px] leading-[30px] px-4 py-4 transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700`}>
              Login
            </button>
          </div>

          <p className='mt-5 text-textColor text-center'>
            Do not have an account? {' '}
            <Link to='/signup' className='text-primaryColor font-medium ml-1'>Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
