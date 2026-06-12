import { MainNav } from "@/components/layout/main-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <MainNav />
      <main className="motion-page">{children}</main>
      <SiteFooter />
    </div>
  );
}
