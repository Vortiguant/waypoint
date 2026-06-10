import { MainNav } from "@/components/layout/main-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <MainNav />
      <main>{children}</main>
    </div>
  );
}
