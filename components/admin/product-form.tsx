"use client";

import { useToast } from "@/hooks/use-toast";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import slugify from "slugify";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { useSession } from "next-auth/react";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update" | "Home" | "Designer"| "Seller";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  // Set default values based on type
  const getDefaultValues = () => {
    if (product && type === "Update") return product;

    if (type === "Home") {
      return {
        ...productDefaultValues,
        name: `${""}`,
        category: "Design Your Home",
        stock: 1,
        price: "0", // Or set a base price for home design
        description: "Custom home design project",
      };
    }
    if (type === "Designer") {
    return {
      ...productDefaultValues,
      name: `${session?.user?.name || "Designer"}'s Portfolio`,
      category: "Designer Portfolio",
      stock: 1,
      price: "0",
      brand: session?.user?.name || "Designer",
      description: `Interior design portfolio by ${session?.user?.name || "Designer"}`,
      isFeatured: false, // Makes the designer's portfolio featured by default
    };
  }
  if (type === "Seller") {
    return {
      ...productDefaultValues,
      name: `${ ""}`,
      category: "",
      stock: 1,
      price: "0",
      brand:  "",
      description: `${""}`,
      isFeatured: false, // Makes the seller's merchandise featured by default
    };
  }

  return productDefaultValues;
};

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === "Update"
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues: product && type === "Update" ? product : getDefaultValues(),
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
  values
) => {
  // On Create
  if (type === "Create" || type === "Home" || type === "Designer" || type === "Seller") {
    const res = await createProduct(values);
    console.log(`create ${type.toLowerCase()}`);
    
    if (!res.success) {
      console.log("failed");
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      // Route based on type
      if (type === "Home") {
        router.push("/search?category=Design%20Your%20Home");
      } else if (type === "Designer") {
        router.push("/search?category=Designer%20Portfolio");
      } else if (type === "Seller") {
        router.push("/");
      } else {
        router.push("/admin/products");
      }
    }
  }

    // On Update 
    if (type === "Update") {
      console.log("udpate");

      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, item_id: productId });

      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push("/admin/products");
      }
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");
  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Name and Slug */}
        
          <div className="flex flex-col md:flex-row gap-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder= {type === "Home" ? "Enter home name" :type === "Designer" ?  "Enter design name" : "Enter product name" }
                     {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative space-y-2">
                      <Input placeholder="Enter slug" {...field} />
                      <Button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1"
                        onClick={() => {
                          form.setValue(
                            "slug",
                            slugify(form.getValues("name"), { lower: true })
                          );
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
         
        {/* Category & Brand */}
        <div className="flex flex-col md:flex-row gap-5">
        <FormField
    control={form.control}
    name="category"
    render={({ field }) => (
      <FormItem className="w-full">
        <FormLabel>
          {type === "Home" ? "Category" : 
           type === "Designer" ? "Category" : 
           "Category"}
        </FormLabel>
        <FormControl>
          <Input
            placeholder="Enter category"
            {...field}
            value={
              type === "Home" ? "Design Your Home" : 
              type === "Designer" ? "Designer Portfolio" : 
              field.value
            }
            readOnly={type === "Home" || type === "Designer"}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

          {type !== "Home" && type !== "Designer" && (
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Price */}
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {type === "Home" ? "Budget" : ""}
                  {type === "Designer" ? "Budget" : ""}
                  {type === "Update" ? "Price" : ""}
                  {type === "Seller" ? "Price" : ""}
                  {type === "Create" ? "Price" : ""}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter ${type === "Home" ? "base " : ""}price`}
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Stock */}
        {type !== "Home" && type !== "Designer" && (
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter stock" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Images Upload */}
        <div className="upload-field flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>
                  {type === "Home" ? "Design Images" : "Product Images"}
                </FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt={
                            type === "Home" ? "design image" : "product image"
                          }
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) =>
                            form.setValue("images", [...images, res[0].url])
                          }
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Featured Product & Banner */}
        {type !== "Home" && type !== "Designer" && type !== "Seller" && (
          <div className="upload-field">
            <Card>
              <CardContent className="space-y-2 mt-2">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="space-x-2 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Is Featured?</FormLabel>
                    </FormItem>
                  )}
                />
                {isFeatured && banner && (
                  <Image
                    src={banner}
                    alt="banner image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                )}
                {isFeatured && !banner && (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) =>
                      form.setValue("banner", res[0].url)
                    }
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        description: `ERROR! ${error.message}`,
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {type === "Home"
                  ? "Project Description"
                  : ""}
                  {type === "Create"
                  ? "Product Description"
                  : ""}
                  {type === "Designer" ? "Design Description" : ""}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    type === "Home"
                      ? "Describe your home design project"
                      : "Enter product description"
                  }
                  className="resize-none"
                  {...field}
                  rows={type === "Home" ? 6 : 4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting
              ? "Submitting"
              : type === "Home"
                ? "Save Home Design"
                : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
