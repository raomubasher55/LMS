"use client";
import React, { useState } from 'react';
import { CheckCircle, User, Mail, Phone, FileText, Upload, AlertCircle, Loader } from 'lucide-react';
const BecomeAnInstructorPrimary = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    expertise: '',
    experience: '',
    courseTopics: '',
    teachingExperience: '',
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.expertise.trim()) newErrors.expertise = 'Area of expertise is required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.courseTopics.trim()) newErrors.courseTopics = 'Course topics are required';
    if (!formData.teachingExperience.trim()) newErrors.teachingExperience = 'Teaching experience is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/instructor/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          applicationDate: new Date().toISOString(),
          status: 'pending'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        expertise: '',
        experience: '',
        courseTopics: '',
        teachingExperience: '',
        agreeToTerms: false
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    "Proven expertise in your chosen subject area with relevant qualifications",
    "Minimum 2 years of professional or teaching experience in your field",
    "Strong communication skills and passion for online education",
    "Ability to create engaging, high-quality video content",
    "Commitment to student success and responsive communication"
  ];

  const benefits = [
    "Earn up to 70% revenue share from your course sales",
    "Access to Tanga Academy's marketing and promotional support",
    "Professional course creation tools and resources",
    "Global student reach across multiple countries",
    "Dedicated instructor support and community"
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Join Tanga Academy as an Instructor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Share your expertise with thousands of eager learners worldwide. Create and sell your courses online while making a meaningful impact on students' lives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Information */}
          <div className="space-y-8">
            <div className=" rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="mr-3 text-blue-600" />
                Why Become a Tanga Academy Instructor?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Tanga Academy is premier online learning platform, connecting passionate educators with students eager to advance their careers and skills. As an instructor, you'll have the opportunity to monetize your knowledge while building a global teaching brand.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Instructor Benefits</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-400">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className=" rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Instructor Requirements</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                To maintain the high quality of education on Tanga Academy, we look for instructors who meet these criteria:
              </p>
              <ul className="space-y-3">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-400">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-semibold mb-4">Start Your Teaching Journey</h3>
              <p className="mb-4">
                Join over 500+ successful instructors who have already built thriving online course businesses with Tanga Academy. Our platform provides everything you need to succeed.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">50,000+</div>
                  <div className="text-blue-200">Active Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">1,200+</div>
                  <div className="text-blue-200">Courses Available</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className=" rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Application Form</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Application submitted successfully! We'll review your application and get back to you within 3-5 business days.</span>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">There was an error submitting your application. Please try again.</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+255 123 456 789"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Area of Expertise *
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.expertise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Web Development, Digital Marketing, Data Science"
                />
                {errors.expertise && <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Professional Experience *
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your professional background and relevant experience..."
                />
                {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Course Topics You'd Like to Teach *
                </label>
                <textarea
                  name="courseTopics"
                  value={formData.courseTopics}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.courseTopics ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="List the specific topics or courses you want to create..."
                />
                {errors.courseTopics && <p className="mt-1 text-sm text-red-500">{errors.courseTopics}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Teaching Experience *
                </label>
                <textarea
                  name="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.teachingExperience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe any teaching, training, or mentoring experience you have..."
                />
                {errors.teachingExperience && <p className="mt-1 text-sm text-red-500">{errors.teachingExperience}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bio/About Yourself * (min 100 words required and max 1000 words) 
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 dark:text-white border rounded-lg focus:ring-2 focus:ring-blue outline-none bg-transparent focus:border-transparent ${
                    errors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about yourself, your background, and what motivates you to teach..."
                />
                {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio}</p>}
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
                  I agree to Tanga Academy's{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Instructor Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Privacy Policy
                  </a>
                  . I understand that my application will be reviewed and I'll be contacted within 3-5 business days. *
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
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