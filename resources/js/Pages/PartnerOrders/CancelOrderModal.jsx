import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

const CancelOrderModal = ({ isOpen, onClose, order }) => {
  const { put, processing } = useForm(); // Changed from 'post' to 'put'

  if (!isOpen || !order) return null;

  const handleCancel = () => {
    put(route('partner-orders.cancel', { partnerOrder: order.id }), { // Changed from 'post' to 'put'
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        // Handle error if needed
      }
    });
  };

  const orderNumber = order.order_number || `PO-${order.contract?.contract_name}-${order.id}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Warning Icon */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mx-auto">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
          Cancel Order
        </h2>

        {/* Description */}
        <p className="mb-4 text-center font-poppins text-sm text-gray-600">
          Are you sure you want to cancel order{' '}
          <span className="font-bold text-red-600">
            {orderNumber}
          </span>
          ?
        </p>

        <p className="mb-2 text-center text-sm text-gray-500">
          This action cannot be undone. The order will be permanently cancelled.
        </p>

        {/* Order Details */}
        {order.partner && (
          <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Partner:</span>
                <span className="text-gray-900">{order.partner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Order Date:</span>
                <span className="text-gray-900">
                  {order.order_date ? new Date(order.order_date).toLocaleDateString('en-GB') : 'N/A'}
                </span>
              </div>
              {order.lines && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Line Items:</span>
                  <span className="text-gray-900">{order.lines.length}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Warning Box */}
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-center text-xs font-medium text-red-800">
            ⚠️ Warning: This action cannot be undone. The order will be permanently cancelled.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleCancel}
            disabled={processing}
            className="flex-1 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium font-poppins text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </button>

          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium font-poppins text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            No, Keep Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;