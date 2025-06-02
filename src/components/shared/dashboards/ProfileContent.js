"use client";
import React, { useEffect, useState } from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import axios from "axios";

const ProfileContent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    skill: "",
    bio: "",
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        phoneNumber: user.phoneNumber || "",
        skill: user.skill || "",
        bio: user.bio || "",
      });
      setUserId(user._id); 
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 200) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong!");
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
      data-aos="fade-up"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 mb-15px gap-y-15px gap-x-30px">
        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Zahid" />
        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ghotia" />
        <InputField label="User Name" name="username" value={formData.username} onChange={handleChange} placeholder="zahiddeveloper" />
        <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1-202-555-0174" />
        <InputField label="Skill/Occupation" name="skill" value={formData.skill} onChange={handleChange} placeholder="Full Stack Developer" />
      </div>

      <div className="mb-15px">
        <label className="mb-3 block font-semibold">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
          rows="5"
        />
      </div>

      <div className="mt-15px">
        <ButtonPrimary type="submit">Update Info</ButtonPrimary>
      </div>
    </form>
  );
};

// Input field component
const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="mb-3 block font-semibold">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
    />
  </div>
);

export default ProfileContent;
