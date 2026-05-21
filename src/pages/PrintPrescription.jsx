import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Stethoscope, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PrintPrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const { data } = await api.get(`/prescriptions/${id}`);
        setPrescription(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescription', error);
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Chargement de l'ordonnance...</div>;
  }

  if (!prescription) {
    return <div className="flex h-screen items-center justify-center text-red-500">Ordonnance introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 print:p-0 print:bg-white">
      {/* Controls - Hidden during print */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)} className="bg-white">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Printer className="h-4 w-4 mr-2" /> Imprimer / Enregistrer en PDF
        </Button>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-3xl mx-auto bg-white p-12 shadow-lg min-h-[1056px] print:shadow-none print:p-0">
        {/* Header */}
        <header className="flex justify-between items-start border-b-2 border-blue-600 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-xl print:bg-white print:text-blue-600 print:border print:border-blue-600">
              <Stethoscope className="h-8 w-8 text-white print:text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">MaClinic</h1>
              <p className="text-gray-500 text-sm mt-1">L'Excellence en Santé</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">{prescription.doctor.name}</h2>
            <p className="text-gray-500 text-sm">Médecin Consultant</p>
            <p className="text-gray-500 text-sm mt-2">{prescription.doctor.address || '123 Health Avenue, Medical District'}</p>
            <p className="text-gray-500 text-sm">Tél: {prescription.doctor.phone || '+1 234 567 8900'}</p>
          </div>
        </header>

        {/* Patient Info */}
        <section className="bg-gray-50 rounded-xl p-6 mb-8 print:bg-white print:border print:border-gray-200">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Nom du Patient</span>
              <p className="text-lg font-bold text-gray-900 mt-1">{prescription.patient.fullName}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Date</span>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {new Date(prescription.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Âge / Sexe</span>
              <p className="text-gray-900 font-medium mt-1">{prescription.patient.age} Ans / {prescription.patient.gender}</p>
            </div>
            {prescription.patient.phoneNumber && (
              <div>
                <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Téléphone</span>
                <p className="text-gray-900 font-medium mt-1">{prescription.patient.phoneNumber}</p>
              </div>
            )}
          </div>
        </section>



        {/* Medicines */}
        <section className="min-h-[300px]">
          <ul className="space-y-6">
            {prescription.medicines.map((med, idx) => (
              <li key={idx} className="flex gap-4 items-start border-b border-gray-100 pb-4">
                <span className="font-bold text-gray-400 text-lg mt-0.5">{idx + 1}.</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{med.name}</h3>
                  <div className="flex gap-6 mt-2 text-gray-700">
                    <p><span className="font-semibold text-gray-500">Dosage:</span> {med.dosage}</p>
                    <p><span className="font-semibold text-gray-500">Durée:</span> {med.duration}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {prescription.notes && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">Notes du Médecin:</h4>
              <p className="text-gray-700 italic">{prescription.notes}</p>
            </div>
          )}
        </section>

        {/* Signatures */}
        <footer className="mt-24 flex justify-end">
          <div className="text-center">
            <div className="w-48 border-b border-gray-400 mb-2"></div>
            <p className="font-semibold text-gray-800">{prescription.doctor.name}</p>
            <p className="text-sm text-gray-500">Signature / Cachet</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
