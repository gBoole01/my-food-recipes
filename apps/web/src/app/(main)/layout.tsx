import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AppStateProvider } from "@/store/AppStateProvider";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      <AppShell>{children}</AppShell>
    </AppStateProvider>
  );
}
