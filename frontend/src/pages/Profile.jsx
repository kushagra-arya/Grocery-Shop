import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CameraIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { getProfile, updateProfile } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50">
                <CameraIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-primary-100">{user?.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                user?.role === 'ADMIN' 
                  ? 'bg-yellow-400 text-yellow-900' 
                  : 'bg-white/20 text-white'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                    isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-primary-500'
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.firstName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                  type="text"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                    isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-primary-500'
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.lastName ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                    isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-primary-500'
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  type="tel"
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl ${
                    isEditing
                      ? 'border-gray-300 focus:ring-2 focus:ring-primary-500'
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isUpdating}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Account Stats */}
        <div className="border-t px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary-600">
                {user?._count?.orders || 0}
              </p>
              <p className="text-sm text-gray-600">Orders</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary-600">
                {user?._count?.reviews || 0}
              </p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary-600">
                {user?._count?.addresses || 0}
              </p>
              <p className="text-sm text-gray-600">Addresses</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Member Since</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t px-6 py-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Danger Zone
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
