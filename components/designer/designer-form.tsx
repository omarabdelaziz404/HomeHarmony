'use client'

import { useSession } from "next-auth/react";
import ProductForm from "@/components/admin/product-form";

const CreateProductPage = () => {
  const { data: session } = useSession();

  if (session?.user?.role !== "designer") {
    return null;
  }

  return (
    <>
      <h2 className="h2-bold"></h2>
      <div className="my-8">
        <ProductForm type="Designer" />
      </div>
    </>
    
  


);
};

export default CreateProductPage;