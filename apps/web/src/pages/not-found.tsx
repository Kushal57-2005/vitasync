import * as React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FiAlertCircle } from 'react-icons/fi';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="404 — Page Not Found" description="The requested route does not exist." />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 text-destructive" />
            Route Missing
          </CardTitle>
          <CardDescription>
            The URL path could not be mapped to any known VitaSync view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="sm">
            <Link to="/">Return to Foundation Shell</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
