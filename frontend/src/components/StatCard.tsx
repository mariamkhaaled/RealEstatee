import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, isPositive = true }) => {
  return (
    <Card data-cmp="StatCard" className="shadow-custom border-border">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${isPositive ? 'text-green-600' : 'text-destructive'}`}>
              {isPositive ? '+' : '-'}{trend} from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
          <Icon className="text-primary" size={24} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;