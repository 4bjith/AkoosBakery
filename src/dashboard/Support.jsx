import { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/authStore';

export default function Support() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'admin',
      text: 'Hello! I am the Super Admin for Akoos Bakery. How can I help you with your B2B account today?',
      time: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      time: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    // Simulate admin reply
    setTimeout(() => {
      const adminReply = {
        id: Date.now() + 1,
        sender: 'admin',
        text: 'Thank you for your message. An operations manager will review this and respond shortly.',
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, adminReply]);
    }, 1000);
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px] max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c2a29]">Admin Support</h1>
        <p className="text-sm text-[#6b615a]">Direct communication line with Akoos B2B administrators.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-[#f0e9e1] flex flex-col overflow-hidden">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-[#f0e9e1] bg-[#fdfbf9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#c79261]/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#c79261]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#2c2a29]">Akoos Super Admin</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 mt-0.5"></span>
                <p className="text-xs text-[#6b615a]">Online & ready to help</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#faf9f6]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            
            return (
              <div
                key={msg.id}
                className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#c79261] flex items-center justify-center flex-shrink-0 mt-auto mb-1">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div
                    className={`px-5 py-3 rounded-2xl ${
                      isUser
                        ? 'bg-[#2c2a29] text-white rounded-br-sm'
                        : 'bg-white border border-[#f0e9e1] text-[#2c2a29] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#6b615a] mt-1.5 px-1 font-medium">
                    {formatTime(msg.time)}
                  </span>
                </div>
                
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#f0e9e1] flex items-center justify-center flex-shrink-0 mt-auto mb-1">
                    <UserIcon className="w-4 h-4 text-[#6b615a]" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input */}
        <div className="p-4 bg-white border-t border-[#f0e9e1]">
          <form onSubmit={handleSend} className="flex gap-2 relative items-center">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 pr-16 h-12 bg-[#fdfbf9] border-[#f0e9e1] focus:border-[#c79261] focus:ring-[#c79261]/20 rounded-xl"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-1.5 h-9 w-9 p-0 bg-[#c79261] hover:bg-[#b58150] text-white rounded-lg shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
             <span className="text-[10px] text-[#6b615a]">Responses from the administration team typically take 1-2 hours during business operations.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
