import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [control, setControl] = useState(false);

    const createUser = async (email, password, name) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setControl(!control);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const logIn = async (email, password) => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                setControl(!control);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const logOut = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(null);
                setControl(!control);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    const authInfo = {
        user,
        loading,
        error,
        createUser,
        logIn,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider