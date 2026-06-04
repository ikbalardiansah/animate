import Image from 'next/image';

interface ProductProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    rating: number;
    sold: string;
    image: string;
    badge?: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
        {/* Badge (New/Best Seller) */}
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            {product.badge}
          </span>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 z-10 bg-white p-1.5 rounded-full shadow-sm text-pink-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>

        <Image 
          src={product.image} 
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="space-y-1">
        <p className="text-pink-500 text-xs font-bold uppercase tracking-wider">{product.category}</p>
        <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="text-yellow-400">★</span>
          <span>{product.rating} | {product.sold} terjual</span>
        </div>

        <p className="font-black text-lg pt-1">Rp {product.price.toLocaleString('id-ID')}</p>
      </div>

      <button className="w-full mt-4 border-2 border-gray-800 py-2 rounded-xl text-pink-500 font-bold text-sm hover:bg-gray-800 hover:text-white transition-colors uppercase">
        Tambah ke Keranjang
      </button>
    </div>
  );
}