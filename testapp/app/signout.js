'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function SignOutButton() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut(); // Trigger the sign-out action
  };

  return session ? (
    <button onClick={handleSignOut}>Sign Out</button>
  ) : null;
}
