"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PROFUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PROFUCTS_LIMIT,
    orderBy: { CreatedAt: "desc" },
  });
  return convertToPlainObject(data);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug: slug } });
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};
       // Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};
      // Rating filter
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};
  const data = await prisma.product.findMany({
    where:{
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { CreatedAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return { data, totalPages: Math.ceil(dataCount / limit) };
}
// Delete a product
export async function deleteProduct(item_id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { item_id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { item_id } });

    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, message: formatError(error) };
  }
}
// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { item_id: product.item_id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: { item_id: product.item_id },
      data: product,
    });

    revalidatePath("/admin/products");

    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// Get single product by it's ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { item_id: productId },
  });

  return convertToPlainObject(data);
}
// Get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}
// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { CreatedAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}
 