'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Tag,
  AlertCircle,
  MessageSquare,
  Upload,
  Star,
  Send,
  CheckCircle,
  Clock,
  Eye,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { complaintService, ComplaintWithDetails } from '@/lib/complaints';

interface TimelineEvent {
  id: string;
  type: 'status_change' | 'comment' | 'assignment' | 'document';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  userRole: 'citizen' | 'official' | 'system';
}

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    type: 'status_change',
    title: 'Complaint Submitted',
    description: 'Your complaint has been successfully submitted and is awaiting review.',
    timestamp: '2025-01-15T10:30:00Z',
    user: 'System',
    userRole: 'system'
  },
  {
    id: '2',
    type: 'assignment',
    title: 'Complaint Assigned',
    description: 'Complaint assigned to BBMP Ward Officer - Rajesh Kumar',
    timestamp: '2025-01-15T14:20:00Z',
    user: 'System',
    userRole: 'system'
  },
  {
    id: '3',
    type: 'status_change',
    title: 'Investigation Started',
    description: 'Field inspection team has been dispatched to assess the issue.',
    timestamp: '2025-01-16T09:15:00Z',
    user: 'Rajesh Kumar',
    userRole: 'official'
  },
  {
    id: '4',
    type: 'comment',
    title: 'Official Update',
    description: 'Site inspection completed. Issue confirmed - electrical fault in the streetlight connection. Work order has been raised with the electrical maintenance team. Expected resolution within 2-3 working days.',
    timestamp: '2025-01-17T11:45:00Z',
    user: 'Rajesh Kumar',
    userRole: 'official'
  }
];

export default function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  // If params is a Promise in the future, we'll need to use React.use(params)
  // For now, we can safely access params.id directly
  const id = params.id;
  
  const [complaint, setComplaint] = useState<ComplaintWithDetails | null>(null);
  const [timeline] = useState<TimelineEvent[]>(mockTimeline);
  const [newComment, setNewComment] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const { data, error } = await complaintService.getComplaintById(id);
        
        if (error) {
          setError(error);
          return;
        }
        
        setComplaint(data);
      } catch (err) {
        setError('Failed to load complaint details');
        console.error('Error fetching complaint:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-amber-300 bg-amber-500/20';
      case 'in-progress': return 'text-blue-300 bg-blue-500/20';
      case 'resolved': return 'text-emerald-300 bg-emerald-500/20';
      case 'rejected': return 'text-red-300 bg-red-500/20';
      default: return 'text-purple-300 bg-purple-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-purple-400';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages([...newImages, ...files]);
  };

  const submitComment = () => {
    if (!newComment.trim() && newImages.length === 0) return;
    
    // Mock comment submission
    console.log('Submitting comment:', { comment: newComment, images: newImages });
    setNewComment('');
    setNewImages([]);
  };

  const submitFeedback = () => {
    if (rating === 0) return;
    
    // Mock feedback submission
    console.log('Submitting feedback:', { rating, comment: feedbackComment });
    setShowFeedback(false);
    setRating(0);
    setFeedbackComment('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-purple-300">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="mb-2 text-xl text-white">Failed to Load Complaint</h2>
          <p className="mb-4 text-purple-300">{error || 'Complaint not found'}</p>
          <Link href="/citizen/dashboard" className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/citizen/dashboard" className="flex items-center space-x-2 text-purple-400 transition-colors hover:text-purple-300">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="font-serif text-xl text-white">Complaint Details</h1>
          <div className="w-32" />
        </div>
      </nav>

      <div className="max-w-6xl p-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Complaint Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h1 className="mb-2 font-serif text-2xl text-white">
                    {complaint.title}
                  </h1>
                  <p className="mb-4 text-purple-300/70">
                    Complaint ID: {complaint.id}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full  ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={` ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 mb-6 sm:grid-cols-2">
                <div className="flex items-center space-x-2 text-purple-300/70">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-300/70">
                  <Tag className="w-4 h-4" />
                  <span>Category: {complaint.category}</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-300/70">
                  <MapPin className="w-4 h-4" />
                  <span>Location: {complaint.location_lat}, {complaint.location_lng}</span>
                </div>
                {complaint.assigned_to && (
                  <div className="flex items-center space-x-2 text-purple-300/70">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {complaint.assigned_to}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-purple-500/20">
                <h3 className="mb-2 text-white">Description</h3>
                <p className="text-purple-300/70">{complaint.description}</p>
              </div>

              {/* Images */}
              {complaint.image_url && (
                <div className="mt-6">
                  <h3 className="mb-3 text-white">Attached Image</h3>
                  <div className="relative group">
                    <img
                      src={complaint.image_url}
                      alt="Evidence"
                      className="object-cover w-full h-64 max-w-md rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/no-image.png';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-lg opacity-0 bg-black/50 group-hover:opacity-100">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <h2 className="mb-6 font-serif text-xl text-white">Progress Timeline</h2>
              
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex space-x-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.type === 'status_change' ? 'bg-purple-600' :
                        event.type === 'assignment' ? 'bg-blue-600' :
                        event.type === 'comment' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {event.type === 'status_change' && <AlertCircle className="w-5 h-5 text-white" />}
                        {event.type === 'assignment' && <User className="w-5 h-5 text-white" />}
                        {event.type === 'comment' && <MessageSquare className="w-5 h-5 text-white" />}
                        {event.type === 'document' && <Upload className="w-5 h-5 text-white" />}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-purple-500/30 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white ">{event.title}</h4>
                        <span className="text-sm text-purple-300/50">
                          {new Date(event.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-purple-300/70">{event.description}</p>
                      <p className="text-xs text-purple-300/50">
                        by {event.user} ({event.userRole})
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Add Comment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <h3 className="mb-4 font-serif text-lg text-white">Add Comment or Evidence</h3>
              
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add additional information, ask questions, or provide updates..."
                  rows={4}
                  className="w-full px-4 py-3 text-white transition-all border rounded-lg resize-none bg-purple-950/20 border-purple-500/30 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label
                    htmlFor="evidence-upload"
                    className="inline-flex items-center space-x-2 text-purple-400 transition-colors cursor-pointer hover:text-purple-300"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Attach Additional Evidence</span>
                  </label>
                </div>

                {newImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {newImages.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`New evidence ${index + 1}`}
                        className="object-cover w-full h-20 rounded"
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={submitComment}
                  disabled={!newComment.trim() && newImages.length === 0}
                  className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Comment</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <h3 className="mb-4 font-serif text-lg text-white">Status Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Current Status</span>
                  <span className={`px-2 py-1 rounded text-xs  ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Days Open</span>
                  <span className="text-sm text-white">
                    {Math.ceil((Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Priority</span>
                  <span className={`text-sm  ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-purple-300/70">Priority Score</span>
                  <span className="text-sm text-white">
                    {complaint.priority_score}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <h3 className="mb-4 font-serif text-lg text-white">Actions</h3>
              
              <div className="space-y-3">
                {complaint.status === 'resolved' && (
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-white transition-colors rounded-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Star className="w-4 h-4" />
                    <span>Rate Resolution</span>
                  </button>
                )}

                <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-purple-300 transition-colors border rounded-lg border-purple-500/30 hover:bg-purple-500/10">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>

                <Link href="/citizen/report">
                  <button className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-purple-300 transition-colors border rounded-lg border-purple-500/30 hover:bg-purple-500/10">
                    <AlertCircle className="w-4 h-4" />
                    <span>Report Similar Issue</span>
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
            >
              <h3 className="mb-4 font-serif text-lg text-white">Contact Information</h3>
              
              {complaint.assigned_to && (
                <div className="space-y-2">
                  <p className="text-sm text-purple-300/70">Assigned Officer</p>
                  <p className="text-white ">{complaint.assigned_to}</p>
                  <p className="text-sm text-purple-300/70">Department: Infrastructure</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl"
          >
            <h3 className="mb-4 font-serif text-xl text-white">Rate This Resolution</h3>
            
            <div className="space-y-4">
              <div>
                <p className="mb-3 text-purple-300/70">How satisfied are you with the resolution?</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-purple-300/30'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm text-purple-300">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience or suggestions..."
                  rows={3}
                  className="w-full px-3 py-2 text-white transition-all border rounded-lg resize-none bg-purple-950/20 border-purple-500/30 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 px-4 py-2 text-purple-300 transition-colors border rounded-lg border-purple-500/30 hover:bg-purple-500/10"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-600/50"
                >
                  Submit Rating
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
