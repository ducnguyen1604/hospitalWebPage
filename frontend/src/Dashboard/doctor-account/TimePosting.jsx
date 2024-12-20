import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from "../../utils/uploadCloudinary";
import { BASE_URL, token } from "../../config";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TimePosting = ({ doctorData, onPostSuccess }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

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

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);

    setFormData((prevFormData) => ({
      ...prevFormData,
      photo: data?.url,
    }));
  };

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

  // Helper function to check for time conflicts within timeSlots
  const hasTimeConflict = (timeSlots) => {
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        const slotA = timeSlots[i];
        const slotB = timeSlots[j];
        if (
          slotA.date.getTime() === slotB.date.getTime() && // Check same date
          ((slotA.startingTime < slotB.endingTime &&
            slotA.endingTime > slotB.startingTime) || // Check overlapping times
            (slotB.startingTime < slotA.endingTime &&
              slotB.endingTime > slotA.startingTime))
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const submitTimeSlots = async (e) => {
    e.preventDefault();

    if (!doctorData?.doctor?.id) {
      toast.error("Doctor data is not loaded. Please try again.");
      return;
    }

    if (formData.timeSlots.length === 0) {
      toast.error("Please add at least one time slot before submitting.");
      return;
    }

    for (const slot of formData.timeSlots) {
      if (!slot.date || !slot.startingTime || !slot.endingTime) {
        toast.error("Please fill out all fields for each time slot.");
        return;
      }

      if (slot.startingTime >= slot.endingTime) {
        toast.error("End time cannot be before or equal to the start time.");
        return;
      }
    }

    try {
      const timeSlotsData = formData.timeSlots.map((slot) => {
        const formattedDate = `${slot.date.getFullYear()}-${String(
          slot.date.getMonth() + 1
        ).padStart(2, "0")}-${String(slot.date.getDate()).padStart(2, "0")}`;

        return {
          user_id: slot.user_id || null,
          ticket_price: formData.ticketPrice || "100.00",
          date: formattedDate,
          startingTime: slot.startingTime,
          endingTime: slot.endingTime,
        };
      });

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

      const result = await res.json();

      if (result.conflicts && result.conflicts.length > 0) {
        result.conflicts.forEach((conflict) => {
          toast.error(conflict); // Show each conflict as a toast message
        });
        return; // Stop further execution if there were conflicts
      }

      if (!res.ok) {
        toast.error(result.message || "Failed to post time slots.");
        return;
      }

      toast.success("Time slots posted successfully!");

      if (onPostSuccess) {
        onPostSuccess();
      }
    } catch (err) {
      console.error("Error in submission: ", err);
      toast.error("An error occurred while posting time slots.");
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
                    onChange={(e) => handleTimeSlotChange(index, e)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Time</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    className="form__input"
                    onChange={(e) => handleTimeSlotChange(index, e)}
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
