import React, { useState } from 'react'
import doctorImg from '../../assets/images/doctor-img02.png'
import { Link } from 'react-router-dom'
import starIcon from '../../assets/images/Star.png'
import DoctorAbout from './DoctorAbout'
import Feedback from './Feedback'
import SidePanel from './SidePanel'

const DoctorDetails = () => {
  const [tab,setTab] = useState('about')
  
  return (

    <section>
      <div className='max-w-[1150px] px-5 mx-auto'>
        <div className='grid md:grid-cols-3 gap-[50px]'>
          <div className='md:col-span-2'>
            <div className='flex items-center gap-5'>
              <figure className='max-w-[200px] max-h-[200px]'>
                <img src={doctorImg} alt="" className='w-full' />
              </figure>

              <div>
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 lg:py-2 px-6 lg:px-6 text-[12px] lg:text-[16px] leading-4  lg:leading-7 font-semibold rounded'>Surgeon</span>

                <h3 className='text-headingColor text-[20px] leading-9 font-bold mt-4'> Dr Thanh</h3>
                <div className='flex items-center gap-[6px]'>
                  <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                    <img src={starIcon} alt="" />4.8
                  </span>
                  <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
                    (200)
                  </span>
                </div>
                <p className='text__para text-[14px] leading-5 md:text-[15px] lg:max-w-[450px] '>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>

            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button
                onClick={() => setTab('about')}
                className={`${tab === "about" && "border-b border-solid border-primaryColor"}
        py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => setTab('feedback')}
                className={`${tab === "feedback" && "border-b border-solid border-primaryColor"}
        py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>
            </div>

            <div>
              {
                tab === 'about' && <DoctorAbout />
              }
              {
                tab === 'feedback' && <Feedback />
              }
            </div>
          </div>

          {/* Booking Panel */}
          <div>
              <SidePanel />
          </div>

          

        </div>
      </div>
    </section>


  )
}

export default DoctorDetails