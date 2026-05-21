import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import api from '../api';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await api.get(`/patients/${id}`);
        setPatient(data);
      } catch (error) {
        console.error('Failed to fetch patient', error);
        alert('Erreur lors du chargement du patient');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Chargement du dossier patient...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Patient introuvable.</div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="ml-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste
      </Button>
      <Card className="shadow-lg border border-slate-200/60">
        <CardHeader className="bg-slate-100/60 border-b border-slate-200/40">
          <CardTitle className="text-xl font-bold">Dossier de {patient.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">Âge: <span className="font-normal text-slate-600">{patient.age}</span></p>
            <p className="font-semibold text-slate-800">Sexe: <span className="font-normal text-slate-600">{patient.gender}</span></p>
            <p className="font-semibold text-slate-800">Téléphone: <span className="font-normal text-slate-600">{patient.phoneNumber}</span></p>
            <p className="font-semibold text-slate-800">Adresse: <span className="font-normal text-slate-600">{patient.address}</span></p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">Allergies:</p>
            <ul className="list-disc list-inside text-slate-600">
              {patient.allergies && patient.allergies.length > 0
                ? patient.allergies.map((a, i) => <li key={i}>{a}</li>)
                : <li>Aucune</li>}
            </ul>
            <p className="font-semibold text-slate-800 mt-2">Antécédents Médicaux:</p>
            <p className="text-slate-600 whitespace-pre-line">{patient.medicalHistory || 'Aucun'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
