'use client'

import { useSession } from "next-auth/react";
import ProductForm from "@/components/admin/product-form";

const CreateProductPage = () => {
  const { data: session } = useSession();

  if (session?.user?.role !== "seller") {
    return null;
  }

  return (
    <>
      <h2 className="h2-bold">Publish Your Merchandise</h2>
      <div className="my-8">
        <ProductForm type="Seller" />
      </div>
    </>
  );
};

  


export default CreateProductPage;