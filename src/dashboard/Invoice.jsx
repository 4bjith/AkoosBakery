import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '@/api/orderApi';
import { ArrowLeft, Printer, Download, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

export default function Invoice() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOne(id);
        setOrder(data.data.order);
      } catch (error) {
        console.error('Failed to fetch invoice data');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#c79261] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#6b615a]">Generating your document...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[#2c2a29]">Invoice Not Found</h2>
        <p className="text-[#6b615a] mt-2">The requested document could not be located.</p>
        <Link to="/dashboard/orders" className="text-[#c79261] mt-4 inline-block hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Utilities Header (Hidden during printing) */}
      <div className="print:hidden flex justify-between items-center mb-6">
        <Link to="/dashboard/orders" className="flex items-center text-[#6b615a] hover:text-[#c79261] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
        <div className="space-x-3 flex">
          <Button onClick={handlePrint} variant="outline" className="border-[#f0e9e1] text-[#2c2a29] hover:bg-[#f5ebe2] cursor-pointer">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handlePrint} className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-md cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Actual Printable Document */}
      <div className="bg-white p-10 md:p-16 rounded-sm shadow-xl shadow-black/5 border border-[#f0e9e1] print:shadow-none print:border-none print:p-0" id="invoice-doc">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-[#f0e9e1] pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2c2a29] tracking-tight">INVOICE</h1>
            <p className="text-[#6b615a] mt-2 font-medium">#{order._id}</p>
          </div>
          <div className="text-right">
            <div className="w-12 h-12 bg-[#c79261]/20 rounded-xl flex items-center justify-center ml-auto mb-2">
               <span className="text-xl font-black text-[#c79261]">AB</span>
            </div>
            <h2 className="font-bold text-[#2c2a29] text-xl">Akoos Bakery B2B</h2>
            <p className="text-[#6b615a] text-sm mt-1">123 Artisan Street, Baker's District</p>
            <p className="text-[#6b615a] text-sm">support@akoosbakery.com</p>
          </div>
        </div>

        {/* Bill To & Info */}
        <div className="flex justify-between gap-8 mb-10 text-sm">
          <div className="space-y-1">
            <p className="text-[#6b615a] font-semibold uppercase tracking-wider mb-2">Billed To:</p>
            <p className="font-bold text-[#2c2a29] text-lg">{order.user?.companyName || user?.companyName}</p>
            <p className="font-medium text-[#2c2a29]">{order.user?.name || user?.name}</p>
            <p className="text-[#6b615a]">{order.user?.email || user?.email}</p>
            <p className="text-[#6b615a]">{order.user?.phone || user?.phone}</p>
          </div>
          
          <div className="bg-[#fdfbf9] p-4 rounded-lg border border-[#f0e9e1] flex flex-col justify-between min-w-[200px]">
             <div>
                <p className="text-[#6b615a] font-semibold uppercase tracking-wider text-xs">Date of Issue</p>
                <p className="font-bold text-[#2c2a29] mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
             </div>
             <div className="mt-4">
                <p className="text-[#6b615a] font-semibold uppercase tracking-wider text-xs">Payment Terms</p>
                <p className="font-bold text-[#2c2a29] mt-1">{order.paymentMethod}</p>
             </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mb-10">
          <table className="w-full text-left">
            <thead className="bg-[#c79261] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-lg">Description</th>
                <th className="px-4 py-3 font-semibold text-center">Qty</th>
                <th className="px-4 py-3 font-semibold text-right">Unit Price</th>
                <th className="px-4 py-3 font-semibold text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e9e1]">
              {order.items.map((item, index) => (
                <tr key={index} className="text-[#2c2a29] text-sm">
                  <td className="px-4 py-4 font-medium">{item.product?.name || 'Deleted Product'}</td>
                  <td className="px-4 py-4 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-right">₹{item.price.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-semibold">₹{(item.quantity * item.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-16">
          <div className="w-72 space-y-3">
             <div className="flex justify-between text-[#6b615a] text-sm px-4">
               <span>Subtotal</span>
               <span className="font-medium text-[#2c2a29]">₹{(order.totalAmount - order.taxAmount).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-[#6b615a] text-sm px-4">
               <span>Tax (GST 18%)</span>
               <span className="font-medium text-[#2c2a29]">₹{order.taxAmount.toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-[#6b615a] text-sm px-4">
               <span>Shipping</span>
               <span className="font-medium text-green-600">Free</span>
             </div>
             <div className="flex justify-between items-center bg-[#fdfbf9] p-4 rounded-lg border border-[#c79261] mt-4">
               <span className="font-bold text-[#c79261]">Grand Total</span>
               <span className="text-xl font-black text-[#2c2a29]">₹{order.totalAmount.toLocaleString()}</span>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#f0e9e1] pt-8 flex justify-between items-end">
          <div>
            <h4 className="font-bold text-[#2c2a29] mb-1">Thank you for your business!</h4>
            <p className="text-xs text-[#6b615a] max-w-sm">If you have any questions concerning this invoice, please contact our wholesale department at B2B@akoosbakery.com.</p>
          </div>
          <div className="text-right">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#dcfce7] text-[#059669] rounded-2xl text-xs font-bold uppercase tracking-wider">
               <CheckCircle className="w-3.5 h-3.5" />
               Official Document
             </span>
          </div>
        </div>

      </div>

      {/* Global CSS override for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-doc, #invoice-doc * {
            visibility: visible;
          }
          #invoice-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />

    </div>
  );
}
