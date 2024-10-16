import React, { useState, useEffect } from "react";
import DoctorCard from "../../components/Doctor/DoctorCard";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config"; // Ensure you have BASE_URL configured
import Loading from "../../components/Loader/Loading"; // Assuming you have a loading component

const Doctors = () => {
  const { data: doctors, loading, error } = useFetchData(
    `${BASE_URL}/doctors/getAllDoctors`
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    // Filter doctors based on search input
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.specialization &&
          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, doctors]);

  if (loading) return <Loading />; // Display loading indicator if data is loading
  if (error) return <p>Error: {error}</p>; // Handle any error

  return (
    <>
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder="Search Doctor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn mt-0 rounded-[0px] rounded-r-md transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700">
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            ) : (
              <p>No doctors found</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[650px] mx-auto">
            <h2 className="heading text-center">What our patients say?</h2>
            <p className="text__para text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed
              accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis,
              venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis,
              elementum nunc.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
