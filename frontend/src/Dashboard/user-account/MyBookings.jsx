import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaVideo } from 'react-icons/fa'; // Import video icon
import { BASE_URL, token } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { authContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const { user } = useContext(authContext);
  const { data, loading, error } = useFetchData(`${BASE_URL}/users/bookings/getMyAppointments`);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (data && data.bookings) {
      const userBookings = data.bookings.filter((item) => item.user_id === user?.id);
      setAppointments(userBookings);
    }
  }, [data, user]);

  const handleDelete = async (id) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) {
      toast.error('Appointment not found.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: 0, ...appointment }),
      });

      if (res.ok) {
        toast.success('Booking removed successfully!');
        setAppointments((prev) => prev.filter((item) => item.id !== id));
      } else {
        const result = await res.json();
        toast.error(result.message || 'Failed to remove the booking.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while removing the booking.');
    }
  };

  const getVideoRoomUrl = (id, doctorId, userId) => 
    `https://careplus-prediagnosis.netlify.app/index.html?room=${id}${doctorId}${userId}`;

  if (loading) return <Loading />;
  if (error) return <Error errMessage={error} />;

  return (
    <div className="max-w-[900px] mx-auto overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-500 mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-2 py-2">Doctor</th>
            <th className="px-2 py-2">Date</th>
            <th className="px-2 py-2">Start Time</th>
            <th className="px-2 py-2">End Time</th>
            <th className="px-2 py-2">Price</th>
            <th className="px-2 py-2">Actions</th>
            <th className="px-2 py-2">Video Call</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            const doctor = data.doctors.find((doc) => doc.id === appointment.doctor_id);
            return (
              <tr key={appointment.id}>
                <td className="px-2 py-2">{doctor?.name || 'Unknown'}</td>
                <td className="px-2 py-2">{appointment.appointment_date?.split(' ')[0] || 'N/A'}</td>
                <td className="px-2 py-2">{appointment.start_time || 'N/A'}</td>
                <td className="px-2 py-2">{appointment.end_time || 'N/A'}</td>
                <td className="px-2 py-2">{appointment.ticket_price || 'N/A'}</td>
                <td className="px-2 py-2">
                  <AiOutlineDelete
                    onClick={() => handleDelete(appointment.id)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  />
                </td>
                <td className="px-2 py-2">
                  <a href={getVideoRoomUrl(appointment.id, appointment.doctor_id, appointment.user_id)} target="_blank" rel="noopener noreferrer">
                    <FaVideo className="cursor-pointer text-green-600 hover:text-green-800" />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
