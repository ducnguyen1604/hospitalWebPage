import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const Profile = ({ doctorData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    ticketPrice: 0,
    //qualifications: [],
    //experiences: [],
    timeSlots: [],
    about: '',
    photo: null,
    password: '',
  });
  
  useEffect(() => {
    if (doctorData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: doctorData.doctor?.name || '',
        email: doctorData.doctor?.email || '',
        phone: doctorData.doctor?.phone || '',
        bio: doctorData.doctor?.bio || '',
        gender: doctorData.doctor?.gender || '',
        specialization: doctorData.doctor?.specialization || '',
        ticketPrice: doctorData.appointments?.[0]?.ticket_price || 0,
        //qualifications: doctorData.doctor?.qualifications || [],
        //experiences: doctorData.doctor?.experiences || [],
        timeSlots: doctorData.doctor?.timeSlots || [],
        about: doctorData.doctor?.about || '',
        photo: doctorData.doctor?.photo || null,
      }));
    }
  }, [doctorData]);
  

  // Handle input change for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Add a new item to qualifications or experiences
  const addItems = (key, items) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], items],
    }));
  };

  

  const addTimeSlot = (e) => {
    e.preventDefault();
    addItems('timeSlots', {
      day: '',
      startingTime: '',
      endingTime: '',
    });
  };

  // Handle change for qualifications, experiences, and timeSlots
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      const updatedItems = [...prevFormData[key]];
      updatedItems[index][name] = value;
      return {
        ...prevFormData,
        [key]: updatedItems,
      };
    });
  };


  const handleTimeSlotChange = (event, index) => {
    handleReusableInputChangeFunc('timeSlots', index, event);
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
    deleteItem('timeSlots', index);
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${BASE_URL}/doctors/updateDoctor?id=${doctorData.id}`,
        {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw Error(result.message);
      }

      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }
  };
 
  // Optional code for adding qualification and Experience
  // const addQualification = (e) => {
  //   e.preventDefault();
  //   addItems('qualifications', {
  //     startingDate: '',
  //     endingDate: '',
  //     degree: '',
  //     university: '',
  //   });
  // };

  // const addExperience = (e) => {
  //   e.preventDefault();
  //   addItems('experiences', {
  //     startingDate: '',
  //     endingDate: '',
  //     position: '',
  //     hospital: '',
  //   });
  // };

   //const deleteQualification = (e, index) => {
  //  e.preventDefault();
  //  deleteItem('qualifications', index);
  //};

  // const deleteExperience = (e, index) => {
  //   e.preventDefault();
  //   deleteItem('experiences', index);
  // };

  // const handleQualificationChange = (event, index) => {
  //   handleReusableInputChangeFunc('qualifications', index, event);
  // };

  // const handleExperienceChange = (event, index) => {
  //   handleReusableInputChangeFunc('experiences', index, event);
  // };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>
      <form>
        {/* Name */}
        <div className="mb-5">
          <p className="form__label">Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <p className="form__label">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="form__input"
            readOnly
            disabled
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <p className="form__label">Phone Number</p>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="form__input"
          />
        </div>

        {/* Biography */}
        <div className="mb-5">
          <p className="form__label">Biography</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
            maxLength={1000}
          />
        </div>

        {/* Gender, Specialization, Ticket Price */}
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Gender</p>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <p className="form__label">Specialization</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input py-3.5"
              >
                <option value="">Select</option>
                <option value="surgeon">Surgeon</option>
                <option value="neurologist">Neurologist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>

            <div>
              <p className="form__label">Ticket Price</p>
              <input
                type="number"
                placeholder="100"
                name="ticketPrice"
                value={formData.ticketPrice}
                className="form__input"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        

        {/* Qualifications 
        <div className="mb-5">
          <p className="form__label">Qualifications</p>
          {formData.qualifications.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Starting Date</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item.startingDate}
                    className="form__input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item.endingDate}
                    className="form__input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Degree</p>
                  <input
                    type="text"
                    name="degree"
                    value={item.degree}
                    className="form__input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">University</p>
                  <input
                    type="text"
                    name="university"
                    value={item.university}
                    className="form__input"
                    onChange={(e) => handleQualificationChange(e, index)}
                  />
                </div>
              </div>
              <button
                onClick={(e) => deleteQualification(e, index)}
                className="bg-red-500 p-2 rounded-full text-white text-[15px] mt-2 mb-[30px]"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button onClick={addQualification} className="btn mt-0">
            Add Qualification
          </button>
        </div>
        */}

        {/* Experiences 
        <div className="mb-5">
          <p className="form__label">Experiences</p>
          {formData.experiences.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Starting Date</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item.startingDate}
                    className="form__input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item.endingDate}
                    className="form__input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="form__label">Position</p>
                  <input
                    type="text"
                    name="position"
                    value={item.position}
                    className="form__input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Hospital</p>
                  <input
                    type="text"
                    name="hospital"
                    value={item.hospital}
                    className="form__input"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>
              <button
                onClick={(e) => deleteExperience(e, index)}
                className="bg-red-500 p-2 rounded-full text-white text-[15px] mt-2 mb-[30px]"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button onClick={addExperience} className="btn mt-0">
            Add Experience
          </button>
        </div>
        */}

        {/* Time Slot */}
        <div className="mb-5">
          <p className="form__label">Time Slot</p>
          {formData.timeSlots.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 md:grid-cols-4 mb-[25px] gap-5">
                <div>
                  <p className="form__label">Day</p>
                  <select
                    name="day"
                    value={item.day}
                    className="form__input py-3.5"
                    onChange={(e) => handleTimeSlotChange(e, index)}
                  >
                    <option value="">Select</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <p className="form__label">Starting Time</p>
                  <input
                    type="time"
                    name="startingTime"
                    value={item.startingTime}
                    className="form__input"
                    onChange={(e) => handleTimeSlotChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Time</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    className="form__input"
                    onChange={(e) => handleTimeSlotChange(e, index)}
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
        </div>

        {/* About & Photo Upload */}
        <div className="mb-5">
          <p className="form__label">About</p>
          <textarea
            name="about"
            rows={5}
            value={formData.about}
            placeholder="About You"
            onChange={handleInputChange}
            className="form__input"
          ></textarea>
        </div>

        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img src={formData.photo} alt="" className="w-full rounded-full" />
            </figure>
          )}
          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .png, .jpeg, .heic"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="btn w-full"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
