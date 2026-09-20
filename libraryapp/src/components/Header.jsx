import { useState, useRef, useEffect, useMemo } from 'react';
import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings, FiChevronDown, FiAlertCircle, FiBookOpen } from 'react-icons/fi';
import { useMongoStore } from '../store/mongoStore';
import { useShallow } from 'zustand/react/shallow';
import { formatDistanceToNow } from 'date-fns';

const Header = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Select raw arrays with shallow comparison to avoid infinite re-render
  const borrowTransactions = useMongoStore(useShallow(state => state.borrowTransactions));
  const members = useMongoStore(useShallow(state => state.members));
  const books = useMongoStore(useShallow(state => state.books));

  // Derive filtered data with useMemo so new arrays are only created when source data changes
  const now = useMemo(() => new Date(), []);
  const overdueTransactions = useMemo(
    () => borrowTransactions.filter(t => t.status === 'Borrowed' && new Date(t.dueDate) < now),
    [borrowTransactions, now]
  );
  const membersWithFines = useMemo(
    () => members.filter(m => m.fine > 0),
    [members]
  );

  const getBookTitle = (id) => books.find(b => b._id === id)?.title || 'Unknown Book';
  const getMemberName = (id) => {
    const m = members.find(m => m._id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Unknown';
  };

  const totalNotifications = overdueTransactions.length + membersWithFines.length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-30 relative">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-blue-600 focus:outline-none lg:hidden">
            <FiMenu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 ml-4 lg:ml-0">Library Management System</h2>
        </div>

        <div className="flex items-center space-x-2">

          {/* --- Bell / Notifications --- */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
              className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full focus:outline-none transition-colors"
            >
              <FiBell className="h-5 w-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold leading-none">
                  {totalNotifications}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                  <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    {totalNotifications} new
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {overdueTransactions.length === 0 && membersWithFines.length === 0 && (
                    <div className="p-6 text-center text-gray-400 text-sm">
                      🎉 No alerts! Everything is on track.
                    </div>
                  )}

                  {overdueTransactions.map(txn => (
                    <div key={txn._id} className="flex items-start px-4 py-3 border-b border-gray-100 hover:bg-red-50 transition-colors">
                      <div className="p-1.5 bg-red-100 rounded-full mr-3 mt-0.5 shrink-0">
                        <FiBookOpen className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Overdue: {getBookTitle(txn.bookId)}</p>
                        <p className="text-xs text-gray-500">by {getMemberName(txn.memberId)}</p>
                        <p className="text-xs text-red-600 font-medium mt-0.5">
                          Due {formatDistanceToNow(new Date(txn.dueDate), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {membersWithFines.map(member => (
                    <div key={member._id} className="flex items-start px-4 py-3 border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                      <div className="p-1.5 bg-yellow-100 rounded-full mr-3 mt-0.5 shrink-0">
                        <FiAlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-yellow-700 font-semibold">Outstanding fine: ₹{member.fine}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* --- Profile / User Menu --- */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Admin User</span>
              <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@library.com</p>
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                    Administrator
                  </span>
                </div>

                <div className="p-1">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiUser className="h-4 w-4 mr-2 text-gray-500" />
                    View Profile
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <FiSettings className="h-4 w-4 mr-2 text-gray-500" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 p-1">
                  <button
                    onClick={() => {
                      alert('In a real app, this would log you out. This is a demo with no auth backend.');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiLogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
