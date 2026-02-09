import { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  isLoading?: boolean;
  variant?: "default" | "accent";
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  isLoading,
  variant = "default" 
}: StatsCardProps) {
  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  const isAccent = variant === "accent";

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      ${isAccent 
        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-transparent shadow-xl shadow-primary/20" 
        : "bg-card text-card-foreground border-border shadow-sm"
      }
    `}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isAccent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2 font-display">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${isAccent ? "text-primary-foreground/60" : "text-green-600"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`
          p-3 rounded-xl 
          ${isAccent ? "bg-white/20" : "bg-primary/10"}
        `}>
          <Icon className={`w-6 h-6 ${isAccent ? "text-white" : "text-primary"}`} />
        </div>
      </div>
      
      {/* Decorative background circle */}
      <div className={`
        absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-50
        ${isAccent ? "bg-white/30" : "bg-primary/10"}
      `} />
    </div>
  );
}
