import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusText } from '@/components/ui/status-text';
import { FiClock } from 'react-icons/fi';

interface PlaceholderPageProps {
  title: string;
  description: string;
  stageName: string;
  stageNumber: number;
  details: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  stageName,
  stageNumber,
  details,
}) => {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-muted-foreground" />
              Scheduled for Stage {stageNumber}
            </CardTitle>
            <StatusText variant="neutral">Pending Stage {stageNumber}</StatusText>
          </div>
          <CardDescription>{stageName}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{details}</p>
        </CardContent>
      </Card>
    </div>
  );
};
