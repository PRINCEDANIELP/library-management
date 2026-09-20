import { NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiRepeat, FiDatabase } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Books', path: '/books', icon: FiBook },
    { name: 'Members', path: '/members', icon: FiUsers },
    { name: 'Transactions', path: '/transactions', icon: FiRepeat },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 h-full border-r border-slate-800 transition-all duration-300 z-10 hidden lg:flex">
      <div className="flex items-center justify-center h-16 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-wider">
          <FiDatabase className="text-primary-500" />
          <span>MongoDB<span className="text-primary-500 text-sm align-top">Sim</span></span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-slate-200 mb-1">Status</h4>
          <div className="flex items-center text-xs text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Simulated DB Active
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
