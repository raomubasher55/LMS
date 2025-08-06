import { useEffect, useState } from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import axios from "axios"; 

const SocialIconContent = () => {
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    website: "",
    github: "",
  });
 const [user , setUser] = useState(null)

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setUser(user);
  }
 },[])
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
    if (!token) {
      console.error("User token not found");
      return;
    }
  
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/social-links`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );
      alert(res.data.message)
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
  
    } catch (err) {
      console.error("Error saving social links:", err.response?.data || err.message);
    }
  };
  
  
  return (
    <form
      className="text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
      data-aos="fade-up"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 mb-15px gap-y-15px gap-x-30px">
        <div>
          <label className="mb-3 block font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-facebook inline-block mr-1"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </label>
          <input
            type="text"
            name="facebook"
            placeholder={user?.instructorProfile?.socialLinks?.facebook || "https://www.facebook.com"}
            value={formData.facebook}
            onChange={handleChange}
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-twitter inline-block mr-1"
            >
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
            Twitter
          </label>
          <input
            type="text"
            name="twitter"
            placeholder={user?.instructorProfile?.socialLinks?.twitter || "https://www.twitter.com"}
            value={formData.twitter}
            onChange={handleChange}
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-linkedin inline-block mr-1"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            Linkedin
          </label>
          <input
            type="text"
            name="linkedin"
            placeholder={user?.instructorProfile?.socialLinks?.linkedin || "https://www.linkedin.com"}
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-layout inline-block mr-1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            Website
          </label>
          <input
            type="text"
            name="website"
            placeholder={user?.instructorProfile?.socialLinks?.website || "https://www.google.com"}
            value={formData.website}
            onChange={handleChange}
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>

        <div>
          <label className="mb-3 block font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-github inline-block mr-1"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            Github
          </label>
          <input
            type="text"
            name="github"
            placeholder={user?.instructorProfile?.socialLinks?.github || "https://www.github.com"}
            value={formData.github}
            onChange={handleChange}
            className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
          />
        </div>
      </div>

      <div className="mt-15px">
        <ButtonPrimary type={"submit"}>Update Social</ButtonPrimary>
      </div>
    </form>
  );
};

export default SocialIconContent;
