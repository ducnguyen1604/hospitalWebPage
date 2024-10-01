import React from 'react'
import userImg from '../../assets/images/doctor-img01.png'
import { useContext, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import MyBookings from './MyBookings';
import Profile from './Profile';
import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';

const MyAccount = () => {

  const { dispatch } = useContext(authContext)
  const [tab, setTab] = useState('bookings')
  const { data: userData, loading, error } = useGetProfile(`${BASE_URL}/users/profile/me`)

  // Userdata o day dang bi undefined, a check lai api.no phai tra lai duoc user data from database
  console.log(userData)


  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">

        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
          <div className="pb-[50px] px-[30px] rounded-md">
            <div className="flex items-center justify-center">
              <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                <img
                  src={userImg} // placeholder photo
                  // src={userData.photo}
                  alt=""
                  className="w-full h-full rounded-full"
                />
              </figure>
            </div>
            
            {/* PlaceHolder, remove later */}
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

             {/* Dung khi nao userData update duoc 

            div className="text-center mt-4">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                {userData.name}
              </h3>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                {userData.email}
              </p>
              <p className="text-textColor text-[15px] leading-6 font-medium">
                Blood Type: 
                <span className='ml-2 text-headingColor text-[20px] leading-8'>{userData.bloodType}</span>
              </p>
            </div>
            */}

            <div className='mt-[50px] md:mt-[100px]'>
              <button onClick={handleLogout} className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#3e3f42] p-3 text-[15px] leading-7 rounded-md text-white'>Log Out</button>
              <button className='transition-transform duration-100 ease-in-out active:scale-95 w-full sm:items-center bg-[#e6592a] p-3 text-[15px] leading-7 rounded-md text-white mt-5 '>Delete Account</button>
            </div>
          </div>

          <div className='md:col-span-2 md:px-[30px]'>
            <div>
              <button
                onClick={() => setTab("bookings")}
                className={`${tab === 'bookings' && 'bg-primaryColor text-white font-normal'} transition-transform duration-100 ease-in-out active:scale-95 p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
              >
                My Bookings
              </button>

              <button
                onClick={() => setTab("settings")}
                className={`${tab === 'settings' && 'bg-primaryColor text-white font-normal'}transition-transform duration-100 ease-in-out active:scale-95 py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
              >
                Profile Settings
              </button>
            </div>

            {
              tab === 'bookings' && <MyBookings />
            }
            {
              tab === 'settings' && <Profile userData={userData} />
            }

          </div>


        </div>
        )}
        
      </div>

    </section>

  );

}

export default MyAccount