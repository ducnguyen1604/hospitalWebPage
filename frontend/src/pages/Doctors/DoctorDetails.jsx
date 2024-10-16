import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import doctorImg from '../../assets/images/doctor-img02.png';
import starIcon from '../../assets/images/Star.png';
import DoctorAbout from './DoctorAbout';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import Loading from '../../components/Loader/Loading';

const DoctorDetails = () => {
  const { doctorId } = useParams();  // Capture doctorId from URL
  const { data: responseData, loading, error } = useFetchData(
    `http://localhost:80/hospitalWebPage/backend/api/v1/doctors/getDoctor?id=${doctorId}`
  );

  const doctor = responseData|| {};  // Default to empty object to avoid null issues

  console.log('Full Doctor Response:', responseData);  // Log the entire response
  console.log('name', doctor)

  const [tab, setTab] = useState('about');

  // Handle loading and error states
  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  // Ensure the doctor object is properly checked
  if (Object.keys(doctor).length === 0) {
    return <p>No doctor found</p>;
   }

  return (
    <section>
      <div className="max-w-[1150px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className="max-w-[200px] max-h-[200px]">
                <img src={doctor.photo || doctorImg} alt={doctor.name} className="w-full" />
              </figure>

              <div>
                <span className="bg-[#CCF0F3] text-irisBlueColor py-1 lg:py-2 px-6 lg:px-6 text-[12px] lg:text-[16px] leading-4 lg:leading-7 font-semibold rounded">
                  {doctor.specialization || 'Unknown Specialization'}
                </span>

                <h3 className="text-headingColor text-[20px] leading-9 font-bold mt-4">
                  Dr. {doctor.name}
                </h3>

                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                    <img src={starIcon} alt="Rating" /> {doctor?.rating || 'No rating available'}
                  </span>
                  <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                    ({doctor?.feedbackCount || 'No feedback yet'})
                  </span>
                </div>

                <p className="text__para text-[14px] leading-5 md:text-[15px] lg:max-w-[450px]">
                  {doctor.bio || 'No bio available for this doctor.'}
                </p>
              </div>
            </div>

            <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
              <button
                onClick={() => setTab('about')}
                className={`${tab === 'about' ? 'border-b border-solid border-primaryColor' : ''} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>
              <button
                onClick={() => setTab('feedback')}
                className={`${tab === 'feedback' ? 'border-b border-solid border-primaryColor' : ''} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedback
              </button>
            </div>

            <div>
              {tab === 'about' && <DoctorAbout name={doctor.name} about={doctor.bio} />}
              {tab === 'feedback' && <Feedback />}
            </div>
          </div>

          <div>
            <SidePanel doctorId={doctorId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
