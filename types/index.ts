import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  paymentResultSchema,
  
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  item_id: string;
  rating: string;
  numReviews: number;
  CreatedAt: Date;
  
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema> & { category: string };
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  item_id: string;
  CreatedAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
  Home: string;
  designer: string;
  seller: string;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;


