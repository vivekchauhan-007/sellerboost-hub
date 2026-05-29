import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AuthGate,
});

function AuthGate() {
  const { loading, session, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold">Not authorized</h1>
          <p className="text-sm text-muted-foreground mt-2">Your account doesn't have admin access.</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
