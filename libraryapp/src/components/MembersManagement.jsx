import { useState } from 'react';
import { useMongoStore } from '../store/mongoStore';
import { FiUserPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

const MembersManagement = () => {
  const members = useMongoStore(state => state.getAllMembers());
  const addMember = useMongoStore(state => state.addMember);
  const updateMember = useMongoStore(state => state.updateMember);
  const deleteMember = useMongoStore(state => state.deleteMember);
  const clearMemberFine = useMongoStore(state => state.clearMemberFine);
  const setMemberFine = useMongoStore(state => state.setMemberFine);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [fineTarget, setFineTarget] = useState(null);
  const [fineAmount, setFineAmount] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    memberId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    dateOfBirth: '',
    membershipType: 'Standard',
    status: 'Active',
    borrowLimit: 3
  });

  const filteredMembers = members.filter(m => 
    m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (member = null) => {
    setError('');
    if (member) {
      setEditingMember(member);
      setFormData({
        ...member,
        street: member.address?.street || '',
        city: member.address?.city || '',
        state: member.address?.state || '',
        zipCode: member.address?.zipCode || '',
        country: member.address?.country || '',
      });
    } else {
      setEditingMember(null);
      setFormData({
        memberId: `M${String(members.length + 1).padStart(3, '0')}`,
        firstName: '', lastName: '', email: '', phone: '',
        street: '', city: '', state: '', zipCode: '', country: '',
        dateOfBirth: '', membershipType: 'Standard', status: 'Active', borrowLimit: 3
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const memberData = {
        memberId: formData.memberId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        dateOfBirth: formData.dateOfBirth,
        membershipType: formData.membershipType,
        status: formData.status,
        borrowLimit: parseInt(formData.borrowLimit),
        isActive: formData.status === 'Active'
      };

      if (editingMember) {
        updateMember(editingMember._id, memberData);
      } else {
        memberData.joinDate = new Date().toISOString();
        memberData.fine = 0;
        addMember(memberData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        deleteMember(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleOpenFineModal = (member) => {
    setFineTarget(member);
    setFineAmount(String(Math.round(member.fine || 0)));
    setIsFineModalOpen(true);
  };

  const handleWaiveFine = () => {
    try {
      clearMemberFine(fineTarget._id);
      setIsFineModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSetFine = (e) => {
    e.preventDefault();
    const amount = Math.round(parseFloat(fineAmount));
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid non-negative amount.');
      return;
    }
    setMemberFine(fineTarget._id, amount);
    setIsFineModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Members Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        >
          <FiUserPlus className="mr-2" /> Add New Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search members by name, email, or ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${member.status === 'Active' ? 'bg-green-500' : member.status === 'Suspended' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
              
              <div className="flex justify-between items-start mb-4 pl-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{member.firstName} {member.lastName}</h3>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2">{member.memberId}</span>
                  {member.status === 'Active' ? 
                    <span className="flex items-center text-xs font-medium text-green-600"><FiCheckCircle className="mr-1" /> Active</span> :
                    <span className="flex items-center text-xs font-medium text-red-600"><FiXCircle className="mr-1" /> {member.status}</span>
                  }
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 pl-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Type</p>
                  <p className="font-medium text-gray-900">{member.membershipType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Fine Balance</p>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-base ${member.fine > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{Math.round(member.fine || 0)}</p>
                    {member.fine > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">FINE</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wider">Location</p>
                  <p className="text-gray-900">{member.address?.city}, {member.address?.state}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 pl-3 border-t border-gray-100 flex flex-wrap justify-end gap-2">
                <button onClick={() => handleOpenFineModal(member)} className="text-yellow-600 hover:text-yellow-800 text-sm font-medium flex items-center border border-yellow-200 hover:border-yellow-400 rounded px-2 py-1 transition-colors">
                  <span className="mr-1 font-bold">₹</span> Manage Fine
                </button>
                <button onClick={() => handleOpenModal(member)} className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center">
                  <FiEdit2 className="mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(member._id)} className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center">
                  <FiTrash2 className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-500">
              No members found. Try adjusting your search.
            </div>
          )}
        </div>
      </div>

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

      {/* Member Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
              
              <form id="memberForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID *</label>
                  <input required type="text" value={formData.memberId} onChange={e => setFormData({...formData, memberId: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" disabled={!!editingMember} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" disabled={!!editingMember} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <h4 className="col-span-2 mt-4 font-semibold text-gray-800 border-b pb-2">Address Information</h4>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>

                <h4 className="col-span-2 mt-4 font-semibold text-gray-800 border-b pb-2">Membership Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={formData.membershipType} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </form>

            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-3">Cancel</button>
              <button type="submit" form="memberForm" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">{editingMember ? 'Update Member' : 'Save Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;
