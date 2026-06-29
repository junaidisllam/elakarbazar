import { Product } from "@/data/products";

interface ProductSpecificationsProps {
  product: Product;
}

export default function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specs = product.specifications || {};

  if (Object.keys(specs).length === 0) {
    return (
      <div className="w-full bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-2xl sm:border p-6 text-center text-zinc-500 font-bold">
        কোন বিবরণী বা স্পেসিফিকেশন পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-none border-x-0 border-y border-zinc-200 sm:rounded-2xl sm:border overflow-hidden shadow-none sm:shadow-sm">
      <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200">
        <h3 className="font-bold text-zinc-800 text-base">পণ্য বিবরণী ও স্পেসিফিকেশন</h3>
      </div>
      <div className="divide-y divide-zinc-100">
        {Object.entries(specs).map(([key, value]) => {
          const formattedKey = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          return (
            <div key={key} className="grid grid-cols-3 px-6 py-3.5 text-sm">
              <span className="font-bold text-zinc-500 col-span-1">{formattedKey}</span>
              <span className="font-medium text-zinc-800 col-span-2">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
