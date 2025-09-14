import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function DraftActiveModal({ contract, onCancel, onConfirm, processing }) {
  if (!contract) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-4">
          <ArrowPathIcon className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
          Activate Contract
        </h2>
        <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
          Are you sure you want to <span className="text-[#37692F] font-bold">activate</span> this contract?
        </p>
        <p className="text-sm text-gray-500 text-center mb-2">
          This action will activate the contract. <span className="text-red-600 font-semibold">You will not be able to edit several details after activation.</span> Please make sure all the fields are correct before proceeding.
        </p>
        {!contract.contract_file && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              A contract file is required to activate the contract. Please upload a file first.
            </p>
          </div>
        )}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            className="flex-1 px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-poppins text-sm font-medium"
            onClick={onConfirm}
            disabled={processing || !contract.contract_file}
          >
            {processing ? 'Activating...' : 'Activate'}
          </button>
          <button
            className="flex-1 px-5 py-3 bg-white text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-lg font-poppins text-sm transition-colors font-medium"
            onClick={onCancel}
            disabled={processing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}