"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

// Mock ClerkProvider – simply renders children
export const ClerkProvider = ({ children, publishableKey }: { children: React.ReactNode; publishableKey: string }) => {
  return <>{children}</>;
};

// Mock authentication hook – returns a signed‑in admin user by default
export const useAuth = () => {
  const [role, setRole] = React.useState<string>('ADMIN');
  const user = {
    id: 'mock-user-id',
    role,
    emailAddress: 'admin@example.com',
    email: 'admin@example.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=3b0764&color=c084fc',
    name: 'Platform Admin',
  };
  return {
    isSignedIn: true,
    user,
    setRole: (newRole: string) => setRole(newRole),
  };
};

// Simple mock components used throughout the app
export const SignedIn = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SignedOut = ({ children }: { children: React.ReactNode }) => <>{children}</>;
export const SignInButton = ({ children, mode, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { mode?: string; children?: React.ReactNode }) => {
  // mode prop is ignored in the mock implementation
  return <>{children}</>;
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
  // Exclude afterSignOutUrl from spreading onto the button element
  const { afterSignOutUrl, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} onClick={handleClick}>
      User
    </button>
  );
};
export const SignIn = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>Mock Sign In Component</div>
);
export const SignUp = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>Mock Sign Up Component</div>
);
