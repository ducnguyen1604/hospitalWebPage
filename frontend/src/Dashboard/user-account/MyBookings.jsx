import React from 'react'
import useFetchData from '../../hooks/useFetchData'
import { BASE_URL } from '../../config'
import Loading from '../../components/Loader/Loading'
import DoctorCard from '../../components/Doctor/DoctorCard'
import Error from '../../components/Error/Error'

const MyBookings = () => {
  const { data, loading, error } = useFetchData(`${BASE_URL}/users/bookings/getMyAppointments`)
  console.log(data)
  const appointments = data.doctors;
  // console.log(appointments)

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div>
      {loading && !error && <Loading />}

      {error && !loading && <Error errMessage={error} />}

      {!error && !loading && appointments.length === 0 && (
        <h2 className='mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor'> You did not book any doctor</h2>
      )}

      {!loading && !error && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {appointments.map(doctor => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings