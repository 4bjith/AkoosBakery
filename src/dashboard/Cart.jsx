import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCartStore from '@/store/cartStore';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    // In a real app, this would submit to the backend /orders endpoint
    // We'll simulate order placement and redirect to history
    toast.success('B2B Order placed successfully! 📦');
    
    // Simulate order ID generation and save to pseudo history
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...items],
      total: getCartTotal(),
      status: 'Processing',
    };
    
    // Saving to localstorage just to mock the Orders page visually later
    const existingOrders = JSON.parse(localStorage.getItem('akoos-mock-orders') || '[]');
    localStorage.setItem('akoos-mock-orders', JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
    navigate('/dashboard/orders');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-[#c79261]/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-[#c79261]" />
        </div>
        <h2 className="text-2xl font-bold text-[#2c2a29] mb-2">Your Draft Order is Empty</h2>
        <p className="text-[#6b615a] mb-8 max-w-sm mx-auto">
          Add bulk items and raw materials from our catalog to create your purchase order.
        </p>
        <Link to="/dashboard/products">
          <Button className="bg-[#c79261] hover:bg-[#b58150] shadow-xl shadow-[#c79261]/20 cursor-pointer h-12 px-8 rounded-xl font-medium">
            Browse Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[#2c2a29]">Review Current Order</h1>
        <p className="text-sm text-[#6b615a]">Review items, adjust quantities, and generate your purchase order.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] overflow-hidden">
            {items.map((item, index) => (
              <div 
                key={item.product.id} 
                className={`flex items-center gap-4 p-4 sm:p-6 ${index !== items.length - 1 ? 'border-b border-[#f0e9e1]' : ''}`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#f5ebe2] flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-[#2c2a29] truncate pr-4">{item.product.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#6b615a] hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#6b615a] mb-4">Unit: {item.product.unit}</p>
                  
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center bg-[#fdfbf9] border border-[#f0e9e1] rounded-lg">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-[#6b615a] hover:text-[#2c2a29] disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-[#2c2a29]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 text-[#6b615a] hover:text-[#2c2a29]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#2c2a29]">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                      <div className="text-[10px] text-[#6b615a]">₹{item.product.price}/ea</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[340px]">
          <div className="bg-white rounded-2xl shadow-md shadow-[#c79261]/5 border border-[#f0e9e1] p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[#2c2a29] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#c79261]" />
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-[#6b615a]">
                <span>Total Items</span>
                <span className="font-medium text-[#2c2a29]">{items.reduce((acc, curr) => acc + curr.quantity, 0)} Units</span>
              </div>
              <div className="flex justify-between text-[#6b615a]">
                <span>Subtotal</span>
                <span className="font-medium text-[#2c2a29]">₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6b615a]">
                <span>Tax (GST 18%)</span>
                <span className="font-medium text-[#2c2a29]">₹{Math.floor(getCartTotal() * 0.18).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6b615a]">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free B2B Delivery</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#f0e9e1] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#2c2a29]">Total Estimate</span>
                <span className="text-2xl font-bold text-[#c79261]">
                  ₹{Math.floor(getCartTotal() * 1.18).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 bg-[#2c2a29] hover:bg-[#1a1918] text-white rounded-xl shadow-lg shadow-black/10 transition-all font-semibold gap-2 cursor-pointer"
            >
              Confirm & Place Order
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <p className="text-center text-[10px] text-[#6b615a] mt-4">
              By confirming, you generate an official purchase order on behalf of your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
