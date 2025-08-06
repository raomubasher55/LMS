import React, { useState } from "react";
import axios from "axios";
import TranslatedText from "@/components/shared/TranslatedText";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      });

      if (response.data.success) {
        // Store token based on remember me choice
        if (formData.rememberMe) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
          localStorage.setItem('token', response.data.token);
        }

        // Store user data (without password)
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect based on role
        switch (userData.role) {
          case 'admin':
            window.location.href = '/dashboards/admin-dashboard';
            break;
          case 'instructor':
            window.location.href = '/dashboards/instructor-dashboard';
            break;
          case 'student':
            window.location.href = '/dashboards/student-dashboard';
            break;
          default:
            window.location.href = '/';
        }
      }
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(err.response)
        const errorMessage = err.response.data?.message || 
                           (err.response.data?.error?.message || 
                           "Login failed. Please try again.");
        setError(errorMessage);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="opacity-100 transition-opacity duration-150 ease-linear">
      {/* heading */}
      <div className="text-center">
        <h3 className="text-size-32 font-bold text-blackColor dark:text-blackColor-dark mb-2 leading-normal">
          <TranslatedText>Connexion</TranslatedText>
        </h3>
        <p className="text-contentColor dark:text-contentColor-dark mb-15px">
          <TranslatedText>Vous n'avez pas encore de compte?</TranslatedText>
          <a
            href="/register"
            className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
          >
            <TranslatedText>Inscrivez-vous gratuitement</TranslatedText>
          </a>
        </p>
      </div>

      {/* Error message - now properly handling string errors */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {typeof error === 'string' ? error : 'An error occurred'}
        </div>
      )}

      <form className="pt-25px" data-aos="fade-up" onSubmit={handleSubmit}>
        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            <TranslatedText>Nom d'utilisateur ou email</TranslatedText>
          </label>
          <input
            type="text"
            name="emailOrUsername"
            value={formData.emailOrUsername}
            onChange={handleChange}
            placeholder="Votre nom d'utilisateur ou email"
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            required
          />
        </div>

        <div className="mb-25px">
          <label className="text-contentColor dark:text-contentColor-dark mb-10px block">
            <TranslatedText>Mot de passe</TranslatedText>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            className="w-full h-52px leading-52px pl-5 bg-transparent text-sm focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 font-medium rounded"
            required
          />
        </div>

        <div className="text-contentColor dark:text-contentColor-dark flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-18px h-18px mr-2 block box-content"
            />
            <label htmlFor="remember"> <TranslatedText>Se souvenir de moi</TranslatedText></label>
          </div>
          <div>
            <a
              href="/forgot-password"
              className="hover:text-primaryColor relative after:absolute after:left-0 after:bottom-0.5 after:w-0 after:h-0.5 after:bg-primaryColor after:transition-all after:duration-300 hover:after:w-full"
            >
              <TranslatedText>Mot de passe oublié?</TranslatedText>
            </a>
          </div>
        </div>
        <div className="my-25px text-center">
          <button
            type="submit"
            disabled={loading}
            className={`text-size-15 text-whiteColor bg-[#2C3340] dark:bg-primaryColor px-25px py-10px w-full border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? <TranslatedText>Connexion en cours...</TranslatedText> : <TranslatedText>Se connecter</TranslatedText>}
          </button>
        </div>
        {/* other login */}
        <div>
          <p className="text-contentColor dark:text-contentColor-dark text-center relative mb-15px before:w-2/5 before:h-1px before:bg-borderColor4 dark:before:bg-borderColor2-dark before:absolute before:left-0 before:top-4 after:w-2/5 after:h-1px after:bg-borderColor4 dark:after:bg-borderColor2-dark after:absolute after:right-0 after:top-4">
            <TranslatedText>ou se connecter avec</TranslatedText>
          </p>
        </div>
        {/* <div className="text-center flex gap-x-1 md:gap-x-15px lg:gap-x-25px gap-y-5 items-center justify-center flex-wrap">
          <button
            type="button"
            className="text-size-15 text-whiteColor bg-[#2C3340] dark:bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-facebook"></i> Facebook
          </button>
          <button
            type="button"
            className="text-size-15 text-whiteColor bg-[#2C3340] dark:bg-primaryColor px-11 py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
          >
            <i className="icofont-google-plus"></i> Google
          </button>
        </div> */}
      </form>
    </div>
  );
};

export default LoginForm;