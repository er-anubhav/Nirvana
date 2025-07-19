'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Bell,
  User,
  MapPin,
  Calendar,
  Eye,
  Image
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { complaintService, type ComplaintWithDetails } from '@/lib/complaints';

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState<ComplaintWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    avgResolutionTime: 'N/A'
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setCurrentUser(user);
    loadUserData(user.id);
  }, [router]);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Load complaints
      const { data: complaintsData, error: complaintsError } = await complaintService.getUserComplaints(userId);
      if (complaintsError) {
        setError(complaintsError);
      } else if (complaintsData) {
        console.log('Loaded complaints:', complaintsData);
        setComplaints(complaintsData);
      }

      // Load stats
      const statsData = await complaintService.getUserStats(userId);
      if (statsData.error) {
        console.error('Stats error:', statsData.error);
      } else {
        setStats({
          total: statsData.total,
          pending: statsData.pending,
          resolved: statsData.resolved,
          avgResolutionTime: statsData.avgResolutionTime
        });
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (activeFilter === 'all') return true;
    return complaint.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-300 bg-amber-500/20';
      case 'in_progress': return 'text-blue-300 bg-blue-500/20';
      case 'resolved': return 'text-emerald-300 bg-emerald-500/20';
      case 'closed': return 'text-red-300 bg-red-500/20';
      default: return 'text-purple-300 bg-purple-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-purple-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 rounded-full border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-purple-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-10 p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center space-x-4">
            <h1 className="font-serif text-2xl font-normal text-white">Nirvana</h1>
            <span className="text-purple-300/70">Citizen Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/citizen/notifications"
              className="relative p-2 text-purple-400 transition-colors hover:text-purple-300"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1"></span>
            </Link>
            <Link 
              href="/citizen/profile"
              className="flex items-center space-x-2 text-purple-400 transition-colors hover:text-purple-300"
            >
              <User className="w-6 h-6" />
              <span className="hidden md:block">Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mt-8 mb-2 font-serif text-3xl font-normal text-white">
                Welcome back, {currentUser?.name || 'Citizen'}!
              </h2>
              <p className="text-lg text-purple-300/70">
                Track your complaints and report new issues with our AI-powered system.
              </p>
            </div>
            <div className="mt-4 md:mt-8">
              <Link href="/citizen/gallery">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  <Image className="w-5 h-5" />
                  <span>Your Gallery</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4"
        >
          <div className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300/70">Total Complaints</p>
                <p className="font-serif text-2xl font-normal text-white">{stats.total}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300/70">Pending</p>
                <p className="font-serif text-2xl font-normal text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300/70">Resolved</p>
                <p className="font-serif text-2xl font-normal text-white">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300/70">Avg Resolution</p>
                <p className="font-serif text-2xl font-normal text-white">{stats.avgResolutionTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </motion.div>

        {/* Main Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Link href="/citizen/report">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center w-full px-8 py-4 space-x-3 font-normal text-white border-1"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg">Report New Complaint</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Complaints Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="overflow-hidden border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
        >
          {/* Header with filters */}
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <h3 className="font-serif text-xl font-normal text-white">Your Complaints</h3>
              
              {/* Filter tabs */}
              <div className="flex p-1 space-x-1 rounded-lg bg-purple-950/20">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'in_progress', label: 'In Progress' },
                  { key: 'resolved', label: 'Resolved' },
                  { key: 'closed', label: 'Closed' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 text-sm font-normal rounded-md transition-colors ${
                      activeFilter === filter.key
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-300 hover:text-white hover:bg-purple-500/20'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="p-4 text-center border rounded-lg border-red-500/30 bg-red-500/10">
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => currentUser && loadUserData(currentUser.id)}
                  className="px-4 py-2 mt-2 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Complaints List */}
          <div className="divide-y divide-purple-500/10">
            {!error && filteredComplaints.length > 0 ? (
              filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 transition-colors hover:bg-purple-500/5"
                >
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="mb-1 text-lg font-normal text-white">
                            {complaint.title}
                          </h4>
                          <p className="mb-2 text-sm text-purple-300/70">
                            ID: {complaint.id}
                          </p>
                        </div>
                        <div className="flex items-center ml-4 space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-normal ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`text-xs font-normal ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-purple-300/70">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {complaint.category}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(complaint.createdAt)}
                        </span>
                        {complaint.image_url && (
                          <span className="flex items-center">
                            <Image className="w-4 h-4 mr-1" />
                            Image attached
                          </span>
                        )}
                        {complaint.assignedUser && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {complaint.assignedUser.name}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-purple-300/70 line-clamp-2">
                        {complaint.description}
                      </p>
                      
                      {/* Display complaint image if available */}
                      {complaint.image_url && (
                        <div className="mt-3">
                          <p className="mb-1 text-xs text-purple-400">Image URL: {complaint.image_url}</p>
                          <img 
                            src={complaint.image_url} 
                            alt={`Image for complaint: ${complaint.title}`}
                            className="object-cover w-full h-32 max-w-md border rounded-lg border-purple-500/20"
                            onLoad={() => console.log('Image loaded successfully:', complaint.image_url)}
                            onError={(e) => {
                              console.log('Image failed to load:', complaint.image_url);
                              e.currentTarget.src = '/no-image.png';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 lg:ml-6">
                      <Link href={`/citizen/complaints/${complaint.id}`}>
                        <button className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h4 className="mb-2 text-lg font-normal text-white">No complaints found</h4>
                <p className="mb-6 text-purple-300/70">
                  {activeFilter === 'all' 
                    ? "You haven't submitted any complaints yet."
                    : `No complaints with status "${activeFilter}".`
                  }
                </p>
                <Link href="/citizen/report">
                  <button className="px-6 py-3 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                    Report Your First Complaint
                  </button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-4"
        >
          <Link href="/public" className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10">
            <h4 className="mb-2 text-lg font-normal text-white">Public Dashboard</h4>
            <p className="text-sm text-purple-300/70">View community complaints and statistics</p>
          </Link>
          
          <Link href="/citizen/gallery" className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10">
            <h4 className="mb-2 text-lg font-normal text-white">Media Gallery</h4>
            <p className="text-sm text-purple-300/70">View all your complaint photos and media</p>
          </Link>
          
          <Link href="/citizen/notifications" className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10">
            <h4 className="mb-2 text-lg font-normal text-white">Notifications</h4>
            <p className="text-sm text-purple-300/70">Stay updated on your complaint status</p>
          </Link>
          
          <Link href="/citizen/profile" className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10">
            <h4 className="mb-2 text-lg font-normal text-white">Profile Settings</h4>
            <p className="text-sm text-purple-300/70">Update your personal information</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
