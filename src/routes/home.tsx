import { createFileRoute, Navigate } from "@tanstack/react-router";

/** Alias kept for convenience: /home always lands on the dashboard at /. */
export const Route = createFileRoute("/home")({
  component: () => <Navigate to="/" replace />,
});
