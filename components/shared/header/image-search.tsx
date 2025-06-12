import Link from "next/link";
import { ImagePlay } from "lucide-react";

const ImageSearch = async () => {
  return (
    <Link href="/clip-search-page" aria-label="Go to Clip Search Page">
      <ImagePlay className="w-6 h-6 hover:text-primary transition-colors" />
    </Link>
  );
};

export default ImageSearch;