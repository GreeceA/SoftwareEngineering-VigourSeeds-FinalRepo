// UserInfoModal.jsx
export default function UserInfoModal({ user, onClose }) {
    if (!user) return null;

    // Helper function to calculate years in company
    const calculateYears = (joinDate) => {
        const joined = new Date(joinDate);
        const now = new Date();

        let years = now.getFullYear() - joined.getFullYear();
        const monthDiff = now.getMonth() - joined.getMonth();
        const dayDiff = now.getDate() - joined.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            years--;
        }

        return years;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-[420px] p-6 relative shadow-xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col items-center space-y-5">
                    {/* Avatar */}
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-24 w-24 rounded-full object-cover border-4 border-[#37692F]"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-[#37692F] flex items-center justify-center text-white text-3xl font-bold border-4 border-[#2a5624]">
                            {user.name[0].toUpperCase()}
                        </div>
                    )}

                    {/* Name and Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-[#37692F] font-medium mt-1">{user.role}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between w-full bg-gray-50 rounded-lg p-4">
                        <div className="text-center flex-1 border-r border-gray-200">
                            <div className="text-2xl font-bold text-[#37692F]">{calculateYears(user.created_at)}</div>
                            <div className="text-xs text-gray-500 mt-1">Years in Company</div>
                        </div>
                        <div className="text-center flex-1">
                            <div className="text-2xl font-bold text-[#37692F]">
                                {user.field_visits_count ?? 0}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Field Visited</div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {user.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Joined:</span>
                            <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Department Section */}
                    <div className="w-full mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Department</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{user.department || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
