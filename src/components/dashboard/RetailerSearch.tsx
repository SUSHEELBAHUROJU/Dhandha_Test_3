import React, { useState } from 'react';
import { Search, Phone, User } from 'lucide-react';
import { retailers } from '../../services/api';

interface Retailer {
  id: number;
  business_name: string;
  phone: string;
  address: string;
}

interface RetailerSearchProps {
  onRetailerSelect: (retailer: Retailer) => void;
}

export default function RetailerSearch({ onRetailerSelect }: RetailerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setSearchQuery(query);
      setError(null);

      if (!query || query.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      const response = await retailers.search(query);
      
      // Ensure we have valid data
      if (!response || !Array.isArray(response)) {
        throw new Error('Invalid response from server');
      }

      setSearchResults(response);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search retailers. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetailerSelect = (retailer: Retailer) => {
    try {
      onRetailerSelect(retailer);
    } catch (err) {
      console.error('Error selecting retailer:', err);
      setError('Failed to select retailer. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Find Retailer</h3>
        <div className="text-sm text-gray-500">
          Search by phone number or business name
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Enter phone number or business name (min. 3 characters)..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="mt-4 divide-y divide-gray-100">
          {searchResults.map((retailer) => (
            <div
              key={retailer.id}
              className="py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer rounded-lg px-4"
              onClick={() => handleRetailerSelect(retailer)}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-100 to-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{retailer.business_name}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-1" />
                    {retailer.phone}
                  </div>
                </div>
              </div>
              <button
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetailerSelect(retailer);
                }}
              >
                Add Due Entry
              </button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchQuery.length >= 3 && searchResults.length === 0 && (
        <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No retailers found matching "{searchQuery}"</p>
          <p className="text-sm text-gray-500 mt-1">Try a different search term or add a new retailer</p>
        </div>
      )}
    </div>
  );
}