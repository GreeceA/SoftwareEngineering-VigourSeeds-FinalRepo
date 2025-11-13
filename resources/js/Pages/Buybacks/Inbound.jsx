import React, { useState, useEffect } from 'react';
import { Leaf, Calendar, AlertTriangle, CheckCircle, Package, TrendingUp } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, router } from '@inertiajs/react';

const BuybackInboundForm = () => {
  const { auth, contracts = [], cornProducts = [], flash = {} } = usePage().props;
  const [formData, setFormData] = useState({
    contract_id: '',
    corn_product_id: '',
    qty: '',
    unit: 'kg',
    delivery_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [showWarning, setShowWarning] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleContractChange = (contractId) => {
    const contract = contracts.find(c => c.id === parseInt(contractId));
    setSelectedContract(contract);
    setFormData({
      ...formData,
      contract_id: contractId,
      corn_product_id: contract?.corn_product_id || '',
      unit: contract?.unit || 'kg'
    });
    setShowWarning(false);
  };

  const [deliveryDateError, setDeliveryDateError] = useState('');
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);

  const handleQtyChange = (qty) => {
    // Prevent negative values and limit to 2 decimal places
    let sanitizedQty = qty;

    // Remove negative sign if present
    if (parseFloat(qty) < 0) {
      sanitizedQty = '0';
    }

    // Limit to 2 decimal places
    if (qty.includes('.')) {
      const parts = qty.split('.');
      if (parts[1] && parts[1].length > 2) {
        sanitizedQty = parseFloat(qty).toFixed(2);
      }
    }

    const qtyInKg = toKg(sanitizedQty, formData.unit);
    const maxKg = selectedContract ? selectedContract.remaining_kg : Infinity;
    setFormData({ ...formData, qty: sanitizedQty });

    if (selectedContract && qtyInKg > maxKg) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const toKg = (qty, unit) => {
    if (unit === 'kg') return parseFloat(qty || 0);
    if (unit === 'sack') return parseFloat(qty || 0) * 50;
    if (unit === 'ton') return parseFloat(qty || 0) * 1000;
    return parseFloat(qty || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    router.post(route('buybacks.inbound.store'), formData, {
      onSuccess: () => {
        setFormData({
          contract_id: '',
          corn_product_id: '',
          qty: '',
          unit: 'kg',
          delivery_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        setSelectedContract(null);
        setShowWarning(false);
      },
      onFinish: () => setSubmitting(false)
    });
  };

  const isFormValid =
    formData.contract_id &&
    formData.corn_product_id &&
    formData.qty >= 0.01 &&
    formData.delivery_date &&
    !deliveryDateError;

  const estimatedValue =
    selectedContract && formData.qty
      ? toKg(formData.qty, formData.unit) * selectedContract.buyback_price
      : 0;

  useEffect(() => {
    if (selectedContract && formData.delivery_date) {
      const deliveryDate = new Date(formData.delivery_date);
      const effectiveDate = new Date(selectedContract.effective_date);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (deliveryDate < effectiveDate) {
        setDeliveryDateError(
          `Date must be between contract start date (${selectedContract.effective_date}) and today`
        );
      } else if (deliveryDate > today) {
        setDeliveryDateError(
          `Date must be between contract start date (${selectedContract.effective_date}) and today`
        );
      } else {
        setDeliveryDateError('');
      }

      const expirationDate = new Date(selectedContract.expiration_date);
      if (deliveryDate > expirationDate) {
        setShowExpirationWarning(true);
      } else {
        setShowExpirationWarning(false);
      }
    } else {
      setDeliveryDateError('');
      setShowExpirationWarning(false);
    }
  }, [formData.delivery_date, selectedContract]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-[25px] font-[800]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="text-[#37692F] font-[800]">VIGOUR SEEDS</span>
          <span className="text-[#333333] font-[400]"> | Record Buyback Delivery</span>
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

          {flash.success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-900">{flash.success}</p>
              </div>
            </div>
          )}

          {flash.error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <p className="font-medium text-red-900">{flash.error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Contract <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.contract_id}
                onChange={(e) => handleContractChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Choose a contract...</option>
                {contracts.map(contract => (
                  <option key={contract.id} value={contract.id}>
                    {contract.contract_name} - {contract.partner_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedContract && (
              <>
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Contract Buyback Status
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Expected</p>
                      <p className="text-lg font-bold text-blue-900">
                        {selectedContract.expected_kg.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Already Received</p>
                      <p className="text-lg font-bold text-blue-900">
                        {selectedContract.actual_kg.toLocaleString()} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 mb-1">Remaining</p>
                      <p className={`text-lg font-bold ${selectedContract.remaining_kg === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedContract.remaining_kg.toLocaleString()} kg
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            selectedContract.expected_kg > 0
                              ? Math.min((selectedContract.actual_kg / selectedContract.expected_kg) * 100, 100)
                              : 0
                          }%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-blue-700 mt-1 text-right">
                      {selectedContract.expected_kg > 0
                        ? Math.round((selectedContract.actual_kg / selectedContract.expected_kg) * 100)
                        : 0}% fulfilled
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corn Product <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={
                      cornProducts.find((p) => p.id === Number(formData.corn_product_id))?.name ||
                      selectedContract?.corn_product_name ||
                      ''
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    readOnly
                    disabled
                  />
                  {/* Hidden input to submit the corn_product_id */}
                  <input type="hidden" name="corn_product_id" value={formData.corn_product_id} />
                  <p className="text-xs text-gray-500 mt-1">
                    Corn product is auto-selected based on the contract's seed and cannot be changed.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="999999.99"
                      value={formData.qty}
                      onChange={(e) => handleQtyChange(e.target.value)}
                      onBlur={(e) => {
                        // Format to 2 decimal places on blur
                        if (e.target.value && parseFloat(e.target.value) > 0) {
                          const formatted = parseFloat(e.target.value).toFixed(2);
                          setFormData({ ...formData, qty: formatted });
                        }
                      }}
                      onKeyDown={(e) => {
                        // Prevent minus sign
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        showWarning ? 'border-yellow-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter quantity"
                      required
                    />
                    {/* ...inside your form, after the quantity input... */}
                    {showWarning && (
                      <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2">
                        Warning: Quantity entered exceeds the remaining expected buyback for this contract!
                      </div>
                    )}
                    {selectedContract.remaining > 0 && (
                      <button
                        type="button"
                        onClick={() => handleQtyChange(selectedContract.remaining.toFixed(2))}
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
                      required
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="sack">Sack (50 kg)</option>
                      <option value="ton">Ton</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-red-500 mt-1">
                  {deliveryDateError}
                </p>

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
                      min={selectedContract?.effective_date || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Date must be between contract start date ({selectedContract?.effective_date}) and today
                  </p>
                </div>

                {showExpirationWarning && (
                  <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-medium text-orange-900">Notice: Contract Expired</p>
                      <p className="text-sm text-orange-800 mt-1">
                        This delivery date ({formData.delivery_date}) is after the contract expiration date 
                        ({selectedContract.expiration_date}). You can still record it, but consider renewing the contract.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Add any notes about this delivery (quality, moisture content, harvest cycle, etc.)"
                  />
                </div>

                {formData.qty && selectedContract && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Transaction Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity</span>
                        <span className="font-semibold">
                          {formData.qty} {formData.unit} 
                          <span className="text-xs text-gray-500 ml-2">
                            ({toKg(formData.qty, formData.unit).toLocaleString()} kg)
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buyback Price</span>
                        <span className="font-semibold">
                          ₱{Number(selectedContract.buyback_price).toFixed(2)}/{selectedContract.unit}
                        </span>
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
                type="submit"
                disabled={!isFormValid || submitting || !!deliveryDateError}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <Package size={20} />
                {submitting ? 'Recording...' : 'Record Buyback'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    contract_id: '',
                    corn_product_id: '',
                    qty: '',
                    unit: 'kg',
                    delivery_date: new Date().toISOString().split('T')[0],
                    notes: ''
                  });
                  setSelectedContract(null);
                  setShowWarning(false);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                disabled={submitting}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default BuybackInboundForm;