import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'participant',
    institution: '',
    dateofbirth: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.username.trim()) {
      setError('Le nom d\'utilisateur est requis');
      return;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!agreed) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setLoading(true);
    try {
      // Envoyer les données au backend
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        institution: formData.institution,
        dateofbirth: formData.dateofbirth
      });
      
      console.log('Inscription réussie:', response.data);
      navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription. Vérifiez que l\'email n\'est pas déjà utilisé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e0f5f1 0%, #b2e8df 100%)", fontFamily: "Poppins, sans-serif" }}>
      <div className="absolute w-[500px] h-[500px] rounded-full" style={{ background: "#2a9d8f", top: -150, left: -150, opacity: 0.35 }} />
      <div className="absolute w-[380px] h-[380px] rounded-full" style={{ background: "#2a9d8f", bottom: -120, right: -100, opacity: 0.28 }} />
      <div className="absolute w-[220px] h-[220px] rounded-full" style={{ background: "#2a9d8f", top: 40, right: 80, opacity: 0.18 }} />

      <div className="relative z-10 w-full flex items-center justify-center px-4 py-8">
        <div className="flex rounded-3xl overflow-hidden shadow-2xl" style={{ width: 920, minHeight: 580, background: "white" }}>
          {/* Left Side - Illustration */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden" style={{ width: 340, background: "linear-gradient(160deg, #2a9d8f 0%, #1a7a6e 100%)" }}>
            <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-white/20" style={{ top: -80, left: -80 }} />
            <div className="absolute w-[180px] h-[180px] rounded-full border-2 border-white/15" style={{ bottom: -50, right: -40 }} />

            <div className="relative z-10 flex flex-col items-center px-10 text-white text-center gap-5">
              <svg width="160" height="140" viewBox="0 0 160 140" fill="none">
                <circle cx="80" cy="60" r="40" fill="rgba(255,255,255,0.15)" />
                <circle cx="80" cy="48" r="18" fill="rgba(255,255,255,0.3)" />
                <path d="M44 100c0-19.882 16.118-36 36-36s36 16.118 36 36" fill="rgba(255,255,255,0.2)" />
                <circle cx="80" cy="48" r="14" fill="rgba(255,255,255,0.5)" />
                <path d="M66 100c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="rgba(255,255,255,0.35)" />
                <rect x="52" y="108" width="56" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
                <rect x="60" y="120" width="40" height="6" rx="3" fill="rgba(255,255,255,0.18)" />
                <circle cx="28" cy="40" r="8" fill="rgba(255,255,255,0.12)" />
                <circle cx="132" cy="80" r="6" fill="rgba(255,255,255,0.1)" />
                <circle cx="20" cy="90" r="4" fill="rgba(255,255,255,0.08)" />
              </svg>
              <h2 className="text-2xl font-semibold leading-snug">Rejoignez-nous<br />dès aujourd'hui</h2>
              <p className="text-sm opacity-75 leading-relaxed">Créez votre compte gratuitement et accédez à tous nos services.</p>
              <div className="flex gap-2 mt-2">
                <div className="w-2 h-2 bg-white/40 rounded-full" />
                <div className="w-5 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white flex flex-col justify-center px-10 py-10">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect x="12" y="2" width="8" height="28" rx="3" fill="#2a9d8f" />
                  <rect x="2" y="12" width="28" height="8" rx="3" fill="#2a9d8f" />
                  <circle cx="16" cy="16" r="4" fill="white" />
                </svg>
                <span className="text-lg font-semibold" style={{ color: "#2a9d8f" }}>MedSConnect</span>
              </div>
              <h1 className="mt-5 text-2xl font-semibold text-gray-800">Créer un compte</h1>
              <p className="mt-1 text-sm text-gray-400">Remplissez le formulaire ci-dessous</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom complet *</label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    name="username"
                    placeholder="Jean Dupont"
                    value={formData.username}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email *</label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="exemple@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mot de passe *</label>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      required
                      minLength={6}
                    />
                    <button onClick={() => setShowPass(!showPass)} className="text-gray-300 hover:text-teal-500 transition-colors" type="button">
                      {showPass ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confirmer *</label>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                      required
                    />
                    <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-300 hover:text-teal-500 transition-colors" type="button">
                      {showConfirmPass ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rôle</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl text-sm text-gray-700 bg-[#f8fffe] border border-[#d0ece9] outline-none focus:border-[#2a9d8f]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <option value="participant">Participant</option>
                    <option value="author">Auteur / Communicant</option>
                    <option value="committee">Membre du Comité</option>
                    <option value="speaker">Conférencier Invité</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de naissance</label>
                  <input
                    type="date"
                    name="dateofbirth"
                    value={formData.dateofbirth}
                    onChange={handleChange}
                    className="px-4 py-2.5 rounded-xl text-sm text-gray-700 bg-[#f8fffe] border border-[#d0ece9] outline-none focus:border-[#2a9d8f]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Institution</label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ border: "1.5px solid #d0ece9", background: "#f8fffe" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="1.8">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <input
                    type="text"
                    name="institution"
                    placeholder="Université, Laboratoire..."
                    value={formData.institution}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-300"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400"
                />
                <label htmlFor="agreed" className="text-xs text-gray-600">
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(90deg, #2a9d8f 0%, #38b2a3 100%)" }}
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </button>

              <p className="text-center text-xs text-gray-400 mt-1">
                Déjà un compte ?{" "}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: "#2a9d8f" }}>
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
