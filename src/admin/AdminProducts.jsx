import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, RefreshCw, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { productAPI } from '@/api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Cakes',
    unit: '',
    stock: '',
    status: 'active',
    images: [],
  });
  const [editId, setEditId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ search: searchTerm, limit: 100 });
      setProducts(data.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setForm({ name: '', price: '', description: '', category: 'Cakes', unit: '', stock: '', status: 'active', images: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditId(product._id || product.id);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      unit: product.unit,
      stock: product.stock,
      status: product.status,
      images: product.images || [],
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error('Image must be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, images: [reader.result] }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (modalMode === 'add') {
        await productAPI.create(payload);
        toast.success('Product created successfully');
      } else {
        await productAPI.update(editId, payload);
        toast.success('Product updated successfully');
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#f0e9e1]">
        <div>
          <h1 className="text-2xl font-bold text-[#2c2a29] flex items-center gap-2 border-none">
            <div className="p-1.5 bg-[#c79261]/10 rounded-lg">
              <Layers className="w-6 h-6 text-[#c79261]" />
            </div>
            Product Management
          </h1>
          <p className="text-sm text-[#6b615a] mt-1 ml-11">Manage global product catalog and inventory.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search catalog..."
              className="pl-9 h-10 w-full sm:w-64 bg-[#fdfbf9] border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 rounded-xl"
            />
          </form>
          <Button onClick={openAddModal} className="bg-[#c79261] hover:bg-[#b58150] rounded-xl text-white cursor-pointer h-10 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1] text-[#6b615a] uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-[#6b615a]">
                    No products found. Start by adding a new product.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id || p.id} className="hover:bg-[#fdfbf9] transition-colors">
                    <td className="px-6 py-4">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded object-cover border border-[#f0e9e1]" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#f0e9e1] flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#6b615a]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#2c2a29] min-w-[200px]">
                      {p.name}
                      <div className="text-[10px] uppercase text-[#6b615a] mt-1 truncate max-w-[250px]">{p.description}</div>
                    </td>
                    <td className="px-6 py-4 text-[#6b615a]">{p.category}</td>
                    <td className="px-6 py-4 text-[#2c2a29] font-bold">₹{p.price}</td>
                    <td className="px-6 py-4 text-[#6b615a]">{p.unit}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                        p.status === 'active' ? 'bg-[#dcfce7] text-[#059669]' : 'bg-[#f0e9e1] text-[#6b615a]'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button onClick={() => openEditModal(p)} variant="outline" size="icon" className="h-8 w-8 text-[#c79261] border-[#f0e9e1] hover:bg-[#f5ebe2] cursor-pointer">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(p._id || p.id, p.name)} variant="outline" size="icon" className="h-8 w-8 text-red-500 border-[#f0e9e1] hover:bg-red-50 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal (Tailwind overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'add' ? 'Create New Product' : 'Edit Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                    <Input name="name" required value={form.name} onChange={handleInputChange} className="border-gray-300 focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" />
                  </div>
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Category</label>
                    <select
                      name="category"
                      required
                      value={form.category}
                      onChange={handleInputChange}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]"
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Raw Materials">Raw Materials</option>
                      <option value="Frozen Pastry">Frozen Pastry</option>
                      <option value="Baked Bases">Baked Bases</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Bread">Bread</option>
                      <option value="Biscuit">Biscuit</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                    <Input name="price" type="number" min="0" required value={form.price} onChange={handleInputChange} className="border-gray-300 focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" />
                  </div>
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Selling Unit (e.g., 5kg Box)</label>
                    <Input name="unit" required value={form.unit} onChange={handleInputChange} className="border-gray-300 focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" />
                  </div>
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Inventory Stock</label>
                    <Input name="stock" type="number" min="0" required value={form.stock} onChange={handleInputChange} className="border-gray-300 focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" />
                  </div>
                  <div className="space-y-1.5 border-none p-0">
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1.5 border-none p-0">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    name="description"
                    required
                    value={form.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]"
                  ></textarea>
                </div>

                <div className="space-y-1.5 border-none p-0">
                  <label className="text-sm font-semibold text-gray-700">Product Image (Local Upload)</label>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="border-gray-300 cursor-pointer p-1.5 focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" />
                  {form.images && form.images.length > 0 && form.images[0] && (
                    <div className="mt-3 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
              <Button type="button" variant="outline" onClick={closeModal} className="border-gray-300 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" form="productForm" disabled={submitting} className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-md cursor-pointer">
                {submitting ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
