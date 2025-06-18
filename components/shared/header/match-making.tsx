import Link from "next/link";
import { WaypointsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const MatchMakingIcon = async () => {
  return (
    <Link href="/match-making-page" aria-label="Go to Match Making Page">
      <Button variant="ghost" size="icon" className="hover:text-primary">
        <WaypointsIcon className="w-6 h-6" />
      </Button>
    </Link>
  );
};

export default MatchMakingIcon;