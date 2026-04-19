import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  isPositive = true,
}) => {
  return (
    <Card
      data-cmp="StatCard"
      className="group overflow-hidden border border-slate-200/80 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
    >
      <CardContent className="relative flex items-center justify-between p-5 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </h3>
          {trend && (
            <p
              className={`text-xs font-medium ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isPositive ? "+" : "-"}
              {trend} from last month
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white text-slate-900 shadow-sm transition-transform duration-300 group-hover:scale-105">
          <Icon size={22} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
