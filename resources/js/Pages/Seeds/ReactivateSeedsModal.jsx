import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function ReactivateSeedsModal({ seed, onCancel, onConfirm }) {
  if (!seed) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-4">
          <ArrowPathIcon className="w-10 h-10 text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
          Reactivate Seed
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
          Are you sure you want to reactivate{' '}
          <span className="text-[#37692F] font-bold">
            {seed.seed_variety}
          </span>
          ?
        </p>

        <p className="text-sm text-gray-500 text-center mb-2">
          This seed will be reactivated and available for new contracts.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-green-800 text-center font-medium">
            ✅ This seed will be restored to active status immediately.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="flex-1 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-poppins text-sm font-medium"
            onClick={() => onConfirm(seed.id)}
          >
            Reactivate Seed
          </button>

          <button
            className="flex-1 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-poppins text-sm hover:bg-gray-50 transition-colors font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}