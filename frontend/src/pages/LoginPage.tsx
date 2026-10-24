import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e0f5f1 0%, #b2e8df 100%)", fontFamily: "Poppins, sans-serif" }}>
      <div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: "#2a9d8f", top: -150, left: -150, opacity: 0.35 }} />
      <div className="absolute w-[380px] h-[380px] rounded-full" style={{ background: "#2a9d8f", bottom: -120, right: -100, opacity: 0.28 }} />
      <div className="absolute w-[220px] h-[220px] rounded-full" style={{ background: "#2a9d8f", top: 40, right: 80, opacity: 0.18 }} />

      <div className="relative z-10 w-full flex items-center justify-center px-4">
        <div className="flex rounded-3xl overflow-hidden shadow-2xl" style={{ width: 900, minHeight: 520, background: "white" }}>
          {/* Left Side - Illustration */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden" style={{ width: 340, background: "linear-gradient(160deg, #2a9d8f 0%, #1a7a6e 100%)" }}>
            <div className="absolute w-[320px] h-[320px] rounded-full border-2 border-white/20" style={{ top: -80, right: -80 }} />
            <div className="absolute w-[200px] h-[200px] rounded-full border-2 border-white/15" style={{ bottom: -60, left: -60 }} />
            <div className="absolute w-[120px] h-[120px] rounded-full border-2 border-white/10" style={{ top: 60, left: 20 }} />

            <div className="relative z-10 flex flex-col items-center px-10 text-white text-center gap-6">
              <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
                <g transform="translate(10, 40)">
                  <polygon points="50,70 140,45 168,80 78,105" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <polygon points="140,45 168,80 168,98 140,63" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <polygon points="50,70 78,105 78,123 50,88" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <polygon points="50,70 82,15 172,0 140,45" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <polygon points="58,64 88,17 166,4 136,42" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                </g>
                <ellipse cx="100" cy="156" rx="70" ry="6" fill="rgba(0,0,0,0.12)" />
              </svg>
              <h2 className="text-2xl font-semibold leading-snug">Votre espace<br />de travail</h2>
              <p className="text-sm opacity-75 leading-relaxed">Gérez vos activités, suivez vos projets et collaborez en toute simplicité.</p>
              <div className="flex gap-2 mt-2">
                <div className="w-5 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white/40 rounded-full" />
                <div className="w-2 h-2 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white flex flex-col justify-center px-14 py-14">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="2" width="8" height="28" rx="3" fill="#2a9d8f" />
                  <rect x="2" y="12" width="28" height="8" rx="3" fill="#2a9d8f" />
                  <circle cx="16" cy="16" r="4" fill="white" />
                </svg>
                <span className="text-lg font-semibold" style={{ color: "#2a9d8f" }}>MedSConnect</span>
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-gray-800">Bon retour 👋</h1>
              <p className="mt-1 text-sm text-gray-400">Connectez-vous à votre compte</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email ou téléphone</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" />
                  </svg>
                  <input
                    type="text"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mot de passe</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                  <button onClick={() => setShowPass(!showPass)} className="text-gray-300 hover:text-teal-500 transition-colors" type="button">
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 mb-6">
                <a href="#" className="text-xs" style={{ color: "#2a9d8f" }}>Mot de passe oublié ?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(90deg, #2a9d8f 0%, #38b2a3 100%)" }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-5">
                Pas encore de compte ?{" "}
                <Link to="/register" className="font-semibold hover:underline" style={{ color: "#2a9d8f" }}>
                  Créer un compte
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
