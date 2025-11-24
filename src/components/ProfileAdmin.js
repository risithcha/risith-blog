'use client';

// Imports
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProfile, updateBio } from '../lib/firebase-profile';
import PrimaryButton from './PrimaryButton';

// Admin panel stuff for managing profile information
export default function ProfileAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load current profile data when stuff mounts
  useEffect(() => {
    loadProfile();
  }, []);

  // Load profile from Firebase
  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      setBio(profileData.bio || '');
    } catch (error) {
      setMessage(`Failed to load profile: ${error.message}`);
    }
  };

  // Save bio changes
  const handleSaveBio = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateBio(bio);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage(`Failed to update profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing and reset to original values
  const handleCancel = () => {
    loadProfile(); // Reset to original values
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Profile Management
        </h3>
        {!isEditing && (
          <PrimaryButton onClick={() => setIsEditing(true)}>
            Edit Profile
          </PrimaryButton>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded ${
            message.includes('successfully')
              ? 'bg-green-900/20 border border-green-700 text-green-300'
              : 'bg-red-900/20 border border-red-700 text-red-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Profile Form */}
      <div className="border border-gray-700 rounded p-4">
        <form onSubmit={handleSaveBio} className="space-y-4">
          {/* Bio Input */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
              Bio Text
            </label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-black dark:text-white"
                placeholder="Enter your bio text..."
                required
              />
            ) : (
              <div className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-gray-700 dark:text-gray-300 min-h-[60px] flex items-center">
                {bio || 'No bio text set'}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Preview Section */}
      <div className="border border-gray-700 rounded p-4">
        <h4 className="text-black dark:text-white font-medium mb-3">Preview</h4>
        <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-500">
              {/* Replaced <img> with Next.js <Image /> for optimization */}
              <Image
                src="/MasterSheep.png"
                alt="Risith"
                className="w-full h-full object-cover"
                width={48}
                height={48}
                priority
              />
            </div>
            <div className="flex-1">
              <h3 className="text-black dark:text-white font-mono text-sm mb-1">
                Risith
              </h3>
              <p className="text-gray-700 dark:text-gray-400 font-mono text-xs">
                {bio || 'No bio text set'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
