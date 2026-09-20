import { useState, useMemo } from 'react';
import { useMongoStore } from '../store/mongoStore';
import { FiBook, FiCornerDownLeft, FiX, FiTrash2, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const TransactionsManagement = () => {
  const transactions = useMongoStore(state => state.borrowTransactions);
  const books = useMongoStore(state => state.books);
  const members = useMongoStore(state => state.members);

  const recordBorrow = useMongoStore(state => state.recordBorrow);
  const recordReturn = useMongoStore(state => state.recordReturn);
  const deleteTransaction = useMongoStore(state => state.deleteTransaction);
  const payTransactionFine = useMongoStore(state => state.payTransactionFine);
  const clearMemberFine = useMongoStore(state => state.clearMemberFine);
  const setMemberFine = useMongoStore(state => state.setMemberFine);
  const resetDatabase = useMongoStore(state => state.resetDatabase);

  const [filterStatus, setFilterStatus] = useState('All');
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);
  const [fineTarget, setFineTarget] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [error, setError] = useState('');

  const [borrowData, setBorrowData] = useState({ memberId: '', bookId: '', dueDate: '' });
  const [returnData, setReturnData] = useState({ notes: '' });

  // Auto-detect overdue at render time without relying on stored status
  const getEffectiveStatus = (txn) => {
    if (txn.status === 'Returned') return 'Returned';
    if (new Date(txn.dueDate) < new Date()) return 'Overdue';
    return 'Borrowed';
  };

  const now = new Date();

  const enrichedTransactions = useMemo(() =>
    transactions.map(t => ({ ...t, effectiveStatus: getEffectiveStatus(t) })),
    [transactions]
  );

  const filteredTransactions = useMemo(() =>
    filterStatus === 'All'
      ? enrichedTransactions
      : enrichedTransactions.filter(t => t.effectiveStatus === filterStatus),
    [enrichedTransactions, filterStatus]
  );

  const handleOpenBorrowModal = () => {
    setError('');
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14);
    setBorrowData({ memberId: '', bookId: '', dueDate: defaultDue.toISOString().split('T')[0] });
    setIsBorrowModalOpen(true);
  };

  const handleBorrowSubmit = (e) => {
    e.preventDefault();
    try {
      const book = books.find(b => b._id === borrowData.bookId);
      const member = members.find(m => m._id === borrowData.memberId);

      if (!book || !member) throw new Error('Please select a valid book and member');
      if (member.status !== 'Active') throw new Error('Member account is not active');
      if (member.fine > 0) throw new Error(`Member has an outstanding fine of ₹${Math.round(member.fine)}`);
      if (!borrowData.dueDate) throw new Error('Please set a due date');

      const borrowDate = new Date();
      const dueDate = new Date(borrowData.dueDate);
      dueDate.setHours(23, 59, 59, 0);

      // Note: check disabled to allow testing of past due dates for fines
      // if (dueDate <= borrowDate) throw new Error('Due date must be a future date');

      recordBorrow({
        transactionId: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
        memberId: member._id,
        bookId: book._id,
        borrowDate: borrowDate.toISOString(),
        dueDate: dueDate.toISOString(),
      });
      setIsBorrowModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenReturnModal = (txn) => {
    setError('');
    setSelectedTxn(txn);
    setReturnData({ notes: '' });
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    try {
      recordReturn(selectedTxn._id, returnData);
      setIsReturnModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction? Book availability and fines will NOT be adjusted.')) {
      deleteTransaction(id);
    }
  };

  const handlePayFine = async (id) => {
    try {
      await payTransactionFine(id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClearMemberFine = (memberId) => {
    const member = members.find(m => m._id === memberId);
    if (!member) return;
    setFineTarget(member);
    setFineAmount(String(Math.round(member.fine || 0)));
    setIsFineModalOpen(true);
  };

  const handleWaiveFine = async () => {
    try {
      await clearMemberFine(fineTarget._id);
      setIsFineModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetFine = async (e) => {
    e.preventDefault();
    const amount = Math.round(parseFloat(fineAmount));
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid non-negative amount.');
      return;
    }
    try {
      await setMemberFine(fineTarget._id, amount);
      setIsFineModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const getBookTitle = (id) => books.find(b => b._id === id)?.title || 'Unknown Book';
  const getMemberName = (id) => {
    const m = members.find(m => m._id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Unknown Member';
  };

  const statusColors = {
    Borrowed: 'bg-blue-100 text-blue-800',
    Returned: 'bg-green-100 text-green-800',
    Overdue:  'bg-red-100 text-red-800',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Transactions Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { if (window.confirm('Reset all data to sample data? All changes will be lost.')) resetDatabase(); }}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
          >
            <FiRefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset Data
          </button>
          <button
            onClick={handleOpenBorrowModal}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
          >
            <FiBook className="mr-2" /> Record Borrow
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 py-1 pl-3 pr-8"
            >
              <option value="All">All Transactions</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <span className="text-xs text-gray-400">{filteredTransactions.length} record(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Txn ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book & Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Fine</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {txn.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 line-clamp-1">{getBookTitle(txn.bookId)}</div>
                    <div className="text-sm text-gray-500">
                      {getMemberName(txn.memberId)}
                      {(() => {
                        const m = members.find(m => m._id === txn.memberId);
                        if (!m) return null;
                        
                        return (
                          <button 
                            onClick={() => handleClearMemberFine(m._id)}
                            className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              m.fine > 0 
                                ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200' 
                                : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                            }`}
                            title="Click to manage this member's fine"
                          >
                            {m.fine > 0 ? `Total Fine: ₹${Math.round(m.fine)} (Manage)` : 'Fine: ₹0 (Manage)'}
                          </button>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div><span className="font-medium text-gray-700">Out:</span> {format(new Date(txn.borrowDate), 'MMM dd, yyyy')}</div>
                    <div><span className="font-medium text-gray-700">Due:</span> {format(new Date(txn.dueDate), 'MMM dd, yyyy')}</div>
                    {txn.returnDate && (
                      <div><span className="font-medium text-gray-700">Ret:</span> {format(new Date(txn.returnDate), 'MMM dd, yyyy')}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusColors[txn.effectiveStatus]}`}>
                      {txn.effectiveStatus === 'Overdue' && <FiAlertTriangle className="mr-1" />}
                      {txn.effectiveStatus}
                    </span>
                    {txn.fine > 0 && (
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-red-600 font-bold">Fine: ₹{Math.round(txn.fine)}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${txn.isFinePaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {txn.isFinePaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3 items-center h-full">
                    {txn.fine > 0 && !txn.isFinePaid && (
                      <button onClick={() => handlePayFine(txn._id)} className="text-green-600 hover:text-green-900 font-medium">
                        Pay Fine
                      </button>
                    )}
                    {!txn.returnDate && (
                      <button onClick={() => handleOpenReturnModal(txn)} className="text-purple-600 hover:text-purple-900">
                        <FiCornerDownLeft className="inline mr-1" /> Return
                      </button>
                    )}
                    <button onClick={() => handleDelete(txn._id)} className="text-gray-400 hover:text-red-600">
                      <FiTrash2 className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Borrow Modal */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Record New Borrow</h3>
              <button onClick={() => setIsBorrowModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              <form id="borrowForm" onSubmit={handleBorrowSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Member *</label>
                  <select required value={borrowData.memberId} onChange={e => setBorrowData({...borrowData, memberId: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                    <option value="">-- Choose Member --</option>
                    {members.filter(m => m.status === 'Active').map(m => (
                      <option key={m._id} value={m._id} disabled={m.fine > 0}>
                        {m.firstName} {m.lastName} ({m.memberId}){m.fine > 0 ? ' — Has Fine' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Book *</label>
                  <select required value={borrowData.bookId} onChange={e => setBorrowData({...borrowData, bookId: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                    <option value="">-- Choose Book --</option>
                    {books.map(b => (
                      <option key={b._id} value={b._id} disabled={b.availableCopies === 0}>
                        {b.title} ({b.availableCopies} available)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date * <span className="text-gray-400 font-normal">(admin sets return deadline)</span>
                  </label>
                  <input
                    required
                    type="date"
                    value={borrowData.dueDate}
                    onChange={e => setBorrowData({...borrowData, dueDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Default: 14 days. Admin can adjust.</p>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsBorrowModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">Cancel</button>
              <button type="submit" form="borrowForm" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Record Borrow</button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnModalOpen && selectedTxn && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Record Return</h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                <p className="text-sm text-gray-700"><strong>Book:</strong> {getBookTitle(selectedTxn.bookId)}</p>
                <p className="text-sm text-gray-700"><strong>Member:</strong> {getMemberName(selectedTxn.memberId)}</p>
                <p className="text-sm text-gray-700"><strong>Due Date:</strong> {format(new Date(selectedTxn.dueDate), 'MMM dd, yyyy')}</p>
                {new Date(selectedTxn.dueDate) < now && (
                  <p className="text-sm font-semibold text-red-600 flex items-center">
                    <FiAlertTriangle className="mr-1" />
                    Overdue — fine will be calculated automatically (₹50/day)
                  </p>
                )}
              </div>
              <form id="returnForm" onSubmit={handleReturnSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Notes (Optional)</label>
                <textarea
                  value={returnData.notes}
                  onChange={e => setReturnData({notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  placeholder="Book condition, reason for delay, etc."
                />
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsReturnModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">Cancel</button>
              <button type="submit" form="returnForm" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Confirm Return</button>
            </div>
          </div>
        </div>
      )}

      {/* Fine Management Modal */}
      {isFineModalOpen && fineTarget && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Manage Fine</h3>
                <p className="text-sm text-gray-500 mt-0.5">{fineTarget.firstName} {fineTarget.lastName} &bull; {fineTarget.memberId}</p>
              </div>
              <button onClick={() => setIsFineModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Current balance */}
              <div className={`flex items-center justify-between p-4 rounded-lg mb-6 ${
                fineTarget.fine > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current Fine Balance</p>
                  <p className={`text-3xl font-bold mt-1 ${fineTarget.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{Math.round(useMongoStore.getState().members.find(m => m._id === fineTarget._id)?.fine ?? fineTarget.fine)}
                  </p>
                </div>
                {fineTarget.fine > 0 && (
                  <button
                    onClick={handleWaiveFine}
                    className="flex items-center px-3 py-2 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiCheckCircle className="mr-1.5" /> Waive All
                  </button>
                )}
              </div>

              {/* Set custom fine */}
              <form id="fineForm" onSubmit={handleSetFine}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set Custom Fine Amount (₹)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={fineAmount}
                      onChange={e => setFineAmount(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Set Fine
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Enter 0 to clear the fine without waiving it.</p>
              </form>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsFineModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsManagement;
