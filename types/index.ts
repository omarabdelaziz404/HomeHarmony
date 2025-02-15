import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  item_id: string;
  rating: string;
  numReviews: number;
  CreatedAt: Date;
  link: string;
};
