import React from 'react'
import userImg from '../../assets/images/doctor-img01.png'
import { useContext } from 'react';
import { authContext } from '../../context/AuthContext';

const MyAccount = () => {

  const {dispatch} = useContext(authContext)
  const handleLogout = () => {
    dispatch({type:'LOGOUT'})
  }

    return (
        <div className="max-w-[1170px] px-5 mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src={userImg}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>
      
              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  Luke Nguyen
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  example@gmail.com
                </p>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  Blood Type: 
                  <span className='ml-2 text-headingColor text-[20px] leading-8'>AB</span>
                </p>
              </div>

              <div className='mt-[50px] md:mt-[100px]'>
                <button onClick={handleLogout} className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#3e3f42] p-3 text-[15px] leading-7 rounded-md text-white'>Log Out</button>
                <button className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#e6592a] p-3 text-[15px] leading-7 rounded-md text-white mt-5 '>Delete Account</button>
              </div>
            </div>


            <div>
              
            </div>
          </div>
        </div>
      );
      
}

export default MyAccount