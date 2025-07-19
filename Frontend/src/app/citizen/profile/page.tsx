'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Edit3, Save, X, Calendar } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  dateOfBirth: string;
  gender: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@email.com',
    address: '123 MG Road, Sector 15',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    dateOfBirth: '1990-05-15',
    gender: 'Male'
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Mock save delay
    setTimeout(() => {
      setProfile(editedProfile);
      setIsEditing(false);
      setIsSaving(false);
    }, 1500);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const inputClassName = "w-full px-4 py-3 bg-purple-950/20 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";
  const labelClassName = "block text-purple-300 text-sm  mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]">
      {/* Navigation */}
      <nav className="p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/citizen/dashboard" className="text-purple-400 transition-colors hover:text-purple-300">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-xl text-white">Profile Settings</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </nav>

      <div className="max-w-4xl p-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-600/10 to-purple-500/10 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-white">
                    {isEditing ? editedProfile.name || 'Enter your name' : profile.name}
                  </h2>
                  <p className="text-purple-300/70">Citizen Account</p>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 space-x-2 text-purple-300 transition-colors bg-transparent border rounded-lg border-purple-500/30 hover:bg-purple-500/10"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="flex items-center mb-4 font-serif text-lg text-white">
                  <User className="w-5 h-5 mr-2 text-purple-400" />
                  Personal Information
                </h3>
                
                <div>
                  <label className={labelClassName}>Full Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className={inputClassName}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      {profile.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Phone Number *</label>
                  <div className="flex items-center px-4 py-3 border rounded-lg bg-purple-950/10 border-purple-500/20 text-purple-300/70">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phone} (Cannot be changed)
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className={inputClassName}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      <Mail className="w-4 h-4 mr-2 text-purple-400" />
                      {profile.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                      className={inputClassName}
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      {new Date(profile.dateOfBirth).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Gender</label>
                  {isEditing ? (
                    <select
                      value={editedProfile.gender}
                      onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})}
                      className={inputClassName}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      {profile.gender}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <h3 className="flex items-center mb-4 font-serif text-lg text-white">
                  <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                  Address Information
                </h3>
                
                <div>
                  <label className={labelClassName}>Street Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                      className={inputClassName}
                      placeholder="Enter your street address"
                      rows={3}
                    />
                  ) : (
                    <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      {profile.address}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClassName}>City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.city}
                        onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                        className={inputClassName}
                        placeholder="City"
                      />
                    ) : (
                      <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                        {profile.city}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClassName}>PIN Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.pincode}
                        onChange={(e) => setEditedProfile({...editedProfile, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                        className={inputClassName}
                        placeholder="PIN Code"
                        maxLength={6}
                      />
                    ) : (
                      <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                        {profile.pincode}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>State</label>
                  {isEditing ? (
                    <select
                      value={editedProfile.state}
                      onChange={(e) => setEditedProfile({...editedProfile, state: e.target.value})}
                      className={inputClassName}
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Delhi">Delhi</option>
                      {/* Add more states as needed */}
                    </select>
                  ) : (
                    <div className="px-4 py-3 text-white border rounded-lg bg-purple-950/10 border-purple-500/20">
                      {profile.state}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save notification */}
            {!isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mt-6 border rounded-lg bg-emerald-500/10 border-emerald-500/20"
              >
                <p className="text-sm text-emerald-300">
                  Profile information is used to better serve your complaints and communicate updates.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
