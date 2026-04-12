import { useState } from 'react';
import { Search, Filter, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCartStore from '@/store/cartStore';
import { toast } from 'sonner';

// Dummy B2B Product Catalog
const CATALOG = [
  { id: '1', name: 'Premium Butter Puff Pastry Sheet', category: 'Raw Materials', price: 1200, unit: '5kg Box', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Signature Chocolate Truffle Mix', category: 'Raw Materials', price: 2500, unit: '10kg Bag', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Bulk Wholesale Croissants (Unbaked)', category: 'Frozen Pastry', price: 800, unit: '50 Pcs', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Kerala Banana Chips - Bulk', category: 'Snacks', price: 1500, unit: '10kg Sack', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd08f?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: 'Classic Vanilla Sponge Cake Base', category: 'Baked Bases', price: 450, unit: '5 Pcs', image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&q=80&w=400' },
  { id: '6', name: 'Artisan Sourdough Loaf (Par-baked)', category: 'Bread', price: 600, unit: '10 Pcs', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=400' },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const { addToCart, items } = useCartStore();

  const categories = ['All', ...new Set(CATALOG.map((p) => p.category))];

  const filteredProducts = CATALOG.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || p.category === filter;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const inCart = items.some((i) => i.product.id === product.id);

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl p-4 border border-[#f0e9e1] hover:border-[#c79261]/30 hover:shadow-xl hover:shadow-[#c79261]/10 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-[#f5ebe2]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-[#c79261] uppercase tracking-wider">
                  {product.category}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-[#2c2a29] leading-tight mb-1">{product.name}</h3>
                <p className="text-xs text-[#6b615a] mb-4">Packaged in: <span className="font-medium text-[#2c2a29]">{product.unit}</span></p>
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
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <Filter className="w-12 h-12 text-[#f0e9e1] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#2c2a29]">No products found</h3>
          <p className="text-[#6b615a] text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
