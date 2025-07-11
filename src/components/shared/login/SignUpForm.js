import React, { useState, useEffect } from "react";
import TranslatedText from "@/components/shared/TranslatedText";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default role
    profile: null,   
  });
  

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
  
    try {
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('username', formData.username);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('confirmPassword', formData.confirmPassword);
      form.append('role', formData.role);
      
      if (formData.profile) {
        form.append('profile', formData.profile);
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        body: form, // 👈 no need to set Content-Type manually!
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      setSuccess(data.message || "Registered successfully!");
  
      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        profile: null,
      });
  
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="transition-opacity duration-150 ease-linear">
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          <TranslatedText>S'inscrire</TranslatedText>
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          <TranslatedText>Vous avez déjà un compte?</TranslatedText>
          <a
            href="/login"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            <TranslatedText>Se connecter</TranslatedText>
          </a>
        </p>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

      <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Prénom</TranslatedText>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Nom de famille</TranslatedText>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Nom de famille"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Nom d'utilisateur</TranslatedText>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Email</TranslatedText>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-30px gap-y-25px mb-25px">
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Mot de passe</TranslatedText>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
          <div>
            <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
              <TranslatedText>Confirmer le mot de passe</TranslatedText>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            />
          </div>
        </div>

        <div className="grid mb-6">
          <label className="text-contentColor dark:text-contentColor-dark mb-2 block text-sm font-medium">
            <TranslatedText>Je veux m'inscrire en tant que *</TranslatedText>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-transparent text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
          >
            <option value="student" className="bg-transparent dark:bg-gray-800">
              <TranslatedText>Étudiant</TranslatedText>
            </option>
            <option
              value="instructor"
              className="bg-transparent dark:bg-gray-800"
            >
              <TranslatedText>Instructeur</TranslatedText>
            </option>
          </select>
        </div>
        <div className="grid mb-6">
          <label className="text-contentColor dark:text-contentColor-dark mb-2 block text-sm font-medium">
            <TranslatedText>Image de profil</TranslatedText>
          </label>
          <input
            type="file"
            name="profile"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, profile: e.target.files[0] }))
            }
            className="w-full text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark rounded-md p-2"
          />
        </div>

        <div className="text-contentColor dark:text-contentColor-dark flex items-center">
          <input
            type="checkbox"
            id="accept-pp"
            className="w-18px h-18px mr-2 block box-content"
            required
          />
          <label htmlFor="accept-pp"><TranslatedText>Accepter les conditions d'utilisation et la politique de confidentialité</TranslatedText></label>
        </div>

        <div className="mt-25px text-center">
          <button
            type="submit"
            className="text-size-15 text-whiteColor bg-[#2C3340] dark:bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <TranslatedText>S'inscrire</TranslatedText>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
