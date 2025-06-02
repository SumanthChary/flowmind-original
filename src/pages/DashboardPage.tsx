import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Bell, User, BarChart2, Calendar, FileText, Users, Folder } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardPage = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = "Dashboard | FlowMind";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Bell size={20} />
              </button>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <User size={20} />
                <span>{user?.email}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg">
                <BarChart2 size={18} className="mr-3" />
                Overview
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <Calendar size={18} className="mr-3" />
                Schedule
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <FileText size={18} className="mr-3" />
                Documents
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <Users size={18} className="mr-3" />
                Team
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <Folder size={18} className="mr-3" />
                Projects
              </a>
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                <Settings size={18} className="mr-3" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-sm font-medium text-gray-500">Total Projects</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
                <div className="mt-2 text-sm text-success-600">+2.5% from last month</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-sm font-medium text-gray-500">Active Workflows</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">24</p>
                <div className="mt-2 text-sm text-success-600">+5.0% from last month</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">8</p>
                <div className="mt-2 text-sm text-success-600">+1 new this month</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                        <FileText size={16} className="text-accent-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New workflow created</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;