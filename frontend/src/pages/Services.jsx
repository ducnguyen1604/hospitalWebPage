import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeartbeat, FaStethoscope, FaUserNurse, 
  FaVials, FaAmbulance, FaSyringe 
} from 'react-icons/fa';

const servicesData = [
  {
    id: 1,
    title: 'Cardiology',
    description: 'Expert care for heart-related conditions, offering diagnostics, treatment, and preventive care.',
    icon: <FaHeartbeat className="text-5xl text-red-500" />,
  },
  {
    id: 2,
    title: 'General Medicine',
    description: 'Comprehensive general medical care for all ages with a focus on patient wellness and preventive care.',
    icon: <FaStethoscope className="text-5xl text-blue-500" />,
  },
  {
    id: 3,
    title: 'Nursing Services',
    description: 'Dedicated nursing staff to provide compassionate care and personalized attention.',
    icon: <FaUserNurse className="text-5xl text-green-500" />,
  },
  {
    id: 4,
    title: 'Laboratory Services',
    description: 'State-of-the-art lab testing and diagnostics for accurate and timely results.',
    icon: <FaVials className="text-5xl text-purple-500" />,
  },
  {
    id: 5,
    title: 'Emergency Services',
    description: '24/7 emergency care with ambulances and rapid response medical teams.',
    icon: <FaAmbulance className="text-5xl text-yellow-500" />,
  },
  {
    id: 6,
    title: 'Vaccination Programs',
    description: 'Comprehensive vaccination programs for children and adults to prevent infectious diseases.',
    icon: <FaSyringe className="text-5xl text-orange-500" />,
  },
];

const Services = () => {
  return (
    <section className="bg-[#f8fafc] py-20">
      <div className="container mx-auto px-5">
        <h2 className="text-center heading mb-6">Our Services</h2>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-headingColor text-center mb-4">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 text-center">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Find Us on the Map
          </h3>
          <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Hospital Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=103.67839425802232%2C1.3415639449170234%2C103.68166655302049%2C1.3436474491641395&layer=mapnik&marker=1.342638%2C+103.680146"
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">We Are Here For You</h3>
          <p className="text-gray-500">
            Your health is our priority. We provide world-class medical services with a commitment to care and well-being.
          </p>
          <Link to="/doctors">
            <button className="mt-8 px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-100 ease-in-out active:scale-95">
              Book an Appointment
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
