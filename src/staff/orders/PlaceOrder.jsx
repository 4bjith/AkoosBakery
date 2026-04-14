import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Search, User, MapPin, FileText, DollarSign } from 'lucide-react';
import { staffAPI } from '@/api/staffApi';
import api from '@/api/axios';
import { toast } from 'sonner';

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    addresses: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersRes, productsRes] = await Promise.all([
        staffAPI.getCustomers(),
        // Fetch real products from the API
        api.get('/products')
      ]);
      setCustomers(customersRes.data.data.customers);
      // Use real products from API
      const productsData = productsRes.data.data?.products || productsRes.data.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await staffAPI.createCustomer(newCustomer);
      const createdCustomer = response.data.data.customer;
      toast.success('Customer created successfully! 👤');
      setCustomers([...customers, createdCustomer]);
      setSelectedCustomer(createdCustomer);
      setShowNewCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '', addresses: [] });
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.product._id === product._id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { product, quantity: 1, price: product.price }]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter(item => item.product._id !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    try {
      const orderData = {
        customerId: selectedCustomer._id,
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
        deliveryAddress: selectedAddress || selectedCustomer.addresses[0],
        staffNotes: orderNotes,
      };

      await staffAPI.placeOrderOnBehalf(selectedCustomer._id, orderData);
      toast.success('Order placed successfully! 📦');
      navigate('/staff/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c79261]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29]">Place Order</h1>
          <p className="text-[#6b615a] mt-1">Create a new order on behalf of a customer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Selection & Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2c2a29] flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Customer
              </h2>
              <button
                onClick={() => setShowNewCustomerModal(true)}
                className="text-sm text-[#c79261] hover:text-[#c79261]/80 font-medium"
              >
                + New Customer
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
              />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer._id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedCustomer?._id === customer._id
                      ? 'border-[#c79261] bg-[#c79261]/10'
                      : 'border-[#f0e9e1] hover:bg-[#fdfbf9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#2c2a29]">{customer.name}</p>
                      <p className="text-sm text-[#6b615a]">{customer.email}</p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-[#c79261]">
                      {selectedCustomer?._id === customer._id && (
                        <div className="w-full h-full rounded-full bg-[#c79261]"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <h2 className="text-lg font-semibold text-[#2c2a29] mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Select Products
            </h2>

            <div className="relative mb-4">
              <Search className="w-5 h-5 text-[#6b615a] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border border-[#f0e9e1] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[#2c2a29]">{product.name}</h3>
                      <p className="text-sm text-[#6b615a]">{product.category.name}</p>
                    </div>
                    <span className="font-bold text-[#c79261]">Rs. {product.price}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#c79261]/10 text-[#c79261] rounded-lg hover:bg-[#c79261]/20 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Cart & Order Details */}
        <div className="space-y-6">
          {/* Cart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <h2 className="text-lg font-semibold text-[#2c2a29] mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Cart
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-[#6b615a] text-center py-8">No items in cart</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between p-3 bg-[#fdfbf9] rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-[#2c2a29]">{item.product.name}</p>
                      <p className="text-sm text-[#6b615a]">Rs. {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 hover:bg-[#f0e9e1] rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 hover:bg-[#f0e9e1] rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#2c2a29]">Total:</span>
                    <span className="font-bold text-[#c79261] text-lg">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f0e9e1]">
            <h2 className="text-lg font-semibold text-[#2c2a29] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Order Details
            </h2>

            {selectedCustomer ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#6b615a]">Customer</p>
                  <p className="font-medium text-[#2c2a29]">{selectedCustomer.name}</p>
                  <p className="text-sm text-[#6b615a]">{selectedCustomer.email}</p>
                </div>

                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                  <div>
                    <p className="text-sm text-[#6b615a] mb-2">Delivery Address</p>
                    <select
                      value={selectedAddress?._id || ''}
                      onChange={(e) => {
                        const address = selectedCustomer.addresses.find(addr => addr._id === e.target.value);
                        setSelectedAddress(address);
                      }}
                      className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    >
                      <option value="">Select address</option>
                      {selectedCustomer.addresses.map((address) => (
                        <option key={address._id} value={address._id}>
                          {address.label}: {address.line1}, {address.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <p className="text-sm text-[#6b615a] mb-2">Order Notes (Optional)</p>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions..."
                    className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            ) : (
              <p className="text-[#6b615a] text-center py-8">Please select a customer first</p>
            )}
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2c2a29] mb-4">Create New Customer</h2>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2c2a29] mb-1">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#f0e9e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c79261]"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-4 py-2 border border-[#f0e9e1] rounded-lg hover:bg-[#f5ebe2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c79261] text-white rounded-lg hover:bg-[#c79261]/90 transition-colors"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
