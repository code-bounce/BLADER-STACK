import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@blader/ui/components/ui/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p className="font-inter text-2xl font-bold"> Hello "/"!</p>
      <Button className="font-inter">Welcome</Button>{" "}
      <Button className="font-inter">Welcome</Button>{" "}
    </div>
  );
}
