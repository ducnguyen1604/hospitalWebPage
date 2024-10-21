import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaVideo } from "react-icons/fa"; // Video call icon
import { BASE_URL, token } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const Appointment = ({ appointments, setAppointments }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({});

  const filteredAppointments = appointments.filter((item) => item.user_id !== 0);

  const handleEditClick = (appointment) => {
    setEditMode(appointment.id);
    setEditedAppointment({
      id: appointment.id,
      ticket_price: appointment.ticket_price,
      appointment_date: appointment.appointment_date
        ? appointment.appointment_date.split(" ")[0]
        : "",
      start_time: appointment.start_time || "",
      end_time: appointment.end_time || "",
    });
  };

  const handleInputChange = (e, field) => {
    setEditedAppointment({
      ...editedAppointment,
      [field]: e.target.value,
    });
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${editedAppointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_price: editedAppointment.ticket_price,
          appointment_date: editedAppointment.appointment_date,
          start_time: editedAppointment.start_time,
          end_time: editedAppointment.end_time,
        }),
      });

      if (res.ok) {
        toast.success("Appointment updated successfully");
        const updatedAppointments = appointments.map((item) =>
          item.id === editedAppointment.id ? { ...item, ...editedAppointment } : item
        );
        setAppointments(updatedAppointments);
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the appointment");
    }

    setEditMode(null);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const res = await fetch(`${BASE_URL}/bookings/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          toast.success("Booking deleted successfully");
          setAppointments(appointments.filter((item) => item.id !== id));
        } else {
          toast.error("Failed to delete booking");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting the booking");
      }
    }
  };

  const handleVideoCallClick = (appointment) => {
    const roomId = `${appointment.id}${appointment.doctor_id}${appointment.user_id}`;
    const videoCallUrl = `https://careplus-prediagnosis.netlify.app/index.html?room=${roomId}`;
    window.open(videoCallUrl, "_blank");
  };

  return (
    <div className="max-w-[900px] mx-auto overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-2 py-2">Name</th>
            <th scope="col" className="px-2 py-2">Email</th>
            <th scope="col" className="px-2 py-2">Gender</th>
            <th scope="col" className="px-2 py-2">Payment</th>
            <th scope="col" className="px-2 py-2 w-16">Price</th>
            <th scope="col" className="px-2 py-2 w-24">Appointment Date</th>
            <th scope="col" className="px-2 py-2 w-16">Start Time</th>
            <th scope="col" className="px-2 py-2 w-16">End Time</th>
            <th scope="col" className="px-2 py-2">Actions</th>
            <th scope="col" className="px-2 py-2">Video Call</th> {/* New column for video call */}
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((item) => (
            <tr key={item.id}>
              <th scope="row" className="flex items-center px-2 py-2 text-gray-900 whitespace-nowrap">
                <div className="pl-2">
                  <div className="text-base font-semibold">{item.user_name || "N/A"}</div>
                </div>
              </th>
              <td className="px-2 py-2">{item.user_email || "N/A"}</td>
              <td className="px-2 py-2">{item.user_gender || "N/A"}</td>
              <td className="px-2 py-2">
                {item.is_paid ? (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1"></div>
                    Paid
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1"></div>
                    Unpaid
                  </div>
                )}
              </td>
              <td className="px-2 py-2">{item.ticket_price || "N/A"}</td>
              <td className="px-2 py-2">
                {item.appointment_date ? item.appointment_date.split(" ")[0] : "N/A"}
              </td>
              <td className="px-2 py-2">{item.start_time || "N/A"}</td>
              <td className="px-2 py-2">{item.end_time || "N/A"}</td>
              <td className="px-2 py-2 flex space-x-2">
                <AiOutlineEdit
                  onClick={() => handleEditClick(item)}
                  className="cursor-pointer text-blue-600"
                />
                <AiOutlineDelete
                  onClick={() => handleDeleteClick(item.id)}
                  className="cursor-pointer text-red-600 hover:text-red-800"
                />
              </td>
              <td className="px-2 py-2">
                <FaVideo
                  onClick={() => handleVideoCallClick(item)}
                  className="cursor-pointer text-green-600 hover:text-green-800"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Appointment;
