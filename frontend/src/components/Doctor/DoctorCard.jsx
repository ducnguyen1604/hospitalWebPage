import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '../../assets/images/Star.png';
import { BsArrowRight } from 'react-icons/bs';

const DoctorCard = ({ doctor }) => {
  const { id, name, avgRating, totalRating, specialty, photo } = doctor;
  console.log(doctor);

  return (
    <div className='p-3 lg:p-2'>
      {/* Wrap image with Link */}
      <Link to={`/doctors/${id}`}>
        <div>
          <img src={photo} alt={name} className='w-full cursor-pointer' />
        </div>
      </Link>
      
      {/* Wrap name with Link */}
      <Link to={`/doctors/${id}`}>
        <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5 cursor-pointer'>
          {name}
        </h2>
      </Link>

      <div className='mt-2 lg:mt-4 flex items-center justify-between'>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
          {specialty}
        </span>
        <div className='flex items-center gap-[6px] mt-3'>
        <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
          <img src={starIcon} alt="" />{avgRating}
        </span>
        <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
          ({totalRating})
        </span>
      </div>
      </div>

      
    </div>
  );
};

export default DoctorCard;
