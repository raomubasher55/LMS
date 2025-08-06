import React, { useState } from "react";
import axios from "axios";
import ButtonPrimary from "../buttons/ButtonPrimary";
import TranslatedText from "../TranslatedText";

const PasswordContent = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-password`,
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Password updated successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Password update failed:", error);
      alert(error.response?.data?.message || "Failed to update password.");
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="text-sm text-blackColor dark:text-blackColor-dark leading-1.8"
  data-aos="fade-up"
>
  <div className="grid grid-cols-1 mb-15px gap-y-15px gap-x-30px">
    <div>
      <label className="mb-3 block font-semibold">
        <TranslatedText>Mot de passe actuel</TranslatedText>
      </label>
      <input
        type="password"
        name="currentPassword"
        placeholder="Mot de passe actuel"
        value={form.currentPassword}
        onChange={handleChange}
        className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
      />
    </div>

    <div>
      <label className="mb-3 block font-semibold">
        <TranslatedText>Nouveau mot de passe</TranslatedText>
      </label>
      <input
        type="password"
        name="newPassword"
        placeholder="Nouveau mot de passe"
        value={form.newPassword}
        onChange={handleChange}
        className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
      />
    </div>

    <div>
      <label className="mb-3 block font-semibold">
        <TranslatedText>Retaper le nouveau mot de passe</TranslatedText>
      </label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Retaper le nouveau mot de passe"
        value={form.confirmPassword}
        onChange={handleChange}
        className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md font-no"
      />
    </div>
  </div>

  <div className="mt-15px">
    <ButtonPrimary type="submit">
      <TranslatedText>Mettre à jour le mot de passe</TranslatedText>
    </ButtonPrimary>
  </div>
</form>

  );
};

export default PasswordContent;
