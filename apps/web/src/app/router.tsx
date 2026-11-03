import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { FoundationShellPage } from '@/pages/foundation-shell';
import { PlaceholderPage } from '@/pages/placeholder-page';
import { AboutPage } from '@/pages/about-page';
import { NotFoundPage } from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <FoundationShellPage />,
      },
      {
        path: 'nutrition',
        element: (
          <PlaceholderPage
            title="Nutrition & Food Tracking"
            description="Log daily food intake, track macros, and scan barcodes."
            stageName="Stage 3 — Nutrition, Food Database and Logging"
            stageNumber={3}
            details="Food catalogue with Open Food Facts API integration, curated Indian food database, custom food entry, and macro calculation will be established in Stage 3."
          />
        ),
      },
      {
        path: 'activity',
        element: (
          <PlaceholderPage
            title="Activity & Health Connect"
            description="Synchronize steps, active energy, and workouts."
            stageName="Stage 5 — Android Health Connect Bridge"
            stageNumber={5}
            details="Android Health Connect Kotlin plugin and Samsung Health synchronization pipeline will be established in Stage 5."
          />
        ),
      },
      {
        path: 'body',
        element: (
          <PlaceholderPage
            title="Body Composition & FitTrack"
            description="Track weight, body fat %, muscle mass, and Dexa/InBody reports."
            stageName="Stage 6 — FitTrack REST API & Webhook Integration"
            stageNumber={6}
            details="FitTrack API client, webhook signature verification, and body composition timeline will be established in Stage 6."
          />
        ),
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
