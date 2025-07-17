"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  AlertCircle,
  Loader,
} from "lucide-react";
import TranslatedText from "@/components/shared/TranslatedText";
const BecomeAnInstructorPrimary = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    expertise: "",
    experience: "",
    courseTopics: "",
    teachingExperience: "",
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (!formData.expertise.trim())
      newErrors.expertise = "Area of expertise is required";
    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";
    if (!formData.courseTopics.trim())
      newErrors.courseTopics = "Course topics are required";
    if (!formData.teachingExperience.trim())
      newErrors.teachingExperience = "Teaching experience is required";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            applicationDate: new Date().toISOString(),
            status: "pending",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "",
        expertise: "",
        experience: "",
        courseTopics: "",
        teachingExperience: "",
        agreeToTerms: false,
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    <TranslatedText>
      Expertise avérée dans votre domaine avec des qualifications pertinentes
    </TranslatedText>,
    <TranslatedText>
      Minimum 2 ans d'expérience professionnelle ou d'enseignement dans votre
      domaine
    </TranslatedText>,
    <TranslatedText>
      Excellentes compétences en communication et passion pour l'enseignement en
      ligne
    </TranslatedText>,
    <TranslatedText>
      Capacité à créer un contenu vidéo attrayant et de haute qualité
    </TranslatedText>,
    <TranslatedText>
      Engagement envers la réussite des étudiants et communication réactive
    </TranslatedText>,
  ];

  const benefits = [
    <TranslatedText>
      Gagnez jusqu'à 70 % de part des revenus de vos ventes de cours
    </TranslatedText>,
    <TranslatedText>
      Accès au soutien marketing et promotionnel de Tanga Academy
    </TranslatedText>,
    <TranslatedText>
      Outils et ressources professionnels pour la création de cours
    </TranslatedText>,
    <TranslatedText>
      Portée mondiale auprès d'étudiants dans plusieurs pays
    </TranslatedText>,
    <TranslatedText>
      Soutien dédié aux formateurs et communauté active
    </TranslatedText>,
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <TranslatedText>
              Rejoignez Tanga Academie en tant que formateur
            </TranslatedText>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            <TranslatedText>
              Partagez votre expertise avec des milliers d'apprenants
              enthousiastes dans le monde entier. Créez et vendez vos cours en
              ligne tout en ayant un impact significatif sur la vie des
              étudiants.
            </TranslatedText>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Information */}
          <div className="space-y-8">
            <div className=" rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="mr-3 text-blue-600" />
                <TranslatedText>
                  Pourquoi devenir formateur chez Tanga Academy ?
                </TranslatedText>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                <TranslatedText>
                  Tanga Academy est la plateforme d’apprentissage en ligne de
                  premier plan, connectant des éducateurs passionnés avec des
                  étudiants désireux de faire progresser leur carrière et leurs
                  compétences. En tant que formateur, vous aurez l’opportunité
                  de monétiser vos connaissances tout en construisant une marque
                  d’enseignement mondiale.
                </TranslatedText>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Instructor Benefits
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-400">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className=" rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                <TranslatedText>Exigences pour les formateurs</TranslatedText>
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <TranslatedText>
                  Pour maintenir la haute qualité de l’enseignement sur Tanga
                  Academy, nous recherchons des formateurs qui répondent à ces
                  critères :
                </TranslatedText>
              </p>

              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-400">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue to-indigo rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-4">
                <TranslatedText>
                  Commencez votre parcours d'enseignement
                </TranslatedText>
              </h3>
              <p className="mb-4">
                <TranslatedText>
                  Rejoignez plus de 500 formateurs à succès qui ont déjà créé
                  des entreprises florissantes de cours en ligne avec Tanga
                  Academy. Notre plateforme vous fournit tout ce dont vous avez
                  besoin pour réussir.
                </TranslatedText>
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">50,000+</div>
                  <div className="text-blue-200">
                    <TranslatedText>Étudiants actifs</TranslatedText>
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1,200+</div>
                  <div className="text-blue-200">
                    <TranslatedText>Cours disponibles</TranslatedText>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className=" rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              <TranslatedText>Formulaire de candidature</TranslatedText>
            </h2>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">
                  <TranslatedText>
                    Candidature soumise avec succès ! Nous examinerons votre
                    demande et vous répondrons dans un délai de 3 à 5 jours
                    ouvrables.
                  </TranslatedText>
                </span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">
                  <TranslatedText>
                    Une erreur s est produite lors de l envoi de votre
                    candidature. Veuillez reessayer.
                  </TranslatedText>
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <TranslatedText>Prénom *</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez votre prénom"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <TranslatedText>Nom de famille *</TranslatedText>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="votre nom de famille"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Adresse e-mail *</TranslatedText>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Numéro de téléphone *</TranslatedText>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+92308 2769 473"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Domaine d'expertise *</TranslatedText>
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.expertise ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Développement Web, Marketing Digital, Science des Données"
                />
                {errors.expertise && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.expertise}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Expérience Professionnelle *</TranslatedText>
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.experience ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Décrivez votre parcours professionnel et votre expérience pertinente..."
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.experience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>
                    Sujets de cours que vous souhaitez enseigner *
                  </TranslatedText>
                </label>
                <textarea
                  name="courseTopics"
                  value={formData.courseTopics}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.courseTopics ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Indiquez les sujets ou cours spécifiques que vous souhaitez créer..."
                />
                {errors.courseTopics && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.courseTopics}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Expérience d’enseignement *</TranslatedText>
                </label>
                <textarea
                  name="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.teachingExperience
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Décrivez toute expérience d’enseignement, de formation ou de mentorat que vous avez..."
                />
                {errors.teachingExperience && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.teachingExperience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>
                    Biographie / À propos de vous * (minimum 100 mots requis et
                    maximum 1000 mots)
                  </TranslatedText>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Parlez-nous de vous, de votre parcours et de ce qui vous motive à enseigner..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue outline-none bg-transparent border-gray-300 rounded"
                />
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  <TranslatedText>
                    J'accepte les conditions de Tanga Academie
                  </TranslatedText>{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <TranslatedText>
                      Conditions générales pour les instructeurs
                    </TranslatedText>
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    <TranslatedText>
                      Politique de confidentialité
                    </TranslatedText>
                  </a>
                  <TranslatedText>
                    Je comprends que ma candidature sera examinée et que je
                    serai contacté(e) sous 3 à 5 jours ouvrables. *
                  </TranslatedText>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue to-indigo text-white font-semibold py-4 px-6 rounded-lg hover:from-blue hover:to-indigo transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    <TranslatedText>Envoi de la candidature...</TranslatedText>
                  </>
                ) : (
                  <TranslatedText>Envoi de la candidature...</TranslatedText>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeAnInstructorPrimary;
