import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './styles.css'; // Importa los estilos CSS

// Componente de Registro
function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Usuario registrado correctamente.');
            onRegister(); // Redirige al login después del registro
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al registrar usuario.');
        }
    };

    return (
        <div className="container">
            <h2 className="title">Registro</h2>
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
            />
            <button onClick={handleRegister} className="button">
                Registrar
            </button>
            <p className="message">
                ¿Ya tienes una cuenta? <Link to="/login" className="link">Inicia Sesión</Link>
            </p>
        </div>
    );
}

// Componente de Login
function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Guarda el token
            onLogin(); // Redirige al usuario
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div className="container">
            <h2 className="title">Iniciar Sesión</h2>
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
            />
            <button onClick={handleLogin} className="button">
                Iniciar Sesión
            </button>
        </div>
    );
}

// Componente de Página Protegida
function ProtectedPage({ onLogout }) {
    const [messageServer1, setMessageServer1] = useState('');
    const [messageServer2, setMessageServer2] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
    
            if (!token) {
                alert('No has iniciado sesión.');
                return;
            }
    
            // Obtener mensaje de server1
            const response1 = await fetch('/api/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response1.ok) {
                console.error('Error al obtener datos de server1:', response1.status);
            } else {
                const data1 = await response1.json();
                setMessageServer1(data1.message);
            }
    
            // Obtener mensaje de server2
            const response2 = await fetch('/media/test', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response2.ok) {
                console.error('Error al obtener datos de server2:', response2.status);
            } else {
                const data2 = await response2.json();
                setMessageServer2(data2.message);
            }
        };
    
        fetchMessages();
    }, []);

    return (
        <div className="container">
            <h2 className="title">Bienvenido</h2>
            <p className="message">{messageServer1}</p>
            <p className="message">{messageServer2}</p>
            <button onClick={onLogout} className="button">
                Cerrar Sesión
            </button>
        </div>
    );
}

// Componente Principal
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token
        setIsLoggedIn(false); // Actualiza el estado de autenticación
    };

    return (
        <Router>
            <Routes>
                {/* Ruta de registro */}
                <Route
                    path="/register"
                    element={<Register onRegister={() => window.location.href = '/login'} />}
                />

                {/* Ruta pública */}
                <Route
                    path="/login"
                    element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/protected" />}
                />

                {/* Ruta protegida */}
                <Route
                    path="/protected"
                    element={isLoggedIn ? <ProtectedPage onLogout={handleLogout} /> : <Navigate to="/login" />}
                />

                {/* Redirigir a login si la ruta no existe */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;