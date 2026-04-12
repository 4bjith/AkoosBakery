import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userAPI } from '@/api/userApi';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // ─── Register ──────────────────────────────────────
      register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await userAPI.register(formData);
          localStorage.setItem('token', data.token);
          set({
            user: data.data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Login ─────────────────────────────────────────
      login: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await userAPI.login(formData);
          localStorage.setItem('token', data.token);
          set({
            user: data.data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Logout ────────────────────────────────────────
      logout: async () => {
        try {
          await userAPI.logout();
        } catch {
          // ignore — clear local state regardless
        }
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // ─── Fetch Profile ────────────────────────────────
      fetchProfile: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await userAPI.getMe();
          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalid / expired
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // ─── Update Profile ───────────────────────────────
      updateProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await userAPI.updateMe(formData);
          set({ user: data.data.user, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Update failed.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Update Password ─────────────────────────────
      updatePassword: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await userAPI.updatePassword(formData);
          localStorage.setItem('token', data.token);
          set({
            user: data.data.user,
            token: data.token,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Password update failed.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      // ─── Addresses ────────────────────────────────────
      addAddress: async (addressData) => {
        try {
          const { data } = await userAPI.addAddress(addressData);
          set((state) => ({
            user: { ...state.user, addresses: data.data.addresses },
          }));
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Failed to add address.' };
        }
      },

      deleteAddress: async (addressId) => {
        try {
          const { data } = await userAPI.deleteAddress(addressId);
          set((state) => ({
            user: { ...state.user, addresses: data.data.addresses },
          }));
          return { success: true };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Failed to delete address.' };
        }
      },

      // ─── Clear errors ────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: 'akoos-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
