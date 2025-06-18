import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
export const metadata: Metadata = {
  title: "Create Merchandise",
};

const CreateProductPage = () => {
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