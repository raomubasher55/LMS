"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TranslatedText from "@/components/shared/TranslatedText";

const ContactFrom = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Échec de l'envoi du formulaire");
      }

      setStatus("Message envoyé avec succès !");
      setFormData({
        name: "",
        email: "",
        service: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus(error.message || "Une erreur s'est produite !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="container pb-100px">
        <form
          onSubmit={handleSubmit}
          className="p-5 md:p-70px md:pt-90px border border-borderColor2 dark:border-transparent dark:shadow-container"
          data-aos="fade-up"
        >
          {/* Heading */}
          <div className="mb-10">
            <h4
              className="text-size-23 md:text-size-44 font-bold leading-10 md:leading-70px text-blackColor dark:text-blackColor-dark"
              data-aos="fade-up"
            >
              <TranslatedText>Laissez-nous un message</TranslatedText>
            </h4>
            <p
              data-aos="fade-up"
              className="text-size-13 md:text-base leading-5 md:leading-30px text-contentColor dark:text-contentColor-dark"
            >
              <TranslatedText>
                Votre adresse e-mail ne sera pas publiée. Les champs obligatoires sont marqués *
              </TranslatedText>
            </p>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 xl:grid-cols-2 mb-30px gap-30px">
            <div data-aos="fade-up" className="relative">
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrez votre nom*"
                required
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder h-15 leading-15 font-medium rounded"
              />
              <div className="text-xl text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-businessman"></i>
              </div>
            </div>

            <div data-aos="fade-up" className="relative">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre adresse e-mail*"
                required
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder h-15 leading-15 font-medium rounded"
              />
              <div className="text-xl text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-envelope"></i>
              </div>
            </div>

            <div data-aos="fade-up" className="relative">
              <input
                name="service"
                type="text"
                value={formData.service}
                onChange={handleChange}
                placeholder="Écrivez le type de service"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder h-15 leading-15 font-medium rounded"
              />
              <div className="text-xl text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-edit"></i>
              </div>
            </div>

            <div data-aos="fade-up" className="relative">
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Entrez votre numéro de téléphone"
                className="w-full pl-26px bg-transparent focus:outline-none text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder h-15 leading-15 font-medium rounded"
              />
              <div className="text-xl text-primaryColor absolute right-6 top-1/2 -translate-y-1/2">
                <i className="icofont-ui-call"></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="relative" data-aos="fade-up">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Entrez votre message ici"
              required
              className="w-full pl-26px bg-transparent text-contentColor dark:text-contentColor-dark border border-borderColor2 dark:border-borderColor2-dark placeholder:text-placeholder rounded"
              cols="30"
              rows="10"
            />
            <div className="text-xl text-primaryColor absolute right-6 top-[17px]">
              <i className="icofont-pen-alt-2"></i>
            </div>
          </div>

          {/* Button */}
          <div className="mt-30px" data-aos="fade-up">
            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? (
                <TranslatedText>Envoi en cours...</TranslatedText>
              ) : (
                <TranslatedText>Poster un commentaire</TranslatedText>
              )}
            </ButtonPrimary>
          </div>

          {/* Status Message */}
          {status && (
            <p className="mt-4 text-center text-primaryColor font-medium">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactFrom;
