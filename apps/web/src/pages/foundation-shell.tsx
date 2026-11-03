import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiSliders,
  FiLayers,
  FiTerminal,
  FiSmartphone,
} from 'react-icons/fi';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { StatusText } from '@/components/ui/status-text';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/services/api-client';

// Sample form schema for validating design system inputs
const sampleFormSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  dailyCalorieTarget: z.coerce
    .number({ invalid_type_error: 'Must be a valid number' })
    .int('Must be a whole number')
    .min(1000, 'Minimum target is 1,000 kcal')
    .max(5000, 'Maximum target is 5,000 kcal'),
});

type SampleFormData = z.infer<typeof sampleFormSchema>;

export const FoundationShellPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // TanStack Query integration testing the Backend Health API
  const {
    data: health,
    isLoading: isHealthLoading,
    isError: isHealthError,
    error: healthError,
    refetch: refetchHealth,
    isFetching: isHealthFetching,
  } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => apiClient.getHealth(),
    retry: 1,
  });

  // React Hook Form + Zod form handling
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SampleFormData>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      displayName: 'Kushan',
      dailyCalorieTarget: 2200,
    },
  });

  const onSubmit = (data: SampleFormData) => {
    toast({
      title: 'Form Validated Successfully',
      description: `Name: ${data.displayName}, Target: ${data.dailyCalorieTarget} kcal`,
    });
  };

  const handleTestToast = () => {
    toast({
      title: 'Design System Notification',
      description: 'Standard toast pattern verified with accessible contrast.',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="VitaSync Foundation"
        description="Stage 1 architecture verification, design system primitives, and backend connectivity."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchHealth()}
            disabled={isHealthFetching}
          >
            <FiRefreshCw className={`h-3.5 w-3.5 ${isHealthFetching ? 'animate-spin' : ''}`} />
            <span>Check API Health</span>
          </Button>
        }
      />

      {/* Grid: Health Status & Architectural Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Readiness Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FiTerminal className="h-4 w-4 text-primary" />
                Backend Readiness Probe
              </CardTitle>
              {isHealthLoading ? (
                <StatusText variant="neutral">Checking...</StatusText>
              ) : isHealthError ? (
                <StatusText variant="error">Offline / Unreachable</StatusText>
              ) : (
                <StatusText variant="success">Operational</StatusText>
              )}
            </div>
            <CardDescription>
              Live response from Express backend at <code>/api/v1/health</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isHealthLoading && (
              <p className="text-sm text-muted-foreground">Connecting to API server...</p>
            )}

            {isHealthError && (
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive flex items-start gap-2">
                <FiAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Unable to connect to backend</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Ensure API is running on port 4000. Error:{' '}
                    {healthError instanceof Error ? healthError.message : 'Unknown error'}
                  </p>
                </div>
              </div>
            )}

            {health && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Service Name:</span>
                  <span className="font-medium text-foreground">{health.service}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-mono text-foreground">{health.version}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="font-mono text-foreground">{health.environment}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span className="font-medium text-foreground">{health.uptimeSeconds}s</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Server Timestamp:</span>
                  <span className="font-mono text-foreground">{health.timestamp}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between text-xs text-muted-foreground">
            <span>Client Base URL: {apiClient.getBaseUrl()}</span>
          </CardFooter>
        </Card>

        {/* Foundation Standards Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiLayers className="h-4 w-4 text-primary" />
              Design System Compliance
            </CardTitle>
            <CardDescription>Strict enforcement of Stage 1 constraints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <FiCheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Light Theme Exclusivity:</span>
                <span className="text-muted-foreground ml-1">
                  No dark mode classes, dark variables, or theme toggles.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">React Icons Only:</span>
                <span className="text-muted-foreground ml-1">
                  Zero emoji glyphs, Unicode pictograms, or decorative icons.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">No Live Badges / Pulsing Dots:</span>
                <span className="text-muted-foreground ml-1">
                  Status rendered as plain semantic text without deceptive real-time badges.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FiCheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Android Capacitor Packaging:</span>
                <span className="text-muted-foreground ml-1">
                  Ready for native Android build via Capacitor CLI.
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={handleTestToast}>
              Test Toast Pattern
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  Open Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Accessible Modal Dialog</DialogTitle>
                  <DialogDescription>
                    Standard modal pattern built on Radix UI primitive with keyboard navigation and
                    screen reader focus trapping.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2 text-sm text-foreground">
                  This dialog demonstrates modal containment, light-theme styling, and backdrop
                  blur.
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </DialogClose>
                  <Button size="sm" onClick={() => setDialogOpen(false)}>
                    Acknowledge
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      {/* Form Validation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiSliders className="h-4 w-4 text-primary" />
            Form Handling & Validation (React Hook Form + Zod)
          </CardTitle>
          <CardDescription>
            Validates user input with decimal/integer safety and responsive layouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="displayName">User Profile Name</Label>
                <Input
                  id="displayName"
                  placeholder="e.g. Alex"
                  error={Boolean(errors.displayName)}
                  {...register('displayName')}
                />
                {errors.displayName && (
                  <p className="text-xs text-destructive">{errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dailyCalorieTarget">Daily Calorie Target (kcal)</Label>
                <Input
                  id="dailyCalorieTarget"
                  type="number"
                  placeholder="2200"
                  error={Boolean(errors.dailyCalorieTarget)}
                  {...register('dailyCalorieTarget')}
                />
                {errors.dailyCalorieTarget && (
                  <p className="text-xs text-destructive">{errors.dailyCalorieTarget.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isSubmitting}>
                Submit Form
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiSmartphone className="h-4 w-4 text-primary" />
            Monorepo Module Architecture Reference
          </CardTitle>
          <CardDescription>
            Clean tabular presentation of Phase 1 workspace packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stack</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">@vitasync/web</TableCell>
                <TableCell>Application</TableCell>
                <TableCell className="text-muted-foreground">
                  React 18 + Vite + Tailwind CSS + Capacitor
                </TableCell>
                <TableCell>
                  <StatusText variant="success">Stage 1 Active</StatusText>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">@vitasync/api</TableCell>
                <TableCell>Application</TableCell>
                <TableCell className="text-muted-foreground">Express + TypeScript + Zod</TableCell>
                <TableCell>
                  <StatusText variant="success">Stage 1 Active</StatusText>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs font-semibold">@vitasync/shared</TableCell>
                <TableCell>Package</TableCell>
                <TableCell className="text-muted-foreground">
                  Types, Zod Schemas & API Contracts
                </TableCell>
                <TableCell>
                  <StatusText variant="success">Stage 1 Active</StatusText>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
