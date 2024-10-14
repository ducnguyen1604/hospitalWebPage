import React, { useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BASE_URL, token } from "../../config";
import "react-datepicker/dist/react-datepicker.css";

const Appointment = ({ appointments, setAppointments }) => {
    const [editMode, setEditMode] = useState(null); // Track which appointment is being edited
    const [editedAppointment, setEditedAppointment] = useState({}); // Store the edited appointment details

    // Handle edit click
    const handleEditClick = (appointment) => {
        setEditMode(appointment.id); // Set the edit mode to the current appointment's ID
        setEditedAppointment({
            id: appointment.id,
            ticket_price: appointment.ticket_price,
            appointment_date: appointment.appointment_date ? appointment.appointment_date.split(' ')[0] : '',
            start_time: appointment.start_time || '',
            end_time: appointment.end_time || '',
        }); // Initialize edited appointment with the current values
    };

    // Handle input changes for editable fields
    const handleInputChange = (e, field) => {
        setEditedAppointment({
            ...editedAppointment,
            [field]: e.target.value,
        });
    };

    // Save the changes and exit edit mode
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
                console.log("Appointment updated successfully");

                // Update the appointments state with the new data
                const updatedAppointments = appointments.map((item) =>
                    item.id === editedAppointment.id ? { ...item, ...editedAppointment } : item
                );
                setAppointments(updatedAppointments); // Update the state to reflect the changes
            } else {
                console.error("Failed to update appointment");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        // Exit edit mode after saving
        setEditMode(null);
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
                    </tr>
                </thead>
                <tbody>
                    {appointments?.map((item) => (
                        <tr key={item.id}>
                            <th scope="row" className="flex items-center px-2 py-2 text-gray-900 whitespace-nowrap">
                                <div className="pl-2">
                                    <div className="text-base font-semibold">{item.user_name || 'N/A'}</div>
                                </div>
                            </th>
                            <td className="px-2 py-2">{item.user_email || 'N/A'}</td>
                            <td className="px-2 py-2">{item.user_gender || 'N/A'}</td>
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
                            <td className="px-2 py-2">
                                {editMode === item.id ? (
                                    <input
                                        type="number"
                                        className="w-full"
                                        value={editedAppointment.ticket_price}
                                        onChange={(e) => handleInputChange(e, 'ticket_price')}
                                    />
                                ) : (
                                    item.ticket_price || 'N/A'
                                )}
                            </td>
                            <td className="px-2 py-2">
                                {editMode === item.id ? (
                                    <input
                                        type="date"
                                        className="w-full"
                                        value={editedAppointment.appointment_date}
                                        onChange={(e) => handleInputChange(e, 'appointment_date')}
                                    />
                                ) : (
                                    item.appointment_date ? item.appointment_date.split(' ')[0] : 'N/A'
                                )}
                            </td>
                            <td className="px-2 py-2">
                                {editMode === item.id ? (
                                    <input
                                        type="time"
                                        className="w-full"
                                        value={editedAppointment.start_time}
                                        onChange={(e) => handleInputChange(e, 'start_time')}
                                    />
                                ) : (
                                    item.start_time || 'N/A'
                                )}
                            </td>
                            <td className="px-2 py-2">
                                {editMode === item.id ? (
                                    <input
                                        type="time"
                                        className="w-full"
                                        value={editedAppointment.end_time}
                                        onChange={(e) => handleInputChange(e, 'end_time')}
                                    />
                                ) : (
                                    item.end_time || 'N/A'
                                )}
                            </td>
                            <td className="px-2 py-2">
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Appointment;
