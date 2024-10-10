import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePosting = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    timeSlots: [],
    about: "",
    photo: null,
    password: "",
  });

  useEffect(() => {
    if (doctorData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        timeSlots: doctorData.doctor?.timeSlots || [],
      }));
    }
  }, [doctorData]);

  // Handle input change for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Add a new time slot
  const addTimeSlot = (e) => {
    e.preventDefault();
    addItems("timeSlots", {
      date: new Date(),
      startingTime: "",
      endingTime: "",
    });
  };

  const addItems = (key, items) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], items],
    }));
  };

  // Handle date and time changes
  const handleTimeSlotChange = (index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedItems = [...prevFormData.timeSlots];
      updatedItems[index][name] = value;
      return {
        ...prevFormData,
        timeSlots: updatedItems,
      };
    });
  };

  const handleDateChange = (date, index) => {
    setFormData((prevFormData) => {
      const updatedItems = [...prevFormData.timeSlots];
      updatedItems[index].date = date;
      return {
        ...prevFormData,
        timeSlots: updatedItems,
      };
    });
  };

  // Handle file input change
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: data?.url,
    }));
  };

  // Reusable function for deleting item
  const deleteItem = (key, index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  const deleteTimeSlot = (e, index) => {
    e.preventDefault();
    deleteItem("timeSlots", index);
  };

  const submitTimeSlots = async (e) => {
    e.preventDefault();

    if (!doctorData?.doctor?.id) {
      toast.error("Doctor data is not loaded. Please try again.");
      return;
    }

    try {
      const timeSlotsData = formData.timeSlots.map((slot) => ({
        user_id: 1, // Replace this with dynamic user_id if needed
        ticket_price: formData.ticketPrice || "100.00",
        date: slot.date.toISOString().split("T")[0], // Ensure date is in correct format
        startingTime: slot.startingTime,
        endingTime: slot.endingTime,
      }));

      const res = await fetch(
        `${BASE_URL}/bookings/doctors/${doctorData.doctor.id}/timeSlots`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(timeSlotsData),
        }
      );

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success("Time slots posted successfully!");
    } catch (err) {
      console.error("Error in submission: ", err);
      toast.error(err.message);
    }
  };


  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Posting Available Timeslot
      </h2>
      <form>
        {/* Time Slot */}
        <div className="mb-5">
          <p className="form__label">Time Slot</p>
          {formData.timeSlots.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 md:grid-cols-4 mb-[25px] gap-5">
                <div>
                  <p className="form__label">Date</p>
                  <DatePicker
                    selected={item.date}
                    onChange={(date) => handleDateChange(date, index)}
                    className="form__input py-3.5"
                    dateFormat="yyyy/MM/dd"
                  />
                </div>
                <div>
                  <p className="form__label">Starting Time</p>
                  <input
                    type="time"
                    name="startingTime"
                    value={item.startingTime}
                    className="form__input"
                    onChange={(e) =>
                      handleTimeSlotChange(index, e)
                    }
                  />
                </div>
                <div>
                  <p className="form__label">Ending Time</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    className="form__input"
                    onChange={(e) =>
                      handleTimeSlotChange(index, e)
                    }
                  />
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => deleteTimeSlot(e, index)}
                    className="bg-red-500 p-2 rounded-full text-white text-[15px] mt-8"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addTimeSlot} className="btn mt-0">
            Add Time Slot
          </button>
          <button onClick={submitTimeSlots} className="btn mt-0 ml-10">
            Post Available Time
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimePosting;

