"use client";
import { useState } from "react";
import axios from "axios";
import useSweetAlert from "@/hooks/useSweetAlert";
import TranslatedText from "../TranslatedText";

const CommentFome = ({ courseId }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    website: "",
    message: "",
  });
const createSweetAlert= useSweetAlert()

  // Form input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage or sessionStorage
    const token =
      typeof window !== "undefined" &&
      (localStorage.getItem("token") || sessionStorage.getItem("token"));

    if (!token) {
      createSweetAlert("error" ,"User not authenticated. Please login first.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments`, 
        {
          courseId,
          name: formData.name,
          email: formData.email,
          number: formData.number,
          website: formData.website,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      console.log("Comment posted successfully", response.data);
      createSweetAlert("success" ,"Comment posted successfully!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        number: "",
        website: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to post comment", error);
      createSweetAlert("error" ,"Failed to post comment");
    }
  };

  return (
    <div className="pt-50px">
      <h4
        className="text-size-26 font-bold text-blackColor dark:text-blackColor-dark mb-30px !leading-30px"
        data-aos="fade-up"
      >
        <TranslatedText>Écrivez votre commentaire</TranslatedText>
      </h4>

      <form onSubmit={handleSubmit} className="pt-5" data-aos="fade-up">
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-30px mb-10 gap-10">
          <input
            type="text"
            name="name"
            placeholder="Entrez votre nom*"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Entrez votre e-mail*"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-30px mb-10 gap-10">
          <input
            type="text"
            name="number"
            placeholder="Entrez votre numéro*"
            value={formData.number}
            onChange={handleChange}
            className="w-full pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
          />
          <input
            type="text"
            name="website"
            placeholder="Website*"
            value={formData.website}
            onChange={handleChange}
            className="w-full pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded"
          />
        </div>

        <textarea
          name="message"
          placeholder="Entrez votre message*"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-5 mb-2 bg-transparent text-sm text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark rounded"
          cols="30"
          rows="8"
        />

        <div data-aos="fade-up" className="text-center">
          <input type="checkbox" defaultChecked />{" "}
          <span className="text-size-15 text-contentColor dark:text-contentColor-dark font-medium text-center">
<TranslatedText>Enregistrer mon nom, mon e-mail et mon site web dans ce navigateur pour la prochaine fois que je commenterai.</TranslatedText>

          </span>
        </div>

        <div className="mt-30px text-center">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-primaryColor px-70px py-13px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <TranslatedText>Publier un commentaire</TranslatedText>

          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentFome;
