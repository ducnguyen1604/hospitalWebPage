import React from 'react'
import { doctors } from '../../assets/data/doctors'
import DoctorCard from './DoctorCard'
import { BASE_URL } from "../../../config";
import useFetchData from '../../hooks/useFetchData';
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";



const DoctorList = () => {

  const {data: doctors, loading, error} = useFetchData(`${BASE_URL}/doctors`);
  console.log(doctors)
  return (
    
    <>
      {loading && <Loader />}
      {error && <Error />}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

    </>
  )
}


export default DoctorList