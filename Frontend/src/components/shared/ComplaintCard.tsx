import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, User, MapPin, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface Complaint {
  id: string;
  title: string;
  category: string;
  status: 'submitted' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  submittedDate: string;
  location: string;
  description: string;
  assignedTo?: string;
  estimatedResolution?: string;
}

interface ComplaintCardProps {
  complaint: Complaint;
  index?: number;
  showActions?: boolean;
}

export function ComplaintCard({ complaint, index = 0, showActions = true }: ComplaintCardProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return Clock;
      case 'in-progress': return AlertCircle;
      case 'resolved': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(complaint.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10"
    >
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="mb-1 text-white texedium line-clamp-2">
                {complaint.title}
              </h4>
              <p className="mb-2 text-sm text-purple-300/70">
                ID: {complaint.id}
              </p>
            </div>
            <div className="flex items-center ml-4 space-x-2">
              <StatusIcon className="w-5 h-5 text-purple-400" />
              <span className={`px-3 py-1 rounded-full text-xs  ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace('-', ' ').toUpperCase()}
              </span>
              <span className={`text-xs  ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-purple-300/70">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {complaint.location}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(complaint.submittedDate).toLocaleDateString('en-IN')}
            </span>
            {complaint.assignedTo && (
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {complaint.assignedTo}
              </span>
            )}
          </div>
          
          <p className="text-sm text-purple-300/70 line-clamp-2">
            {complaint.description}
          </p>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2 lg:ml-6">
            <Link href={`/citizen/complaints/${complaint.id}`}>
              <button className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
