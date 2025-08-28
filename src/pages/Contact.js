/**
 * Contact Us Page
 * Professional contact page with contact form and support information
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual implementation)
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: '',
        priority: 'normal'
      });
    }, 1500);
  };

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'account', label: 'Account Issues' },
    { value: 'content', label: 'Content Questions' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'partnership', label: 'Partnership/Collaboration' },
    { value: 'research', label: 'Research Inquiry' }
  ];

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'General inquiries and support',
      contact: 'support@dclinpsyprep.com',
      responseTime: '24-48 hours'
    },
    {
      icon: '🐛',
      title: 'Bug Reports',
      description: 'Technical issues and bugs',
      contact: 'bugs@dclinpsyprep.com',
      responseTime: '12-24 hours'
    },
    {
      icon: '🤝',
      title: 'Partnerships',
      description: 'Collaboration opportunities',
      contact: 'partnerships@dclinpsyprep.com',
      responseTime: '3-5 business days'
    },
    {
      icon: '🔬',
      title: 'Research Inquiries',
      description: 'Academic research and data requests',
      contact: 'research@dclinpsyprep.com',
      responseTime: '5-7 business days'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto text-center">
          <h1 className="h1 mb-6">Contact Us</h1>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help with questions, technical support, 
            feedback, and partnership opportunities.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <h2 className="h2 mb-6">Send us a message</h2>
                
                {submitStatus === 'success' && (
                  <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-success-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-success-700 font-medium">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Subject and Priority */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="form-label">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      >
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="priority" className="form-label">Priority</label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="low">Low - General question</option>
                        <option value="normal">Normal - Standard inquiry</option>
                        <option value="high">High - Urgent issue</option>
                        <option value="critical">Critical - System down</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="form-input resize-none"
                      placeholder="Please provide details about your inquiry. For technical issues, include your browser type and any error messages you've seen."
                    />
                    <p className="caption text-neutral-500 mt-2">
                      Minimum 20 characters. Be specific to help us assist you better.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.message.length < 20}
                    className={`btn btn-primary w-full sm:w-auto px-8 py-3 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <p className="body-sm text-neutral-600">
                    <strong>Response Times:</strong> We aim to respond to all inquiries within 24-48 hours. 
                    High priority and critical issues receive faster attention. For immediate assistance, 
                    check our <Link to="/faq" className="text-primary-600 hover:underline">FAQ page</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-6">Other Ways to Reach Us</h3>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div className="flex-grow">
                        <h4 className="h4 mb-1">{method.title}</h4>
                        <p className="body-sm text-neutral-600 mb-2">{method.description}</p>
                        <p className="body-sm font-medium text-primary-600">{method.contact}</p>
                        <p className="caption text-neutral-500">Response: {method.responseTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Quick Answers</h3>
                <p className="body-sm text-neutral-600 mb-4">
                  Many questions are answered instantly in our FAQ section.
                </p>
                <div className="space-y-3">
                  <Link 
                    to="/faq#sjt" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • SJT Practice Questions
                  </Link>
                  <Link 
                    to="/faq#account" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • Account & Privacy Issues
                  </Link>
                  <Link 
                    to="/faq#technical" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • Technical Support
                  </Link>
                  <Link 
                    to="/faq#general" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • General Platform Questions
                  </Link>
                </div>
                <Link to="/faq" className="btn btn-outline w-full mt-4">
                  View All FAQs
                </Link>
              </div>
            </div>

            {/* Office Hours */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Support Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sunday:</span>
                    <span className="text-neutral-500">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="caption text-neutral-500">
                    Emergency technical issues are monitored 24/7. 
                    Critical system problems will be addressed immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Alternative Support */}
            <div className="card">
              <div className="card-body">
                <h3 className="h3 mb-4">Community Support</h3>
                <p className="body-sm text-neutral-600 mb-4">
                  Join our community for peer support and discussions.
                </p>
                <div className="space-y-3">
                  <a 
                    href="https://github.com/jmckernan95/dclinpsy-app/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • GitHub Issues & Feature Requests
                  </a>
                  <Link 
                    to="/volunteer" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • Volunteer & Contribute
                  </Link>
                  <Link 
                    to="/feedback" 
                    className="block text-sm text-primary-600 hover:underline"
                  >
                    • Send Anonymous Feedback
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;