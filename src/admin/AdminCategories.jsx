import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, Layers, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import { categoryAPI } from '@/api/categoryApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.data.categories);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setForm({ name: '', description: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setEditId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await categoryAPI.create(form);
        toast.success('Category created successfully');
      } else {
        await categoryAPI.update(editId, form);
        toast.success('Category updated successfully');
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? Products referencing this category may fail to load properly.`)) {
      try {
        await categoryAPI.delete(id);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Failed to delete category');
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
              <FolderTree className="w-6 h-6 text-[#c79261]" />
            </div>
            Category Management
          </h1>
          <p className="text-sm text-[#6b615a] mt-1 ml-11">Organize and structure the product catalog.</p>
        </div>
        <div>
          <Button onClick={openAddModal} className="bg-[#c79261] hover:bg-[#b58150] rounded-xl text-white cursor-pointer h-10 shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#f0e9e1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#fdfbf9] border-b border-[#f0e9e1] text-[#6b615a] uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[#6b615a]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#c79261]" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[#6b615a]">
                    No categories found. Start by adding one.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id} className="hover:bg-[#fdfbf9] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2c2a29] uppercase tracking-wider">{c.name}</td>
                    <td className="px-6 py-4 text-[#6b615a] truncate max-w-xs">{c.description || 'No description provided'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                        c.isActive ? 'bg-[#dcfce7] text-[#059669]' : 'bg-[#f0e9e1] text-[#6b615a]'
                      }`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button onClick={() => openEditModal(c)} variant="outline" size="icon" className="h-8 w-8 text-[#c79261] border-[#f0e9e1] hover:bg-[#f5ebe2] cursor-pointer">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(c._id, c.name)} variant="outline" size="icon" className="h-8 w-8 text-red-500 border-[#f0e9e1] hover:bg-red-50 cursor-pointer">
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

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c2a29]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#f0e9e1] flex items-center justify-between bg-[#fdfbf9]">
              <h2 className="text-xl font-bold text-[#2c2a29]">
                {modalMode === 'add' ? 'Create Category' : 'Edit Category'}
              </h2>
              <button onClick={closeModal} className="text-[#6b615a] hover:text-[#2c2a29] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 border-none p-0">
                  <label className="text-sm font-semibold text-[#6b615a]">Category Name</label>
                  <Input 
                    name="name" 
                    required 
                    value={form.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Biscuits, Cakes"
                    className="border-[#f0e9e1] focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]" 
                  />
                </div>
                
                <div className="space-y-1.5 border-none p-0">
                  <label className="text-sm font-semibold text-[#6b615a]">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="flex w-full rounded-md border border-[#f0e9e1] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#c79261] focus:ring-1 focus:ring-[#c79261]"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={form.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#c79261] rounded border-[#f0e9e1] focus:ring-[#c79261]"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-[#2c2a29]">
                    Category is active and visible
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-[#f0e9e1] flex items-center justify-end gap-3 bg-[#fdfbf9]">
              <Button type="button" variant="outline" onClick={closeModal} className="border-[#f0e9e1] text-[#6b615a] cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" form="categoryForm" disabled={submitting} className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-md cursor-pointer">
                {submitting ? 'Saving...' : 'Save Category'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
