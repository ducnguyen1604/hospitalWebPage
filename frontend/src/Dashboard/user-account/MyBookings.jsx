import React, { useState, useEffect, useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaVideo, FaMoneyBillWave } from "react-icons/fa"; // Video call icon
import { BASE_URL, token } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { authContext } from "../../context/AuthContext";
import { toast } from "react-toastify"; // Toast notifications
import Modal from "react-modal"; // Import Modal
import qrImage from "../../assets/images/qr-payment.jpg";

// Initialize Modal to avoid accessibility issues
Modal.setAppElement("#root");

const MyBookings = () => {
  const { user } = useContext(authContext); // Get authenticated user
  const { data, loading, error } = useFetchData(
    `${BASE_URL}/users/bookings/getMyAppointments`
  );
  const [appointments, setAppointments] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // State to track sorting order
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Extract bookings and map doctor names when the data changes
  useEffect(() => {
    if (data && data.bookings) {
      const userBookings = data.bookings.filter(
        (item) => item.user_id === user?.id
      );
      setAppointments(userBookings);
    }
  }, [data, user]);

  // Toggle sorting order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  console.log(appointments);

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.appointment_date);
    const dateB = new Date(b.appointment_date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleDelete = async (id) => {
    const appointment = appointments.find((item) => item.id === id);

    if (!appointment) {
      toast.error("Appointment not found.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: 0,
          appointment_date: appointment.appointment_date,
          ticket_price: appointment.ticket_price,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
        }),
      });

      const result = await res.json();
      console.log("Response:", result);

      if (res.ok) {
        toast.success("Booking removed successfully!");
        setAppointments((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(result.message || "Failed to remove the booking.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while removing the booking.");
    }
  };

  const handleVideoCallClick = (appointment) => {
    const roomId = `${appointment.id}${appointment.doctor_id}${appointment.user_id}`;
    const videoCallUrl = `https://careplus-prediagnosis.netlify.app/index.html?room=${roomId}`;
    window.open(videoCallUrl, "_blank"); // Open in a new tab
  };

  /////PAYMENT

  const handlePaymentClick = (appointment) => {
    if (String(appointment.is_paid) === 1) {
      toast.info("This appointment is already paid.");
      return;
    }
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handlePaymentConfirmation = async () => {
    try {
      const appointment = selectedAppointment;

      if (!appointment || !appointment.id) {
        toast.error("Invalid appointment selected.");
        return;
      }

      //console.log("Sending PUT request for booking:", appointment);

      // Ensure the appointment ID is correctly included in the URL
      const res = await fetch(`${BASE_URL}/bookings/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: appointment.user_id,
          appointment_date: appointment.appointment_date,
          ticket_price: appointment.ticket_price,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          is_paid: 1,
          status: "approved",
        }),
      });

      const result = await res.json();
      //console.log("Payment Response:", result);

      if (res.ok) {
        toast.success("Payment confirmed and appointment approved!");
        setAppointments((prev) =>
          prev.map((item) =>
            item.id === appointment.id
              ? { ...item, is_paid: 1, status: "approved" }
              : item
          )
        );
        setIsModalOpen(false);
      } else {
        toast.error(result.message || "Failed to confirm payment.");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("An error occurred while confirming the payment.");
    }
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "8px",
      width: "400px",
      textAlign: "center",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };
  ////PAYMENT

  if (loading) return <Loading />;
  if (error) return <Error errMessage={error} />;

  return (
    <div className="max-w-[900px] mx-auto overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-500 mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-2 py-2">Doctor</th>
            <th className="px-2 py-2 cursor-pointer" onClick={toggleSortOrder}>
              Date {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="px-2 py-2">Start Time</th>
            <th className="px-2 py-2">End Time</th>
            <th className="px-2 py-2">Price</th>
            <th className="px-2 py-2">Payment Status</th>
            <th className="px-2 py-2">Actions</th>
            <th className="px-2 py-2">Video Call</th>
            <th className="px-2 py-2">Pay your bookings</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((appointment) => {
            const doctor = data.doctors.find(
              (doc) => doc.id === appointment.doctor_id
            );
            return (
              <tr key={appointment.id}>
                <td className="px-2 py-2">{doctor?.name || "Unknown"}</td>
                <td className="px-2 py-2">
                  {appointment.appointment_date?.split(" ")[0] || "N/A"}
                </td>
                <td className="px-2 py-2">{appointment.start_time || "N/A"}</td>
                <td className="px-2 py-2">{appointment.end_time || "N/A"}</td>
                <td className="px-2 py-2">
                  {appointment.ticket_price || "N/A"}
                </td>
                <td className="px-2 py-2">
                  {String(appointment.is_paid) !== "0" ? (
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
                  <AiOutlineDelete
                    onClick={() => handleDelete(appointment.id)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  />
                  DELETE
                </td>
                <td className="px-2 py-2 ">
                  <FaVideo
                    onClick={() => handleVideoCallClick(appointment)}
                    className="cursor-pointer text-green-600 hover:text-green-800"
                  />
                  CALL
                </td>
                {String(appointment.is_paid) !== "1" && (
                  <td className="px-2 py-2">
                    <FaMoneyBillWave
                      onClick={() => handlePaymentClick(appointment)}
                      className="cursor-pointer text-yellow-600 hover:text-yellow-800"
                    />
                    PAY
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
        <p className="text-lg mb-2">
          Ticket Price: {selectedAppointment?.ticket_price || "N/A"} SGD
        </p>

        <img src={qrImage} alt="QR CODE" className="w-full h-auto mb-4" />
        <button
          onClick={handlePaymentConfirmation}
          className="btn w-full bg-blue-600 text-white mt-4"
        >
          Confirm Payment
        </button>
      </Modal>

      {appointments.length === 0 && (
        <h2 className="mt-5 text-center text-[20px] font-semibold text-primaryColor">
          You have no bookings yet.
        </h2>
      )}
    </div>
  );
};

export default MyBookings;
