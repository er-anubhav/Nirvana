'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
}

interface ComplaintData {
  category: string;
  total: number;
  resolved: number;
  pending: number;
  avgResolutionTime: number;
}

const mockStats: Stat[] = [
  {
    label: 'Total Complaints',
    value: '15,847',
    change: '+12%',
    trend: 'up',
    icon: BarChart3
  },
  {
    label: 'Resolved This Month',
    value: '2,394',
    change: '+8%',
    trend: 'up',
    icon: CheckCircle
  },
  {
    label: 'Average Resolution Time',
    value: '4.2 days',
    change: '-15%',
    trend: 'down',
    icon: Clock
  },
  {
    label: 'Satisfaction Rate',
    value: '89.5%',
    change: '+3%',
    trend: 'up',
    icon: Users
  }
];

const mockComplaintData: ComplaintData[] = [
  { category: 'Infrastructure', total: 4250, resolved: 3890, pending: 360, avgResolutionTime: 5.2 },
  { category: 'Utilities', total: 3180, resolved: 2950, pending: 230, avgResolutionTime: 3.8 },
  { category: 'Traffic', total: 2840, resolved: 2650, pending: 190, avgResolutionTime: 2.1 },
  { category: 'Environment', total: 2150, resolved: 1980, pending: 170, avgResolutionTime: 6.3 },
  { category: 'Health & Sanitation', total: 1890, resolved: 1750, pending: 140, avgResolutionTime: 4.5 },
  { category: 'Public Safety', total: 980, resolved: 920, pending: 60, avgResolutionTime: 1.8 },
  { category: 'Education', total: 340, resolved: 320, pending: 20, avgResolutionTime: 8.1 },
  { category: 'Other', total: 217, resolved: 195, pending: 22, avgResolutionTime: 7.2 }
];

const regions = ['All Regions', 'North Bangalore', 'South Bangalore', 'East Bangalore', 'West Bangalore', 'Central Bangalore'];
const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'Last year'];

export default function PublicDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 days');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Mock refresh action
  };

  const getResolutionRate = (data: ComplaintData) => {
    return ((data.resolved / data.total) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center space-x-4">
            <h1 className="font-serif text-2xl text-white">Nirvana</h1>
            <span className="text-purple-300/70">Public Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 text-purple-400 transition-colors hover:text-purple-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:block">Refresh</span>
            </button>
            <Link href="/auth/login" className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
              Citizen Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 font-serif text-4xl text-white">
            Transparent Governance Dashboard
          </h2>
          <p className="mb-6 text-xl text-purple-300/70">
            Real-time insights into citizen complaints and government response across Bangalore
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-purple-300/70">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Last updated: {lastUpdated.toLocaleString('en-IN')}
            </span>
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              All data anonymized for privacy
            </span>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 mb-8 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 ">Filters</span>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <div>
                <label className="block mb-2 text-sm text-purple-300">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-4 py-2 text-white transition-all border rounded-lg bg-purple-950/20 border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm text-purple-300">Time Range</label>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-4 py-2 text-white transition-all border rounded-lg bg-purple-950/20 border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {timeRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {mockStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8 text-purple-400" />
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend === 'up' ? 'text-emerald-400' :
                    stat.trend === 'down' ? 'text-red-400' :
                    'text-purple-400'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                    {stat.trend === 'down' && <TrendingDown className="w-4 h-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="mb-1 font-serif text-2xl text-white">
                  {stat.value}
                </h3>
                <p className="text-sm text-purple-300/70">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Complaints by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 mb-8 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-white">Complaints by Category</h3>
            <button className="flex items-center space-x-2 text-purple-400 transition-colors hover:text-purple-300">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="py-3 text-left text-purple-300">Category</th>
                  <th className="py-3 text-center text-purple-300">Total</th>
                  <th className="py-3 text-center text-purple-300">Resolved</th>
                  <th className="py-3 text-center text-purple-300">Pending</th>
                  <th className="py-3 text-center text-purple-300">Resolution Rate</th>
                  <th className="py-3 text-center text-purple-300">Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {mockComplaintData.map((item, index) => (
                  <motion.tr
                    key={item.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="transition-colors border-b border-purple-500/10 hover:bg-purple-500/5"
                  >
                    <td className="py-4">
                      <span className="text-white ">{item.category}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-purple-300">{item.total.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-emerald-400">{item.resolved.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-amber-400">{item.pending.toLocaleString()}</span>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-2 mr-2 rounded-full bg-purple-950/40">
                          <div 
                            className="h-2 transition-all duration-1000 rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                            style={{ width: `${getResolutionRate(item)}%` }}
                          />
                        </div>
                        <span className="text-sm text-white">
                          {getResolutionRate(item)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-purple-300">{item.avgResolutionTime} days</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Insights and Recent Activity */}
        <div className="grid gap-8 mb-8 lg:grid-cols-2">
          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
          >
            <h3 className="mb-6 font-serif text-xl text-white">Key Insights</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-white ">Improved Resolution Time</p>
                  <p className="text-sm text-purple-300/70">
                    Average resolution time has decreased by 15% this month, with Traffic complaints being resolved fastest.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-white ">Infrastructure Focus</p>
                  <p className="text-sm text-purple-300/70">
                    Infrastructure complaints account for 27% of all issues, primarily street lighting and road maintenance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full" />
                <div>
                  <p className="text-white ">High Satisfaction</p>
                  <p className="text-sm text-purple-300/70">
                    89.5% of citizens are satisfied with complaint resolution, up 3% from last month.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full" />
                <div>
                  <p className="text-white ">Regional Performance</p>
                  <p className="text-sm text-purple-300/70">
                    North Bangalore shows the highest resolution rate at 94.2%, followed by Central Bangalore at 91.8%.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
          >
            <h3 className="mb-6 font-serif text-xl text-white">System Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">AI Categorization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-emerald-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Complaint Submission</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-emerald-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Mobile App</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-emerald-400">Operational</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-purple-300">SMS Notifications</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-yellow-400">Partial</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-purple-500/20">
              <h4 className="mb-3 text-white">Recent System Updates</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">AI Model Updated</span>
                  <span className="text-purple-300/50">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Database Maintenance</span>
                  <span className="text-purple-300/50">6 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Security Patch Applied</span>
                  <span className="text-purple-300/50">1 day ago</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 text-center border bg-gradient-to-r from-purple-600/20 to-purple-500/20 border-purple-500/30 rounded-xl"
        >
          <h3 className="mb-4 font-serif text-2xl text-white">
            Have a Complaint to Report?
          </h3>
          <p className="max-w-2xl mx-auto mb-6 text-purple-300/70">
            Join thousands of citizens who are making their city better. Report issues, track progress, 
            and help create a more responsive government.
          </p>
          <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="/auth/login">
              <button className="px-8 py-3 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                Login as Citizen
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="px-8 py-3 text-purple-300 transition-colors border rounded-lg border-purple-500/30 hover:bg-purple-500/10">
                Create Account
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
