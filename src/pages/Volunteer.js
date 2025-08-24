/**
 * Volunteer with DClinPsy Prep Hub Page
 * Application form for volunteers to contribute to the platform
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentStatus: '',
    experience: '',
    roles: [],
    availability: '',
    motivation: '',
    portfolio: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const volunteerRoles = [
    {
      id: 'content-writer',
      title: 'Content Writer',
      description: 'Write engaging blog articles about DClinPsy applications, study tips, and career advice',
      skills: 'Strong writing skills, DClinPsy knowledge, research ability',
      commitment: '2-4 articles per month',
      benefits: 'Published byline, portfolio building, writing experience'
    },
    {
      id: 'news-curator',
      title: 'News Curator',
      description: 'Research and suggest new psychology news sources, monitor RSS feeds for quality',
      skills: 'Research skills, psychology knowledge, attention to detail',
      commitment: '2-3 hours per week',
      benefits: 'Stay current with psychology news, research experience'
    },
    {
      id: 'quality-assurance',
      title: 'Quality Assurance',
      description: 'Review website content for errors, test functionality, suggest improvements',
      skills: 'Detail-oriented, critical thinking, user experience awareness',
      commitment: '1-2 hours per week',
      benefits: 'Testing experience, technical skills, quality control experience'
    },
    {
      id: 'social-media',
      title: 'Social Media Officer',
      description: 'Promote DClinPsy Prep Hub on forums, social media, and academic communities',
      skills: 'Social media expertise, communication skills, networking',
      commitment: '3-5 hours per week',
      benefits: 'Digital marketing experience, networking, community building'
    },
    {
      id: 'statistics-developer',
      title: 'Statistics Content Developer',
      description: 'Create statistics questions, explanations, and educational materials',
      skills: 'Statistics knowledge, educational writing, psychology background',
      commitment: '2-3 hours per week',
      benefits: 'Curriculum development experience, statistics expertise showcase'
    },
    {
      id: 'user-experience',
      title: 'User Experience Researcher',
      description: 'Conduct user interviews, analyse usage patterns, suggest interface improvements',
      skills: 'UX research methods, analytical thinking, user empathy',
      commitment: '3-4 hours per week',
      benefits: 'UX research experience, portfolio projects, user research skills'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(r => r !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = encodeURIComponent('DClinPsy Prep Hub - Volunteer Application');
    const selectedRoles = formData.roles.map(roleId => 
      volunteerRoles.find(role => role.id === roleId)?.title
    ).join(', ');

    const body = encodeURIComponent(`
Volunteer Application for DClinPsy Prep Hub

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Current Status: ${formData.currentStatus}

Interested Roles: ${selectedRoles}

Experience & Background:
${formData.experience}

Weekly Availability: ${formData.availability}

Motivation:
${formData.motivation}

Portfolio/Examples: ${formData.portfolio}

Additional Information:
${formData.additionalInfo}

---
Submitted via DClinPsy Prep Hub Volunteer Form
    `);

    // Open email client
    window.location.href = `mailto:help@example.com?subject=${subject}&body=${body}`;

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in volunteering with DClinPsy Prep Hub. Your email client should have opened with your application details.
            </p>
            <p className="text-gray-600 mb-8">
              We'll review your application and get back to you within 5-7 working days. We're excited about the possibility of working with you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
              >
                Return to Home
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '', email: '', phone: '', currentStatus: '', experience: '',
                    roles: [], availability: '', motivation: '', portfolio: '', additionalInfo: ''
                  });
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>→</span>
            <span className="text-gray-800">Volunteer Opportunities</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🤝 Volunteer with DClinPsy Prep Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-6">
            Join our mission to support aspiring clinical psychologists. Gain valuable experience whilst making a difference to the DClinPsy community.
          </p>
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-green-800 font-medium">
              ✨ Perfect for CV building • Shows initiative and commitment • Flexible time commitment • Great networking opportunities
            </p>
          </div>
        </div>

        {/* Available Roles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Volunteer Roles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {volunteerRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{role.title}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Skills needed:</span>
                    <span className="text-gray-600 ml-1">{role.skills}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time commitment:</span>
                    <span className="text-gray-600 ml-1">{role.commitment}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Benefits:</span>
                    <span className="text-gray-600 ml-1">{role.benefits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Volunteer Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Volunteer with Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">CV Enhancement</h3>
              <p className="text-gray-600 text-sm">Demonstrate initiative, commitment to clinical psychology, and relevant skills to admissions committees and employers.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-semibold text-gray-800 mb-2">Networking</h3>
              <p className="text-gray-600 text-sm">Connect with other aspiring and qualified clinical psychologists, building professional relationships.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-800 mb-2">Skill Development</h3>
              <p className="text-gray-600 text-sm">Gain practical experience in content creation, research, quality assurance, or digital marketing.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-semibold text-gray-800 mb-2">Flexible Commitment</h3>
              <p className="text-gray-600 text-sm">Choose roles and time commitments that fit around your studies or work schedule.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Portfolio Building</h3>
              <p className="text-gray-600 text-sm">Create tangible work samples and achievements to showcase in applications and interviews.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Make an Impact</h3>
              <p className="text-gray-600 text-sm">Directly contribute to supporting fellow aspiring clinical psychologists on their journey.</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Volunteer Application Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status *
                </label>
                <select
                  name="currentStatus"
                  required
                  value={formData.currentStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select your current status</option>
                  <option value="undergraduate">Psychology Undergraduate</option>
                  <option value="masters">Psychology Masters Student</option>
                  <option value="postgraduate">Other Postgraduate Student</option>
                  <option value="graduate">Recent Psychology Graduate</option>
                  <option value="assistant-psychologist">Assistant Psychologist</option>
                  <option value="researcher">Research Assistant</option>
                  <option value="other-healthcare">Other Healthcare Professional</option>
                  <option value="career-changer">Career Changer</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Which roles interest you? (Select all that apply) *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {volunteerRoles.map((role) => (
                  <label key={role.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                      className="mt-1 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{role.title}</div>
                      <div className="text-sm text-gray-600">{role.commitment}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relevant Experience & Background *
              </label>
              <textarea
                name="experience"
                required
                value={formData.experience}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your relevant experience, skills, and background that would help you in these volunteer roles..."
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weekly Availability *
              </label>
              <select
                name="availability"
                required
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your weekly availability</option>
                <option value="1-2-hours">1-2 hours per week</option>
                <option value="3-4-hours">3-4 hours per week</option>
                <option value="5-7-hours">5-7 hours per week</option>
                <option value="8-10-hours">8-10 hours per week</option>
                <option value="flexible">Flexible - varies by week</option>
              </select>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to volunteer with DClinPsy Prep Hub? *
              </label>
              <textarea
                name="motivation"
                required
                value={formData.motivation}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="What motivates you to volunteer with us? How does this align with your goals and interests in clinical psychology?"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio/Work Examples (Optional)
              </label>
              <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Link to your portfolio, LinkedIn, or examples of relevant work"
              />
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Anything else you'd like us to know? Questions about the roles? Special circumstances we should consider?"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || formData.roles.length === 0}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              
              <p className="text-sm text-gray-500 mt-2">
                * Required fields. Your application will be sent via email for review.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;