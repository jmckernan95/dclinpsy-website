/**
 * Optional Research Questionnaire Component
 * Collects anonymous research data to improve DClinPsy preparation resources
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUserResearchData } from '../utils/auth';

const ResearchQuestionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Educational Background
    undergraduateDegree: '',
    university: '',
    degreeClassification: '',
    graduationYear: '',
    hasMasters: '',
    mastersDegree: '',
    mastersUniversity: '',
    mastersGrade: '',
    
    // Demographics (all with "Prefer not to say" option)
    gender: '',
    ethnicity: '',
    ethnicityCustom: '',
    firstLanguage: '',
    firstLanguageCustom: '',
    disabilityStatus: '',
    
    // Application Status
    universitiesApplied: [],
    applicationYear: '',
    hasAppliedBefore: '',
    previousApplicationYears: [],
    interviewInvitations: [],
    offersReceived: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UK DClinPsy Universities
  const ukUniversities = [
    'University of Bath',
    'University of Birmingham',
    'University of Bristol',
    'Cardiff University',
    'University of East Anglia',
    'University of Edinburgh',
    'University of Exeter',
    'University of Glasgow',
    'University of Hull',
    'King\'s College London',
    'Lancaster University',
    'University of Leeds',
    'University of Liverpool',
    'University of Manchester',
    'Newcastle University',
    'University of Nottingham',
    'University of Oxford',
    'Queen\'s University Belfast',
    'University of Sheffield',
    'University of Southampton',
    'Staffordshire University',
    'University of Surrey',
    'University College London',
    'University of Warwick'
  ];

  const sections = [
    {
      title: 'Educational Background',
      description: 'Help us understand the educational pathways of DClinPsy applicants',
      optional: true
    },
    {
      title: 'Demographics (Optional)',
      description: 'All demographic questions include "Prefer not to say" options',
      optional: true
    },
    {
      title: 'Application Status',
      description: 'Information about your DClinPsy application journey',
      optional: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'universitiesApplied' || name === 'interviewInvitations' || name === 'offersReceived' || name === 'previousApplicationYears') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (error) setError('');
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSkip = () => {
    navigate('/practice', {
      state: { message: 'Welcome! You can complete the research questionnaire later from your profile.' }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const researchData = {
        education: {
          undergraduateDegree: formData.undergraduateDegree,
          university: formData.university,
          degreeClassification: formData.degreeClassification,
          graduationYear: formData.graduationYear,
          hasMasters: formData.hasMasters,
          mastersDegree: formData.mastersDegree,
          mastersUniversity: formData.mastersUniversity,
          mastersGrade: formData.mastersGrade
        },
        demographics: {
          gender: formData.gender,
          ethnicity: formData.ethnicity,
          ethnicityCustom: formData.ethnicityCustom,
          firstLanguage: formData.firstLanguage,
          firstLanguageCustom: formData.firstLanguageCustom,
          disabilityStatus: formData.disabilityStatus
        },
        applicationStatus: {
          universitiesApplied: formData.universitiesApplied,
          applicationYear: formData.applicationYear,
          hasAppliedBefore: formData.hasAppliedBefore,
          previousApplicationYears: formData.previousApplicationYears,
          interviewInvitations: formData.interviewInvitations,
          offersReceived: formData.offersReceived
        }
      };

      const success = updateUserResearchData(user.userId, researchData);
      
      if (success) {
        updateUser({ profileData: { ...researchData, completedAt: new Date().toISOString() } });
        navigate('/practice', {
          state: { message: 'Thank you for participating in our research! Your responses help improve DClinPsy preparation resources.' }
        });
      } else {
        setError('Failed to save research data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving research data:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderEducationSection = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="undergraduateDegree" className="block text-sm font-medium text-gray-700 mb-1">
          Undergraduate Degree Subject
        </label>
        <input
          type="text"
          id="undergraduateDegree"
          name="undergraduateDegree"
          value={formData.undergraduateDegree}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Psychology, Biology, etc."
        />
      </div>

      <div>
        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
          University Attended
        </label>
        <input
          type="text"
          id="university"
          name="university"
          value={formData.university}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="University name"
        />
      </div>

      <div>
        <label htmlFor="degreeClassification" className="block text-sm font-medium text-gray-700 mb-1">
          Degree Classification
        </label>
        <select
          id="degreeClassification"
          name="degreeClassification"
          value={formData.degreeClassification}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select classification</option>
          <option value="First Class Honours">First Class Honours</option>
          <option value="Upper Second Class (2:1)">Upper Second Class (2:1)</option>
          <option value="Lower Second Class (2:2)">Lower Second Class (2:2)</option>
          <option value="Third Class Honours">Third Class Honours</option>
          <option value="Pass">Pass</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
          Graduation Year
        </label>
        <input
          type="number"
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleInputChange}
          min="1990"
          max={new Date().getFullYear() + 5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 2020"
        />
      </div>

      {/* Masters Degree Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">Masters Degree</h3>
        
        <div className="mb-4">
          <label htmlFor="hasMasters" className="block text-sm font-medium text-gray-700 mb-1">
            Have you completed a Masters degree?
          </label>
          <select
            id="hasMasters"
            name="hasMasters"
            value={formData.hasMasters}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="In Progress">Currently studying</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {formData.hasMasters === 'Yes' && (
          <div className="space-y-4 ml-4 pl-4 border-l-2 border-blue-200">
            <div>
              <label htmlFor="mastersDegree" className="block text-sm font-medium text-gray-700 mb-1">
                Masters Course Title
              </label>
              <input
                type="text"
                id="mastersDegree"
                name="mastersDegree"
                value={formData.mastersDegree}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., MSc Health Psychology, MA Clinical Psychology"
              />
            </div>
            
            <div>
              <label htmlFor="mastersUniversity" className="block text-sm font-medium text-gray-700 mb-1">
                University
              </label>
              <input
                type="text"
                id="mastersUniversity"
                name="mastersUniversity"
                value={formData.mastersUniversity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="University name"
              />
            </div>
            
            <div>
              <label htmlFor="mastersGrade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade Achieved
              </label>
              <select
                id="mastersGrade"
                name="mastersGrade"
                value={formData.mastersGrade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select grade</option>
                <option value="Distinction">Distinction</option>
                <option value="Merit">Merit</option>
                <option value="Pass">Pass</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDemographicsSection = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select option</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 mb-1">
          Ethnicity
        </label>
        <select
          id="ethnicity"
          name="ethnicity"
          value={formData.ethnicity}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select option</option>
          <option value="White - British">White - British</option>
          <option value="White - Irish">White - Irish</option>
          <option value="White - Other">White - Other</option>
          <option value="Mixed - White and Black Caribbean">Mixed - White and Black Caribbean</option>
          <option value="Mixed - White and Black African">Mixed - White and Black African</option>
          <option value="Mixed - White and Asian">Mixed - White and Asian</option>
          <option value="Mixed - Other">Mixed - Other</option>
          <option value="Asian or Asian British - Indian">Asian or Asian British - Indian</option>
          <option value="Asian or Asian British - Pakistani">Asian or Asian British - Pakistani</option>
          <option value="Asian or Asian British - Bangladeshi">Asian or Asian British - Bangladeshi</option>
          <option value="Asian or Asian British - Chinese">Asian or Asian British - Chinese</option>
          <option value="Asian or Asian British - Other">Asian or Asian British - Other</option>
          <option value="Black or Black British - Caribbean">Black or Black British - Caribbean</option>
          <option value="Black or Black British - African">Black or Black British - African</option>
          <option value="Black or Black British - Other">Black or Black British - Other</option>
          <option value="Arab">Arab</option>
          <option value="Other (please specify)">Other (please specify)</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        
        {formData.ethnicity === 'Other (please specify)' && (
          <input
            type="text"
            name="ethnicityCustom"
            value={formData.ethnicityCustom}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please specify your ethnicity"
          />
        )}
      </div>

      <div>
        <label htmlFor="firstLanguage" className="block text-sm font-medium text-gray-700 mb-1">
          First Language
        </label>
        <select
          id="firstLanguage"
          name="firstLanguage"
          value={formData.firstLanguage}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select option</option>
          <option value="English">English</option>
          <option value="Welsh">Welsh</option>
          <option value="Scottish Gaelic">Scottish Gaelic</option>
          <option value="Irish Gaelic">Irish Gaelic</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Polish">Polish</option>
          <option value="Romanian">Romanian</option>
          <option value="Dutch">Dutch</option>
          <option value="Russian">Russian</option>
          <option value="Arabic">Arabic</option>
          <option value="Mandarin Chinese">Mandarin Chinese</option>
          <option value="Cantonese">Cantonese</option>
          <option value="Hindi">Hindi</option>
          <option value="Urdu">Urdu</option>
          <option value="Bengali">Bengali</option>
          <option value="Punjabi">Punjabi</option>
          <option value="Tamil">Tamil</option>
          <option value="Turkish">Turkish</option>
          <option value="Kurdish">Kurdish</option>
          <option value="Somali">Somali</option>
          <option value="Other (please specify)">Other (please specify)</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        
        {formData.firstLanguage === 'Other (please specify)' && (
          <input
            type="text"
            name="firstLanguageCustom"
            value={formData.firstLanguageCustom}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please specify your first language"
          />
        )}
      </div>

      <div>
        <label htmlFor="disabilityStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Disability Status
        </label>
        <select
          id="disabilityStatus"
          name="disabilityStatus"
          value={formData.disabilityStatus}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select option</option>
          <option value="No disability">No disability</option>
          <option value="Yes, disability declared">Yes, disability declared</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
    </div>
  );

  const renderApplicationSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Universities Applied To (Select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {ukUniversities.map(university => (
            <label key={university} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="universitiesApplied"
                value={university}
                checked={formData.universitiesApplied.includes(university)}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>{university}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="applicationYear" className="block text-sm font-medium text-gray-700 mb-1">
          Application Year
        </label>
        <select
          id="applicationYear"
          name="applicationYear"
          value={formData.applicationYear}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select year</option>
          {[2024, 2025, 2026, 2027].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
          <option value="Future">Future application</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      {/* Previous Applications Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium text-gray-800 mb-4">Previous Applications</h3>
        
        <div className="mb-4">
          <label htmlFor="hasAppliedBefore" className="block text-sm font-medium text-gray-700 mb-1">
            Have you applied to DClinPsy programmes before?
          </label>
          <select
            id="hasAppliedBefore"
            name="hasAppliedBefore"
            value={formData.hasAppliedBefore}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {formData.hasAppliedBefore === 'Yes' && (
          <div className="ml-4 pl-4 border-l-2 border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which years did you previously apply? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[2020, 2021, 2022, 2023, 2024].map(year => (
                <label key={year} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="previousApplicationYears"
                    value={year.toString()}
                    checked={formData.previousApplicationYears.includes(year.toString())}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{year}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Future Features</h4>
        <p className="text-sm text-blue-700">
          We're planning to add tracking for interview invitations and offers received. 
          These features will be available in future updates for users who complete this questionnaire.
        </p>
      </div>
    </div>
  );

  const currentSectionData = sections[currentSection];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Research Questionnaire</h1>
          <p className="text-gray-600 mb-4">
            Help us improve DClinPsy preparation resources (completely optional)
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-green-800 mb-2">📊 How Your Data Helps</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Identify which question categories need more development</li>
              <li>• Understand educational pathways to DClinPsy success</li>
              <li>• Improve the app's effectiveness for different user groups</li>
              <li>• Create better study recommendations and resources</li>
            </ul>
            <p className="text-xs text-green-600 mt-2 font-medium">
              All data is anonymized and stored locally on your device.
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {sections.map((_, index) => (
              <React.Fragment key={index}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= currentSection ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < sections.length - 1 && (
                  <div className={`h-1 w-16 ${index < currentSection ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Question {currentSection + 1} of {sections.length} • About 5 minutes total
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {currentSectionData.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {currentSectionData.description}
            </p>
            {currentSectionData.optional && (
              <p className="text-xs text-blue-600 mt-1">
                All questions in this section are optional - skip any you prefer not to answer
              </p>
            )}
          </div>

          {/* Section Content */}
          <div>
            {currentSection === 0 && renderEducationSection()}
            {currentSection === 1 && renderDemographicsSection()}
            {currentSection === 2 && renderApplicationSection()}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">❌ {error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div className="space-x-3">
              {currentSection > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Skip Questionnaire
              </button>
            </div>

            <div>
              {currentSection < sections.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Saving...' : 'Complete & Continue'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p className="mb-2">
            🔒 Your responses are stored securely on your device and are not transmitted to external servers.
          </p>
          <p>
            You can view, export, or delete your data at any time from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchQuestionnaire;