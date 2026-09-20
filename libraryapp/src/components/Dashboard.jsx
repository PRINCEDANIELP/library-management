import { useMongoStore } from '../store/mongoStore';
import { FiBookOpen, FiUsers, FiRepeat, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const Dashboard = () => {
  const totalBooks = useMongoStore(state => state.books.length);
  const activeMembers = useMongoStore(state => state.members.filter(m => m.status === 'Active').length);
  const borrowedBooks = useMongoStore(state => state.borrowTransactions.filter(t => t.status === 'Borrowed').length);
  const totalFines = useMongoStore(state => state.members.reduce((sum, m) => sum + m.fine, 0));
  
  const resetDatabase = useMongoStore(state => state.resetDatabase);

  const statCards = [
    { title: 'Total Books', value: totalBooks, icon: FiBookOpen, color: 'bg-blue-500' },
    { title: 'Active Members', value: activeMembers, icon: FiUsers, color: 'bg-green-500' },
    { title: 'Borrowed Books', value: borrowedBooks, icon: FiRepeat, color: 'bg-purple-500' },
    { title: 'Total Fines (₹)', value: totalFines, icon: FiAlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome to the MongoDB Library Management Simulator</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to reset the database to its initial state? All your changes will be lost.')) {
                resetDatabase();
              }
            }}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiRefreshCw className="mr-2 h-4 w-4 text-gray-500" />
            Reset Database
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

