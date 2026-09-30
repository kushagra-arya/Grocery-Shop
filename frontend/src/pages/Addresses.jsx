import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon } from '@heroicons/react/24/solid';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../services/addressService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

// Indian states list for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await getAddresses();
      const addressList = Array.isArray(response.data) ? response.data : response.data.addresses || [];
      setAddresses(addressList);
    } catch (err) {
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    reset({
      fullName: '',
      phone: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false,
    });
    setShowModal(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    reset({
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'India',
      isDefault: address.isDefault || false,
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddress) {
        const response = await updateAddress(editingAddress.id, data);
        const updatedAddress = response.data;
        setAddresses(addresses.map(a => 
          a.id === editingAddress.id ? updatedAddress : a
        ));
        toast.success('Address updated successfully');
      } else {
        const response = await createAddress(data);
        // Reload addresses to get proper default status
        loadAddresses();
        toast.success('Address added successfully');
      }
      setShowModal(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    setDeletingId(id);
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    setSettingDefaultId(id);
    try {
      await setDefaultAddress(id);
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      })));
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set default address');
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Amazon-style Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <a href="/account" className="hover:text-[#C45500] hover:underline">Your Account</a>
            <span className="mx-2">›</span>
            <span className="text-[#C45500]">Your Addresses</span>
          </nav>
          <h1 className="text-[28px] font-normal text-[#0F1111]">Your Addresses</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add New Address Card - Amazon Style */}
          <button
            onClick={openAddModal}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:border-[#007185] hover:bg-gray-50 transition-all min-h-[260px] group"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#E7F4F5] transition-colors">
              <PlusIcon className="h-12 w-12 text-gray-400 group-hover:text-[#007185] stroke-1" />
            </div>
            <span className="text-xl font-normal text-[#007185]">Add address</span>
          </button>

          {/* Existing Address Cards */}
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-lg shadow-sm border-2 relative overflow-hidden transition-all ${
                address.isDefault 
                  ? 'border-[#007185]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Default Badge - Amazon Style */}
              {address.isDefault && (
                <div className="absolute top-0 left-0 right-0 bg-[#F0F9FA] px-4 py-2 border-b border-[#007185]/20">
                  <span className="inline-flex items-center text-sm font-medium text-[#007185]">
                    <CheckBadgeIcon className="h-5 w-5 mr-1.5 text-[#007185]" />
                    Default address
                  </span>
                </div>
              )}

              <div className={`p-5 ${address.isDefault ? 'pt-14' : ''}`}>
                {/* Name - Bold like Amazon */}
                <h3 className="font-bold text-[#0F1111] text-base mb-1">{address.fullName}</h3>

                {/* Address Lines */}
                <div className="text-sm text-[#565959] leading-relaxed mb-2">
                  <p>{address.street}</p>
                  {address.landmark && <p>{address.landmark}</p>}
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country || 'India'}</p>
                </div>

                {/* Phone */}
                <p className="text-sm text-[#565959] mb-4">
                  Phone number: <span className="text-[#0F1111]">{address.phone}</span>
                </p>

                {/* Actions - Amazon Link Style */}
                <div className="flex flex-wrap items-center gap-1 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => openEditModal(address)}
                    className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline px-1 py-0.5"
                  >
                    Edit
                  </button>
                  <span className="text-gray-300 text-sm">|</span>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                    className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline px-1 py-0.5 disabled:opacity-50"
                  >
                    {deletingId === address.id ? 'Removing...' : 'Remove'}
                  </button>
                  {!address.isDefault && (
                    <>
                      <span className="text-gray-300 text-sm">|</span>
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        disabled={settingDefaultId === address.id}
                        className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline px-1 py-0.5 disabled:opacity-50"
                      >
                        {settingDefaultId === address.id ? 'Setting...' : 'Set as Default'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border mt-4">
            <div className="w-24 h-24 mx-auto bg-[#F5F5F5] rounded-full flex items-center justify-center mb-6">
              <MapPinIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-[#0F1111] mb-2">No addresses saved yet</h2>
            <p className="text-[#565959] mb-6 max-w-md mx-auto">
              Add your delivery address to checkout faster and manage your deliveries easily.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal - Amazon Style */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAddress ? 'Edit your address' : 'Add a new address'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Country/Region
              </label>
              <select
                {...register('country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm bg-[#F0F2F2]"
              >
                <option value="India">India</option>
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Full name (First and Last name)
              </label>
              <input
                {...register('fullName', { required: 'Full name is required' })}
                placeholder=""
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.fullName ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Mobile number
              </label>
              <input
                {...register('phone', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Please enter a valid 10-digit mobile number',
                  },
                })}
                placeholder="10-digit mobile number without prefixes"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.phone ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-[#565959] mt-1">May be used to assist delivery</p>
              {errors.phone && (
                <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.phone.message}
                </p>
              )}
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Pincode
              </label>
              <input
                {...register('postalCode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[1-9][0-9]{5}$/,
                    message: 'Please enter a valid 6-digit pincode',
                  },
                })}
                placeholder="6 digits [0-9] PIN code"
                maxLength={6}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.postalCode ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.postalCode && (
                <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.postalCode.message}
                </p>
              )}
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Flat, House no., Building, Company, Apartment
              </label>
              <input
                {...register('street', { required: 'Address is required' })}
                placeholder=""
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                  errors.street ? 'border-[#CC0C39]' : 'border-gray-300'
                }`}
              />
              {errors.street && (
                <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠</span> {errors.street.message}
                </p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1">
                Area, Street, Sector, Village
              </label>
              <input
                {...register('landmark')}
                placeholder=""
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm"
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1">
                  Town/City
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  placeholder=""
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm ${
                    errors.city ? 'border-[#CC0C39]' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1">
                  State
                </label>
                <select
                  {...register('state', { required: 'State is required' })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-[#E77600] focus:border-[#E77600] text-sm bg-[#F0F2F2] ${
                    errors.state ? 'border-[#CC0C39]' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-[#CC0C39] text-xs mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-start pt-2">
              <input
                {...register('isDefault')}
                type="checkbox"
                id="isDefault"
                className="h-4 w-4 text-[#E77600] border-gray-300 rounded focus:ring-[#E77600] mt-0.5"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-[#0F1111]">
                Make this my default address
              </label>
            </div>
          </div>

          {/* Action Buttons - Amazon Style */}
          <div className="mt-6 space-y-3">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200] shadow-sm font-normal py-2"
            >
              {editingAddress ? 'Save changes' : 'Add address'}
            </Button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full text-sm text-[#007185] hover:text-[#C7511F] hover:underline py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
