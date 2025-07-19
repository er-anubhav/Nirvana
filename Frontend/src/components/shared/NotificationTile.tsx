import { motion } from 'framer-motion';
import { Bell, MessageSquare, AlertCircle, CheckCircle, User, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'status_update' | 'comment' | 'assignment' | 'feedback_request' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  complaintId?: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

interface NotificationTileProps {
  notification: Notification;
  index?: number;
  onMarkAsRead?: (id: string) => void;
  onToggleSelection?: (id: string) => void;
  isSelected?: boolean;
}

export function NotificationTile({ 
  notification, 
  index = 0, 
  onMarkAsRead,
  onToggleSelection,
  isSelected = false 
}: NotificationTileProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_update': return AlertCircle;
      case 'comment': return MessageSquare;
      case 'assignment': return User;
      case 'feedback_request': return CheckCircle;
      case 'reminder': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'status_update': return 'text-blue-400 bg-blue-500/20';
      case 'comment': return 'text-green-400 bg-green-500/20';
      case 'assignment': return 'text-purple-400 bg-purple-500/20';
      case 'feedback_request': return 'text-orange-400 bg-orange-500/20';
      case 'reminder': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-purple-400 bg-purple-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-purple-500';
    }
  };

  const IconComponent = getNotificationIcon(notification.type);

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-purple-500/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 ${
        !notification.isRead ? 'border-l-4' : ''
      } ${getPriorityColor(notification.priority)} hover:bg-purple-500/10 transition-colors cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {/* Selection checkbox */}
        {onToggleSelection && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelection(notification.id);
            }}
            className="w-4 h-4 mt-1 text-purple-600 rounded bg-purple-950/20 border-purple-500/30 focus:ring-purple-500 focus:ring-2"
          />
        )}

        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className={` ${notification.isRead ? 'text-purple-300' : 'text-white'}`}>
              {notification.title}
            </h3>
            <div className="flex items-center ml-4 space-x-2">
              {notification.actionRequired && (
                <span className="px-2 py-1 text-xs text-orange-300 rounded bg-orange-500/20">
                  Action Required
                </span>
              )}
              {!notification.isRead && (
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </div>
          </div>
          
          <p className={`text-sm mb-2 ${notification.isRead ? 'text-purple-300/70' : 'text-purple-300'}`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-purple-300/50">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(notification.timestamp).toLocaleString('en-IN')}
              </span>
              {notification.complaintId && (
                <span>Complaint: {notification.complaintId}</span>
              )}
            </div>
            
            {notification.complaintId && (
              <Link
                href={`/citizen/complaints/${notification.complaintId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-purple-400 transition-colors hover:text-purple-300"
              >
                View Complaint →
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
