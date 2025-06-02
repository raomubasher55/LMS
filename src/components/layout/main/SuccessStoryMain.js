"use client";
import React, { useState } from 'react';

export default function SuccessStories() {
  const [activeTab, setActiveTab] = useState('students');

  const studentStories = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Full-Stack Developer",
      company: "TechCorp Inc.",
      image: "👩‍💻",
      course: "Complete Web Development Bootcamp",
      achievement: "Landed $85k job in 6 months",
      story: "From retail manager to full-stack developer in just 6 months! Tanga Academy's practical approach and mentorship made all the difference.",
      skills: ["React", "Node.js", "MongoDB", "AWS"],
      timeline: "6 months",
      salary: "$85,000"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Data Scientist",
      company: "Analytics Pro",
      image: "👨‍🔬",
      course: "Python Data Science Mastery",
      achievement: "Career transition from finance",
      story: "The comprehensive curriculum and real-world projects helped me transition from finance to data science seamlessly.",
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      timeline: "8 months",
      salary: "$95,000"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "UX/UI Designer",
      company: "Design Studio",
      image: "👩‍🎨",
      course: "Complete UX/UI Design Course",
      achievement: "Freelance to full-time designer",
      story: "The design fundamentals and portfolio guidance helped me land my dream job at a leading design studio.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      timeline: "4 months",
      salary: "$70,000"
    }
  ];

  const instructorStories = [
    {
      id: 1,
      name: "Dr. James Wilson",
      expertise: "Machine Learning Expert",
      image: "👨‍🏫",
      course: "Advanced AI Fundamentals",
      students: "2,500+",
      rating: "4.9/5",
      achievement: "Top-rated instructor 2024",
      story: "Teaching on Tanga Academy has allowed me to reach thousands of students globally and share my passion for AI.",
      earnings: "$50,000+",
      experience: "5 years"
    },
    {
      id: 2,
      name: "Lisa Chen",
      expertise: "Full-Stack Developer",
      image: "👩‍💼",
      course: "React Mastery Program",
      students: "1,800+",
      rating: "4.8/5",
      achievement: "Best New Instructor 2024",
      story: "Creating courses on Tanga Academy has been incredibly rewarding, both personally and financially.",
      earnings: "$35,000+",
      experience: "3 years"
    }
  ];

  const companyStories = [
    {
      id: 1,
      company: "TechStart Solutions",
      logo: "🏢",
      employees: "50+",
      program: "Corporate Training Program",
      improvement: "40% productivity increase",
      story: "Tanga Academy's corporate training helped our team stay current with latest technologies.",
      skills: ["Cloud Computing", "DevOps", "Agile Methodologies"],
      duration: "3 months"
    },
    {
      id: 2,
      company: "Innovation Labs",
      logo: "🚀",
      employees: "25+",
      program: "Data Analytics Training",
      improvement: "60% faster decision making",
      story: "The data science training transformed how we approach business intelligence and analytics.",
      skills: ["Python", "Data Visualization", "Statistical Analysis"],
      duration: "4 months"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-green-600 to-blue bg-clip-text text-transparent">
            Success Stories
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Real people, real achievements, real transformations
        </p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 overflow-x-scroll to-purple-600 p-1 rounded-xl inline-flex shadow-lg">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'students'
                  ? 'bg-white text-blue shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-white hover:bg-white/20'
              }`}
            >
              🎓 Student Success
            </button>
            <button
              onClick={() => setActiveTab('instructors')}
              className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'instructors'
                  ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-white hover:bg-white/20'
              }`}
            >
              👨‍🏫 Instructor Impact
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'companies'
                  ? 'bg-white text-green-600 shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-white hover:bg-white/20'
              }`}
            >
              🏢 Corporate Training
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Student Success Stories */}
        {activeTab === 'students' && (
          <section className="animate-slideIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Students Who Changed Their Lives
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From career changers to skill upgraders, see how our students achieved their dreams
              </p>
            </div>

            <div className="grid gap-8">
              {studentStories.map((story, index) => (
                <article key={story.id} className="group hover:scale-[1.02] transition-all duration-500">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30 shadow-2xl">
                    {/* Background decorative elements */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${index % 3 === 0 ? 'from-blue-400/10 to-purple-400/10' : index % 3 === 1 ? 'from-green-400/10 to-blue-400/10' : 'from-purple-400/10 to-pink-400/10'} rounded-full -translate-y-32 translate-x-32`}></div>
                    
                    <div className="relative z-10 p-8 lg:p-12">
                      <div className="grid lg:grid-cols-3 gap-8 items-center">
                        {/* Profile Section */}
                        <div className="text-center lg:text-left">
                          <div className="text-6xl mb-4">{story.image}</div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{story.name}</h3>
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{story.role}</p>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{story.company}</p>
                          
                          {/* Key Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700/30">
                              <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{story.salary}</div>
                              <div className="text-sm text-green-700 dark:text-green-300">New Salary</div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700/30">
                              <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{story.timeline}</div>
                              <div className="text-sm text-blue-700 dark:text-blue-300">Timeline</div>
                            </div>
                          </div>
                        </div>

                        {/* Story Content */}
                        <div className="lg:col-span-2">
                          <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
                              📚 {story.course}
                            </span>
                          </div>
                          
                          <blockquote className="text-xl text-gray-700 dark:text-gray-200 mb-6 italic leading-relaxed">
                            "{story.story}"
                          </blockquote>
                          
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🛠️ Skills Mastered:</h4>
                            <div className="flex flex-wrap gap-2">
                              {story.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue text-white rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300">
                            🎉 {story.achievement}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Instructor Success Stories */}
        {activeTab === 'instructors' && (
          <section className="animate-slideIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Instructors Making an Impact
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Educators who are changing lives while building successful teaching careers
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {instructorStories.map((story, index) => (
                <article key={story.id} className="group hover:scale-[1.02] transition-all duration-500">
                  <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-600/30 shadow-2xl">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-400/10 to-pink-400/10 rounded-full -translate-y-24 translate-x-24"></div>
                    
                    <div className="relative z-10 p-8">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">{story.image}</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{story.name}</h3>
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">{story.expertise}</p>
                        <span className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50">
                          📚 {story.course}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-700/30">
                          <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{story.students}</div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">Students Taught</div>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-center border border-yellow-200 dark:border-yellow-700/30">
                          <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{story.rating}</div>
                          <div className="text-sm text-yellow-700 dark:text-yellow-300">Average Rating</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-center border border-green-200 dark:border-green-700/30">
                          <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{story.earnings}</div>
                          <div className="text-sm text-green-700 dark:text-green-300">Earnings</div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center border border-indigo-200 dark:border-indigo-700/30">
                          <div className="text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{story.experience}</div>
                          <div className="text-sm text-indigo-700 dark:text-indigo-300">Teaching</div>
                        </div>
                      </div>

                      <blockquote className="text-lg text-gray-700 dark:text-gray-200 mb-6 italic text-center">
                        "{story.story}"
                      </blockquote>

                      <div className="text-center">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg">
                          🏆 {story.achievement}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Company Success Stories */}
        {activeTab === 'companies' && (
          <section className="animate-slideIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Companies Transforming Teams
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Organizations that invested in their teams and saw remarkable results
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {companyStories.map((story, index) => (
                <article key={story.id} className="group hover:scale-[1.02] transition-all duration-500">
                  <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-800/90 dark:to-green-900/20 backdrop-blur-sm border border-green-200/50 dark:border-green-600/30 shadow-2xl">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full -translate-y-24 -translate-x-24"></div>
                    
                    <div className="relative z-10 p-8">
                      <div className="text-center mb-6">
                        <div className="text-5xl mb-4">{story.logo}</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{story.company}</h3>
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700/50">
                          👥 {story.employees} employees trained
                        </span>
                      </div>

                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700/30">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">📈 Program Impact</h4>
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{story.improvement}</div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Measurable business improvement</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">🎯 Training Focus:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {story.skills.map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>Duration: {story.duration}</span>
                        </div>
                      </div>

                      <blockquote className="text-lg text-gray-700 dark:text-gray-200 mb-6 italic text-center">
                        "{story.story}"
                      </blockquote>

                      <div className="text-center">
                        <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue text-white rounded-xl font-semibold shadow-lg">
                          🎯 {story.program}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-green-600/90"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students, instructors, and companies who have transformed their careers and businesses with Tanga Academy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href='/courses' className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  🎓 Start Learning Today
                </a>
                <a href='/login' className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 border border-white/30">
                  👨‍🏫 Become an Instructor
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.6s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .group:hover {
          transform: scale(1.02);
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}