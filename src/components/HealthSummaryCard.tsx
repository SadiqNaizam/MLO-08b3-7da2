import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Activity, CalendarClock, PlusCircle } from 'lucide-react'; // Example icons

interface HealthSummaryCardProps {
  title: string;
  description?: string;
  metric?: string; // e.g., "3 Upcoming" or "Normal"
  metricValue?: string; // e.g., "Appointments" or "Blood Pressure"
  actionText?: string;
  onActionClick?: () => void;
  children?: React.ReactNode; // For more complex content
  variant?: 'appointments' | 'vitals' | 'generic'; // To slightly alter appearance or icon
}

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  title,
  description,
  metric,
  metricValue,
  actionText,
  onActionClick,
  children,
  variant = 'generic'
}) => {
  console.log("Rendering HealthSummaryCard:", title);

  const IconComponent = variant === 'appointments' ? CalendarClock : variant === 'vitals' ? Activity : PlusCircle;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {metric && <div className="text-2xl font-bold">{metric}</div>}
        {metricValue && <p className="text-xs text-muted-foreground">{metricValue}</p>}
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        {children}
      </CardContent>
      {actionText && onActionClick && (
        <CardFooter>
          <Button className="w-full" onClick={onActionClick}>
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default HealthSummaryCard;