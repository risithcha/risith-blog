'use client';

// Imports
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProfile } from '../lib/firebase-profile';
import SocialButton from './SocialButton';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

// Profile card stuff showing bio and social links
export default function ProfileCard() {
  const [profile, setProfile] = useState({ bio: 'Loading...' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        setProfile({ bio: 'idk, I need to put something here.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex items-start space-x-6 border border-gray-200 dark:border-gray-700/50">
        {/* Profile Picture */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-500">
          <Image
            src="/MasterSheep.png"
            alt="Risith"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h3 className="text-black dark:text-white font-mono text-lg mb-2">
            Risith
          </h3>
          <p className="text-gray-400 font-mono text-sm mb-4">
            {isLoading ? 'Loading...' : profile.bio}
          </p>

          {/* Social Links */}
          <div className="flex gap-3">
            <SocialButton href="https://github.com/risithcha" Icon={FaGithub} label="GITHUB" />
            <SocialButton href="https://linkedin.com/in/risithcha/" Icon={FaLinkedin} label="LINKEDIN" />
            <SocialButton href="mailto:risithcha@gmail.com" Icon={HiOutlineMail} label="EMAIL" isEmail={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
