import { create } from 'zustand';
import { persist, StateStorage, StorageValue } from 'zustand/middleware';

type UserRole = 'admin' | 'student' | 'freelancer' | 'PM' | 'HR' | 'Admin' | "Tech";

interface StoreUserParams {
    role: UserRole;
    userObject: any;
    token?: string; // optional — token now lives in HttpOnly cookie set by the server
}

interface AuthState {
    user: any | null;
    isHydrated: boolean;
    storeUser: (params: StoreUserParams) => void;
    clearUser: () => void;
    getUserRole: () => UserRole | null;
    isAuthenticated: () => boolean;
    initializeAuth: () => void;
}

const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
    }
    return null;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isHydrated: false,

            storeUser: ({ role, userObject }: StoreUserParams) => {
                if (typeof window === 'undefined') return;
                // Token is stored as HttpOnly cookie by the server — no JS access needed
                const userData = { ...userObject, role };
                set({ user: userData, isHydrated: true });
            },

            clearUser: () => {
                if (typeof window === 'undefined') return;
                deleteCookie('token');
                set({ user: null });
            },

            getUserRole: () => get().user?.role || null,

            isAuthenticated: () => {
                if (!get().isHydrated) return false;
                return !!get().user;
            },

            initializeAuth: () => {
                if (typeof window === 'undefined') return;
                const token = getCookie('token');
                const localData = localStorage.getItem('auth-storage');
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        set({
                            user: parsed.state.user ? { ...parsed.state.user, token: token || '' } : null,
                            isHydrated: true
                        });
                    } catch {
                        set({ isHydrated: true });
                    }
                } else {
                    set({ isHydrated: true });
                }
            }
        }),
        {
            name: 'auth-storage-v1',
            partialize: (state): AuthState => ({
                user: state.user,
                isHydrated: true,
                storeUser: state.storeUser,
                clearUser: state.clearUser,
                getUserRole: state.getUserRole,
                isAuthenticated: state.isAuthenticated,
                initializeAuth: state.initializeAuth
            }),
            storage: {
                getItem: (name: string) => {
                    if (typeof window === 'undefined') return null;
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name: string, value: StorageValue<AuthState>) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(name, JSON.stringify({
                            state: { 
                                user: value.state.user,
                                isHydrated: true // Include isHydrated in storage
                            },
                            version: value.version
                        }));
                    }
                },
                removeItem: (name: string) => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(name);
                    }
                },
            },
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;
                    useAuthStore.setState({ isHydrated: true });
                }
            },
        }
    )
);