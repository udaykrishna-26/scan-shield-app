import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <span className="grid h-6 w-6 place-items-center rounded-sm border border-border bg-card">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </span>
          <span>QR Shield</span>
          <span className="ml-1 hidden rounded-sm border border-border px-1.5 py-px text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-block">
            Beta
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/app/scan" className="rounded-sm px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Scanner</Link>
              <Link to="/app/dashboard" className="rounded-sm px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>Dashboard</Link>
              <Link to="/app/history" className="rounded-sm px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>History</Link>
              <div className="mx-2 h-5 w-px bg-border" />
              <Button variant="ghost" size="sm" onClick={signOut} className="h-8 text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" />
                <span className="ml-1.5">Sign out</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="h-8">Sign in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}