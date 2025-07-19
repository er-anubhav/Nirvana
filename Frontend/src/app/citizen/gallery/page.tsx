'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Grid3X3,
  Image as ImageIcon,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { complaintService, type ComplaintWithDetails } from '@/lib/complaints';

interface MediaItem extends ComplaintWithDetails {
  hasMedia: boolean;
}

export default function ComplaintGallery() {
  const [complaints, setComplaints] = useState<MediaItem[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setCurrentUser(user);
    loadUserComplaints(user.id);
  }, [router]);

  const loadUserComplaints = async (userId: string) => {
    setLoading(true);
    try {
      const { data: complaintsData, error: complaintsError } = await complaintService.getUserComplaints(userId);
      if (complaintsError) {
        setError(complaintsError);
      } else if (complaintsData) {
        // Filter complaints that have media
        const complaintsWithMedia = complaintsData
          .filter(complaint => complaint.image_url && complaint.image_url.trim() !== '')
          .map(complaint => ({
            ...complaint,
            hasMedia: true
          }));
        
        setComplaints(complaintsWithMedia);
        setFilteredComplaints(complaintsWithMedia);
        console.log('Loaded complaints with media:', complaintsWithMedia);
      }
    } catch (err) {
      setError('Failed to load complaints');
      console.error('Error loading user complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = complaints;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, selectedCategory, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-emerald-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-purple-500';
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(complaints.map(c => c.category))];
    return categories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-2 rounded-full border-purple-500/20 border-t-purple-500 animate-spin"></div>
          <p className="text-purple-300">Loading your gallery...</p>
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
            <Link
              href="/citizen/dashboard"
              className="flex items-center p-2 text-purple-400 transition-colors rounded-lg hover:text-purple-300 hover:bg-purple-500/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-serif text-2xl font-normal text-white">Media Gallery</h1>
            <span className="text-purple-300/70">{filteredComplaints.length} items</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
              className="p-2 text-purple-400 transition-colors rounded-lg hover:text-purple-300 hover:bg-purple-500/10"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="p-6 mx-auto max-w-7xl">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 p-6 border lg:flex-row lg:items-center lg:justify-between bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-5 h-5 text-purple-400 left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-white placeholder-purple-300/50 bg-purple-950/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-purple-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 text-white bg-purple-950/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="p-6 mb-8">
            <div className="p-4 text-center border rounded-lg border-red-500/30 bg-red-500/10">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={() => currentUser && loadUserComplaints(currentUser.id)}
                className="px-4 py-2 mt-2 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!error && filteredComplaints.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative overflow-hidden border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:border-purple-400/40 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={complaint.image_url}
                    alt={complaint.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/no-image.png';
                    }}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedImage(complaint.image_url)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <Link href={`/citizen/complaints/${complaint.id}`}>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {complaint.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-purple-300/70 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(complaint.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-purple-300/70">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="truncate">{complaint.category}</span>
                  </div>

                  {/* View Complaint Button */}
                  <Link href={`/citizen/complaints/${complaint.id}`}>
                    <button className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                      View Complaint
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-12 text-center border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
          >
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h3 className="mb-2 text-xl font-medium text-white">No Media Found</h3>
            <p className="mb-6 text-purple-300/70">
              {searchTerm || selectedCategory !== 'all'
                ? "No complaints match your current filters."
                : "You haven't submitted any complaints with media yet."
              }
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <Link href="/citizen/report">
                <button className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  Report New Complaint
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Selected complaint"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/no-image.png';
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
