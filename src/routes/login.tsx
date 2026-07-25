import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · QR Shield" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app/scan" });
    });
  }, [navigate]);

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/app/scan" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-8">
        <Link to="/" className="mb-8 flex items-center gap-2 text-sm font-medium">
          <span className="grid h-6 w-6 place-items-center rounded-sm border border-border">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </span>
          QR Shield
        </Link>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Sign in to QR Shield
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          One click with Google. We use your account only to keep your scan history private to you.
        </p>

        <Button onClick={google} className="mt-8 w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to use QR Shield for research and educational purposes.
        </p>
      </div>
    </div>
  );
}