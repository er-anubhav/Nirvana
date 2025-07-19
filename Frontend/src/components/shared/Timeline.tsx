import { motion } from 'framer-motion';
import { AlertCircle, MessageSquare, User, Upload, CheckCircle, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'status_change' | 'comment' | 'assignment' | 'document';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  userRole: 'citizen' | 'official' | 'system';
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'status_change': return AlertCircle;
      case 'assignment': return User;
      case 'comment': return MessageSquare;
      case 'document': return Upload;
      default: return CheckCircle;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'status_change': return 'bg-purple-600';
      case 'assignment': return 'bg-blue-600';
      case 'comment': return 'bg-green-600';
      case 'document': return 'bg-gray-600';
      default: return 'bg-purple-600';
    }
  };

  const getUserRoleColor = (role: string) => {
    switch (role) {
      case 'official': return 'text-blue-400';
      case 'citizen': return 'text-green-400';
      case 'system': return 'text-purple-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const IconComponent = getEventIcon(event.type);
        
        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex space-x-4"
          >
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              {index < events.length - 1 && (
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
              <p className={`text-xs ${getUserRoleColor(event.userRole)}`}>
                by {event.user} ({event.userRole})
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
