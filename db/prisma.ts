import { neonConfig, Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Create a Neon Pool and pass it to PrismaNeon
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(Product) {
          return Product.price.toString();
        },
      },
      rating: {
        compute(Product) {
          return Product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});





