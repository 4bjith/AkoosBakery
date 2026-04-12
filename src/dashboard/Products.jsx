import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Check, RefreshCw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCartStore from '@/store/cartStore';
import { toast } from 'sonner';
import { productAPI } from '@/api/productApi';
import { categoryAPI } from '@/api/categoryApi';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const { addToCart, items } = useCartStore();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, catRes] = await Promise.all([
          productAPI.getAll({ limit: 100 }),
          categoryAPI.getAll()
        ]);
        
        // Map products adding backward compatibility mapping for _id to id for the cart
        const fetchedProducts = progRes.data.data.products.map(p => ({
          ...p,
          id: p._id,
          image: p.images?.[0] || null,
        }));
        setProducts(fetchedProducts);
        setCategories(['All', ...catRes.data.data.categories.map(c => c.name)]);
      } catch (err) {
        toast.error('Failed to load marketplace data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || p.category?.name === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAdd = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29]">Wholesale Catalog</h1>
          <p className="text-sm text-[#6b615a]">Browse and order bakery supplies in bulk.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 w-full sm:w-64 border-[#f0e9e1] focus:border-[#c79261] bg-white rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              filter === cat
                ? 'bg-[#c79261] text-white border-[#c79261] shadow-md shadow-[#c79261]/20'
                : 'bg-white text-[#6b615a] border-[#f0e9e1] hover:border-[#c79261]/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <RefreshCw className="w-10 h-10 animate-spin text-[#c79261] mb-4" />
            <h3 className="text-lg font-medium text-[#2c2a29]">Loading B2B Catalog...</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const inCart = items.some((i) => i.product.id === product.id);

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl p-4 border border-[#f0e9e1] hover:border-[#c79261]/30 hover:shadow-xl hover:shadow-[#c79261]/10 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#f5ebe2]">
                {product.image ? (
                   <img
                     src={product.image}
                     alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                   />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#6b615a]">
                     <Package className="w-8 h-8 opacity-20" />
                   </div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#c79261] uppercase tracking-wider shadow-sm">
                  {product.category?.name || 'Uncategorized'}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-[#2c2a29] leading-tight mb-1">{product.name}</h3>
                <p className="text-[10px] uppercase text-[#6b615a] line-clamp-2 mb-2">{product.description}</p>
                <p className="text-xs text-[#6b615a] mb-4">Packaged in: <span className="font-medium text-[#c79261] bg-[#c79261]/10 px-1.5 py-0.5 rounded">{product.unit}</span></p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#f0e9e1]">
                <div>
                  <span className="text-lg font-bold text-[#2c2a29]">₹{product.price.toLocaleString()}</span>
                  <span className="text-[10px] text-[#6b615a] ml-1">/ {product.unit.split(' ')[0]}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAdd(product)}
                  variant={inCart ? "secondary" : "default"}
                  className={`rounded-lg cursor-pointer ${
                    inCart 
                      ? 'bg-[#f5ebe2] text-[#c79261] hover:bg-[#c79261]/20' 
                      : 'bg-[#c79261] text-white hover:bg-[#b58150] shadow-md shadow-[#c79261]/20'
                  }`}
                >
                  {inCart ? <Check className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                  {inCart ? 'Add More' : 'Add to Order'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      )}
      
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#f0e9e1] shadow-sm">
          <Filter className="w-12 h-12 text-[#f0e9e1] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#2c2a29]">No products found</h3>
          <p className="text-[#6b615a] text-sm mt-1">Check back later or try adjusting filters.</p>
        </div>
      )}
    </div>
  );
}
