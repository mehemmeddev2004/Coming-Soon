import { getProductById } from "@/utils/fetchProducts";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ui/product/ProductGallery";
import AddToCartButton from "@/components/ui/button/AddToCartButton";

type Props = {
  params: { id: string };
};

const ProductPage = async ({ params }: Props) => {
  const { id } = params;
  const product = await getProductById(id);
  if (!product) return notFound();

  const fallbackImages = [
    { id: "1", url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_1.jpg" },
    { id: "2", url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_7.jpg" },
    { id: "3", url: "https://media.endclothing.com/media/f_auto,q_auto:eco,w_1600/prodmedia/media/catalog/product/0/9/09-09-2025-ns_jv6464_8.jpg" },
  ];

  const sizes = [
    { id: 1, label: "X-Small" },
    { id: 2, label: "Small" },
    { id: 3, label: "Medium" },
    { id: 4, label: "Large" },
    { id: 5, label: "X-Large" },
    { id: 6, label: "XX-Large" },
  ];

  const galleryImages = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images.map((url: string, idx: number) => ({ id: String(idx + 1), url }))
    : fallbackImages;

  return (
    <div className="max-w-[1280px] mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Product Gallery */}
        <div className="w-full lg:w-[639px]">
          <ProductGallery images={galleryImages} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-[740px] flex flex-col gap-1 items-center text-center">
          {/* Product Name */}
          <h2 className="text-[20px] md:text-[1.7rem] font-proxima font-semibold uppercase tracking-wide leading-[28px]">
            {product.name}
          </h2>

          {/* Product Specs */}
          {product.specs && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {product.specs.map((spec: any) =>
                spec.values.map((v: any) => (
                  <span
                    key={v.id}
                    className="px-2 py-1 text-sm text-gray-500 font-sans  text-center"
                  >
                    {v.value}
                  </span>
                ))
              )}
            </div>
          )}

          {/* Price */}
          <p className="text-[14px]  font-proxima font-semibold uppercase mt-3">
            {product.price} AZN
          </p>

          {/* Size Guide */}
          <div className="flex justify-between w-full pl-[20px] pr-[20px] items-center mt-4 gap-2">
            <h2 className="text-[0.857rem] font-proxima tracking-[0.017rem] leading-[20px] font-normal text-[#1a1a1a]">
              Select a size
            </h2>
            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-500 transition-colors">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.8457 2.70759C5.99907 2.34855 6.03946 1.95253 5.96106 1.57031C5.88267 1.18819 5.68962 0.839373 5.40881 0.567076C5.12817 0.29494 4.77245 0.111267 4.38741 0.0369984C4.00243 -0.0372577 3.60324 0.000726519 3.23969 0.146749C2.87603 0.292819 2.56273 0.541174 2.34115 0.862743C2.11944 1.18451 2.00008 1.56449 2.00008 1.95455L3.00008 1.95455C3.00008 1.76924 3.05667 1.58677 3.16459 1.43014C3.27266 1.27332 3.4279 1.14881 3.61241 1.07469C3.79704 1.00053 4.00105 0.980908 4.19802 1.0189C4.39492 1.05688 4.57375 1.15027 4.71266 1.28498C4.85142 1.41952 4.94408 1.58905 4.98145 1.77125C5.0188 1.95333 4.99978 2.14224 4.92609 2.31477C4.85231 2.48748 4.72629 2.6376 4.56155 2.74434C4.33845 2.88889 4.08355 3.08031 3.88055 3.32239C3.70469 3.53211 3.55054 3.80127 3.51029 4.12468L3.44538 4.16795L0.445377 6.16795C0.07872 6.41239 -0.0847126 6.86803 0.0429858 7.28978C0.170684 7.71154 0.55941 8 1.00008 8H4.00008H7.00008C7.44074 8 7.82947 7.71154 7.95717 7.28978C8.08487 6.86802 7.92143 6.41239 7.55478 6.16795L4.55478 4.16795L4.52912 4.15084C4.55183 4.095 4.58936 4.03344 4.6468 3.96493C4.75843 3.83182 4.9202 3.70351 5.10532 3.58357C5.43392 3.37066 5.69242 3.06644 5.8457 2.70759ZM4.00008 5L2.50008 6L1.00008 7H2.80285H4.00008H5.1973H7.00008L5.50008 6L4.00008 5Z" fill="#1A1A1A"/>
              </svg>
              Size guide
            </button>
          </div>

          {/* Sizes Grid */}
          <div className="grid grid-cols-4  mb-[30px] max-w-[530px] w-full mx-auto mt-2">
            {sizes.map((item) => (
              <div
                key={item.id}
                className={"flex items-center justify-center h-[43px] px-4 border rounded font-medium text-center text-gray-500 border-gray-300"}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-[10px]">
            <div>
              <AddToCartButton
                id={String(product.id)}
                name={product.name}
                price={product.price}
                imageUrl={(product as any).img || ((product as any).images?.[0] as string) || undefined}
                className="w-[300px] h-[44px] bg-black hover:bg-gray-900 cursor-pointer text-white flex items-center justify-center"
              >
                Add To Cart
              </AddToCartButton>
            </div>
            <div>

            </div>
          </div>
        </div>
        
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default ProductPage;
