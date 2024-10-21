import React, { useState, useEffect } from "react";
import DoctorCard from "../../components/Doctor/DoctorCard";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // For carousel controls

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    feedback: "The doctors here are amazing! They provided excellent care during my treatment.",
    date: "August 12, 2024",
  },
  {
    id: 2,
    name: "Jane Smith",
    feedback: "I’ve never felt more comfortable in a healthcare setting. Highly recommended!",
    date: "September 5, 2024",
  },
  {
    id: 3,
    name: "Sam Wilson",
    feedback: "The staff were very kind and the doctors took time to explain everything clearly.",
    date: "July 22, 2024",
  },
  {
    id: 4,
    name: "Emily Johnson",
    feedback: "Booking an appointment was easy, and the online consultation was smooth.",
    date: "October 1, 2024",
  },
];

const Doctors = () => {
  const { data: doctors, loading, error } = useFetchData(
    `${BASE_URL}/doctors/getAllDoctors`
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current testimonial slide

  const specializations = Array.from(new Set(doctors.map((doctor) => doctor.specialization)));

  useEffect(() => {
    const filtered = doctors.filter((doctor) => {
      const matchesName = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialization =
        specialization === "" ||
        (doctor.specialization && doctor.specialization.toLowerCase() === specialization.toLowerCase());

      return matchesName && matchesSpecialization;
    });

    setFilteredDoctors(filtered);
  }, [searchQuery, specialization, doctors]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Search Section */}
      <section className="bg-[#fff9ea]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>
          <div className="max-w-[800px] mt-[30px] mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="search"
                className="py-4 pl-4 pr-2 bg-[#0066ff2c] min-w-[550px] rounded-md w-full sm:w-auto focus:outline-none cursor-pointer placeholder:text-textColor"
                placeholder="Search Doctor by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="py-4 pl-4 pr-3 bg-[#0066ff2c] rounded-md focus:outline-none cursor-pointer"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>

              <button className="btn mt-0 rounded-md transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors List Section */}
      <section>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
            ) : (
              <p>No doctors found</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="py-16 bg-[#f3f4f6] relative">
        <div className="container">
          <div className="xl:w-[650px] mx-auto text-center mb-12">
            <h2 className="heading">What Our Patients Say</h2>
            <p className="text__para">
              We value our patients and their feedback. Here are some words from those we’ve helped.
            </p>
          </div>

          <div className="relative">
            {/* Carousel Content */}
            <div
              className="overflow-hidden"
              style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
            >
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 w-full p-6 bg-white shadow-lg rounded-lg text-center"
                  >
                    <h3 className="text-xl font-semibold text-headingColor mb-2">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-600 italic mb-4">"{testimonial.feedback}"</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <button
              className="absolute left-1/4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
              onClick={handlePrev}
            >
              <AiOutlineLeft size={24} />
            </button>
            <button
              className="absolute right-1/4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
              onClick={handleNext}
            >
              <AiOutlineRight size={24} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
