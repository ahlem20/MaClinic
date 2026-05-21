import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Coins, TrendingUp, Calendar, CreditCard, Activity, Sparkles, Receipt } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function Finance() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    today: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const { data } = await api.get('/prescriptions');
        setPrescriptions(data);

        // Calculate Stats
        let total = 0;
        let month = 0;
        let todayRev = 0;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // For Chart (last 7 days)
        const last7Days = Array.from({length: 7}, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          d.setHours(0,0,0,0);
          return { date: d, label: d.toLocaleDateString('en-US', { weekday: 'short' }), revenue: 0 };
        });

        data.forEach((p) => {
          const price = p.price || 0;
          const pDate = new Date(p.createdAt);
          
          total += price;
          if (pDate >= startOfMonth) month += price;
          if (pDate >= startOfToday) todayRev += price;

          // Chart data grouping
          const dayMatch = last7Days.find(d => 
            pDate.getFullYear() === d.date.getFullYear() &&
            pDate.getMonth() === d.date.getMonth() &&
            pDate.getDate() === d.date.getDate()
          );
          if (dayMatch) {
            dayMatch.revenue += price;
          }
        });

        setStats({ totalRevenue: total, thisMonth: month, today: todayRev });
        setChartData(last7Days);

      } catch (error) {
        console.error('Error fetching finance data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinances();
  }, []);

  const statCards = [
    { 
      title: 'Revenus Totaux', 
      value: stats.totalRevenue, 
      description: 'Revenus historiques',
      icon: Coins, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/30' 
    },
    { 
      title: 'Ce Mois-ci', 
      value: stats.thisMonth, 
      description: 'Cycle actuel',
      icon: TrendingUp, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30' 
    },
    { 
      title: 'Revenus d\'Aujourd\'hui', 
      value: stats.today, 
      description: 'Frais de consultation d\'aujourd\'hui',
      icon: Calendar, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/30' 
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-slate-500 animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <Activity className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="font-semibold text-xs">Assemblage du registre financier...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Financial Stats Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm hover-scale transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`${stat.bg} p-2.5 rounded-xl border flex items-center justify-center`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stat.value.toLocaleString()} <span className="text-sm font-semibold text-slate-400">DA</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 pb-4">
            <div>
              <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" /> Aperçu des Revenus (7 Derniers Jours)
              </CardTitle>
              <p className="text-xs text-slate-400 font-medium">Métrique de performance de facturation quotidienne</p>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full tracking-wider uppercase">Cycle de 7 Jours</span>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} tickFormatter={(value) => `${value} DA`} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.4)', 
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                    formatter={(value) => [`${value.toLocaleString()} DA`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Ledger */}
        <Card className="border border-slate-200/60 bg-white/80 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-slate-100/80 pb-4">
            <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              Consultations Récentes
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium">Derniers flux de facturation entrants</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableBody>
                  {prescriptions.slice(0, 10).map((p, index) => (
                    <TableRow 
                      key={p._id} 
                      className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors animate-in fade-in-25 duration-300"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell className="py-3 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs">
                            {p.patient?.fullName ? p.patient.fullName.charAt(0) : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs truncate max-w-[120px]">{p.patient?.fullName || 'Unknown'}</p>
                            <p className="text-[9px] text-slate-400 font-semibold">{new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm shadow-emerald-100/20">
                          +{p.price || 0} DA
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prescriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-12 text-slate-400">
                        <div className="flex flex-col items-center gap-1 justify-center">
                          <Receipt className="h-6 w-6 text-slate-200 animate-pulse" />
                          <p className="text-xs font-semibold text-slate-500">Aucune transaction enregistrée</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
