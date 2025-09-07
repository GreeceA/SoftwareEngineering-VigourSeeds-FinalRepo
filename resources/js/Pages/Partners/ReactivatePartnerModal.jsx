import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function ReactivatePartnerModal({ partner, onCancel, onConfirm }) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-4">
          <ArrowPathIcon className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="mt-8 text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
          Reactivate Partner
        </h2>
        <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
          Are you sure you want to reactivate <span className="text-[#37692F] font-bold">
            {partner.partner_type === 'organization' ? 'Partner Organization ' : ''}
            {partner.name}
          </span>
          ?
        </p>
        <p className="text-sm text-gray-500 text-center mb-6">
          This partner will be able to receive new contracts again.
        </p>
        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="flex-1 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-poppins text-sm"
            onClick={() => onConfirm(partner.id)}
          >
            Reactivate
          </button>
          <button
            className="flex-1 px-5 py-3 bg-white text-black border border-gray-400 rounded-lg font-poppins text-sm hover:bg-gray-400 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}