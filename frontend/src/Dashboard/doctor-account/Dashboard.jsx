import React, { useContext, useState, useEffect } from "react";
import { authContext } from "../../context/AuthContext";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL, token } from "../../config";  // Ensure token is imported
import Loading from "../../components/Loader/Loading";
import Tabs from "./Tabs";
import StarIcon from "../../assets/images/Star.png";
import DoctorAbout from "../../pages/Doctors/DoctorAbout";
import Profile from "./Profile";
import Appointment from "./Appointment";
import TimePosting from "./TimePosting";

const Dashboard = () => {
  const { dispatch } = useContext(authContext);
  const { data, loading, error, setData: setDoctorData } = useGetProfile(`${BASE_URL}/doctors/getDoctorProfile`);
  const [tab, setTab] = useState("overview");
  const [appointments, setAppointments] = useState([]); // Manage appointments in the parent

  // Function to fetch appointments with the Authorization header
  const fetchAppointments = async (doctorId) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
        },
      });
      const result = await res.json();
      console.log('Appointments API Response:', result);
      if (result.success) {
        console.log('Fetched Appointments Data:', result.data);
        setAppointments(result.data); // Set the fetched appointments
      } else {
        console.error("Failed to fetch appointments:", result.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch doctor profile and then fetch appointments
  useEffect(() => {
    console.log('Doctor Profile Data:', data);
    if (data && data.doctor) {
      fetchAppointments(data.doctor.id); // Fetch appointments using the doctor's ID
    }
  }, [data]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const getRandomRating = () => {
    return (Math.random() * (5 - 3) + 3).toFixed(1);
  };

  const rating = getRandomRating();
  const doctor = data?.doctor;

  if (!data || !doctor) return null;

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loading />}

        {error && !loading && <Error errMessage={error} />}

        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <Tabs tab={tab} setTab={setTab} />
            <div className="lg:col-span-2">
              {doctor.isApproved === "pending" && (
                <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 0 0116 0zm-7-4a1 1 0 10-2 0 1 1 0 001 1h11a1 1 0 100-2v3a1 1 0 001 1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    To get approval, please complete your profile. We&apos;ll review manually and approve within 3 days.
                  </div>
                </div>
              )}

              <div className="mt-8">
                {tab === "overview" && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <figure className="max-w-[200px] max-h-[200px]">
                        <img src={doctor.photo} alt="" className="w-full" />
                      </figure>

                      <div>
                        <span className="bg-[#CCF0F8] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                          {doctor.specialization}
                        </span>

                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {doctor.name}
                        </h3>
                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={StarIcon} alt="" />
                            {rating}
                          </span>
                        </div>
                        <p className="text__para font-[15px] lg:max-w-[400px] leading-6">
                          Doctor of CarePlus+
                        </p>
                      </div>
                    </div>
                    <DoctorAbout name={doctor.name} about={doctor.about} bio={doctor.bio} />
                  </div>
                )}

                {tab === "appointments" && (
                  <Appointment appointments={appointments} setAppointments={setAppointments} />
                )}

                {tab === "settings" && (
                  <Profile
                    doctorData={doctor}
                    onChangeDoctorDetails={(doctorData) => {
                      setDoctorData({ ...data, doctor: doctorData });
                    }}
                  />
                )}
                {tab === "timepostings" && // Inside your Dashboard component:
                  <TimePosting
                    doctorData={data}
                    onPostSuccess={() => fetchAppointments(data.doctor.id)}
                  />
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
