import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@blader/ui-web/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/"! <Button>Click me</Button>
    </div>
  );
}
