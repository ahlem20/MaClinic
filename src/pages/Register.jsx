import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Stethoscope } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Doctor');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l\'inscription');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-blue-50/50 py-12">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-2xl">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-emerald-900">Rejoindre MaClinic</CardTitle>
          <CardDescription className="text-gray-500">Créez un compte pour votre clinique</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Dr. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <option value="Doctor">Médecin</option>
                <option value="Nurse">Infirmier(ère)</option>
                <option value="Receptionist">Réceptionniste</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4">
              S'inscrire
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Connectez-vous ici
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
