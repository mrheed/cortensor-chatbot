"use client";
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

interface StatusBannersProps {
  isLoading: boolean;
  error: string | null;
}

const StatusBanners: React.FC<StatusBannersProps> = ({ isLoading, error }) => {
  return (
    <>
      {isLoading && (
        <div className="px-4 py-2 text-center text-xs text-yellow-300 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center">
          <Loader2 size={16} className="animate-spin mr-2" />
          Assistant is thinking...
        </div>
      )}
      {error && !isLoading && (
        <div className="px-4 py-2 bg-red-900 text-red-100 text-xs flex items-center justify-center border-t border-red-700">
          <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}
    </>
  );
};

export default StatusBanners;