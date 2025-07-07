"use client";
import React, { useState } from 'react';

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Tanga Academie Policies</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#2C3340] dark:bg-gray-600 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'privacy'
                  ? 'bg-blue text-white shadow-md'
                  : 'text-gray-200 dark:text-gray-300 hover:text-blue dark:hover:text-blue'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'terms'
                  ? 'bg-blue text-white shadow-md'
                  : 'text-gray-200 dark:text-gray-300 hover:text-blue dark:hover:text-blue'
              }`}
            >
              Terms of Service
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-none">
        {/* Privacy Policy Section */}
        {activeTab === 'privacy' && (
          <section className="animate-slideIn">
            <div className="relative flex flex-col items-center backdrop-blur-sm border border-blue-200/30 dark:border-blue-400/20 rounded-3xl p-10 shadow-2xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-cyan-400/20 to-blue-400/20 rounded-full translate-x-24 translate-y-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Privacy Policy</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

              <div className="grid gap-8">
                <article className="group hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30 dark:border-blue-400/20">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        📊 Information We Collect
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">When you use Tanga Academie, we collect:</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-blue-100 dark:border-blue-800/30">
                          <strong className="text-blue-600 dark:text-blue-400">👤 Account Info:</strong>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Name, email, password, profile picture</p>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-800/30">
                          <strong className="text-green-600 dark:text-green-400">💳 Payment Info:</strong>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Billing details via secure gateways</p>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-purple-100 dark:border-purple-800/30">
                          <strong className="text-purple-600 dark:text-purple-400">📚 Learning Data:</strong>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Progress, quiz scores, assignments</p>
                        </div>
                        <div className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-orange-100 dark:border-orange-800/30">
                          <strong className="text-orange-600 dark:text-orange-400">🔧 Technical Data:</strong>
                          <p className="text-sm text-gray-600 dark:text-gray-300">IP address, device info, browser type</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="group hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/30 dark:border-purple-400/20">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        🎯 How We Use Your Information
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-purple-100 dark:border-purple-800/30">
                          <div className="text-2xl mb-2">🎓</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Personalize Learning</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-blue-100 dark:border-blue-800/30">
                          <div className="text-2xl mb-2">💰</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Process Payments</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-green-100 dark:border-green-800/30">
                          <div className="text-2xl mb-2">📈</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Track Progress</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-yellow-100 dark:border-yellow-800/30">
                          <div className="text-2xl mb-2">🚀</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Platform Improvement</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-red-100 dark:border-red-800/30">
                          <div className="text-2xl mb-2">📧</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Service Updates</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl text-center border border-indigo-100 dark:border-indigo-800/30">
                          <div className="text-2xl mb-2">🛡️</div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Security & Fraud Prevention</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="group hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200/30 dark:border-cyan-400/20">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        🤝 Data Sharing
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">We may share information with:</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-cyan-100 dark:border-cyan-800/30">
                          <span className="text-2xl">👨‍🏫</span>
                          <div>
                            <strong className="text-cyan-600 dark:text-cyan-400">Instructors:</strong>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Share student progress for courses they teach</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-800/30">
                          <span className="text-2xl">💳</span>
                          <div>
                            <strong className="text-green-600 dark:text-green-400">Payment Processors:</strong>
                            <p className="text-sm text-gray-600 dark:text-gray-300">To complete secure transactions</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-purple-100 dark:border-purple-800/30">
                          <span className="text-2xl">🔧</span>
                          <div>
                            <strong className="text-purple-600 dark:text-purple-400">Service Providers:</strong>
                            <p className="text-sm text-gray-600 dark:text-gray-300">For hosting, analytics, and customer support</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-700/50">
                        <p className="text-green-800 dark:text-green-200 font-semibold flex items-center gap-2">
                          <span className="text-xl">✅</span>
                          We never sell your personal data to third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="grid md:grid-cols-2 gap-6">
                  <article className="group hover:scale-[1.02] transition-all duration-300">
                    <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/30 dark:border-red-400/20">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">🔐 Data Security</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">Industry-standard security measures:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          SSL/TLS encryption
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Regular security audits
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Secure payment processing
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Access controls & authentication
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="group hover:scale-[1.02] transition-all duration-300">
                    <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/30 dark:border-emerald-400/20">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">⚖️ Your Rights</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="text-emerald-500">📥</span>
                          Access & download your data
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="text-blue-500">✏️</span>
                          Request data corrections
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="text-red-500">🗑️</span>
                          Delete your account & data
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="text-purple-500">📧</span>
                          Opt-out of marketing
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
            </div>
          </section>
        )}

        {/* Terms of Service Section */}
        {activeTab === 'terms' && (
          <section className="animate-slideIn">
            <div className="relative flex flex-col items-center backdrop-blur-sm border border-purple-200/30 dark:border-purple-400/20 rounded-3xl p-10 shadow-2xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-pink-400/20 rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full -translate-x-24 translate-y-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl">
                    📋
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Terms of Service</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">By using Tanga Academie, you agree to these terms</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <article className="group hover:scale-[1.02] transition-all duration-300">
                      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30 dark:border-blue-400/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">1</div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">👤 Account Responsibilities</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Provide accurate account information</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Maintain account security</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Must be at least 13 years old</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>No sharing login credentials</span>
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="group hover:scale-[1.02] transition-all duration-300">
                      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/30 dark:border-green-400/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">2</div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">💳 Course Purchases</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">💰</span>
                            <span>Prices listed in USD</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-purple-500 mt-1">♾️</span>
                            <span>Lifetime access granted</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">🔄</span>
                            <span>30-day refund policy</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-orange-500 mt-1">🔒</span>
                            <span>Final after 30 days</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>

                  <article className="group hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/30 dark:border-purple-400/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">3</div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">👨‍🏫 Instructor Terms</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">©️</span>
                            <span>Retain content ownership</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">📜</span>
                            <span>Grant distribution license</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-purple-500 mt-1">💰</span>
                            <span>70% revenue share</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-orange-500 mt-1">📅</span>
                            <span>Monthly payouts at $100+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  <div className="grid md:grid-cols-2 gap-6">
                    <article className="group hover:scale-[1.02] transition-all duration-300">
                      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200/30 dark:border-red-400/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">4</div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">🚫 Prohibited Conduct</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Share course materials</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Upload copyrighted content</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Unlawful purposes</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-red-500 mt-1">✗</span>
                            <span>Harassment or disruption</span>
                          </div>
                        </div>
                      </div>
                    </article>

                    <article className="group hover:scale-[1.02] transition-all duration-300">
                      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-900/20 dark:to-teal-900/20 border border-cyan-200/30 dark:border-cyan-400/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">5</div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">🏆 Certificate Requirements</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>Complete all course content</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">📊</span>
                            <span>Pass minimum quiz scores</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-purple-500 mt-1">📝</span>
                            <span>Submit all assignments</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-orange-500 mt-1">🔍</span>
                            <span>Verifiable through platform</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>

                  <article className="group hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200/30 dark:border-indigo-400/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold">6</div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">📞 Contact & Support</h3>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-indigo-500 text-lg">📧</span>
                            <strong className="text-indigo-600 dark:text-indigo-400">Email Support</strong>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">support@tangaacademy.com</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-white/5 rounded-xl border border-violet-100 dark:border-violet-800/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-violet-500 text-lg">📱</span>
                            <strong className="text-violet-600 dark:text-violet-400">Phone Support</strong>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700/50">
                        <p className="text-indigo-800 dark:text-indigo-200 font-medium flex items-center gap-2">
                          <span className="text-lg">💬</span>
                          We're here to help with any questions about these policies.
                        </p>
                      </div>
                    </div>
                  </article>

                  <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-900/40 dark:to-slate-900/40 border border-gray-200/50 dark:border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl flex items-center justify-center text-white font-bold">ℹ️</div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">📝 Policy Updates</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      We may update these terms periodically to reflect changes in our services or legal requirements. 
                      When we make significant changes, we'll notify you via email or through our platform.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Continued use after changes constitutes acceptance of updated terms</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}
      </main>


      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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
          backdrop-filter: blur(4px);
        }
      `}</style>

    </div>
  );
}