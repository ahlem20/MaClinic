import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatientsList from './pages/PatientsList';
import PatientDetails from './pages/PatientDetails';
import Prescriptions from './pages/Prescriptions';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import PrintPrescription from './pages/PrintPrescription';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/prescriptions/print/:id" element={<PrintPrescription />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
