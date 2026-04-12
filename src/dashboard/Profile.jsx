import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Phone, Lock, MapPin, LogOut, Trash2,
  Plus, ChevronRight, Shield, Croissant, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuthStore from '@/store/authStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, updatePassword, addAddress, deleteAddress, isLoading } = useAuthStore();

  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileForm);
    if (result.success) {
      toast.success('Profile updated! ✨');
    } else {
      toast.error(result.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    const result = await updatePassword(passwordForm);
    if (result.success) {
      toast.success('Password updated! 🔒');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } else {
      toast.error(result.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const result = await addAddress(addressForm);
    if (result.success) {
      toast.success('Address added! 📍');
      setAddressForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
      setShowAddressForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    const result = await deleteAddress(id);
    if (result.success) {
      toast.success('Address removed');
    } else {
      toast.error(result.message);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf9] via-[#f5ebe2]/30 to-[#fdfbf9]">
      {/* Header */}
      <div className="border-b border-[#f0e9e1] bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-[#6b615a] hover:text-[#2c2a29] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Croissant className="w-5 h-5 text-[#c79261]" />
              <span className="font-semibold text-[#2c2a29]">My Account</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* User header card */}
        <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="py-6">
            <div className="flex items-center gap-5">
              <Avatar className="w-20 h-20 border-4 border-[#c79261]/20">
                <AvatarFallback className="bg-gradient-to-br from-[#c79261] to-[#b58150] text-white text-xl font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#2c2a29]">{user?.name}</h2>
                <p className="text-[#6b615a] flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#c79261]/10 text-[#c79261] text-xs font-medium rounded-full">
                    {user?.role === 'admin' ? '👑 Admin' : '🧁 Customer'}
                  </span>
                  <span className="text-xs text-[#6b615a]">
                    Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar tabs */}
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#c79261] text-white shadow-lg shadow-[#c79261]/25'
                    : 'text-[#6b615a] hover:bg-[#f5ebe2] hover:text-[#2c2a29]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? 'translate-x-0' : '-translate-x-1 opacity-0'}`} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#2c2a29]">Personal Information</CardTitle>
                  <CardDescription className="text-[#6b615a]">Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#2c2a29]">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                          className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#2c2a29]">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          value={user?.email}
                          disabled
                          className="pl-10 h-11 border-[#f0e9e1] bg-[#fafaf8] text-[#6b615a]"
                        />
                      </div>
                      <p className="text-xs text-[#6b615a]">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-[#2c2a29]">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-lg shadow-[#c79261]/25 cursor-pointer"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#2c2a29]">Change Password</CardTitle>
                  <CardDescription className="text-[#6b615a]">Ensure your account stays secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-[#2c2a29]">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                          required
                          className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-[#2c2a29]">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                          required
                          minLength={8}
                          placeholder="Min. 8 characters"
                          className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-[#2c2a29]">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b615a]" />
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          value={passwordForm.confirmNewPassword}
                          onChange={(e) => setPasswordForm((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                          required
                          className="pl-10 h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#c79261] hover:bg-[#b58150] text-white shadow-lg shadow-[#c79261]/25 cursor-pointer"
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#2c2a29]">Saved Addresses</CardTitle>
                      <CardDescription className="text-[#6b615a]">Manage your delivery addresses</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="bg-[#c79261] hover:bg-[#b58150] text-white cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Address
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* Existing addresses */}
                    {user?.addresses?.length > 0 ? (
                      <div className="space-y-3">
                        {user.addresses.map((addr) => (
                          <div
                            key={addr._id}
                            className="flex items-start justify-between p-4 rounded-xl border border-[#f0e9e1] hover:border-[#c79261]/30 transition-colors bg-white"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#c79261]/10 flex items-center justify-center mt-0.5">
                                <MapPin className="w-5 h-5 text-[#c79261]" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-[#2c2a29]">{addr.label}</span>
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-medium bg-[#c79261]/10 text-[#c79261] px-2 py-0.5 rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-[#6b615a] mt-0.5">
                                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                                </p>
                                <p className="text-sm text-[#6b615a]">
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(addr._id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-[#f0e9e1] mx-auto mb-3" />
                        <p className="text-[#6b615a] text-sm">No addresses saved yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add address form */}
                {showAddressForm && (
                  <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg text-[#2c2a29]">New Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddAddress} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#2c2a29]">Label</Label>
                            <Input
                              value={addressForm.label}
                              onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))}
                              placeholder="Home / Office"
                              className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#2c2a29]">Pincode</Label>
                            <Input
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm((p) => ({ ...p, pincode: e.target.value }))}
                              required
                              placeholder="682001"
                              className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-[#2c2a29]">Address Line 1</Label>
                          <Input
                            value={addressForm.line1}
                            onChange={(e) => setAddressForm((p) => ({ ...p, line1: e.target.value }))}
                            required
                            placeholder="House no., Building, Street"
                            className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-[#2c2a29]">Address Line 2 <span className="text-xs text-[#6b615a] font-normal">(optional)</span></Label>
                          <Input
                            value={addressForm.line2}
                            onChange={(e) => setAddressForm((p) => ({ ...p, line2: e.target.value }))}
                            placeholder="Landmark, Area"
                            className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#2c2a29]">City</Label>
                            <Input
                              value={addressForm.city}
                              onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                              required
                              placeholder="Kochi"
                              className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#2c2a29]">State</Label>
                            <Input
                              value={addressForm.state}
                              onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                              required
                              placeholder="Kerala"
                              className="h-11 border-[#f0e9e1] focus:border-[#c79261] bg-white"
                            />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-[#2c2a29] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
                            className="rounded border-[#f0e9e1] text-[#c79261] focus:ring-[#c79261]"
                          />
                          Set as default address
                        </label>

                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            className="bg-[#c79261] hover:bg-[#b58150] text-white cursor-pointer"
                          >
                            Save Address
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAddressForm(false)}
                            className="border-[#f0e9e1] cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
