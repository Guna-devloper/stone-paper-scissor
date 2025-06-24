import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function ProtectedRoute({ children, allowedRole }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) {
          setRole(docSnap.data().role?.toLowerCase());
        }
        setRoleLoading(false);
      }
    };
    if (user) fetchUserRole();
  }, [user]);

  if (loading || roleLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // If a specific role is required, check
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/shop" replace />;
  }

  return children;
}

export default ProtectedRoute;
