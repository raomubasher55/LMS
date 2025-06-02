"use client"
import React, { useEffect, useState } from "react";

const ProfileDetails = () => {
  const [user , setUser] = useState('')
  useEffect(()=> {
    const user = localStorage.getItem('user')
    setUser(JSON.parse(user))
  },[])

  return (
    <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
      <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
        <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
          My Profile
        </h2>
      </div>

      <div>
        <ul>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Registration Date</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
            {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">First Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.firstName || "No Name Provided"}</span>
            </div>
          </li>
          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Last Name</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.lastName || "No Name Provided" }</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Username</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block"> @{user?.username || "No Username Provided"}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Email</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block"> {user?.email || "No Email"}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Phone Number</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.phoneNumber || "No Phone Number"}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Expert</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">{user?.skill || "No Skills Listed"}</span>
            </div>
          </li>

          <li className="text-lg text-contentColor dark:text-contentColor-dark leading-1.67 grid grid-cols-1 md:grid-cols-12 gap-x-30px mt-15px">
            <div className="md:col-start-1 md:col-span-4">
              <span className="inline-block">Biography</span>
            </div>
            <div className="md:col-start-5 md:col-span-8">
              <span className="inline-block">
              {user?.bio || "No Bio"}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDetails;
