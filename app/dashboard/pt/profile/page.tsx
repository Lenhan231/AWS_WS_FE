'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { PersonalTrainer } from '@/types';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  Calendar,
  Star,
  Edit,
  Save,
  X,
  Camera,
  CheckCircle,
  TrendingUp,
  Target,
  Dumbbell,
  Loader2,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

export default function PTProfilePage() {
  const [profile, setProfile] = useState<PersonalTrainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    bio: '',
    specializations: '',
    certifications: '',
    yearsOfExperience: 0,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.ptUsers.getMyProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        // Initialize edit form
        setEditForm({
          bio: response.data.bio || '',
          specializations: response.data.specializations || '',
          certifications: response.data.certifications || '',
          yearsOfExperience: response.data.yearsOfExperience || 0,
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await api.ptUsers.updateMyProfile(editForm);
      if (response.success && response.data) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (profile) {
      setEditForm({
        bio: profile.bio || '',
        specializations: profile.specializations || '',
        certifications: profile.certifications || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
      });
    }
  };

  // Parse comma-separated strings to arrays
  const getSpecializationsArray = () => {
    return editForm.specializations
      ? editForm.specializations.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  };

  const getCertificationsArray = () => {
    return editForm.certifications
      ? editForm.certifications.split(',').map(c => c.trim()).filter(Boolean)
      : [];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-xl font-bold mb-4">{error || 'Profile not found'}</p>
          <Button onClick={fetchProfile} className="btn-primary">
            <span className="font-bold">Retry</span>
          </Button>
        </div>
      </div>
    );
  }

  const specializationsArray = getSpecializationsArray();
  const certificationsArray = getCertificationsArray();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Epic Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[130px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-neon">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  MY <span className="text-gradient">PROFILE</span>
                </h1>
                <p className="text-gray-400 text-lg">Manage your professional information</p>
              </div>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="btn-primary group">
                <Edit className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold">Edit Profile</span>
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleCancel} variant="outline" className="btn-outline">
                  <X className="w-5 h-5 mr-2" />
                  <span className="font-bold">Cancel</span>
                </Button>
                <Button onClick={handleSave} disabled={isSaving} className="btn-primary">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span className="font-bold">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      <span className="font-bold">Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card rounded-2xl p-6 border border-yellow-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                <p className="text-2xl font-black text-white">{profile.averageRating || 0}/5</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{profile.ratingCount || 0} reviews</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-blue-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Status</p>
                <p className="text-2xl font-black text-white">{profile.verified ? 'Verified' : 'Pending'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{profile.active ? 'Active' : 'Inactive'}</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-green-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Certs</p>
                <p className="text-2xl font-black text-white">{certificationsArray.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Certifications</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-purple-600/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                <p className="text-2xl font-black text-white">{profile.yearsOfExperience || 0}y</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Years training</p>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image */}
            <div className="glass-card rounded-3xl p-8 border border-primary-600/30 shadow-3d-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden border-4 border-primary-600/30 group-hover:border-primary-600/60 transition-all duration-300">
                  <img
                    src={profile.profileImageUrl || 'https://picsum.photos/seed/pt-default/480/320'}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-white mx-auto mb-2" />
                      <p className="text-white font-bold">Change Photo</p>
                      <p className="text-gray-400 text-sm">Coming soon</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <h2 className="text-2xl font-black text-white mb-1">
                  {profile.user?.firstName} {profile.user?.lastName}
                </h2>
                <Badge className="bg-primary-600/20 text-primary-400 border-primary-600/30 font-bold">
                  PERSONAL TRAINER
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card rounded-3xl p-6 border border-primary-600/30 shadow-3d-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary-500" />
                QUICK STATS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Experience</span>
                  <span className="text-base font-bold text-white">{profile.yearsOfExperience || 0} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Certifications</span>
                  <span className="text-base font-bold text-white">{certificationsArray.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Specializations</span>
                  <span className="text-base font-bold text-white">{specializationsArray.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <Badge className={profile.verified ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}>
                    {profile.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="glass-card rounded-3xl p-8 border border-primary-600/30 shadow-3d-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary-500" />
                CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <p className="text-base text-white font-medium">{profile.user?.firstName || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Managed in user settings</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <p className="text-base text-white font-medium">{profile.user?.lastName || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Managed in user settings</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <p className="text-base text-white font-medium">{profile.user?.email || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <p className="text-base text-white font-medium">{profile.user?.phoneNumber || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Managed in user settings</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <p className="text-base text-white font-medium">{profile.location?.formattedAddress || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="glass-card rounded-3xl p-8 border border-primary-600/30 shadow-3d-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary-500" />
                PROFESSIONAL INFORMATION
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      className="w-full bg-dark-800/50 border border-primary-600/30 rounded-xl px-4 py-3 text-white focus:border-primary-600/60 focus:outline-none transition-colors"
                      placeholder="Tell clients about your training philosophy and experience..."
                    />
                  ) : (
                    <p className="text-base text-gray-300 leading-relaxed">{profile.bio || 'No bio provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Years of Experience
                  </label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.yearsOfExperience}
                      onChange={(e) => setEditForm({ ...editForm, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      className="w-full max-w-xs"
                      min="0"
                    />
                  ) : (
                    <p className="text-base text-white font-medium">{profile.yearsOfExperience || 0} years</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <Award className="w-4 h-4 inline mr-1" />
                    Specializations
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.specializations}
                      onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                      placeholder="Strength Training, Fat Loss, Mobility (comma-separated)"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {specializationsArray.length > 0 ? (
                        specializationsArray.map((spec, index) => (
                          <Badge key={index} className="bg-primary-600/20 text-primary-400 border-primary-600/30 font-bold">
                            {spec}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No specializations added</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                    <Award className="w-4 h-4 inline mr-1" />
                    Certifications
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.certifications}
                      onChange={(e) => setEditForm({ ...editForm, certifications: e.target.value })}
                      placeholder="ACE CPT, NASM, Precision Nutrition (comma-separated)"
                      className="w-full"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {certificationsArray.length > 0 ? (
                        certificationsArray.map((cert, index) => (
                          <Badge key={index} className="bg-green-600/20 text-green-400 border-green-600/30 font-bold">
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No certifications added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
