import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SessionGuard } from '@/components/session-guard';
import { PermissionGuard } from '@/components/permission-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <SessionGuard>
      <PermissionGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-auto bg-muted/30 p-6">
              <Breadcrumbs />
              {children}
            </main>
          </div>
        </div>
      </PermissionGuard>
    </SessionGuard>
  );
}
