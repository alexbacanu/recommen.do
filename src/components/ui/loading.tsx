import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="mx-auto">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
