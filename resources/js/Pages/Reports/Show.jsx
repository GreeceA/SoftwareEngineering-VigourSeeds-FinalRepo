import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditGrowthModal from '@/Pages/Reports/EditGrowthModal';
import EditDamageModal from '@/Pages/Reports/EditDamageModal';
import DeleteGrowthModal from '@/Pages/FieldVisits/DeleteGrowthModal';
import DeleteDamageModal from '@/Pages/FieldVisits/DeleteDamageModal';

export default function Show({ auth, report, reportType }) {
  const { flash } = usePage().props;
  const permissions = auth.user.can || [];
  const reportId = reportType === 'growth' ? report.growth_ID : report.damage_ID;

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit form
  const editForm = useForm(
    reportType === 'growth'
      ? {
          stage: report.stage || '',
          status: report.status || '',
          notes: report.notes || '',
        }
      : {
          stage: report.stage || '',
          type_damage: report.type_damage || '',
          severity_damage: report.severity_damage || '',
          notes: report.notes || '',
        }
  );

  const contractName = report.field_visit?.contract?.contract_name || 'N/A';
  const farmName = report.field_visit?.farm?.location_name || 'N/A';
  const assigneeName = (
    report.field_visit?.assignee
      ? `${report.field_visit.assignee.first_name || ''} ${report.field_visit.assignee.last_name || ''}`.trim()
      : 'Not assigned'
  );

  const handleEditClick = () => {
    // Reset form with current data
    if (reportType === 'growth') {
      editForm.setData({
        stage: report.stage || '',
        status: report.status || '',
        notes: report.notes || '',
      });
    } else {
      editForm.setData({
        stage: report.stage || '',
        type_damage: report.type_damage || '',
        severity_damage: report.severity_damage || '',
        notes: report.notes || '',
      });
    }
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = (id) => {
    const route_name = reportType === 'growth' ? 'growth-reports.destroy' : 'damage-reports.destroy';
    
    router.delete(route(route_name, id), {
      onSuccess: () => {
        // Redirect to field visit show page after deletion
        router.visit(route('field-visits.show', report.field_visit.field_visit_ID));
      },
    });
  };

  const submitEdit = () => {
    const route_name = reportType === 'growth' ? 'growth-reports.update' : 'damage-reports.update';
    
    editForm.put(route(route_name, reportId), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setShowEditModal(false);
        editForm.reset();
        // Force page reload to show updated data
        router.reload({ only: ['report'] });
      },
      onError: (errors) => {
        console.error('Update failed:', errors);
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDamageTypeColor = (type) => {
    switch (type) {
      case 'pest': return 'bg-red-100 text-red-800 border-red-200';
      case 'disease': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'weather': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mechanical': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'other': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
      
      {/* Breadcrumb */}
      <div className="px-6 pt-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link
            href={route('dashboard')}
            className="text-[#37692F] hover:underline transition-colors duration-200"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={route('field-visits.index')}
            className="text-[#37692F] hover:underline transition-colors duration-200"
          >
            Field Visits
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            href={route('field-visits.show', report.field_visit.field_visit_ID)}
            className="text-[#37692F] hover:underline transition-colors duration-200"
          >
            Visit #{report.field_visit.field_visit_ID}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium truncate max-w-xs">
            {reportType === 'growth' ? 'Growth' : 'Damage'} Report #{reportId}
          </span>
        </nav>
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#37692F] to-[#4a8a3f] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {reportType === 'growth' ? '🌱' : '⚠️'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-poppins">
                  {reportType === 'growth' ? 'Growth' : 'Damage'} Report #{reportId}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    Field Visit: #{report.field_visit.field_visit_ID}
                  </span>
                  {reportType === 'growth' ? (
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(report.status)}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        report.status === 'excellent' ? 'bg-green-500' :
                        report.status === 'good' ? 'bg-blue-500' :
                        report.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(report.severity_damage)}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        report.severity_damage === 'low' ? 'bg-green-500' :
                        report.severity_damage === 'medium' ? 'bg-yellow-500' :
                        report.severity_damage === 'high' ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      {report.severity_damage ? report.severity_damage.charAt(0).toUpperCase() + report.severity_damage.slice(1) : 'N/A'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {permissions.includes('edit field visit') && report.field_visit.status === 'ongoing' && (
                <>
                  <button
                    onClick={handleEditClick}
                    className="flex items-center rounded-xl bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-5 py-3 text-white font-medium hover:from-[#2a5624] hover:to-[#37692F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Report
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Report
                  </button>
                </>
              )}
              <Link
                href={route('field-visits.show', report.field_visit.field_visit_ID)}
                className="flex items-center rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-5 py-3 text-white font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Visit
              </Link>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
          <div className="mb-6 rounded-xl bg-green-100 border border-green-200 p-4 text-green-700">
            {flash.success}
          </div>
        )}

        {flash?.error && (
          <div className="mb-6 rounded-xl bg-red-100 border border-red-200 p-4 text-red-700">
            {flash.error}
          </div>
        )}

        {/* Warning Banner for Closed Field Visits */}
        {(report.field_visit.status === 'completed' || report.field_visit.status === 'cancelled') && (
          <div className="mb-6 rounded-xl border-l-4 border-orange-500 bg-orange-50 p-4">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-orange-800">
                  {report.field_visit.status === 'completed' ? '🔒 Field Visit Completed' : '🚫 Field Visit Cancelled'}
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  This report cannot be edited or deleted because the associated field visit is {report.field_visit.status}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid - Keep existing content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Report Details */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Report Details</h2>
            </div>
            
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Report ID</label>
                <p className="text-lg font-semibold text-gray-900">#{reportId}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Growth Stage</label>
                <p className="text-gray-900 font-semibold">{report.stage || 'N/A'}</p>
              </div>

              {reportType === 'growth' ? (
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Plant Status</label>
                  <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(report.status)}`}>
                    {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Damage Type</label>
                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getDamageTypeColor(report.type_damage)}`}>
                      {report.type_damage ? report.type_damage.charAt(0).toUpperCase() + report.type_damage.slice(1) : 'N/A'}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Severity</label>
                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(report.severity_damage)}`}>
                      {report.severity_damage ? report.severity_damage.charAt(0).toUpperCase() + report.severity_damage.slice(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Field Visit Information Card */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Field Visit Information</h2>
            </div>
            
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Field Visit ID</label>
                <Link
                  href={route('field-visits.show', report.field_visit.field_visit_ID)}
                  className="text-lg font-semibold text-[#37692F] hover:underline"
                >
                  #{report.field_visit.field_visit_ID}
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit Status</label>
                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                  report.field_visit.status === 'ongoing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  report.field_visit.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                  'bg-red-100 text-red-800 border-red-200'
                }`}>
                  {report.field_visit.status ? report.field_visit.status.charAt(0).toUpperCase() + report.field_visit.status.slice(1) : 'N/A'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Contract</label>
                <p className="text-gray-900 font-semibold">{contractName}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Farm Location</label>
                <p className="text-gray-900 font-semibold">{farmName}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Assigned To</label>
                <p className="text-gray-900 font-semibold">{assigneeName}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit Date</label>
                <p className="text-gray-900 font-semibold">{dateFormatter(report.field_visit.date_visit)}</p>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Observations & Notes</h2>
            </div>
            
            {report.notes ? (
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{report.notes}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No Notes Available</p>
                <p className="text-gray-400 text-sm mt-1">No additional observations were recorded for this report</p>
              </div>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Created: <strong className="text-gray-700">{dateFormatter(report.created_at)}</strong></span>
          </div>
          {report.updated_at !== report.created_at && (
            <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Last Updated: <strong className="text-gray-700">{dateFormatter(report.updated_at)}</strong></span>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Report generated from field visit #{report.field_visit.field_visit_ID}
          </p>
        </div>
      </div>

      {/* Edit Modals */}
      {reportType === 'growth' ? (
        <EditGrowthModal
          open={showEditModal}
          form={editForm}
          onSubmit={submitEdit}
          onClose={() => {
            setShowEditModal(false);
            editForm.reset();
          }}
        />
      ) : (
        <EditDamageModal
          open={showEditModal}
          form={editForm}
          onSubmit={submitEdit}
          onClose={() => {
            setShowEditModal(false);
            editForm.reset();
          }}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        reportType === 'growth' ? (
          <DeleteGrowthModal
            open={showDeleteModal}
            growthReport={report}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        ) : (
          <DeleteDamageModal
            open={showDeleteModal}
            damageReport={report}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )
      )}
    </AuthenticatedLayout>
  );
}