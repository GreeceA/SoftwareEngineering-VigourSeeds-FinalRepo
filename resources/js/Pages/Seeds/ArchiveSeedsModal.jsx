import { ArchiveBoxIcon } from '@heroicons/react/24/solid';

export default function ArchiveModal({ seed, onCancel, onConfirm }) {
    if (!seed) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                {/* Warning Icon */}
                <div className="flex items-center justify-center w-20 h-20 mx-auto bg-orange-100 rounded-full mb-4">
                    <ArchiveBoxIcon className="w-10 h-10 text-orange-600" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-poppins font-semibold text-center text-gray-800 mb-2">
                    Archive Seed
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-center mb-4 font-poppins text-sm">
                    Are you sure you want to archive{' '}
                    <span className="text-[#37692F] font-bold">
                        {seed.seed_variety}
                    </span>
                    ?
                </p>

                <p className="text-sm text-gray-500 text-center mb-2">
                    This seed will be archived and will no longer be available for new contracts until reactivated.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <p className="text-xs text-yellow-800 text-center font-medium">
                        ⚠️ Warning: You cannot archive a seed that is in an active and ongoing contract.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        className="flex-1 px-5 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-poppins text-sm font-medium"
                        onClick={() => onConfirm(seed.id)}
                    >
                        Archive Seed
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