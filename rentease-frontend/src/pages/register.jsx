import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, phoneNumber);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-(screen-16) bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-xs sm:rounded-2xl border border-gray-100 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500"
                  placeholder="555-0123"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-hidden focus:border-brand-500"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-2 rounded-lg text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              <UserPlus size={16} />
              <span>{loading ? 'Registering...' : 'Create Account'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}