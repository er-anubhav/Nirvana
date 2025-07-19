import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
  index?: number;
}

export function StatCard({ 
  label, 
  value, 
  change, 
  trend, 
  icon: IconComponent, 
  color = 'purple',
  index = 0 
}: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'green': return 'text-emerald-400';
      case 'yellow': return 'text-amber-400';
      case 'red': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="p-6 transition-colors border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:bg-purple-500/10"
    >
      <div className="flex items-center justify-between mb-4">
        <IconComponent className={`w-8 h-8 ${getColorClasses(color)}`} />
        {change && trend && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
            {trend === 'up' && <TrendingUp className="w-4 h-4" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <h3 className="mb-1 font-serif text-2xl text-white">
        {value}
      </h3>
      <p className="text-sm text-purple-300/70">{label}</p>
    </motion.div>
  );
}
