export default function ContractFilePreviewModal({ fileUrl, onClose, contract }) {
    if (!fileUrl) return null;

    const fullUrl = fileUrl;
    const filename = fullUrl.split('/').pop();
    const extension = filename.split('.').pop().toLowerCase();
    const isPDF = extension === 'pdf';

    // Format contract name and signing date for filename
    const contractName = contract?.contract_name?.replace(/[^a-zA-Z0-9-_]/g, '_') || 'Contract';
    const signingDate = contract?.signing_date?.replace(/-/g, '') || 'date';
    const formattedDownloadName = `VigourContract_${contractName}_${signingDate}.${extension}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 relative overflow-hidden">
                <div className="bg-[#37692F] px-6 py-4">
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <span className="font-[800]">VIGOUR SEEDS</span>
                        <span className="font-[400]"> | Contract File Preview</span>
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-6">
                    <div className="w-full h-[60vh] border border-gray-300 rounded-md overflow-hidden flex items-center justify-center bg-gray-50">
                        {isPDF ? (
                            <iframe
                                src={fullUrl}
                                title="Contract File Preview"
                                className="w-full h-full"
                                frameBorder="0"
                            />
                        ) : (
                            <div className="text-center w-full">
                                <p className="mb-4 text-gray-700">
                                    Preview is only available for PDF files.<br />
                                    Click the button below to download and view this file.
                                </p>
                                <a
                                    href={fullUrl}
                                    download={formattedDownloadName}
                                    rel="noopener noreferrer"
                                    className="ml-3 bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                                >
                                    Download File
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#37692F] bg-white text-gray-700"
                        >
                            Close
                        </button>
                        {isPDF && (
                            <a
                                href={fullUrl}
                                download={formattedDownloadName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 bg-[#37692F] text-white px-4 py-2 rounded-md hover:bg-[#2a5624] focus:outline-none focus:ring-2 focus:ring-[#37692F]"
                            >
                                Download File
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}