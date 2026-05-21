import { useState, useEffect } from 'react';
import { X, FileText, User, Activity, AlertCircle, Phone, MapPin, Printer } from 'lucide-react';
import { Button } from './ui/button';
import api from '../api';
import AddPrescriptionModal from './AddPrescriptionModal'; // 1. Imported your modal

export default function PatientDetailsModal({ isOpen, onClose, patient }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 2. State to handle visibility

  // Function to refresh prescriptions after adding a new one
  const fetchHistory = async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/prescriptions/patient/${patient._id}`);
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && patient) {
      fetchHistory();
    }
  }, [isOpen, patient]);

  if (!isOpen || !patient) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-full overflow-hidden">

          {/* Header */}
          <div className="flex justify-between items-start p-6 bg-blue-50/50 border-b">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.fullName}</h2>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center"><User className="h-4 w-4 mr-1" /> {patient.age} ans, {patient.gender}</span>
                  {patient.phoneNumber && <span className="flex items-center"><Phone className="h-4 w-4 mr-1" /> {patient.phoneNumber}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-700 shadow-sm border border-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Left Column: Details */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Info Patient</h3>
                <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Première Visite:</span>
                    <span className="font-medium text-gray-900">{new Date(patient.createdAt).toLocaleDateString()}</span>
                  </div>
                  {patient.address && (
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{patient.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <h3 className="flex items-center text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">
                    <AlertCircle className="h-4 w-4 mr-1" /> Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium border border-red-100">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: History & Prescriptions */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  <Activity className="h-4 w-4 mr-1" /> Antécédents Médicaux
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-gray-700 text-sm leading-relaxed shadow-sm">
                  {patient.medicalHistory || 'Aucun antécédent médical enregistré.'}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="flex items-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <FileText className="h-4 w-4 mr-1" /> Historique des Ordonnances
                  </h3>
                  {!loading && prescriptions.length > 0 && (
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      Revenus Totaux: {prescriptions.reduce((sum, p) => sum + (p.price || 0), 0)} DA
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-6 text-gray-400 text-sm">Chargement de l'historique...</div>
                ) : prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {prescriptions.map((script) => (
                      <div key={script._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                          <span className="font-semibold text-gray-900">
                            {new Date(script.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              Frais: {script.price || 0} DA
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Par {script.doctor?.name || 'Docteur'}</span>
                            <a
                              href={`/prescriptions/print/${script._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                            >
                              <Printer className="h-3 w-3" /> Imprimer
                            </a>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {script.medicines.map((med, idx) => (
                            <div key={idx} className="flex justify-between text-sm bg-blue-50/50 p-2 rounded-lg">
                              <span className="font-medium text-blue-900">{med.name}</span>
                              <span className="text-gray-600">{med.dosage} pendant {med.duration}</span>
                            </div>
                          ))}
                        </div>
                        {script.notes && (
                          <p className="mt-4 text-sm text-gray-500 italic bg-yellow-50 p-3 rounded-lg">"{script.notes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center text-gray-500 text-sm">
                    Aucune ordonnance trouvée pour ce patient.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <Button variant="outline" onClick={onClose} className="mr-2">Fermer</Button>

            {/* 3. Updated button to toggle state */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Nouvelle Ordonnance
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Render the AddPrescriptionModal conditionally */}
      <AddPrescriptionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchHistory(); // Optional: Refreshes the timeline automatically if a submission occurs
        }}
        patient={patient}
      />
    </>
  );
}