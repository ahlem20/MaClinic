import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Stethoscope } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('E-mail ou mot de passe invalide');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-50/50">
      <Card className="w-full max-w-md shadow-xl border-blue-100">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-blue-900">Connexion MaClinic</CardTitle>
          <CardDescription className="text-gray-500">Entrez vos identifiants pour accéder au système</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:ring-blue-500"
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
                className="focus-visible:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Se Connecter
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Vous n'avez pas de compte?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Inscrivez-vous ici
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
