import React from 'react'
import DoctorCard from "../../components/Doctor/DoctorCard"
import { doctors } from "./../../assets/data/doctors"


const Doctors = () => {
  return (
    <>
    <section className="bg-[#fff9ea]">
      <div className="container text-center">
        <h2 className="heading">Find a Doctor</h2>
        <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
          <input type="search" className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor" placeholder="Search Doctor" />
          <button className="btn mt-0 rounded-[0px] rounded-r-md transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700">Search</button>
        </div>
      </div>
    </section>

    <section>
      <div className='container'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {doctors.map((doctor) => (<DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>

    <section>
      <div className='container'>
        <div className='xl:w-[650px] mx-auto'>
          <h2 className='heading text-center'>What our patients say?</h2>
          <p className='text__para text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis, elementum nunc.</p>
        </div>
      </div>

     
    </section>

    </>
    
  )
   
}

export default Doctors