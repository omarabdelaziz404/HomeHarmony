import Link from "next/link";
import { ImagePlay } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageSearch = async () => {
  return (
    <Link href="/clip-search-page" aria-label="Go to Clip Search Page">
      <Button variant="ghost" size="icon" className="hover:text-primary">
        <ImagePlay className="w-6 h-6" />
      </Button>
    </Link>
  );
};

export default ImageSearch;
