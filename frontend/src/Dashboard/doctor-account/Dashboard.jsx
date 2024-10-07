import React from 'react'
import userImg from '../../assets/images/doctor-img01.png'
import { useContext, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import Tabs from './Tabs';
import StarIcon from '../../assets/images/Star.png'
import DoctorAbout from '../../pages/Doctors/DoctorAbout';
import Profile from './Profile';
import Appointment from './Appointment';


const Dashboard = ({name, about, qualification, experiences}) => {
  const { dispatch } = useContext(authContext)
  const { data, loading, error } = useGetProfile(`${BASE_URL}/doctors/getDoctorProfile`)
  const [tab, setTab] = useState('overview')

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const doctor = data.doctor

  if (!data || !doctor) return null

  console.log("Doctor data:",data)
  

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">

        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <Tabs tab={tab} setTab={setTab} />
            <div className='lg:col-span-2'>
              {doctor.isApproved === 'pending' && (
                <div className='flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg'>
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 10-2 0 1 1 0 001 1h11a1 1 0 100-2v3a1 1 0 001 1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className='sr-only'>Info</span>
                  <div className='ml-3 text-sm font-medium'>To get approval, please complete your profile. We&apos;ll review manullay and approve within 3 days.</div>
                </div>
              )}

              <div className='mt-8'>
                {tab === 'overview' && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                    <figure className="max-w-[200px] max-h-[200px]">
                      <img src={doctor.photo}  alt="" className="w-full" />
                    </figure>

                    <div>
                      <span className="bg-[#CCF0F8] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                      { doctor.specialization}
                      </span>

                      <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                    {doctor.name}
                      </h3>
                      <div className="flex items-center gap-[6px]">
                      <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold"><img src={StarIcon} alt="" />{doctor.averageRating}</span>
                      <span className='text-textColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold'>({doctor.totalRating})</span>
                    </div>
                    <p className='text__para font-[15px] lg:max-w-[400px] leading-6'>{doctor?.bio}</p>
                    </div>                    
                  </div>
                  <DoctorAbout 
                  name={doctor.name}
                   about={doctor.about} 
                   qualifications={doctor.qualifications} 
                   experiences={doctor.experiences}
                  />
                  </div>
                  
                )}
                {tab === 'appointments' && <Appointment appointments={data?.appointments}/>}
                {tab === 'settings' && <Profile doctorData={data}/>}
              </div>
            </div>
          </div>
        )}

      </div>

    </section>


  )
}

export default Dashboard