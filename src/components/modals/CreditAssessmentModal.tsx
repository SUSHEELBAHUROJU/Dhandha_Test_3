import React from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertCircle } from 'lucide-react';

interface CreditAssessmentFormData {
  panNumber: string;
  annualTurnover: number;
  yearsInBusiness: number;
  businessType: string;
  shopOwnership: 'owned' | 'rented';
  bankAccountDetails: boolean;
  bankStatements: File | null;
}

interface CreditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreditAssessmentFormData) => void;
}

export default function CreditAssessmentModal({ isOpen, onClose, onSubmit }: CreditAssessmentModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreditAssessmentFormData>();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold">Credit Assessment</h3>
            <p className="text-sm text-gray-500 mt-1">
              Please provide your business details for credit evaluation
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
            <input
              type="text"
              {...register('panNumber', {
                required: 'PAN number is required',
                pattern: {
                  value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                  message: 'Invalid PAN number format'
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="ABCDE1234F"
            />
            {errors.panNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.panNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Annual Turnover (₹)</label>
            <input
              type="number"
              {...register('annualTurnover', {
                required: 'Annual turnover is required',
                min: {
                  value: 100000,
                  message: 'Minimum turnover should be ₹1,00,000'
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="1000000"
            />
            {errors.annualTurnover && (
              <p className="mt-1 text-sm text-red-600">{errors.annualTurnover.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years in Business</label>
            <input
              type="number"
              {...register('yearsInBusiness', {
                required: 'Years in business is required',
                min: {
                  value: 0,
                  message: 'Years must be 0 or greater'
                }
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="2"
            />
            {errors.yearsInBusiness && (
              <p className="mt-1 text-sm text-red-600">{errors.yearsInBusiness.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type</label>
            <select
              {...register('businessType', { required: 'Business type is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select business type</option>
              <option value="sole_proprietorship">Sole Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="private_limited">Private Limited</option>
              <option value="llp">LLP</option>
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-600">{errors.businessType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Ownership</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('shopOwnership', { required: 'Shop ownership is required' })}
                  value="owned"
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Owned</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('shopOwnership', { required: 'Shop ownership is required' })}
                  value="rented"
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Rented</span>
              </label>
            </div>
            {errors.shopOwnership && (
              <p className="mt-1 text-sm text-red-600">{errors.shopOwnership.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account Details</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register('bankAccountDetails')}
                  className="form-checkbox h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">I have an active business bank account</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Bank Statements (Last 6 months)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      {...register('bankStatements')}
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your credit limit will be determined based on the information provided. Please ensure all details are accurate.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}