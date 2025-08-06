"use client";
import TranslatedText from "@/components/shared/TranslatedText";
import { useState } from "react";

const CreateBlogModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "General",
    tags: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    isCommentEnabled: true,
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          featuredImage: "Image size should be less than 5MB",
        }));
        return;
      }
      setFeaturedImage(file);
      setErrors((prev) => ({ ...prev, featuredImage: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title should be less than 60 characters";
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription =
        "Meta description should be less than 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if selected
      if (featuredImage) {
        formDataToSend.append("featuredImage", featuredImage);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || "Failed to create blog" });
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              <TranslatedText>Créer un nouvel article de blog</TranslatedText>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Titre</TranslatedText> *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Entrez le titre du blog"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Extrait</TranslatedText>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Brève description du blog"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <TranslatedText>Catégorie</TranslatedText>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">
                      <TranslatedText>Toutes les catégories</TranslatedText>
                    </option>
                    <option value="Technology">
                      <TranslatedText>Technologie</TranslatedText>
                    </option>
                    <option value="Education">
                      <TranslatedText>Éducation</TranslatedText>
                    </option>
                    <option value="Business">
                      <TranslatedText>Affaires</TranslatedText>
                    </option>
                    <option value="General">
                      <TranslatedText>Général</TranslatedText>
                    </option>
                    <option value="Career">
                      <TranslatedText>Carrière</TranslatedText>
                    </option>
                    <option value="Development">
                      <TranslatedText>Développement</TranslatedText>
                    </option>
                    <option value="Design">
                      <TranslatedText>Design</TranslatedText>
                    </option>
                    <option value="Marketing">
                      <TranslatedText>Marketing</TranslatedText>
                    </option>
                    <option value="AI_ML">
                      <TranslatedText>
                        Intelligence Artificielle & Machine Learning
                      </TranslatedText>
                    </option>
                    <option value="Productivity">
                      <TranslatedText>Productivité</TranslatedText>
                    </option>
                    <option value="Inspiration">
                      <TranslatedText>Inspiration</TranslatedText>
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <TranslatedText>Statut</TranslatedText>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>
                    Étiquettes (séparées par des virgules)
                  </TranslatedText>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., javascript, react, tutorial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Image mise en avant</TranslatedText>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                {errors.featuredImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.featuredImage}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Contenu</TranslatedText> *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Rédigez le contenu de votre blog ici..."
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Titre méta (SEO)</TranslatedText>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SEO title (max 60 characters)"
                  maxLength={60}
                />
                {errors.metaTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.metaTitle}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaTitle.length}/60
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TranslatedText>Description méta (SEO)</TranslatedText>
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SEO description (max 160 characters)"
                  maxLength={160}
                />
                {errors.metaDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.metaDescription}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.metaDescription.length}/160
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isCommentEnabled"
                  checked={formData.isCommentEnabled}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  <TranslatedText>Activer les commentaires</TranslatedText>
                </label>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <TranslatedText>Annuler</TranslatedText>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <TranslatedText>Création en cours...</TranslatedText>
              ) : (
                <TranslatedText>Créer un article</TranslatedText>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogModal;
