import React from "react";

const Appointment = ({ appointments }) => {
    console.log(appointments);
    return (
        <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Email</th>
                    <th scope="col" className="px-6 py-3">Gender</th>
                    <th scope="col" className="px-6 py-3">Payment</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Booked on</th>
                </tr>
            </thead>
            <tbody>
                {appointments?.map((item) => {
                    // Add null/undefined checks
                    const user = item.user || {}; // Provide default empty object if user is undefined
                    return (
                        <tr key={item.id}>
                            <th
                                scope="row"
                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                            >
                                {user.photo && (
                                    <img
                                        src={user.photo}
                                        className="w-10 h-10 rounded-full"
                                        alt=""
                                    />
                                )}
                                <div className="pl-3">
                                    <div className="text-base font-semibold">{user.name || 'N/A'}</div>
                                </div>
                            </th>
                            <td className="px-6 py-4">{user.email || 'N/A'}</td>
                            <td className="px-6 py-4">{user.gender || 'N/A'}</td>
                            <td className="px-6 py-4">
                                {item.isPaid ? (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                        Paid
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                                        Unpaid
                                    </div>
                                )}
                            </td>
                            <td>{item.ticket_price || 'N/A'}</td>
                            <td>{item.appointment_date || 'N/A'}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Appointment;
