import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, report, reportType }) {
  const { flash } = usePage().props;
  const reportId = reportType === 'growth' ? report.growth_ID : report.damage_ID;

  const contractName = report.field_visit?.contract?.contract_name || 'N/A';
  const farmName = report.field_visit?.farm?.location_name || 'N/A';
  const assigneeName = (
    report.field_visit?.assignee
      ? `${report.field_visit.assignee.first_name || ''} ${report.field_visit.assignee.last_name || ''}`.trim()
      : 'Not assigned'
  );

  const getStatusBadge = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-700',
      good: 'bg-blue-100 text-blue-700',
      average: 'bg-yellow-100 text-yellow-700',
      poor: 'bg-red-100 text-red-700',
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
      </span>
    );
  };

  const getDamageTypeBadge = (type) => {
    const colors = {
      pest: 'bg-red-100 text-red-700',
      disease: 'bg-orange-100 text-orange-700',
      weather: 'bg-blue-100 text-blue-700',
      mechanical: 'bg-purple-100 text-purple-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-poppins font-normal ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
        {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'N/A'}
      </span>
    );
  };

  const dateFormatter = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
          <span className="text-[#333333] font-[400]"> | {reportType === 'growth' ? 'Growth' : 'Damage'} Report Details</span>
        </h2>
      }
    >
      <Head title={`${reportType === 'growth' ? 'Growth' : 'Damage'} Report #${reportId}`} />
      
      <div className="px-6 pt-6">
        <nav className="text-sm text-gray-600">
          <Link
            href={route('dashboard')}
            className="text-[#37692F] hover:underline"
          >
            Home
          </Link>{" "}
          /{" "}
          <Link
            href={route('field-visits.index')}
            className="text-[#37692F] hover:underline"
          >
            Field Visits
          </Link>{" "}
          /{" "}
          <Link
            href={route('field-visits.show', report.field_visit.field_visit_ID)}
            className="text-[#37692F] hover:underline"
          >
            Visit #{report.field_visit.field_visit_ID}
          </Link>{" "}
          / <span>{reportType === 'growth' ? 'Growth' : 'Damage'} Report #{reportId}</span>
        </nav>
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {reportType === 'growth' ? '🌱 Growth' : '⚠️ Damage'} Report #{reportId}
            </h1>
            <p className="mt-1 font-poppins text-sm text-gray-600">
              Detailed information about this {reportType === 'growth' ? 'growth progress' : 'damage incident'}
            </p>
          </div>
          <div className="flex space-x-3">
            {report.field_visit.status !== 'completed' && (
              <Link
                href={route(
                  reportType === 'growth' ? 'growth-reports.edit' : 'damage-reports.edit',
                  reportId
                )}
                className="flex items-center rounded-md bg-[#37692F] px-4 py-2 text-white hover:bg-[#2a5624]"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Report
              </Link>
            )}
            <Link
              href={route('field-visits.show', report.field_visit.field_visit_ID)}
              className="flex items-center rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Visit
            </Link>
          </div>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            {flash.success}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Report Details Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
              Report Details
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                    Report ID
                  </label>
                  <p className="font-poppins text-sm font-normal text-gray-900">
                    #{reportId}
                  </p>
                </div>
                
                <div>
                  <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                    Growth Stage
                  </label>
                  <p className="font-poppins text-sm font-normal text-gray-900">
                    {report.stage || 'N/A'}
                  </p>
                </div>
              </div>

              {reportType === 'growth' ? (
                <div>
                  <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                    Plant Status
                  </label>
                  {getStatusBadge(report.status)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                      Damage Type
                    </label>
                    {getDamageTypeBadge(report.type_damage)}
                  </div>
                  <div>
                    <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                      Severity
                    </label>
                    {getStatusBadge(report.severity_damage)}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Created Date
                </label>
                <p className="font-poppins text-sm font-normal text-gray-900">
                  {dateFormatter(report.created_at)}
                </p>
              </div>

              {report.updated_at !== report.created_at && (
                <div>
                  <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                    Last Updated
                  </label>
                  <p className="font-poppins text-sm font-normal text-gray-900">
                    {dateFormatter(report.updated_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Field Visit Information Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
              Field Visit Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Field Visit ID
                </label>
                <Link
                  href={route('field-visits.show', report.field_visit.field_visit_ID)}
                  className="font-poppins text-sm font-normal text-[#37692F] hover:underline"
                >
                  #{report.field_visit.field_visit_ID}
                </Link>
              </div>

              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Contract
                </label>
                <p className="font-poppins text-sm font-normal text-gray-900">
                  {contractName}
                </p>
              </div>

              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Farm Location
                </label>
                <p className="font-poppins text-sm font-normal text-gray-900">
                  {farmName}
                </p>
              </div>

              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <p className="font-poppins text-sm font-normal text-gray-900">
                  {assigneeName}
                </p>
              </div>

              <div>
                <label className="mb-1 block font-poppins text-sm font-medium text-gray-700">
                  Visit Date
                </label>
                <p className="font-poppins text-sm font-normal text-gray-900">
                  {dateFormatter(report.field_visit.date_visit)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
              Observations & Notes
            </h2>
            
            {report.notes ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="font-poppins text-sm font-normal text-gray-700 whitespace-pre-wrap">
                  {report.notes}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 font-poppins text-sm font-medium text-gray-900">
                  No Notes Available
                </p>
                <p className="mt-1 font-poppins text-sm text-gray-500">
                  No additional observations were recorded for this report
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 font-poppins text-sm font-normal text-gray-500">
          <p>Report generated from field visit #{report.field_visit.field_visit_ID}</p>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}