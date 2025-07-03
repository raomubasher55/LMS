"use client";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";

const CreateCoursePrimary = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    discountedPrice: "",
    category: "All",
    offerType: "premium",
    description: "",
    requirements: "Add your course requirements here.",
    benefits: "Add your course benefits here.",
    tags: "",
    startDate: "",
    language: "English",
    pdfFiles: [],
    bannerImage: null,
    bannerPreview: null,
    certificateFile: null,
    certificatePreview: null,
    chapters: [],
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("course-info");
  const bannerInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const certificateInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);

    switch (type) {
      case "pdf":
        // Validate PDF files
        const invalidPdf = files.find(
          (file) => !file.type.match("application/pdf")
        );
        if (invalidPdf) {
          alert("Please upload only PDF files");
          return;
        }
        setFormData((prev) => ({ ...prev, pdfFiles: files }));
        break;

      case "banner":
        if (files[0]) {
          if (!files[0].type.match("image/(jpeg|png|webp)")) {
            alert("Please select a JPEG, PNG, or WebP image");
            return;
          }

          if (files[0].size > 5 * 1024 * 1024) {
            alert("Banner image must be less than 5MB");
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            setFormData((prev) => ({
              ...prev,
              bannerImage: files[0],
              bannerPreview: reader.result,
            }));
          };
          reader.readAsDataURL(files[0]);
        }
        break;

      case "certificate":
        if (files[0]) {
          if (!files[0].type.match("(image/(jpeg|png|webp)|application/pdf)")) {
            alert("Certificate must be JPEG, PNG, WebP, or PDF");
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            setFormData((prev) => ({
              ...prev,
              certificateFile: files[0],
              certificatePreview: reader.result,
            }));
          };
          reader.readAsDataURL(files[0]);
        }
        break;
    }
  };

  const addNewChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          title: `Chapter ${prev.chapters.length + 1}`,
          order: prev.chapters.length + 1,
          video: {
            url: "",
            duration: 0,
            title: "",
          },
          quiz: null,
          assignment: null,
          isLockedUntilQuizPass: false,
        },
      ],
    }));
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? "" : section);
  };

  const updateChapter = (index, field, value) => {
    const updatedChapters = [...formData.chapters];

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (!updatedChapters[index][parent]) {
        updatedChapters[index][parent] = {};
      }
      updatedChapters[index][parent][child] = value;
    } else {
      updatedChapters[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleChapterVideoUrlChange = (e, chapterIndex) => {
    const url = e.target.value;
    updateChapter(chapterIndex, "video.url", url);
  };

  const removeBanner = () => {
    setFormData((prev) => ({
      ...prev,
      bannerImage: null,
      bannerPreview: null,
    }));
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  const removeCertificate = () => {
    setFormData((prev) => ({
      ...prev,
      certificateFile: null,
      certificatePreview: null,
    }));
    if (certificateInputRef.current) certificateInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.chapters.length === 0) {
      alert("Please add at least one chapter");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "chapters" ||
          key === "pdfFiles" ||
          key === "bannerImage" ||
          key === "certificateFile"
        ) {
          return; // Handle these separately
        }

        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Handle PDF files
      formData.pdfFiles.forEach((file) => {
        formDataToSend.append("pdfFiles", file);
      });

      // Handle banner and certificate
      if (formData.bannerImage) {
        formDataToSend.append("bannerImage", formData.bannerImage);
      }
      if (formData.certificateFile) {
        formDataToSend.append("certificateFile", formData.certificateFile);
      }

      // Handle chapters and videos (without JSON.stringify)
      formData.chapters.forEach((chapter, index) => {
        // Append individual chapter fields
        formDataToSend.append(`chapters[${index}][title]`, chapter.title);
        formDataToSend.append(
          `chapters[${index}][order]`,
          Number(chapter.order) || index + 1
        );
        formDataToSend.append(
          `chapters[${index}][isLockedUntilQuizPass]`,
          chapter.isLockedUntilQuizPass ? "true" : "false"
        );

        if (chapter.video?.url) {
          formDataToSend.append(
            `chapters[${index}][video][url]`,
            chapter.video.url
          );
          formDataToSend.append(
            `chapters[${index}][video][title]`,
            chapter.video.title || "Chapter Video"
          );
          formDataToSend.append(
            `chapters[${index}][video][duration]`,
            chapter.video.duration || 0
          );
        }
      });


      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-course`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        router.push(`/dashboards/instructor-course`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to create course"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container pt-100px pb-100px" data-aos="fade-up">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-5">
            {/* Left Column */}
            <div className="lg:col-start-1 lg:col-span-8">
              <ul className="accordion-container curriculum create-course">
                {/* Course Info Section */}
                <li className="accordion mb-5 active">
                  <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md">
                    <div className="py-5 px-30px">
                      <div
                        className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px rounded-t-md"
                        onClick={() => toggleAccordion("course-info")}
                      >
                        <div>
                          <span>Course Info</span>
                        </div>
                        <svg
                          className={`transition-all duration-500 ${
                            activeAccordion === "course-info"
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="#212529"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`accordion-content transition-all duration-500 overflow-hidden ${
                        activeAccordion === "course-info" ? "block" : "hidden"
                      }`}
                    >
                      <div className="content-wrapper py-4 px-5">
                        <div className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8">
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              Course Banner Image
                            </label>
                            <input
                              type="file"
                              id="banner"
                              ref={bannerInputRef}
                              onChange={(e) => handleFileUpload(e, "banner")}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => bannerInputRef.current.click()}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Upload Banner
                            </button>
                            <span className="ml-3">
                              {formData.bannerImage
                                ? formData.bannerImage.name
                                : "No banner selected"}
                            </span>
                            <p className="text-xs mt-1 text-gray-500">
                              Recommended size: 1200x600px (Max 5MB)
                            </p>

                            {formData.bannerPreview && (
                              <div className="mt-4">
                                <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                  <Image
                                    src={formData.bannerPreview} // Use the preview URL here
                                    alt="Course Banner Preview"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 1200px"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={removeBanner}
                                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove Banner
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 mb-15px gap-15px">
                            <div>
                              <label className="mb-3 block font-semibold">
                                Course Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Course Title"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                required
                              />
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Course Slug
                              </label>
                              <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="Course Slug"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                required
                              />
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Free Regular Price ($)
                              </label>
                              <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Free Regular Price ($)"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                required
                              />
                            </div>
                            <div>
                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                The Course Price Includes Your Author Fee.
                              </p>
                              <label className="mb-3 block font-semibold">
                                Discounted Price ($)
                              </label>
                              <input
                                type="number"
                                name="discountedPrice"
                                value={formData.discountedPrice}
                                onChange={handleChange}
                                placeholder="Discounted Price ($)"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              />
                            </div>
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-30px">
                                <div>
                                  <label className="text-xs uppercase text-placeholder block font-semibold text-opacity-50 leading-1.8">
                                    COURSES
                                  </label>
                                  <div className="bg-whiteColor relative rounded-md">
                                    <select
                                      name="category"
                                      value={formData.category}
                                      onChange={handleChange}
                                      className="text-base bg-transparent text-blackColor2 w-full p-13px pr-30px focus:outline-none block appearance-none relative z-20 focus:shadow-select rounded-md"
                                    >
                                      <option value="All">All</option>
                                      <option value="Web Design">
                                        Web Design
                                      </option>
                                      <option value="Graphic">Graphic</option>
                                      <option value="English">English</option>
                                      <option value="Spoken English">
                                        Spoken English
                                      </option>
                                      <option value="Art Painting">
                                        Art Painting
                                      </option>
                                      <option value="App Development">
                                        App Development
                                      </option>
                                      <option value="Web Application">
                                        Web Application
                                      </option>
                                      <option value="Php Development">
                                        Php Development
                                      </option>
                                    </select>
                                    <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-lg z-10"></i>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs uppercase text-placeholder block font-semibold text-opacity-50 leading-1.8">
                                    SHORT BY OFFER
                                  </label>
                                  <div className="bg-whiteColor relative rounded-md">
                                    <select
                                      name="offerType"
                                      value={formData.offerType}
                                      onChange={handleChange}
                                      className="text-base bg-transparent text-blackColor2 w-full p-13px pr-30px focus:outline-none block appearance-none relative z-20 focus:shadow-select rounded-md"
                                    >
                                      <option value="premium">Premium</option>
                                      <option value="free">Free</option>
                                    </select>
                                    <i className="icofont-simple-down absolute top-1/2 right-3 -translate-y-1/2 block text-lg z-10"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              About Course
                            </label>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              className="w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              cols="30"
                              rows="10"
                              required
                            />
                          </div>
                          <div className="mt-15px">
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("course-media")}
                            >
                              Next: Course Media
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Course Media Section - Updated for Chapter Videos */}
                <li className="accordion mb-5">
                  <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                    <div className="py-5 px-30px">
                      <div
                        className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px"
                        onClick={() => toggleAccordion("course-media")}
                      >
                        <div>
                          <span>Course Media</span>
                        </div>
                        <svg
                          className={`transition-all duration-500 ${
                            activeAccordion === "course-media"
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="#212529"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`accordion-content transition-all duration-500 overflow-hidden ${
                        activeAccordion === "course-media" ? "block" : "hidden"
                      }`}
                    >
                      <div className="content-wrapper py-4 px-5">
                        <div className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8">
                          {/* PDF Upload (Unchanged) */}
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              Upload PDFs
                            </label>
                            <input
                              type="file"
                              name="pdfFiles"
                              onChange={(e) => handleFileUpload(e, "pdf")}
                              accept=".pdf"
                              multiple
                              className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                            />
                            {formData.pdfFiles.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm">
                                  Selected PDFs: {formData.pdfFiles.length}
                                </p>
                                <ul className="text-xs mt-1">
                                  {formData.pdfFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between mt-15px">
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("course-info")}
                            >
                              Previous
                            </button>
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("course-builder")}
                            >
                              Next: Add Chapters
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Course Builder Section - Updated for Chapters */}
                <li className="accordion mb-5">
                  <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                    <div className="py-5 px-30px">
                      <div
                        className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px"
                        onClick={() => toggleAccordion("course-builder")}
                      >
                        <div>
                          <span>Course Chapters</span>
                        </div>
                        <svg
                          className={`transition-all duration-500 ${
                            activeAccordion === "course-builder"
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="#212529"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`accordion-content transition-all duration-500 overflow-hidden ${
                        activeAccordion === "course-builder"
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <div className="content-wrapper py-4 px-5">
                        <div className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8">
                          {/* Chapter Management */}
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              Add Chapter
                            </label>
                            <button
                              type="button"
                              onClick={addNewChapter}
                              className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
                            >
                              + Add Chapter
                            </button>
                          </div>

                          {formData.chapters.length > 0 && (
                            <div className="space-y-4">
                              {formData.chapters.map((chapter, index) => (
                                <div
                                  key={index}
                                  className="p-4 border rounded-lg"
                                >
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold">
                                      Chapter {index + 1}:{" "}
                                      {chapter.title || "Untitled"}
                                    </h4>
                                  </div>

                                  {/* Chapter Title */}
                                  <input
                                    type="text"
                                    name={`chapters[${index}][title]`}
                                    value={chapter.title}
                                    onChange={(e) =>
                                      updateChapter(
                                        index,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Chapter Title"
                                    className="w-full mb-3 p-2 border rounded bg-transparent"
                                  />

                                  {/* Video URL Input */}
                                  <div className="mb-3">
                                    <label className="block mb-1">
                                      Chapter Video URL
                                    </label>
                                    <input
                                      type="url"
                                      name={`chapterVideos[${index}][url]`}
                                      value={chapter.video?.url || ""}
                                      onChange={(e) =>
                                        handleChapterVideoUrlChange(e, index)
                                      }
                                      placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                      className="w-full p-2 border rounded bg-transparent"
                                    />
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-sm mb-1">
                                          Video Title
                                        </label>
                                        <input
                                          type="text"
                                          name={`chapterVideos[${index}][title]`}
                                          value={chapter.video?.title || ""}
                                          onChange={(e) =>
                                            updateChapter(
                                              index,
                                              "video.title",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Video title"
                                          className="w-full p-1 border rounded bg-transparent text-sm"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm mb-1">
                                          Duration (seconds)
                                        </label>
                                        <input
                                          type="number"
                                          name={`chapterVideos[${index}][duration]`}
                                          min={1}
                                          value={chapter.video?.duration || 0}
                                          onChange={(e) =>
                                            updateChapter(
                                              index,
                                              "video.duration",
                                              parseInt(e.target.value) || 0
                                            )
                                          }
                                          placeholder="Duration"
                                          className="w-full p-1 border rounded bg-transparent text-sm"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quiz/Assignment Toggles */}
                                  <div className="flex gap-4 mb-3">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          chapter.isLockedUntilQuizPass || false
                                        }
                                        onChange={(e) =>
                                          updateChapter(
                                            index,
                                            "isLockedUntilQuizPass",
                                            e.target.checked
                                          )
                                        }
                                        className="mr-2"
                                      />
                                      Lock until quiz passed
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between mt-15px">
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("course-media")}
                            >
                              Previous
                            </button>
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("additional-info")}
                            >
                              Next: Additional Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Additional Information Section */}
                <li className="accordion mb-5">
                  <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark">
                    <div className="py-5 px-30px">
                      <div
                        className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px"
                        onClick={() => toggleAccordion("additional-info")}
                      >
                        <div>
                          <span>Additional Information</span>
                        </div>
                        <svg
                          className={`transition-all duration-500 ${
                            activeAccordion === "additional-info"
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="#212529"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`accordion-content transition-all duration-500 overflow-hidden ${
                        activeAccordion === "additional-info"
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      <div className="content-wrapper py-4 px-5">
                        <div className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8">
                          <div className="grid grid-cols-1 xl:grid-cols-2 mb-15px gap-y-15px gap-x-30px">
                            <div>
                              <label className="mb-3 block font-semibold">
                                Start Date
                              </label>
                              <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              />
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Language
                              </label>
                              <input
                                type="text"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                placeholder="English"
                                className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-30px">
                            <div>
                              <label className="mb-3 block font-semibold">
                                Requirements
                              </label>
                              <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                className="w-full py-10px px-5 mb-15px text-sm text-contentColor dark:text-contentColor-dark text-start bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                cols="30"
                                rows="10"
                              />
                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Enter for per line.
                              </p>
                            </div>
                            <div>
                              <label className="mb-3 block font-semibold">
                                Benefits
                              </label>
                              <textarea
                                name="benefits"
                                value={formData.benefits}
                                onChange={handleChange}
                                className="w-full py-10px px-5 mb-15px text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                                cols="30"
                                rows="10"
                              />
                              <p className="flex items-center gap-0.5">
                                <svg
                                  className="feather feather-info w-14px h-14px"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="16" x2="12" y2="12"></line>
                                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                Enter for per line.
                              </p>
                            </div>
                          </div>
                          <div className="mb-15px">
                            <label className="mb-3 block font-semibold">
                              {"Course Tags (only 5)"}
                            </label>
                            <textarea
                              name="tags"
                              value={formData.tags}
                              onChange={handleChange}
                              placeholder="Enter tags separated by commas"
                              className="w-full py-10px px-5 text-sm text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
                              cols="30"
                              rows="3"
                            />
                          </div>

                          <div className="flex justify-between mt-15px">
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("course-media")}
                            >
                              Previous
                            </button>
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("certificate")}
                            >
                              Next: Certificate Template
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Certificate Template Section */}

                <li className="accordion mb-5">
                  <div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-b-md">
                    <div className="py-5 px-30px">
                      <div
                        className="cursor-pointer accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold w-full dark:text-headingColor-dark font-hind leading-27px rounded-b-md"
                        onClick={() => toggleAccordion("certificate")}
                      >
                        <div>
                          <span>Certificate Template</span>
                          {formData.certificateFile && (
                            <span className="ml-2 text-sm text-green-500">
                              ✓ Uploaded
                            </span>
                          )}
                        </div>
                        <svg
                          className={`transition-all duration-500 ${
                            activeAccordion === "certificate"
                              ? "rotate-180"
                              : "rotate-0"
                          }`}
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="#212529"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div
                      className={`accordion-content transition-all duration-500 overflow-hidden ${
                        activeAccordion === "certificate" ? "block" : "hidden"
                      }`}
                    >
                      <div className="content-wrapper py-4 px-5">
                        <div className="p-10px md:p-10 lg:p-5 2xl:p-10 bg-darkdeep3 dark:bg-transparent text-sm text-blackColor dark:text-blackColor-dark leading-1.8">
                          <div className="mb-4">
                            <label className="block mb-3 font-semibold">
                              Upload Custom Certificate Template
                            </label>
                            <input
                              type="file"
                              id="certificate-upload"
                              ref={fileInputRef}
                              onChange={(e) =>
                                handleFileUpload(e, "certificate")
                              }
                              accept="image/*,.pdf"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Choose File
                            </button>
                            <span className="ml-3">
                              {formData.certificateFile
                                ? formData.certificateFile.name
                                : "No file chosen"}
                            </span>
                            <p className="text-xs mt-1 text-gray-500">
                              Accepted formats: JPG, PNG, GIF, PDF (Max 5MB)
                            </p>
                          </div>

                          {formData.certificatePreview && (
                            <div className="mt-4 border rounded p-4">
                              <h4 className="font-semibold mb-2">
                                Certificate Preview:
                              </h4>
                              <div className="relative w-full h-64 bg-gray-100 flex items-center justify-center">
                                {formData.certificateFile.type.startsWith(
                                  "image/"
                                ) ? (
                                  <Image
                                    src={formData.certificatePreview}
                                    alt="Certificate Preview"
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="text-center">
                                    <Image
                                      src="/pdf-icon.png" // Your PDF icon
                                      alt="PDF Icon"
                                      width={64}
                                      height={64}
                                    />
                                    <p>{formData.certificateFile.name}</p>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={removeCertificate}
                                className="mt-2 text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove Certificate
                              </button>
                            </div>
                          )}

                          <div className="flex justify-between mt-15px">
                            <button
                              className="bg-blueDark p-2 px-3 rounded"
                              type="button"
                              onClick={() => toggleAccordion("additional-info")}
                            >
                              Previous
                            </button>
                            <ButtonPrimary
                              type="submit"
                              disabled={
                                isSubmitting || !formData.certificateFile
                              }
                            >
                              {isSubmitting
                                ? "Creating Course..."
                                : "Create Course"}
                            </ButtonPrimary>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Instructions */}
            <div className="lg:col-start-9 lg:col-span-4">
              <div className="p-30px border-2 border-primaryColor">
                <ul>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Set the Course Price option make it free.
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Standard size for the course thumbnail.
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Video section controls the course overview video.
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Course Builder is where you create course.
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Add Topics in the Course Builder section to create
                      lessons.
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Prerequisites refers to the fundamental courses .
                    </p>
                  </li>
                  <li className="my-7px flex gap-10px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-check flex-shrink-0"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        className="text-greencolor"
                      ></polyline>
                    </svg>
                    <p className="text-lg text-contentColor dark:text-contentColor-dark leading-1.45">
                      Information from the Additional Data section.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePrimary;
