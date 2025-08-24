/**
 * User Profile Page with GDPR Compliance Features
 * Account management, data export/deletion, privacy settings
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, exportUserData, deleteUserAccount } from '../utils/auth';
import { getHistoryStats } from '../utils/testHistory';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [testStats, setTestStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // We can't decrypt DOB without the password, so we'll show basic profile info
      const stats = getHistoryStats();
      setTestStats(stats);
      
      // For the profile data that doesn't require password (like research data)
      // we can show what we have in the user context
      setProfileData({
        id: user.userId,
        username: user.username,
        email: user.email,
        hasResearchData: user.researchDataConsent
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const password = prompt('Enter your password to export your data:');
      if (!password) return;

      const exportedData = await exportUserData(user.userId, password);
      
      if (exportedData) {
        // Create and download the export file
        const dataStr = JSON.stringify(exportedData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `dclinpsy-sjt-data-export-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        alert('Your data has been exported successfully. The file contains all your personal data stored in the app.');
      } else {
        alert('Failed to export data. Please check your password and try again.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('An error occurred while exporting your data.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Password is required to delete your account');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      const success = await deleteUserAccount(user.userId, deletePassword);
      
      if (success) {
        alert('Your account has been successfully deleted. All your data has been removed from this device.');
        logout();
        navigate('/');
      } else {
        setDeleteError('Failed to delete account. Please check your password.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('An error occurred while deleting your account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTrendEmoji = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
              <p className="text-gray-600">Manage your account and privacy settings</p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: '👤' },
                { id: 'data', name: 'Data Management', icon: '📊' },
                { id: 'privacy', name: 'Privacy & Security', icon: '🔒' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="text-lg text-gray-900">{profileData.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg text-gray-900">{profileData.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account ID</label>
                    <p className="text-sm text-gray-600 font-mono">{profileData.id}</p>
                  </div>
                </div>
              </div>

              {/* Practice Statistics */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Practice Statistics</h2>
                {testStats.totalTests > 0 ? (
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{testStats.totalTests}</p>
                      <p className="text-sm text-gray-600">Tests Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{testStats.averageScore}%</p>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{testStats.bestScore}%</p>
                      <p className="text-sm text-gray-600">Best Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-orange-600">
                        {getTrendEmoji(testStats.recentTrend)}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{testStats.recentTrend}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-2">No practice tests completed yet</p>
                    <Link
                      to="/practice"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Start your first practice test
                    </Link>
                  </div>
                )}
              </div>

              {/* Research Participation */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Research Participation</h2>
                {profileData.hasResearchData ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <p className="font-medium text-green-800">Thank you for participating in our research!</p>
                      <p className="text-sm text-gray-600">
                        Your anonymous data helps improve DClinPsy preparation resources.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <p className="font-medium text-gray-800">Optional Research Questionnaire</p>
                        <p className="text-sm text-gray-600">
                          Help us improve the app by sharing anonymous demographic and educational data.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/research-questionnaire"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Complete Survey
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Data Management</h2>
                <p className="text-gray-600 mb-6">
                  In compliance with GDPR regulations, you have full control over your personal data.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📥</div>
                        <div>
                          <h3 className="font-medium text-gray-800">Export My Data</h3>
                          <p className="text-sm text-gray-600">
                            Download a complete copy of all your personal data stored in this app.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Export Data
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">📊</div>
                        <div>
                          <h3 className="font-medium text-gray-800">View Progress Dashboard</h3>
                          <p className="text-sm text-gray-600">
                            See detailed analytics of your practice test performance.
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        View Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Storage Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-800 mb-2">How Your Data is Stored</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All data is stored locally on your device using browser storage</li>
                  <li>• No data is transmitted to external servers or third parties</li>
                  <li>• Sensitive information like your date of birth is encrypted</li>
                  <li>• Test history and progress data is tied to your account</li>
                  <li>• You can delete all data at any time by deleting your account</li>
                </ul>
              </div>
            </div>
          )}

          {/* Privacy & Security Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
                
                <div className="space-y-6">
                  {/* Account Security */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Account Security</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span>Password protected with industry-standard hashing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span>Rate limiting prevents brute force attacks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span>Session timeout for added security</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✅</span>
                        <span>Date of birth encrypted with your password</span>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Rights */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Your Privacy Rights</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📋</span>
                        <span>Right to access: Export all your data at any time</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">✏️</span>
                        <span>Right to rectification: Contact us to correct any data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">🗑️</span>
                        <span>Right to erasure: Delete your account and all data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-600">📄</span>
                        <span>Right to portability: Export your data in JSON format</span>
                      </div>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Logout</h3>
                        <p className="text-sm text-gray-600">
                          Sign out of your account on this device.
                        </p>
                      </div>
                      <button
                        onClick={logout}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-red-800">Delete Account</h3>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-2">Privacy Questions?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have questions about how your data is handled or need assistance with your privacy rights:
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Email: <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">privacy@example.com</a></p>
                  <p>Privacy Policy: <Link to="/privacy" className="text-blue-600 hover:underline">View full policy</Link></p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Account Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Delete Account</h3>
              <p className="text-gray-700 mb-4">
                This will permanently delete your account and all associated data including:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
                <li>Profile information</li>
                <li>Test history and progress data</li>
                <li>Research questionnaire responses (if completed)</li>
                <li>All analytics and performance tracking</li>
              </ul>
              <p className="text-sm font-medium text-red-600 mb-4">
                This action cannot be undone.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your password to confirm:
                  </label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Password"
                  />
                </div>

                {deleteError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{deleteError}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading || !deletePassword}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;