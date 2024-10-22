import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { FaVideo } from "react-icons/fa";
import { BASE_URL, token } from "../../config";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const Appointment = ({ appointments, setAppointments }) => {
  const [editMode, setEditMode] = useState(null);
  const [editedAppointment, setEditedAppointment] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredAppointments = appointments.filter(
    (item) => item.user_id !== 0
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.appointment_date);
    const dateB = new Date(b.appointment_date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  //   console.log(sortedAppointments);
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleEditClick = (appointment) => {
    setEditMode(appointment.id);
    setEditedAppointment({ ...appointment });
  };

  const handleInputChange = (e, field) => {
    setEditedAppointment((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${editedAppointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedAppointment),
      });

      if (res.ok) {
        toast.success("Appointment updated successfully");
        setAppointments((prev) =>
          prev.map((item) =>
            item.id === editedAppointment.id
              ? { ...item, ...editedAppointment }
              : item
          )
        );
        setEditMode(null);
      } else {
        toast.error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the appointment");
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    );

    if (!confirmation) return; // If user cancels, exit early

    try {
      const response = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Update state to remove the deleted appointment
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== id)
        );
        toast.success("Booking deleted successfully!");
      } else {
        // If server responds with an error message
        toast.error(result.message || "Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(
        "An error occurred while deleting the booking. Please try again."
      );
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
            <th className="px-2 py-2">Name</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2">Gender</th>
            <th className="px-2 py-2">Payment</th>
            <th className="px-2 py-2 w-16">Price</th>
            <th
              className="px-2 py-2 w-24 cursor-pointer"
              onClick={toggleSortOrder}
            >
              Appointment Date {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="px-2 py-2 w-16">Start Time</th>
            <th className="px-2 py-2 w-16">End Time</th>
            <th className="px-2 py-2">Actions</th>
            <th className="px-2 py-2">Video Call</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((item) => (
            <tr key={item.id}>
              <td className="px-2 py-2">{item.user_name || "N/A"}</td>
              <td className="px-2 py-2">{item.user_email || "N/A"}</td>
              <td className="px-2 py-2">{item.user_gender || "N/A"}</td>
              <td className="px-2 py-2">
                {String(item.is_paid) !== "0" ? (
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
              <td className="px-2 py-2">
                {editMode === item.id ? (
                  <input
                    type="number"
                    value={editedAppointment.ticket_price || ""}
                    onChange={(e) => handleInputChange(e, "ticket_price")}
                    className="w-full"
                  />
                ) : (
                  item.ticket_price || "N/A"
                )}
              </td>
              <td className="px-2 py-2">
                {editMode === item.id ? (
                  <input
                    type="date"
                    value={editedAppointment.appointment_date || ""}
                    onChange={(e) => handleInputChange(e, "appointment_date")}
                    className="w-full"
                  />
                ) : (
                  item.appointment_date.split(" ")[0] || "N/A"
                )}
              </td>
              <td className="px-2 py-2">
                {editMode === item.id ? (
                  <input
                    type="time"
                    value={editedAppointment.start_time || ""}
                    onChange={(e) => handleInputChange(e, "start_time")}
                    className="w-full"
                  />
                ) : (
                  item.start_time || "N/A"
                )}
              </td>
              <td className="px-2 py-2">
                {editMode === item.id ? (
                  <input
                    type="time"
                    value={editedAppointment.end_time || ""}
                    onChange={(e) => handleInputChange(e, "end_time")}
                    className="w-full"
                  />
                ) : (
                  item.end_time || "N/A"
                )}
              </td>
              <td className="px-2 py-2 flex space-x-2">
                {editMode === item.id ? (
                  <button onClick={handleSaveClick} className="text-green-600">
                    Save
                  </button>
                ) : (
                  <AiOutlineEdit
                    onClick={() => handleEditClick(item)}
                    className="cursor-pointer text-blue-600"
                  />
                )}
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
