/**
 * FAQ Page
 * Comprehensive Frequently Asked Questions for DClinPsy Prep Hub
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const toggleQuestion = (questionId) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const categories = [
    { id: 'general', name: 'General', icon: '❓' },
    { id: 'sjt', name: 'SJT Practice', icon: '🎯' },
    { id: 'statistics', name: 'Statistics', icon: '📊' },
    { id: 'account', name: 'Account & Privacy', icon: '🔒' },
    { id: 'technical', name: 'Technical Support', icon: '⚙️' }
  ];

  const faqData = {
    general: [
      {
        id: 'what-is-dclinpsy',
        question: 'What is DClinPsy and why do I need to prepare?',
        answer: `DClinPsy stands for Doctorate in Clinical Psychology. It's a highly competitive 3-year professional doctorate program that trains you to become a qualified clinical psychologist in the UK. 

        With acceptance rates typically below 10%, thorough preparation is essential. Our platform helps you practice the key skills and knowledge areas commonly assessed in DClinPsy applications, including Situational Judgment Tests, statistical knowledge, and professional understanding.`
      },
      {
        id: 'is-it-free',
        question: 'Is this platform completely free to use?',
        answer: `Yes! DClinPsy Prep Hub is completely free to use with no hidden costs, subscriptions, or premium features. You can:
        
        • Practice SJT tests anonymously or with an account
        • Access all learning materials and resources
        • Read expert articles and guidance
        • Use all features without any payment
        
        We believe quality DClinPsy preparation should be accessible to everyone.`
      },
      {
        id: 'do-i-need-account',
        question: 'Do I need to create an account to use the platform?',
        answer: `No, you don't need an account for basic usage. You can practice SJT tests and access most content anonymously.

        However, creating a free account provides additional benefits:
        • Progress tracking across all practice sessions
        • Personalized study recommendations
        • Category-specific performance analytics
        • Test history and trend analysis
        • Optional research participation opportunities`
      },
      {
        id: 'official-endorsement',
        question: 'Is this platform officially endorsed by BPS or universities?',
        answer: `This platform is an independent educational resource created by clinical psychology professionals. While not officially endorsed by BPS or universities, all content is carefully aligned with BPS and HCPC professional standards.

        This tool supplements, but does not replace, formal DClinPsy preparation programs. Always refer to official BPS and HCPC guidelines for authoritative information.`
      }
    ],
    sjt: [
      {
        id: 'what-is-sjt',
        question: 'What exactly is a Situational Judgment Test (SJT)?',
        answer: `An SJT is an assessment that presents realistic professional scenarios and asks you to rank response options from most to least appropriate. In clinical psychology, SJTs assess:

        • Clinical reasoning and professional judgment
        • Understanding of ethical principles
        • Knowledge of professional boundaries
        • Risk assessment capabilities
        • Cultural competence and inclusive practice

        You'll see a clinical scenario followed by 5 response options that you must rank in order of appropriateness.`
      },
      {
        id: 'sjt-scoring',
        question: 'How does the proximity-based scoring system work?',
        answer: `Our scoring system rewards clinical reasoning even when your ranking isn't perfect:

        • Exact match: 4 points
        • ±1 position off: 3 points  
        • ±2 positions off: 2 points
        • ±3 positions off: 1 point
        • ±4 positions off: 0 points

        Each question is worth 20 points maximum (5 answers × 4 points each). This system recognizes that clinical judgment often involves nuanced decisions where multiple approaches may be reasonable.`
      },
      {
        id: 'question-randomization',
        question: 'Why are answer options in different orders each time?',
        answer: `We randomize the order of response options to ensure authentic assessment of your clinical judgment rather than pattern recognition. This means:

        • You can't memorize answer positions
        • Each test session is genuinely challenging
        • You must engage with the clinical reasoning behind each option
        • The assessment more accurately reflects real-world decision-making

        The scoring system automatically accounts for this randomization.`
      },
      {
        id: 'category-mixing',
        question: 'What is category mixing and why is it important?',
        answer: `Category mixing ensures each practice test includes questions from multiple clinical domains rather than focusing on just one area. This approach:

        • Mirrors real DClinPsy assessments which cover diverse scenarios
        • Helps identify strengths and weaknesses across all domains
        • Provides balanced practice for comprehensive preparation
        • Prevents over-specialization in specific areas

        You can also choose to focus on specific categories if you want targeted practice in particular domains.`
      },
      {
        id: 'feedback-explanations',
        question: 'How detailed is the feedback after each question?',
        answer: `Each question provides comprehensive feedback including:

        • Detailed explanation for each response option
        • References to relevant BPS/HCPC guidelines
        • Clinical reasoning behind the ranking
        • Professional standards and ethical considerations
        • Learning points for future scenarios

        Feedback is organized by appropriateness ranking (most to least appropriate) to enhance learning and understanding of professional judgment.`
      }
    ],
    statistics: [
      {
        id: 'statistics-importance',
        question: 'Why is statistics knowledge important for DClinPsy?',
        answer: `Statistics knowledge is crucial for clinical psychology because:

        • DClinPsy programs require strong research skills
        • You'll need to understand and conduct research during training
        • Evidence-based practice relies on statistical literacy
        • Many DClinPsy applications include statistics assessments
        • Professional practice involves interpreting research findings

        Our statistics module covers essential concepts from descriptive statistics to advanced inferential methods.`
      },
      {
        id: 'statistics-level',
        question: 'What level of statistics knowledge do I need?',
        answer: `Our statistics module covers undergraduate to early postgraduate level concepts including:

        • Descriptive statistics (mean, median, standard deviation)
        • Probability and distributions  
        • Hypothesis testing and p-values
        • Correlation and regression
        • ANOVA and non-parametric tests
        • Effect sizes and confidence intervals
        • Basic research design principles

        Content is designed for psychology students and DClinPsy applicants.`
      }
    ],
    account: [
      {
        id: 'data-privacy',
        question: 'How is my personal data protected?',
        answer: `We take data privacy seriously and comply with GDPR:

        • All data is stored locally on your device when possible
        • Account information is encrypted and securely stored
        • We collect minimal personal information
        • You have full control over your data with export/deletion options
        • No personal data is shared with third parties
        • Research participation is completely optional and anonymized

        See our Privacy Policy for complete details.`
      },
      {
        id: 'delete-account',
        question: 'Can I delete my account and data?',
        answer: `Yes, you have complete control over your data:

        • Delete your account anytime from your profile settings
        • Export your progress data before deletion if desired
        • All personal information will be permanently removed
        • Anonymous usage data may be retained for platform improvement
        • Account deletion is immediate and irreversible

        Contact us if you need assistance with account deletion.`
      },
      {
        id: 'research-participation',
        question: 'What does research participation involve?',
        answer: `Research participation is completely optional and involves:

        • Anonymous contribution to DClinPsy preparation research
        • Helping improve the platform for future users
        • Supporting research into clinical psychology education
        • No personal information shared or published
        • Ability to opt out at any time
        • No impact on your platform access if you don't participate

        Your decision about research participation doesn't affect any platform features.`
      }
    ],
    technical: [
      {
        id: 'browser-requirements',
        question: 'What browser and device requirements are needed?',
        answer: `DClinPsy Prep Hub works on most modern devices and browsers:

        **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
        **Devices:** Desktop, laptop, tablet, and mobile phones
        **Requirements:** JavaScript enabled, internet connection
        **Storage:** Local storage enabled for saving progress

        The platform is fully responsive and works well on all screen sizes.`
      },
      {
        id: 'progress-not-saving',
        question: 'Why is my progress not being saved?',
        answer: `If your progress isn't saving, check:

        • You're logged into your account (anonymous sessions don't save progress)
        • Browser cookies and local storage are enabled
        • You're not in private/incognito browsing mode
        • Browser isn't blocking local storage
        • You have sufficient storage space available

        Try logging out and back in, or clear your browser cache if issues persist.`
      },
      {
        id: 'technical-support',
        question: 'I\'m experiencing technical issues. How can I get help?',
        answer: `For technical support:

        1. **Check the FAQ** - Many common issues are covered here
        2. **Try basic troubleshooting:**
           • Refresh the page
           • Clear browser cache
           • Try a different browser
           • Check your internet connection
        3. **Contact us** - Use our contact form with details about the issue
        4. **Include helpful information:**
           • Browser and device type
           • Steps to reproduce the problem
           • Any error messages you see

        We typically respond to technical support requests within 24-48 hours.`
      }
    ]
  };

  const currentFAQs = faqData[activeCategory] || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto text-center">
          <h1 className="h1 mb-6">Frequently Asked Questions</h1>
          <p className="body-lg text-neutral-600 max-w-3xl mx-auto">
            Find answers to common questions about DClinPsy Prep Hub, SJT practice, 
            statistics learning, and account management.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-body">
                <h3 className="h3 mb-4">FAQ Categories</h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {currentFAQs.map((faq) => (
                <div key={faq.id} className="card">
                  <div className="card-body">
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full text-left flex items-center justify-between group"
                    >
                      <h3 className="h4 group-hover:text-primary-600 transition pr-4">
                        {faq.question}
                      </h3>
                      <svg 
                        className={`w-5 h-5 text-neutral-400 transition-transform ${
                          openQuestions.has(faq.id) ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openQuestions.has(faq.id) && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <div className="prose prose-neutral max-w-none">
                          {faq.answer.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="body-sm text-neutral-600 mb-3 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Still have questions? */}
            <div className="card mt-8">
              <div className="card-body text-center">
                <h3 className="h3 mb-4">Still have questions?</h3>
                <p className="body-sm text-neutral-600 mb-6">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact" className="btn btn-primary">
                    Contact Support
                  </Link>
                  <Link to="/feedback" className="btn btn-outline">
                    Send Feedback
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search FAQs */}
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="h2 mb-6">Quick Search</h2>
          <p className="body-lg text-neutral-600 mb-8">
            Looking for something specific? Try searching our knowledge base.
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                className="form-input pr-12"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;