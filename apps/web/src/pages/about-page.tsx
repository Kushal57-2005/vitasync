import * as React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FiInfo, FiSmartphone } from 'react-icons/fi';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About VitaSync"
        description="Your nutrition. Your activity. Your progress."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiInfo className="h-4 w-4 text-primary" />
              Product Architecture
            </CardTitle>
            <CardDescription>
              Multi-user Android-first nutrition and fitness platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              VitaSync bridges nutrition intake, activity telemetry from Health Connect / Samsung
              Health, and precision body composition metrics from FitTrack.
            </p>
            <p>
              Built with a modular pnpm monorepo structure, strict TypeScript, light-mode design
              tokens, and Capacitor Android distribution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiSmartphone className="h-4 w-4 text-primary" />
              Runtime & Distribution
            </CardTitle>
            <CardDescription>Capacitor Android configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">App Identifier:</span>
              <span className="font-mono text-foreground">com.vitasync.app</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Target Framework:</span>
              <span className="text-foreground">Capacitor 7 (Android SDK 34+)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Frontend Stack:</span>
              <span className="text-foreground">React 18, Vite, Tailwind CSS</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Backend Stack:</span>
              <span className="text-foreground">Node.js, Express, TypeScript</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
