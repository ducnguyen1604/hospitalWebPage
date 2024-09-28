import React from 'react'
import { Link } from 'react-router-dom'
import starIcon from '../../assets/images/Star.png'
import { BsArrowRight } from 'react-icons/bs'

const DoctorCard = ({ doctor }) => {

    const { id, name, avgRating, totalRating, specialty, photo, totalPatients, hospital } = doctor



    return (
        <div className='p-3 lg:p-5'>
            <div>
                <img src={photo} alt="" className='w-full' />
            </div>
            <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5'>
                {name}
            </h2>
            <div className='mt-2 lg:mt-4 flex items-center justify-between'>
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                    {specialty}
                </span>
                <div className='flex items-center gap-[6px]'>
                    <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                    <img src={starIcon} alt="" />{avgRating}
                    </span>
                    <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
                    ({totalRating})
                    </span>
                </div>
            </div>

            <div className='mt-[18px] lg:mt-5 flex items-center justify-between'>
                <div>
                    <h3 className='text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibild text-headingColor'>{totalPatients} Patients</h3>
                    <p className='text-[14px] leading-6 font-[400] text-textColor'>At {hospital}</p>
                </div>
                <Link to={`/doctors/${id}`} className='w-[44px] h-[44px] border border-solid border-[#181a1E] rounded-full mt-[10px] mr-5 mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none' >
                <BsArrowRight className='w-6 h-5 group-hover:text-white' />
            </Link>
            </div>

           
            
        </div>
    )
}

export default DoctorCard