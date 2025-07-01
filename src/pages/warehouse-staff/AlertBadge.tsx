import React from 'react';
import { BellAlertIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

interface AlertBadgeProps {
  count: number;
}

export const AlertBadge = ({ count }: AlertBadgeProps) => {
  return (
    <div className="relative inline-block">
      <BellAlertIcon className="w-8 h-8 text-blue-700" />
      {count > 0 && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">{count}</Badge>
      )}
    </div>
  );
};
