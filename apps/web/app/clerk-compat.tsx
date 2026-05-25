"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

// Mock ClerkProvider – simply renders children
export const ClerkProvider = ({ children, publishableKey }: { children: React.ReactNode; publishableKey: string }) => {
  return <>{children}</>;
};

// Mock authentication hook – returns dynamic signed‑in admin user based on localStorage
export const useAuth = () => {
  const [role, setRole] = React.useState<string>('ADMIN');
  const [name, setName] = React.useState<string>('Platform Admin');
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('pm_mock_signed_in');
    setIsSignedIn(stored === 'true');
    const storedRole = localStorage.getItem('pm_mock_user_rbac_role') || 'ADMIN';
    setRole(storedRole);
    const storedName = localStorage.getItem('pm_mock_user_name') || 'Platform Admin';
    setName(storedName);
  }, []);

  const user = React.useMemo(() => {
    return {
      id: 'mock-user-id',
      role,
      emailAddress: 'admin@example.com',
      email: 'admin@example.com',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b0764&color=c084fc`,
      name,
    };
  }, [role, name]);

  const setRoleWithStorage = React.useCallback((newRole: string) => {
    setRole(newRole);
    localStorage.setItem('pm_mock_user_rbac_role', newRole);
  }, []);

  return {
    isSignedIn: mounted ? isSignedIn : false,
    user,
    setRole: setRoleWithStorage,
  };
};

// Conditional rendering components matching Clerk API
export const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isSignedIn) return null;
  return <>{children}</>;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted || isSignedIn) return null;
  return <>{children}</>;
};

export const SignInButton = ({ children, mode, ...rest }: { children?: React.ReactNode; mode?: string; [key: string]: any }) => {
  const router = useRouter();
  const handleClick = () => {
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split('/');
      const locale = segments[1] || 'en';
      router.push(`/${locale}/sign-in`);
    }
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        handleClick();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      }
    });
  }
  return <button onClick={handleClick} {...rest}>{children}</button>;
};

export const UserButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & { afterSignOutUrl?: string }) => {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.afterSignOutUrl) {
      router.push(props.afterSignOutUrl);
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };
  const { afterSignOutUrl, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} onClick={handleClick}>
      User
    </button>
  );
};

export const SignIn = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const [email, setEmail] = React.useState('admin@example.com');
  const [password, setPassword] = React.useState('••••••••');
  const [loading, setLoading] = React.useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('pm_mock_signed_in', 'true');
      localStorage.setItem('pm_mock_user_name', 'Platform Admin');
      localStorage.setItem('pm_mock_user_rbac_role', 'ADMIN');
      document.cookie = 'pm_mock_signed_in=true; path=/';
      setLoading(false);
      const segments = window.location.pathname.split('/');
      const locale = segments[1] || 'en';
      router.push(`/${locale}/dashboard`);
      router.refresh();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6 shadow-xl text-left">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold text-white">Sign in to Supernova Workspace</h3>
        <p className="text-xs text-slate-400">Enter your credentials to establish a secure handshake</p>
      </div>
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <a href="#" className="text-[10px] text-indigo-400 hover:underline">Forgot password?</a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-lg shadow-indigo-600/15 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Establishing Handshake...
            </>
          ) : (
            'Access Workspace'
          )}
        </button>
      </form>
    </div>
  );
};

export const SignUp = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('pm_mock_signed_in', 'true');
      localStorage.setItem('pm_mock_user_name', name || 'Astraea Vance');
      localStorage.setItem('pm_mock_user_rbac_role', 'ADMIN');
      document.cookie = 'pm_mock_signed_in=true; path=/';
      setLoading(false);
      const segments = window.location.pathname.split('/');
      const locale = segments[1] || 'en';
      router.push(`/${locale}/dashboard`);
      router.refresh();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6 shadow-xl text-left">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold text-white">Create Supernova Node Account</h3>
        <p className="text-xs text-slate-400">Initialize standard enterprise workspace credentials</p>
      </div>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            placeholder="Astraea Vance"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            placeholder="astraea@supernova.ai"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold border border-indigo-400/20 shadow-lg shadow-indigo-600/15 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Provisioning Seat...
            </>
          ) : (
            'Deploy Node Handshake'
          )}
        </button>
      </form>
    </div>
  );
};
