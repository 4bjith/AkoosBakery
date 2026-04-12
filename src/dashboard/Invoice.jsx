import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Croissant } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

export default function Invoice() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('akoos-mock-orders') || '[]');
    const found = saved.find((o) => o.id === id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return <div className="p-8 text-center text-[#6b615a]">Invoice not found.</div>;
  }

  const subtotal = order.total;
  const tax = Math.floor(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to="/dashboard/orders" className="flex items-center text-[#6b615a] hover:text-[#c79261] text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => window.print()} className="flex-1 sm:flex-none border-[#f0e9e1] text-[#2c2a29] cursor-pointer">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button className="flex-1 sm:flex-none bg-[#c79261] hover:bg-[#b58150] text-white shadow-md shadow-[#c79261]/20 cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#f0e9e1] p-8 sm:p-12 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 border-b border-[#f0e9e1] pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#c79261] rounded-xl flex items-center justify-center">
              <Croissant className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2c2a29] leading-tight">Akoos Bakery</h1>
              <p className="text-xs text-[#6b615a] uppercase tracking-wider font-semibold">Tax Invoice</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-2xl font-bold text-[#2c2a29] mb-1">INVOICE</div>
            <div className="text-sm text-[#6b615a]">#{order.id}</div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#6b615a] mb-2">Billed To:</h3>
            <div className="text-[#2c2a29]">
              <p className="font-bold mb-1">{user?.name || 'Guest User'}</p>
              <p className="text-sm text-[#6b615a]">{user?.email}</p>
              <p className="text-sm text-[#6b615a]">{user?.phone || 'No phone provided'}</p>
            </div>
          </div>
          <div className="md:text-right">
            <h3 className="text-[10px] uppercase tracking-wider font-bold text-[#6b615a] mb-2">Invoice Details:</h3>
            <div className="text-sm text-[#2c2a29] space-y-1">
              <p><span className="text-[#6b615a]">Date:</span> {new Date(order.date).toLocaleDateString('en-IN')}</p>
              <p><span className="text-[#6b615a]">Payment Status:</span> <span className="font-semibold text-[#059669]">Paid</span></p>
              <p><span className="text-[#6b615a]">Delivery Status:</span> {order.status}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-[#f0e9e1] bg-[#fdfbf9]">
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-[#6b615a]">Item Description</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-[#6b615a] text-right">Qty</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-[#6b615a] text-right">Rate</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wider font-bold text-[#6b615a] text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#2c2a29]">{item.product.name}</p>
                    <p className="text-xs text-[#6b615a] mt-0.5">Unit: {item.product.unit}</p>
                  </td>
                  <td className="py-4 px-4 text-right text-[#2c2a29]">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-[#2c2a29]">₹{item.product.price.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-semibold text-[#2c2a29]">
                    ₹{(item.quantity * item.product.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex flex-col items-end">
          <div className="w-full md:w-1/2 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b615a]">Subtotal</span>
              <span className="font-medium text-[#2c2a29]">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b615a]">Tax (GST 18%)</span>
              <span className="font-medium text-[#2c2a29]">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-[#f0e9e1] pb-3">
              <span className="text-[#6b615a]">Shipping</span>
              <span className="font-medium text-[#2c2a29]">₹0</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-[#2c2a29]">Total Amount</span>
              <span className="font-black text-xl text-[#c79261]">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#f0e9e1] text-center text-xs text-[#6b615a]">
          <p className="font-semibold text-[#2c2a29] mb-1">Thank you for your business.</p>
          <p>Akoos Bakery | 123 Baker Street, Sweet Valley | GSTIN: 32ABCDE1234F1Z5</p>
        </div>
      </div>
    </div>
  );
}
