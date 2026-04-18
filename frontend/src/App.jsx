import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Wallet, TrendingDown, TrendingUp, Activity, Plus,
  LayoutDashboard, ListOrdered, Settings, LogOut, User,
  FileText, Download, BrainCircuit
} from 'lucide-react';
import './index.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} mode={authMode} setMode={setAuthMode} />;
  }

  return <MainLayout onLogout={() => setIsAuthenticated(false)} />;
}

function AuthScreen({ onLogin, mode, setMode }) {
  const [username, setUsername] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(username.trim() !== '') {
      onLogin();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>FinSight</h1>
        <p>{mode === 'login' ? 'Welcome back! Please login.' : 'Create your account to start tracking.'}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. data_analyst" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input required type="password" placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            {mode === 'login' ? 'Login to Dashboard' : 'Register Account'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
}

function MainLayout({ onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [forecast, setForecast] = useState(null);
  
  const [financialGoal, setFinancialGoal] = useState(() => {
    const saved = localStorage.getItem('financialGoal');
    return saved ? JSON.parse(saved) : { name: 'Emergency Fund', target: 5000 };
  });

  const fetchData = async () => {
    try {
      const [dashboardRes, transactionsRes, predictRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/transactions'),
        fetch('/api/predict')
      ]);
      const dashboardData = await dashboardRes.json();
      const txData = await transactionsRes.json();
      
      let predictData = { forecast_day: null };
      if (predictRes.ok) {
        predictData = await predictRes.json();
      }
      
      setData(dashboardData);
      setTransactions(txData.transactions);
      setForecast(predictData.forecast_day);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Fails gracefully
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="loader-container"><div className="spinner"></div></div>;
  }

  const { metrics, categoryBreakdown, monthlyTrends } = data || { metrics: {}, categoryBreakdown: [], monthlyTrends: [] };
  const hasData = transactions && transactions.length > 0;

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={24} /> FinSight
          </h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${currentView === 'transactions' ? 'active' : ''}`} onClick={() => setCurrentView('transactions')}>
            <ListOrdered size={20} /> All Transactions
          </div>
          <div className={`nav-item ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}>
            <User size={20} /> Profile & Settings
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="nav-item" onClick={onLogout}>
            <LogOut size={20} /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="top-bar">
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>{currentView === 'dashboard' ? 'Overview Analytics' : currentView === 'transactions' ? 'Transaction History' : 'Settings'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here is your latest financial data.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary auto-width" onClick={() => window.open('/api/export/csv', '_blank')} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
              <Download size={18} /> Export CSV
            </button>
            <button className="btn-secondary auto-width" onClick={() => window.open('/api/export/pdf', '_blank')} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
              <FileText size={18} /> Export PDF Report
            </button>
            <button className="btn-primary auto-width" onClick={() => setShowModal(true)}>
              <Plus size={18} /> New Transaction
            </button>
          </div>
        </div>

        {/* Dynamic View Rendering */}
        {currentView === 'dashboard' && (
          <>
            {!hasData ? (
              <div className="empty-state glass">
                <Wallet size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3>No Data Available!</h3>
                <p>Welcome to the Real-Time Simulation! Start by adding your first transaction clicking "+ New Transaction" above to build your dashboard instantly.</p>
              </div>
            ) : (
              <>
                <MetricsGrid metrics={metrics} />
                <Forecaster forecast={forecast} />
                <GoalTracker balance={metrics.balance} goal={financialGoal} />
                <ChartsGrid monthlyTrends={monthlyTrends} categoryBreakdown={categoryBreakdown} />
                <RecentTransactions transactions={transactions} />
              </>
            )}
          </>
        )}

        {currentView === 'transactions' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Full Transaction Reporting</h2>
            {hasData ? <TransactionDataGrid transactions={transactions} /> : <p className="empty-state">No transactions yet.</p>}
          </div>
        )}

        {currentView === 'profile' && (
          <ProfileSettings refreshData={fetchData} goal={financialGoal} setGoal={setFinancialGoal} />
        )}
      </main>

      {/* Transaction Modal */}
      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)} 
          refreshData={fetchData} 
          balance={metrics.balance} 
          goal={financialGoal} 
        />
      )}
    </div>
  );
}

// ------ Subcomponents for Cleaner Code ------

function MetricsGrid({ metrics }) {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  return (
    <div className="metrics-grid">
      <div className="metric-card glass">
        <div className="icon-wrapper balance"><Wallet size={28} /></div>
        <div className="metric-info">
          <h3>Net Balance</h3>
          <p>{formatCurrency(metrics.balance)}</p>
        </div>
      </div>
      <div className="metric-card glass">
        <div className="icon-wrapper income"><TrendingUp size={28} /></div>
        <div className="metric-info">
          <h3>Total Income</h3>
          <p>{formatCurrency(metrics.totalIncome)}</p>
        </div>
      </div>
      <div className="metric-card glass">
        <div className="icon-wrapper expense"><TrendingDown size={28} /></div>
        <div className="metric-info">
          <h3>Total Expenses</h3>
          <p>{formatCurrency(metrics.totalExpense)}</p>
        </div>
      </div>
    </div>
  );
}

function ChartsGrid({ monthlyTrends, categoryBreakdown }) {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  return (
    <div className="charts-grid">
      <div className="chart-card glass">
        <h3>Income vs Expense Trend</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="var(--success)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Expense" stroke="var(--danger)" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-card glass">
        <h3>Expense Breakdown</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {categoryBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: 'var(--card-bg)', border: 'none', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RecentTransactions({ transactions, hideTitle }) {
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);
  return (
    <div className={`transactions-section ${!hideTitle ? 'glass' : ''}`} style={!hideTitle ? { padding: '1.5rem'} : {}}>
      {!hideTitle && <h3 style={{marginBottom: '1.5rem'}}>Recent Logging</h3>}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i}>
                <td>{tx.Date}</td>
                <td><span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.1)' }}>{tx.Category}</span></td>
                <td>{tx.Description}</td>
                <td className={tx.Type === 'Income' ? 'text-success' : 'text-danger'}>
                  {tx.Type === 'Income' ? '+' : '-'}{formatCurrency(tx.Amount)}
                </td>
                <td>{tx.Type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionDataGrid({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'
  
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  // Filter & Sort Logic
  const filteredData = transactions.filter(tx => 
    tx.Description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.Date) - new Date(a.Date);
    if (sortOrder === 'oldest') return new Date(a.Date) - new Date(b.Date);
    if (sortOrder === 'highest') return b.Amount - a.Amount;
    if (sortOrder === 'lowest') return a.Amount - b.Amount;
    return 0;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search descriptions or categories..." 
          style={{ flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '0.5rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '0.5rem' }}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="highest">Sort: Highest Amount</option>
          <option value="lowest">Sort: Lowest Amount</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? sortedData.map((tx, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{tx.Date}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(255,255,255,0.1)' }}>
                    {tx.Category}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{tx.Description}</td>
                <td style={{ padding: '1rem' }} className={tx.Type === 'Income' ? 'text-success' : 'text-danger'}>
                  {tx.Type === 'Income' ? '+' : '-'}{formatCurrency(tx.Amount)}
                </td>
                <td style={{ padding: '1rem' }}>{tx.Type}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No transactions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionModal({ onClose, refreshData, balance, goal }) {
  const [formData, setFormData] = useState({
    Amount: '', Category: 'Food & Dining', Description: '',
    Date: new Date().toISOString().split('T')[0], Type: 'Expense'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // GOAL PROTECTION LOGIC
    if (formData.Type === 'Expense') {
      const expenseAmount = parseFloat(formData.Amount);
      const newBalanceAfterExpense = balance - expenseAmount;
      const targetAmount = parseFloat(goal.target);
      
      if (newBalanceAfterExpense < targetAmount) {
        alert(`🚨 TRANSACTION BLOCKED! \n\nSorry, this expense was rejected. You have to maintain your $${targetAmount} target for the "${goal.name}" trip! Your current balance is $${balance}.`);
        return; // Stop the submission!
      }
    }

    try {
      await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, Amount: parseFloat(formData.Amount) })
      });
      await refreshData();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1.5rem' }}>Log New Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction Type</label>
            <select value={formData.Type} onChange={(e) => setFormData({...formData, Type: e.target.value})}>
              <option>Expense</option><option>Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.Category} onChange={(e) => setFormData({...formData, Category: e.target.value})}>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Groceries">Groceries</option>
              <option value="Housing & Rent">Housing & Rent</option>
              <option value="Auto & Transport">Auto & Transport</option>
              <option value="Utilities & Bills">Utilities & Bills</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Shopping & Retail">Shopping & Retail</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Travel & Vacation">Travel & Vacation</option>
              <option value="Education">Education</option>
              <option value="Investments">Investments</option>
              <option value="Salary & Income">Salary & Income</option>
              <option value="Freelance & Business">Freelance & Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount ($)</label>
            <input required type="number" step="0.01" value={formData.Amount} onChange={(e) => setFormData({...formData, Amount: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input required type="text" value={formData.Description} onChange={(e) => setFormData({...formData, Description: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input required type="date" value={formData.Date} onChange={(e) => setFormData({...formData, Date: e.target.value})} />
          </div>
          <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary auto-width" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary auto-width">Securely Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GoalTracker({ balance, goal }) {
  const current = balance > 0 ? balance : 0;
  const target = parseFloat(goal.target) || 1;
  const percentage = Math.min((current / target) * 100, 100).toFixed(1);
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="goal-tracker glass">
      <div className="goal-header">
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🎯 Goal Tracker: {goal.name}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Progress: {formatCurrency(current)} / {formatCurrency(target)}</p>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: percentage >= 100 ? 'var(--success)' : 'var(--text-main)' }}>
          {percentage}%
        </div>
      </div>
      <div className="progress-container">
        <div className="progress-fill" style={{ width: `${percentage}%`, background: percentage >= 100 ? 'var(--success)' : '' }}></div>
      </div>
      {percentage >= 100 && (
        <p style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 'bold', textAlign: 'center' }}>
          🎉 Congratulations! You have fully funded the "{goal.name}"! Outstanding financial management.
        </p>
      )}
      {balance < 0 && (
        <p style={{ marginTop: '1rem', color: 'var(--danger)', fontWeight: 'bold', textAlign: 'center' }}>
          ⚠️ You have a negative net balance. Clear your debt to start saving for your goal!
        </p>
      )}
    </div>
  );
}

function Forecaster({ forecast }) {
  if (!forecast) return null;
  
  const formattedForecast = forecast.includes('safely') || forecast === 'today' 
    ? forecast 
    : `by the ${forecast}`;

  return (
    <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #8b5cf6' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#8b5cf6' }}>
        <BrainCircuit size={24} /> Machine Learning Forecast
      </h3>
      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
        Forecast: Based on your habits, you will run out of money {formattedForecast}.
      </p>
    </div>
  );
}

function ProfileSettings({ refreshData, goal, setGoal }) {
  const [numRecords, setNumRecords] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [localGoal, setLocalGoal] = useState(goal);

  const handleSimulate = async () => {
    setLoading(true);
    setMessage("");
    try {
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_transactions: parseInt(numRecords) })
      });
      await refreshData();
      setMessage("Simulation Complete! Dashboard updated.");
    } catch (err) {
      console.error(err);
      setMessage("Error performing simulation.");
    }
    setLoading(false);
  };
  
  const handleSavePreferences = () => {
    setGoal(localGoal);
    localStorage.setItem('financialGoal', JSON.stringify(localGoal));
    alert("Preferences & Goal saved successfully!");
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Application Settings & Bulk Simulation</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Settings Panel */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Goals & Preferences</h3>
          <div className="form-group">
            <label>Financial Goal Title</label>
            <input type="text" value={localGoal.name} onChange={(e) => setLocalGoal({...localGoal, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Target Amount ($)</label>
            <input type="number" value={localGoal.target} onChange={(e) => setLocalGoal({...localGoal, target: e.target.value})} />
          </div>
          <button className="btn-secondary" onClick={handleSavePreferences}>Save Preferences</button>
        </div>

        {/* Data Generation Panel */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} /> Data Simulation Engine
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Instantly generate random transactions using Data Science models to automatically test your dashboard visuals. Useful for seeing immediate changes!
          </p>
          
          <div className="form-group">
            <label>Number of Random Expenses to Generate:</label>
            <input 
              type="number" 
              value={numRecords} 
              onChange={(e) => setNumRecords(e.target.value)} 
              min="1" 
              max="500" 
            />
          </div>
          
          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }} 
            onClick={handleSimulate}
            disabled={loading}
          >
            {loading ? 'Simulating Data...' : `Inject ${numRecords} Mock Transactions`}
          </button>
          
          {message && <p style={{ marginTop: '1rem', color: 'var(--success)', fontWeight: 'bold' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
