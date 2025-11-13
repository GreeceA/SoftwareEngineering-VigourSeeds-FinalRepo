import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ reports, reportType, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const routeName = reportType === 'growth' ? 'growth-reports.index' : 'damage-reports.index';
        router.get(route(routeName), { search });
    };

    const handleReset = () => {
        setSearch('');
        const routeName = reportType === 'growth' ? 'growth-reports.index' : 'damage-reports.index';
        router.get(route(routeName));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Head title={`${reportType === 'growth' ? 'Growth' : 'Damage'} Reports`} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {reportType === 'growth' ? 'Growth' : 'Damage'} Reports
                    </h1>
                    <p className="mt-2 text-gray-600">
                        View and manage all {reportType} reports across field visits
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field Visit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contract</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                                    {reportType === 'growth' ? (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    ) : (
                                        <>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                                        </>
                                    )}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reports.data.map((report) => {
                                    const reportId = reportType === 'growth' ? report.growth_ID : report.damage_ID;
                                    return (
                                        <tr key={reportId}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{reportId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <Link
                                                    href={route('field-visits.show', report.field_visit.field_visit_ID)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    #{report.field_visit.field_visit_ID}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {report.field_visit.contract?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {report.field_visit.farm?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{report.stage || 'N/A'}</td>
                                            {reportType === 'growth' ? (
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        report.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                                        report.status === 'good' ? 'bg-blue-100 text-blue-800' :
                                                        report.status === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {report.status || 'N/A'}
                                                    </span>
                                                </td>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{report.type_damage || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            report.severity_damage === 'critical' ? 'bg-red-100 text-red-800' :
                                                            report.severity_damage === 'high' ? 'bg-orange-100 text-orange-800' :
                                                            report.severity_damage === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {report.severity_damage || 'N/A'}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm space-x-2">
                                                <Link
                                                    href={route(
                                                        reportType === 'growth' ? 'growth-reports.show' : 'damage-reports.show',
                                                        reportId
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route(
                                                        reportType === 'growth' ? 'growth-reports.edit' : 'damage-reports.edit',
                                                        reportId
                                                    )}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {reports.links && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Showing {reports.from} to {reports.to} of {reports.total} results
                            </div>
                            <div className="flex gap-2">
                                {reports.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}