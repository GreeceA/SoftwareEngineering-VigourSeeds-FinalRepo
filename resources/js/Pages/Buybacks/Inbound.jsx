import React, { useState } from 'react';
import { Leaf, Calendar, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, Link } from '@inertiajs/react'; // Add this import

const BuybackInboundForm = () => {
  const { auth } = usePage().props;
  const [formData, setFormData] = useState({
    contract_id: '',
    corn_product_id: '',
    qty: '',
    unit: 'kg',
    delivery_date: '',
    notes: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const contracts = [
    {
      id: 1,
      contract_number: 'CNT-2024-001',
      partner_name: 'Partner Farm A',
      farm_name: 'Main Farm',
      expected_buyback: 5000,
      actual_buyback: 3200,
      remaining: 1800,
      buyback_price: 25.50,
      unit: 'kg'
    },
    {
      id: 2,
      contract_number: 'CNT-2024-002',
      partner_name: 'Partner Farm B',
      farm_name: 'North Field',
      expected_buyback: 8000,
      actual_buyback: 8000,
      remaining: 0,
      buyback_price: 26.00,
      unit: 'kg'
    },
    {
      id: 3,
      contract_number: 'CNT-2024-003',
      partner_name: 'Partner Farm C',
      farm_name: 'Valley Farm',
      expected_buyback: 6500,
      actual_buyback: 2100,
      remaining: 4400,
      buyback_price: 25.00,
      unit: 'kg'
    }
  ];

  const cornProducts = [
    { id: 1, name: 'White Corn', unit: 'kg' },
    { id: 2, name: 'Yellow Corn', unit: 'kg' }
  ];

  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === parseInt(contractId));
    setSelectedContract(contract);
    setFormData({
      ...formData,
      contract_id: contractId,
      unit: contract?.unit || 'kg'
    });
    setShowWarning(false);
  };

  const handleQtyChange = (qty) => {
    setFormData({...formData, qty});
    if (selectedContract && parseFloat(qty) > selectedContract.remaining) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting buyback:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        contract_id: '',
        corn_product_id: '',
        qty: '',
        unit: 'kg',
        delivery_date: '',
        notes: ''
      });
      setSelectedContract(null);
      setShowWarning(false);
    }, 2000);
  };

  const isFormValid = formData.contract_id && formData.corn_product_id && 
                      formData.qty > 0 && formData.delivery_date;

  const estimatedValue = selectedContract && formData.qty 
    ? parseFloat(formData.qty) * selectedContract.buyback_price 
    : 0;

  return (
    <AuthenticatedLayout
        user={auth.user}
        header={
            <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
                <span className="text-[#333333] font-[400]"> | Inventory Management</span>
            </h2>
        }
    >
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Leaf className="text-green-600" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Record Buyback Delivery</h1>
          </div>
          <p className="text-gray-600">Log incoming corn from partner farms based on contract commitments</p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="font-medium text-green-900">Buyback recorded successfully!</p>
              <p className="text-sm text-green-700">Inventory and contract tracking have been updated.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Contract <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.contract_id}
              onChange={(e) => handleContractChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Choose a contract...</option>
              {contracts.map((contract) => (
                <option key={contract.id} value={contract.id}>
                  {contract.contract_number} - {contract.partner_name} ({contract.farm_name})
                </option>
              ))}
            </select>
          </div>

          {selectedContract && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Contract Buyback Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700 mb-1">Expected</p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedContract.expected_buyback.toLocaleString()} {selectedContract.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Already Received</p>
                  <p className="text-lg font-bold text-blue-900">
                    {selectedContract.actual_buyback.toLocaleString()} {selectedContract.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 mb-1">Remaining</p>
                  <p className={`text-lg font-bold ${selectedContract.remaining === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedContract.remaining.toLocaleString()} {selectedContract.unit}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${(selectedContract.actual_buyback / selectedContract.expected_buyback) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.contract_id && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Corn Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.corn_product_id}
                  onChange={(e) => setFormData({...formData, corn_product_id: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Choose corn type...</option>
                  {cornProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.qty}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      showWarning ? 'border-yellow-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter quantity"
                  />
                  {selectedContract && (
                    <button
                      type="button"
                      onClick={() => handleQtyChange(selectedContract.remaining)}
                      className="mt-2 text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Fill Remaining ({selectedContract.remaining} {selectedContract.unit})
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>
              </div>

              {showWarning && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-yellow-900">Warning: Exceeds Expected Buyback</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      Delivery quantity ({formData.qty} {formData.unit}) exceeds remaining expected buyback 
                      ({selectedContract.remaining} {selectedContract.unit}). This may indicate over-delivery 
                      or additional harvest cycles. You can proceed if this is intentional.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any notes about this delivery (quality, moisture content, etc.)"
                />
              </div>

              {formData.qty && selectedContract && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Transaction Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-semibold">{formData.qty} {formData.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Buyback Price</span>
                      <span className="font-semibold">₱{selectedContract.buyback_price}/{selectedContract.unit}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-gray-900 font-medium">Estimated Value</span>
                      <span className="font-bold text-lg text-green-600">
                        ₱{estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <Package size={20} />
              Record Buyback
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  contract_id: '',
                  corn_product_id: '',
                  qty: '',
                  unit: 'kg',
                  delivery_date: '',
                  notes: ''
                });
                setSelectedContract(null);
                setShowWarning(false);
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
};

export default BuybackInboundForm;