import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext"; // Authentication context
import Loading from "../../components/Loader/Loading";
import { BASE_URL, token } from "../../config";

const SidePanel = () => {
  const { doctorId } = useParams(); // Get the doctorId from route params
  const navigate = useNavigate(); // React Router navigation
  const { user } = useContext(authContext); // Get logged-in user from context

  const [slots, setSlots] = useState([]); // Store time slots
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Manage error state
  const [selectedSlot, setSelectedSlot] = useState(null); // Track selected slot
  const [isModelOpen, setIsModalOpen] = useState(false);

  // Fetch time slots from the backend
  const fetchSlots = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch(`${BASE_URL}/bookings/doctors/${doctorId}`);
      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) throw new Error("Failed to fetch slots");
      if (Array.isArray(data)) {
        setSlots(data.filter((slot) => String(slot.user_id) === "0")); // Filter available slots
      } else if (data.data && Array.isArray(data.data)) {
        // If the API returns an object, and slots are in the "data" field
        setSlots(data.data.filter((slot) => String(slot.user_id) === "0"));
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };

  // Run fetchSlots when component mounts
  useEffect(() => {
    fetchSlots();
  }, []); // Only run on mount

  const handleSlotSelect = (slotId) => {
    setSelectedSlot((prevSelectedSlot) =>
      prevSelectedSlot === slotId ? null : slotId
    );
  };

  const handleBooking = async () => {
    //console.log("User ID:", user.id, "Selected Slot:", selectedSlot);

    if (!user) {
      toast.warning("Please log in to book a time slot.");
      navigate("/login");
      return;
    }

    if (user.role === "doctor") {
      toast.error("Doctors cannot book appointments.");
      return;
    }

    if (selectedSlot) {
      const slot = slots.find((slot) => slot.id === selectedSlot);

      try {
        const res = await fetch(`${BASE_URL}/bookings/${slot.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            appointment_date: slot.appointment_date,
            ticket_price: slot.ticket_price,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_paid: slot.is_paid,
            status: slot.status
          }),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          toast.success("Appointment booked successfully!");
          setSelectedSlot(null); // Clear selected slot
          fetchSlots(); // Refresh available slots after booking
        } else {
          toast.error(result.message || "Failed to book the appointment.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while booking the appointment.");
      }
    } else {
      toast.warning("Please select a time slot to book.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Ticket Price
        </p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          500 SGD
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-headingColor">
          Available Time Slots:
        </p>
        {slots.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot.id)}
                className={`px-4 py-2 rounded-full border transition-transform duration-150 active:scale-95 ease-in-out transform ${
                  selectedSlot === slot.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border-blue-600"
                }`}
              >
                {`${slot.appointment_date.split(" ")[0]} | ${
                  slot.start_time
                } - ${slot.end_time}`}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-textColor">No available time slots found.</p>
        )}
      </div>

      <button
        onClick={handleBooking}
        className={`btn px-2 w-full rounded-md mt-5 transition-transform duration-100 ease-in-out ${
          selectedSlot ? "active:bg-blue-700" : "opacity-50 cursor-not-allowed"
        }`}
        disabled={!selectedSlot} // Disable booking if no slot is selected
      >
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;
