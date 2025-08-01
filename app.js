const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } = Recharts;

// Componentes de ícones SVG minimalistas
const Icons = {
  Dashboard: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill={color}/>
    </svg>
  ),
  
  CreditCard: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill={color}/>
    </svg>
  ),
  
  Document: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
    </svg>
  ),
  
  Chart: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21M16,8H18V15H16V8M12,2H14V15H12V2M8,9H10V15H8V9M4,11H6V15H4V11Z" fill={color}/>
    </svg>
  ),
  
  Bank: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5,1L2,6V8H21V6M16,10V17H19V19H4V17H7V10H9V17H11V10H13V17H15V10H16Z" fill={color}/>
    </svg>
  ),
  
  Search: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" fill={color}/>
    </svg>
  ),
  
  Money: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z" fill={color}/>
    </svg>
  ),
  
  Check: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill={color}/>
    </svg>
  ),
  
  Warning: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" fill={color}/>
    </svg>
  ),
  
  Mobile: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z" fill={color}/>
    </svg>
  ),
  
  Sync: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" fill={color}/>
    </svg>
  ),
  
  Clipboard: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3" fill={color}/>
    </svg>
  ),
  
  Export: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
      <path d="M12,11L16,15H13V19H11V15H8L12,11Z" fill={color}/>
    </svg>
  ),
  
  Printer: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" fill={color}/>
    </svg>
  ),
  
  File: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
    </svg>
  ),
  
  Filter: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z" fill={color}/>
    </svg>
  ),
  
  Target: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" fill={color}/>
    </svg>
  ),
  
  Clock: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" fill={color}/>
    </svg>
  ),
  
  Invoice: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill={color}/>
      <path d="M8,12V14H16V12H8M8,16V18H13V16H8Z" fill={color}/>
    </svg>
  ),
  
  Logout: ({ size = 20, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z" fill={color}/>
    </svg>
  )
};

// Real data from the provided extract
const realData = `
"Data Lançamento","Histórico","Descrição","Valor","Saldo"
05/05/2025,"Pix enviado","Paul Gustavo Lukoff Corpcornt Serviços De",-1351.02,"15807.18"
05/05/2025,"Boleto de cobrança recebido","Kapam Seguradora LTDA","1500.00","17658.20"
05/05/2025,"Boleto de cobrança recebido","Corretora de Seguros LTDA","6000.00","16158.20"
05/05/2025,"Boleto de cobrança recebido","SINEK Assessor de Investimentos Ltda","6000.00","10158.20"
06/05/2025,"Pagamento efetuado","CENTRO DE ESTUDOS E DEFESA DO INTERESSES PROFISSIO",-400.00,"11925.18"
11/05/2025,"Pix enviado","Paul Gustavo Lukoff",-3482.00,"12325.18"
11/05/2025,"Pix enviado","Alex Lemos Kravchyn",-5000.00,"1925.18"
12/05/2025,"Pagamento efetuado","PLANO DE BENEFICIOS MICRO PREV",-207.20,"1677.98"
14/05/2025,"Pagamento efetuado","GOOGLE Cloud BR C E SR DE DAD",-40.00,"1885.18"
20/05/2025,"Pagamento Darf Numerado","Darf Numerado",-470.58,"1207.40"
20/05/2025,"Pagamento Simples Nacional","Simples Nacional",-607.51,"599.89"
27/05/2025,"Pagamento efetuado","NUCLEO INF COORD PONTO BR",-76.00,"523.89"
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // landing, register, login, app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estados para polimentos visuais
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'default';
  });
  const [toasts, setToasts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [newRow, setNewRow] = useState({
    'Data Lançamento': '',
    Histórico: '',
    Descrição: '',
    Valor: 0,
    Saldo: 0,
    Origem: 'Banco',
  });
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFilter, setSearchFilter] = useState('all'); // all, transactions, contacts, invoices
  
  // Estados do Dashboard Interativo
  const [dashboardPeriod, setDashboardPeriod] = useState('30days'); // 7days, 30days, 90days, 6months, 1year, custom
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedChart, setSelectedChart] = useState(null); // Para drill-down
  const [chartDrillData, setChartDrillData] = useState(null);
  const [widgetLayout, setWidgetLayout] = useState([
    { id: 'revenue', position: 0, visible: true },
    { id: 'expenses', position: 1, visible: true },
    { id: 'balance', position: 2, visible: true },
    { id: 'chart', position: 3, visible: true },
    { id: 'transactions', position: 4, visible: true },
    { id: 'goals', position: 5, visible: true }
  ]);

  // Estados do Módulo de Metas e Orçamentos
  const [goalCategories, setGoalCategories] = useState([
    {
      id: 1,
      name: 'Tecnologia da Informação',
      description: 'Gastos com infraestrutura, software e serviços de TI',
      color: '#3B82F6',
      monthlyBudget: 300000,
      yearlyBudget: 3600000,
      currentSpent: 245000,
      yearSpent: 2950000,
      priority: 'high',
      createdAt: '2025-01-01',
      subcategories: [
        { name: 'Infraestrutura', budget: 150000, spent: 125000 },
        { name: 'Software', budget: 100000, spent: 85000 },
        { name: 'Serviços', budget: 50000, spent: 35000 }
      ]
    },
    {
      id: 2,
      name: 'Recursos Humanos',
      description: 'Salários, benefícios e treinamentos',
      color: '#10B981',
      monthlyBudget: 450000,
      yearlyBudget: 5400000,
      currentSpent: 420000,
      yearSpent: 5100000,
      priority: 'high',
      createdAt: '2025-01-01',
      subcategories: [
        { name: 'Salários', budget: 350000, spent: 340000 },
        { name: 'Benefícios', budget: 80000, spent: 65000 },
        { name: 'Treinamentos', budget: 20000, spent: 15000 }
      ]
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Campanhas, publicidade e eventos',
      color: '#8B5CF6',
      monthlyBudget: 150000,
      yearlyBudget: 1800000,
      currentSpent: 95000,
      yearSpent: 1200000,
      priority: 'medium',
      createdAt: '2025-01-01',
      subcategories: [
        { name: 'Digital', budget: 80000, spent: 55000 },
        { name: 'Eventos', budget: 50000, spent: 30000 },
        { name: 'Material', budget: 20000, spent: 10000 }
      ]
    },
    {
      id: 4,
      name: 'Infraestrutura Física',
      description: 'Aluguel, manutenção e utilidades',
      color: '#F59E0B',
      monthlyBudget: 80000,
      yearlyBudget: 960000,
      currentSpent: 78000,
      yearSpent: 850000,
      priority: 'medium',
      createdAt: '2025-01-01',
      subcategories: [
        { name: 'Aluguel', budget: 50000, spent: 50000 },
        { name: 'Utilidades', budget: 20000, spent: 18000 },
        { name: 'Manutenção', budget: 10000, spent: 10000 }
      ]
    },
    {
      id: 5,
      name: 'Viagens e Representação',
      description: 'Viagens corporativas e despesas de representação',
      color: '#EF4444',
      monthlyBudget: 25000,
      yearlyBudget: 300000,
      currentSpent: 12000,
      yearSpent: 180000,
      priority: 'low',
      createdAt: '2025-01-01',
      subcategories: [
        { name: 'Passagens', budget: 15000, spent: 8000 },
        { name: 'Hospedagem', budget: 7000, spent: 3000 },
        { name: 'Alimentação', budget: 3000, spent: 1000 }
      ]
    }
  ]);
  const [selectedGoalCategory, setSelectedGoalCategory] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalModalType, setGoalModalType] = useState('create'); // create, edit, view
  const [newGoalCategory, setNewGoalCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    monthlyBudget: 0,
    yearlyBudget: 0,
    priority: 'medium',
    subcategories: []
  });
  const [goalsPeriod, setGoalsPeriod] = useState('month'); // month, quarter, year
  const [goalsSortBy, setGoalsSortBy] = useState('usage'); // usage, budget, name, priority
  const [showGoalAlerts, setShowGoalAlerts] = useState(true);

  // Mock de dados de notificações financeiras
  const notifications = [
    {
      id: 1,
      type: 'overdue',
      title: 'Pagamento em Atraso',
      description: 'Conta de energia venceu há 3 dias',
      amount: 'R$ 285,00',
      date: '2025-07-21',
      priority: 'high',
      icon: 'warning'
    },
    {
      id: 2,
      type: 'upcoming',
      title: 'Conta Agendada',
      description: 'Financiamento do carro vence amanhã',
      amount: 'R$ 820,00',
      date: '2025-07-25',
      priority: 'medium',
      icon: 'clock'
    },
    {
      id: 3,
      type: 'due',
      title: 'Conta a Pagar',
      description: 'Cartão de crédito vence em 5 dias',
      amount: 'R$ 1.250,00',
      date: '2025-07-29',
      priority: 'medium',
      icon: 'creditcard'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Lembrete de Investimento',
      description: 'Aplicação automática será realizada hoje',
      amount: 'R$ 500,00',
      date: '2025-07-24',
      priority: 'low',
      icon: 'chart'
    },
    {
      id: 5,
      type: 'income',
      title: 'Recebimento Confirmado',
      description: 'Salário foi depositado',
      amount: 'R$ 4.500,00',
      date: '2025-07-24',
      priority: 'low',
      icon: 'check'
    }
  ];

  const unreadCount = notifications.filter(n => n.priority === 'high' || n.priority === 'medium').length;

  // Mock data para busca global
  const searchData = {
    transactions: [
      { id: 1, type: 'transaction', title: 'Pagamento Fornecedor ABC', amount: 'R$ 2.500,00', date: '2025-07-20', category: 'Fornecedores' },
      { id: 2, type: 'transaction', title: 'Recebimento Cliente XYZ', amount: 'R$ 5.800,00', date: '2025-07-22', category: 'Vendas' },
      { id: 3, type: 'transaction', title: 'Conta de Energia Elétrica', amount: 'R$ 285,00', date: '2025-07-21', category: 'Despesas' },
      { id: 4, type: 'transaction', title: 'Transferência Bancária', amount: 'R$ 1.200,00', date: '2025-07-23', category: 'Transferências' },
    ],
    contacts: [
      { id: 1, type: 'contact', title: 'Fornecedor ABC Ltda', phone: '(11) 9999-9999', email: 'contato@abc.com', category: 'Fornecedor' },
      { id: 2, type: 'contact', title: 'Cliente XYZ Corp', phone: '(21) 8888-8888', email: 'vendas@xyz.com', category: 'Cliente' },
      { id: 3, type: 'contact', title: 'Banco Bradesco', phone: '(11) 4004-2002', email: 'atendimento@bradesco.com', category: 'Banco' },
      { id: 4, type: 'contact', title: 'Contador Silva & Associados', phone: '(11) 7777-7777', email: 'silva@contador.com', category: 'Serviços' },
    ],
    invoices: [
      { id: 1, type: 'invoice', title: 'Fatura #2025001', amount: 'R$ 3.200,00', status: 'Paga', dueDate: '2025-07-15' },
      { id: 2, type: 'invoice', title: 'Fatura #2025002', amount: 'R$ 1.850,00', status: 'Pendente', dueDate: '2025-07-30' },
      { id: 3, type: 'invoice', title: 'Fatura #2025003', amount: 'R$ 4.100,00', status: 'Vencida', dueDate: '2025-07-18' },
      { id: 4, type: 'invoice', title: 'Fatura #2025004', amount: 'R$ 2.750,00', status: 'Enviada', dueDate: '2025-08-05' },
    ]
  };

  // Dados dinâmicos para dashboard baseados no período
  const getDashboardData = (period) => {
    const baseData = {
      '7days': {
        revenue: 'R$ 12.450,00',
        expenses: 'R$ 8.320,00',
        balance: 'R$ 4.130,00',
        growth: '+12.5%',
        chartData: [
          { name: 'Seg', receita: 1800, despesa: 1200, saldo: 600 },
          { name: 'Ter', receita: 2100, despesa: 1400, saldo: 700 },
          { name: 'Qua', receita: 1950, despesa: 1100, saldo: 850 },
          { name: 'Qui', receita: 2300, despesa: 1600, saldo: 700 },
          { name: 'Sex', receita: 2200, despesa: 1300, saldo: 900 },
          { name: 'Sáb', receita: 1100, despesa: 800, saldo: 300 },
          { name: 'Dom', receita: 1000, despesa: 920, saldo: 80 }
        ],
        transactions: [
          { date: '24/07', description: 'Venda Online #2405', amount: '+R$ 2.300,00', type: 'income', status: 'confirmed' },
          { date: '23/07', description: 'Pagamento Fornecedor ABC', amount: '-R$ 1.600,00', type: 'expense', status: 'confirmed' },
          { date: '22/07', description: 'Recebimento PIX Cliente XYZ', amount: '+R$ 2.100,00', type: 'income', status: 'confirmed' },
          { date: '21/07', description: 'Folha de Pagamento', amount: '-R$ 3.200,00', type: 'expense', status: 'confirmed' },
          { date: '20/07', description: 'Consultoria Projeto Alpha', amount: '+R$ 4.500,00', type: 'income', status: 'confirmed' }
        ],
        categoryData: [
          { category: 'Vendas', value: 45, amount: 8500 },
          { category: 'Serviços', value: 30, amount: 5800 },
          { category: 'Consultorias', value: 20, amount: 3900 },
          { category: 'Outros', value: 5, amount: 950 }
        ],
        kpis: {
          marginLiquida: 28.5,
          roi: 18.3,
          liquidez: 2.4,
          crescimento: 15.2,
          efficiency: 85.4
        }
      },
      '30days': {
        revenue: 'R$ 45.230,00',
        expenses: 'R$ 32.180,00',
        balance: 'R$ 13.050,00',
        growth: '+18.3%',
        chartData: [
          { name: 'Sem 1', receita: 8500, despesa: 6200, saldo: 2300 },
          { name: 'Sem 2', receita: 9800, despesa: 7100, saldo: 2700 },
          { name: 'Sem 3', receita: 11200, despesa: 8300, saldo: 2900 },
          { name: 'Sem 4', receita: 10300, despesa: 7800, saldo: 2500 },
          { name: 'Sem 5', receita: 5430, despesa: 2780, saldo: 2650 }
        ],
        transactions: [
          { date: '20/07', description: 'Contrato Anual Cliente Premium', amount: '+R$ 15.000,00', type: 'income', status: 'confirmed' },
          { date: '18/07', description: 'Folha de Pagamento Equipe', amount: '-R$ 12.500,00', type: 'expense', status: 'confirmed' },
          { date: '15/07', description: 'Venda Produtos Especiais', amount: '+R$ 8.750,00', type: 'income', status: 'confirmed' },
          { date: '12/07', description: 'Aluguel + Condomínio', amount: '-R$ 3.200,00', type: 'expense', status: 'confirmed' },
          { date: '10/07', description: 'Projeto Desenvolvimento', amount: '+R$ 12.400,00', type: 'income', status: 'confirmed' }
        ],
        categoryData: [
          { category: 'Vendas', value: 42, amount: 19000 },
          { category: 'Serviços', value: 35, amount: 15800 },
          { category: 'Consultorias', value: 18, amount: 8100 },
          { category: 'Outros', value: 5, amount: 2330 }
        ],
        kpis: {
          marginLiquida: 32.1,
          roi: 22.7,
          liquidez: 2.8,
          crescimento: 18.3,
          efficiency: 88.2
        }
      },
      '90days': {
        revenue: 'R$ 128.450,00',
        expenses: 'R$ 89.230,00',
        balance: 'R$ 39.220,00',
        growth: '+24.7%',
        chartData: [
          { name: 'Mês 1', receita: 38200, despesa: 28100, saldo: 10100 },
          { name: 'Mês 2', receita: 45230, despesa: 32180, saldo: 13050 },
          { name: 'Mês 3', receita: 45020, despesa: 28950, saldo: 16070 }
        ],
        transactions: [
          { date: 'Jul/2025', description: 'Faturamento Mensal Total', amount: '+R$ 45.230,00', type: 'income', status: 'confirmed' },
          { date: 'Jun/2025', description: 'Faturamento Mensal Total', amount: '+R$ 38.200,00', type: 'income', status: 'confirmed' },
          { date: 'Mai/2025', description: 'Faturamento Mensal Total', amount: '+R$ 45.020,00', type: 'income', status: 'confirmed' },
          { date: 'Jul/2025', description: 'Despesas Operacionais', amount: '-R$ 32.180,00', type: 'expense', status: 'confirmed' },
          { date: 'Jun/2025', description: 'Despesas Operacionais', amount: '-R$ 28.100,00', type: 'expense', status: 'confirmed' }
        ],
        categoryData: [
          { category: 'Vendas', value: 40, amount: 51400 },
          { category: 'Serviços', value: 38, amount: 48800 },
          { category: 'Consultorias', value: 17, amount: 21800 },
          { category: 'Outros', value: 5, amount: 6450 }
        ],
        kpis: {
          marginLiquida: 30.5,
          roi: 24.7,
          liquidez: 3.1,
          crescimento: 24.7,
          efficiency: 92.1
        }
      },
      '6months': {
        revenue: 'R$ 265.840,00',
        expenses: 'R$ 180.320,00',
        balance: 'R$ 85.520,00',
        growth: '+28.9%',
        chartData: [
          { name: 'Jan', receita: 35200, despesa: 25100, saldo: 10100 },
          { name: 'Fev', receita: 38900, despesa: 27800, saldo: 11100 },
          { name: 'Mar', receita: 42100, despesa: 29500, saldo: 12600 },
          { name: 'Abr', receita: 44500, despesa: 31200, saldo: 13300 },
          { name: 'Mai', receita: 47890, despesa: 33420, saldo: 14470 },
          { name: 'Jun', receita: 57250, despesa: 33300, saldo: 23950 }
        ],
        transactions: [
          { date: 'Jun/2025', description: 'Maior faturamento do semestre', amount: '+R$ 57.250,00', type: 'income', status: 'confirmed' },
          { date: 'Mai/2025', description: 'Crescimento sustentado', amount: '+R$ 47.890,00', type: 'income', status: 'confirmed' },
          { date: 'Abr/2025', description: 'Meta superada em 12%', amount: '+R$ 44.500,00', type: 'income', status: 'confirmed' },
          { date: 'Mar/2025', description: 'Expansão de mercado', amount: '+R$ 42.100,00', type: 'income', status: 'confirmed' },
          { date: 'Fev/2025', description: 'Consolidação de base', amount: '+R$ 38.900,00', type: 'income', status: 'confirmed' }
        ],
        categoryData: [
          { category: 'Vendas', value: 45, amount: 119700 },
          { category: 'Serviços', value: 32, amount: 85100 },
          { category: 'Consultorias', value: 18, amount: 47850 },
          { category: 'Outros', value: 5, amount: 13190 }
        ],
        kpis: {
          marginLiquida: 32.2,
          roi: 28.9,
          liquidez: 3.5,
          crescimento: 28.9,
          efficiency: 94.3
        }
      },
      '1year': {
        revenue: 'R$ 542.180,00',
        expenses: 'R$ 365.920,00',
        balance: 'R$ 176.260,00',
        growth: '+32.5%',
        chartData: [
          { name: 'T1', receita: 116200, despesa: 82400, saldo: 33800 },
          { name: 'T2', receita: 134640, despesa: 91920, saldo: 42720 },
          { name: 'T3', receita: 142890, despesa: 95800, saldo: 47090 },
          { name: 'T4', receita: 148450, despesa: 95800, saldo: 52650 }
        ],
        transactions: [
          { date: 'T4/2024', description: 'Melhor trimestre do ano', amount: '+R$ 148.450,00', type: 'income', status: 'confirmed' },
          { date: 'T3/2024', description: 'Crescimento acelerado', amount: '+R$ 142.890,00', type: 'income', status: 'confirmed' },
          { date: 'T2/2024', description: 'Expansão consolidada', amount: '+R$ 134.640,00', type: 'income', status: 'confirmed' },
          { date: 'T1/2024', description: 'Base sólida estabelecida', amount: '+R$ 116.200,00', type: 'income', status: 'confirmed' },
          { date: '2024', description: 'Crescimento anual sustentável', amount: '+R$ 176.260,00', type: 'income', status: 'confirmed' }
        ],
        categoryData: [
          { category: 'Vendas', value: 48, amount: 260250 },
          { category: 'Serviços', value: 30, amount: 162650 },
          { category: 'Consultorias', value: 17, amount: 92170 },
          { category: 'Outros', value: 5, amount: 27110 }
        ],
        kpis: {
          marginLiquida: 32.5,
          roi: 32.5,
          liquidez: 4.2,
          crescimento: 32.5,
          efficiency: 96.8
        }
      }
    };
    
    return baseData[period] || baseData['30days'];
  };

  const currentDashboardData = getDashboardData(dashboardPeriod);
  const [currentView, setCurrentView] = useState('transactions');
  const [currentReport, setCurrentReport] = useState('');
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    client: '',
    category: '',
    bank: '',
    reportType: 'financial',
    type: '',
    account: '',
    costCenter: '',
    status: ''
  });

  // Plano de Contas Estruturado
  const [chartOfAccounts] = useState({
    receitas: {
      name: 'Receitas',
      code: '3',
      subcategories: {
        vendas: {
          name: 'Vendas',
          code: '3.1',
          subcategories: {
            produtos: { name: 'Vendas de Produtos', code: '3.1.1' },
            servicos: { name: 'Vendas de Serviços', code: '3.1.2' },
            comissoes: { name: 'Comissões', code: '3.1.3' }
          }
        },
        financeiras: {
          name: 'Receitas Financeiras',
          code: '3.2',
          subcategories: {
            juros: { name: 'Juros Recebidos', code: '3.2.1' },
            rendimentos: { name: 'Rendimentos de Aplicações', code: '3.2.2' }
          }
        }
      }
    },
    despesas: {
      name: 'Despesas',
      code: '4',
      subcategories: {
        operacionais: {
          name: 'Despesas Operacionais',
          code: '4.1',
          subcategories: {
            pessoal: { name: 'Despesas com Pessoal', code: '4.1.1' },
            marketing: { name: 'Marketing e Publicidade', code: '4.1.2' },
            administrativas: { name: 'Despesas Administrativas', code: '4.1.3' },
            tecnologia: { name: 'Tecnologia e Software', code: '4.1.4' }
          }
        },
        financeiras: {
          name: 'Despesas Financeiras',
          code: '4.2',
          subcategories: {
            juros: { name: 'Juros Pagos', code: '4.2.1' },
            taxas: { name: 'Taxas Bancárias', code: '4.2.2' }
          }
        }
      }
    }
  });

  // Centro de Custos
  const [costCenters] = useState([
    { id: 1, name: 'Administrativo', code: 'ADM' },
    { id: 2, name: 'Comercial', code: 'COM' },
    { id: 3, name: 'Tecnologia', code: 'TEC' },
    { id: 4, name: 'Marketing', code: 'MKT' },
    { id: 5, name: 'Financeiro', code: 'FIN' }
  ]);

  // Estados para transações melhoradas
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [enhancedTransaction, setEnhancedTransaction] = useState({
    'Data Lançamento': '',
    Histórico: '',
    Descrição: '',
    Valor: 0,
    Saldo: 0,
    Origem: 'Banco',
    Categoria: '',
    Subcategoria: '',
    Conta: '',
    CentroCusto: '',
    Tipo: 'Receita', // Receita ou Despesa
    Status: 'Confirmada', // Confirmada, Pendente, Cancelada
    Cliente: '',
    Fornecedor: '',
    FormaPagamento: 'PIX',
    NumeroDocumento: '',
    Observacoes: ''
  });

  // Estados para gerenciar bancos
  const [banks, setBanks] = useState([
    { id: 1, name: 'Banco do Brasil', code: '001', agency: '1234-5', account: '12345-6', balance: 15420.80, active: true },
    { id: 2, name: 'Itaú Unibanco', code: '341', agency: '9876', account: '54321-0', balance: 8750.30, active: true },
    { id: 3, name: 'Caixa Econômica', code: '104', agency: '5678', account: '98765-4', balance: 22100.50, active: true }
  ]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [newBank, setNewBank] = useState({
    name: '',
    code: '',
    agency: '',
    account: '',
    balance: 0,
    active: true
  }); // 'transactions', 'dashboard', 'documents'
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentForm, setDocumentForm] = useState({
    type: 'nota_fiscal',
    description: '',
    value: 0,
    date: '',
    category: '',
    file: null
  });

  const [newDocument, setNewDocument] = useState({
    type: 'nota_fiscal',
    description: '',
    value: 0,
    date: '',
    category: '',
    file: null
  });

  // Estados para Faturas
  const [invoices, setInvoices] = useState([
    {
      numero: 'INV-001',
      cliente: 'Empresa ABC Ltda',
      dataEmissao: '2025-07-01',
      vencimento: '2025-07-31',
      valor: 1500.00,
      status: 'Pendente',
      descricao: 'Serviços de consultoria'
    },
    {
      numero: 'INV-002',
      cliente: 'Indústria XYZ',
      dataEmissao: '2025-07-15',
      vencimento: '2025-08-15',
      valor: 3200.00,
      status: 'Pago',
      descricao: 'Desenvolvimento de sistema'
    }
  ]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [currentInvoiceIndex, setCurrentInvoiceIndex] = useState(null);

  // Estados para Clientes/Fornecedores
  const [contacts, setContacts] = useState([
    {
      nome: 'Empresa ABC Ltda',
      tipo: 'Cliente',
      documento: '12.345.678/0001-90',
      email: 'contato@empresaabc.com',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Flores, 123, São Paulo - SP'
    },
    {
      nome: 'Fornecedor XYZ',
      tipo: 'Fornecedor',
      documento: '98.765.432/0001-10',
      email: 'vendas@fornecedorxyz.com',
      telefone: '(11) 88888-8888',
      endereco: 'Av. Paulista, 1000, São Paulo - SP'
    }
  ]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [currentContactIndex, setCurrentContactIndex] = useState(null);

  const sidebarOptions = [
    { label: "Painel", action: () => setCurrentView('dashboard'), icon: <Icons.Dashboard size={18} /> },
    { label: "Transações", action: () => setCurrentView('transactions'), icon: <Icons.CreditCard size={18} /> },
    { label: "Documentos", action: () => setCurrentView('documents'), icon: <Icons.Document size={18} /> },
    { label: "Relatórios", action: () => setCurrentView('reports'), icon: <Icons.Chart size={18} /> },
    { label: "Metas", action: () => setCurrentView('metas'), icon: <Icons.Target size={18} /> },
    { label: "Bancos", action: () => setCurrentView('banks'), icon: <Icons.Bank size={18} /> },
    { label: "Faturas", action: () => setCurrentView('faturas'), icon: <Icons.Invoice size={18} /> },
    { label: "Clientes/Fornecedores", action: () => setCurrentView('contatos'), icon: <Icons.Clipboard size={18} /> },
    { label: "Histórico", action: () => setShowHistoryModal(true), icon: <Icons.Sync size={18} /> },
  ];

  const filteredSidebarOptions = sidebarOptions.filter(opt =>
    opt.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  // Funções helper para Plano de Contas
  const getAccountsList = (type = null) => {
    const accounts = [];
    
    const traverse = (category, parentName = '') => {
      if (category.subcategories) {
        Object.entries(category.subcategories).forEach(([key, subcat]) => {
          if (subcat.subcategories) {
            traverse(subcat, `${parentName}${category.name} > `);
          } else {
            accounts.push({
              code: subcat.code,
              name: `${parentName}${category.name} > ${subcat.name}`,
              fullName: subcat.name,
              category: category.name,
              type: parentName.includes('Receitas') ? 'Receita' : 'Despesa'
            });
          }
        });
      }
    };

    Object.entries(chartOfAccounts).forEach(([key, category]) => {
      traverse(category);
    });

    return type ? accounts.filter(acc => acc.type === type) : accounts;
  };

  const getCategoryOptions = (type) => {
    const baseCategory = type === 'Receita' ? chartOfAccounts.receitas : chartOfAccounts.despesas;
    const options = [];
    
    Object.entries(baseCategory.subcategories).forEach(([key, category]) => {
      options.push({
        value: key,
        label: category.name,
        code: category.code
      });
    });
    
    return options;
  };

  const getSubcategoryOptions = (type, categoryKey) => {
    const baseCategory = type === 'Receita' ? chartOfAccounts.receitas : chartOfAccounts.despesas;
    const category = baseCategory.subcategories[categoryKey];
    
    if (!category || !category.subcategories) return [];
    
    return Object.entries(category.subcategories).map(([key, subcat]) => ({
      value: key,
      label: subcat.name,
      code: subcat.code
    }));
  };

  // Função para atualizar/sincronizar dados
  const handleRefreshData = () => {
    setLoading(true);
    
    // Simular refresh dos dados
    setTimeout(() => {
      // Reprocessar dados CSV
      const parsedData = Papa.parse(realData, { header: true }).data;
      const cleanedData = parsedData
        .filter(row => row['Data Lançamento'] && row['Data Lançamento'].trim() !== '')
        .map((row, index) => ({
          ...row,
          Valor: parseFloat(row.Valor) || 0,
          Saldo: parseFloat(row.Saldo) || 0,
          id: index
        }));
      
      setData(cleanedData);
      setFilteredData(cleanedData);
      setLoading(false);
      
      // Feedback visual de sucesso
      const button = document.querySelector('[data-refresh]');
      if (button) {
        button.classList.add('animate-spin');
        setTimeout(() => {
          button.classList.remove('animate-spin');
        }, 1000);
      }
    }, 1000);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
    setSidebarOpen(false); // Fecha o sidebar quando mostra o modal de logout
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    // Reset all states
    setCurrentView('transactions');
    setSidebarOpen(false);
    setUsername('');
    setPassword('');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Fechar painéis ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-panel') && !event.target.closest('.notifications-button')) {
        setShowNotifications(false);
      }
      if (showSettings && !event.target.closest('.settings-panel') && !event.target.closest('.settings-button')) {
        setShowSettings(false);
      }
      if (showSearchResults && !event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showSettings, showSearchResults]);

  const getNotificationIcon = (iconType) => {
    switch(iconType) {
      case 'warning': return Icons.Warning;
      case 'clock': return Icons.Clock;
      case 'creditcard': return Icons.CreditCard;
      case 'chart': return Icons.Chart;
      case 'check': return Icons.Check;
      default: return Icons.Document;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Funções para polimentos visuais
  
  // Sistema de Toast
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sistema de Loading States
  const setLoadingState = (key, loading) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  };

  const getLoadingState = (key) => {
    return loadingStates[key] || false;
  };

  // Modo Escuro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    showToast(`Modo ${newDarkMode ? 'escuro' : 'claro'} ativado`, 'success');
  };

  // Sistema de Temas
  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    showToast(`Tema ${theme} aplicado`, 'success');
  };

  // Aplicar modo escuro na inicialização
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const formatNotificationDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays < -1) return `${Math.abs(diffDays)} dias atrás`;
    if (diffDays > 1) return `Em ${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
  };

  // Funções de busca
  const performSearch = (query, filter = 'all') => {
    if (!query.trim()) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    let results = [];
    
    const searchInData = (dataArray) => {
      return dataArray.filter(item => 
        item.title.toLowerCase().includes(normalizedQuery) ||
        (item.category && item.category.toLowerCase().includes(normalizedQuery)) ||
        (item.email && item.email.toLowerCase().includes(normalizedQuery)) ||
        (item.phone && item.phone.toLowerCase().includes(normalizedQuery)) ||
        (item.status && item.status.toLowerCase().includes(normalizedQuery))
      );
    };
    
    if (filter === 'all' || filter === 'transactions') {
      results = [...results, ...searchInData(searchData.transactions)];
    }
    if (filter === 'all' || filter === 'contacts') {
      results = [...results, ...searchInData(searchData.contacts)];
    }
    if (filter === 'all' || filter === 'invoices') {
      results = [...results, ...searchInData(searchData.invoices)];
    }
    
    return results.slice(0, 8); // Limita a 8 resultados
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getSearchIcon = (type) => {
    switch(type) {
      case 'transaction': return Icons.Money;
      case 'contact': return '👤';
      case 'invoice': return Icons.Invoice;
      default: return Icons.Search;
    }
  };

  const getSearchItemColor = (type) => {
    switch(type) {
      case 'transaction': return 'text-blue-600 bg-blue-50';
      case 'contact': return 'text-green-600 bg-green-50';
      case 'invoice': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Funções auxiliares para Metas e Orçamentos
  const calculateBudgetProgress = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getBudgetStatus = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 90) return 'warning';
    if (percentage >= 75) return 'caution';
    return 'good';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      case 'caution': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'exceeded': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'caution': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const handleCreateGoalCategory = () => {
    setGoalModalType('create');
    setNewGoalCategory({
      name: '',
      description: '',
      color: '#3B82F6',
      monthlyBudget: 0,
      yearlyBudget: 0,
      priority: 'medium',
      subcategories: []
    });
    setShowGoalModal(true);
  };

  const handleEditGoalCategory = (category) => {
    setGoalModalType('edit');
    setSelectedGoalCategory(category);
    setNewGoalCategory({
      name: category.name,
      description: category.description,
      color: category.color,
      monthlyBudget: category.monthlyBudget,
      yearlyBudget: category.yearlyBudget,
      priority: category.priority,
      subcategories: [...category.subcategories]
    });
    setShowGoalModal(true);
  };

  const handleSaveGoalCategory = () => {
    if (goalModalType === 'create') {
      const newCategory = {
        ...newGoalCategory,
        id: Date.now(),
        currentSpent: 0,
        yearSpent: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGoalCategories([...goalCategories, newCategory]);
    } else {
      setGoalCategories(goalCategories.map(cat => 
        cat.id === selectedGoalCategory.id 
          ? { ...cat, ...newGoalCategory }
          : cat
      ));
    }
    setShowGoalModal(false);
    showToast('Categoria de meta salva com sucesso!', 'success');
  };

  const handleDeleteGoalCategory = (categoryId) => {
    setGoalCategories(goalCategories.filter(cat => cat.id !== categoryId));
    showToast('Categoria de meta removida!', 'info');
  };

  const getSortedGoalCategories = () => {
    return [...goalCategories].sort((a, b) => {
      switch (goalsSortBy) {
        case 'usage':
          return calculateBudgetProgress(b.currentSpent, b.monthlyBudget) - 
                 calculateBudgetProgress(a.currentSpent, a.monthlyBudget);
        case 'budget':
          return b.monthlyBudget - a.monthlyBudget;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });
  };

  const getGoalAlerts = () => {
    return goalCategories.filter(category => {
      const status = getBudgetStatus(category.currentSpent, category.monthlyBudget);
      return status === 'warning' || status === 'exceeded';
    });
  };

  // Funções do Dashboard Interativo
  const handlePeriodChange = (period) => {
    setDashboardPeriod(period);
    setSelectedChart(null);
    setChartDrillData(null);
  };

  const handleChartClick = (data, chartType) => {
    setSelectedChart(chartType);
    
    // Simular drill-down data
    const drillDownData = {
      revenue: [
        { name: 'Vendas Online', value: data.receita * 0.6, color: '#10B981' },
        { name: 'Vendas Físicas', value: data.receita * 0.3, color: '#3B82F6' },
        { name: 'Serviços', value: data.receita * 0.1, color: '#8B5CF6' }
      ],
      expenses: [
        { name: 'Pessoal', value: data.despesa * 0.5, color: '#EF4444' },
        { name: 'Operacional', value: data.despesa * 0.3, color: '#F97316' },
        { name: 'Marketing', value: data.despesa * 0.2, color: '#EC4899' }
      ]
    };
    
    setChartDrillData({
      period: data.name,
      type: chartType,
      data: drillDownData[chartType] || []
    });
  };

  const closeDrillDown = () => {
    setSelectedChart(null);
    setChartDrillData(null);
  };

  const getPeriodLabel = (period) => {
    const labels = {
      '7days': 'Últimos 7 dias',
      '30days': 'Últimos 30 dias',
      '90days': 'Últimos 90 dias',
      '6months': 'Últimos 6 meses',
      '1year': 'Último ano',
      'custom': 'Personalizado'
    };
    return labels[period] || labels['30days'];
  };

  const formatCurrencyValue = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para reorganizar widgets (simulação de drag & drop)
  const moveWidget = (fromIndex, toIndex) => {
    const newLayout = [...widgetLayout];
    const [movedWidget] = newLayout.splice(fromIndex, 1);
    newLayout.splice(toIndex, 0, movedWidget);
    
    // Atualizar posições
    newLayout.forEach((widget, index) => {
      widget.position = index;
    });
    
    setWidgetLayout(newLayout);
  };

  const toggleWidgetVisibility = (widgetId) => {
    setWidgetLayout(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const fetchBankData = async () => {
    setLoading(true);
    return new Promise(resolve => setTimeout(() => resolve(realData), 1000));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await fetchBankData();
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: header => header.trim(),
          transform: (value, header) => {
            if (header === 'Valor' || header === 'Saldo') return parseFloat(value.replace('.', '').replace(',', '.')) || 0;
            return value.trim();
          },
          complete: ({ data }) => {
            const initialData = data.map(row => ({ ...row, Origem: 'Banco' }));
            setData(initialData);
            setFilteredData(initialData);
            setTransactionHistory(initialData);
            setLoading(false);
          },
        });
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const trackChange = (action, row, originalRow = null) => {
    setTransactionHistory(prev => [
      ...prev,
      {
        'Data Lançamento': row['Data Lançamento'],
        Histórico: row.Histórico,
        Descrição: row.Descrição,
        Valor: row.Valor,
        Origem: row.Origem,
        Ação: action,
        Detalhes: originalRow ? `Alterado de: ${JSON.stringify(originalRow)}` : 'Novo movimento',
        DataAlteração: new Date().toLocaleString('pt-BR'),
      },
    ]);
  };

  function handleFilter() {
    let filtered = data;
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(row => row['Histórico'].includes(selectedPlan));
    }
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      filtered = filtered.filter(row => {
        const [day, mon, yr] = row['Data Lançamento'].split('/');
        return yr === year && mon === month;
      });
    }
    setFilteredData(filtered);
  }

  const calculateTotals = () => {
    const gastos = filteredData
      .filter(row => row['Valor'] < 0)
      .reduce((sum, row) => sum + Math.abs(row['Valor']), 0)
      .toFixed(2);
    const faturamento = filteredData
      .filter(row => row['Valor'] > 0)
      .reduce((sum, row) => sum + row['Valor'], 0)
      .toFixed(2);
    const saldo = filteredData.length > 0 ? filteredData[filteredData.length - 1]['Saldo'].toFixed(2) : 0;
    return { gastos, faturamento, saldo };
  };

  const handleEdit = (row, index) => {
    setCurrentRow({ ...row, index });
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    const updatedData = [...data];
    const originalRow = { ...updatedData[currentRow.index] };
    updatedData[currentRow.index] = { ...currentRow };
    setData(updatedData);
    setFilteredData(updatedData);
    trackChange('Editado', currentRow, originalRow);
    setShowEditModal(false);
    handleFilter();
  };

  const handleAddSubmit = () => {
    // Validações básicas
    if (!newRow['Data Lançamento'] || !newRow.Descrição || !newRow.Valor || !newRow.Categoria || !newRow.Conta || !newRow.CentroCusto) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Criar nova transação com todos os campos do plano de contas
    const newTransaction = {
      ...newRow,
      Saldo: data.length > 0 ? (parseFloat(data[data.length - 1].Saldo) + newRow.Valor).toFixed(2) : newRow.Valor,
      Histórico: newRow.Conta || newRow.Histórico, // Usar conta como histórico se não preenchido
      // Garantir que campos essenciais estão preenchidos
      Tipo: newRow.Tipo || (newRow.Valor >= 0 ? 'Receita' : 'Despesa'),
      Status: newRow.Status || 'Confirmada',
      FormaPagamento: newRow.FormaPagamento || 'PIX',
      Origem: 'Sistema'
    };

    const updatedData = [...data, newTransaction];
    setData(updatedData);
    setFilteredData(updatedData);
    trackChange('Adicionado', newTransaction);
    setShowAddModal(false);
    
    // Reset do formulário
    setNewRow({
      'Data Lançamento': '',
      Histórico: '',
      Descrição: '',
      Valor: 0,
      Saldo: 0,
      Origem: 'Banco',
      Categoria: '',
      Subcategoria: '',
      Conta: '',
      CentroCusto: '',
      Tipo: 'Receita',
      Status: 'Confirmada',
      Cliente: '',
      Fornecedor: '',
      FormaPagamento: 'PIX',
      NumeroDocumento: '',
      Observacoes: ''
    });
    
    handleFilter();
  };

  function exportToCSV() {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, 'relatorio_conciliacao.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = 'relatorio_conciliacao.csv';
      link.click();
    }
  }

  // Funções para manipular documentos
  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewDocument({ ...newDocument, file });
    }
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    if (!newDocument.file || !newDocument.description || !newDocument.value || !newDocument.date) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const documentToAdd = {
      id: Date.now(),
      ...newDocument,
      fileName: newDocument.file.name,
      fileSize: (newDocument.file.size / 1024).toFixed(2) + ' KB',
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      status: 'processed'
    };

    // Adicionar documento à lista
    setUploadedDocuments(prev => [...prev, documentToAdd]);

    // Criar transação automática baseada no documento
    const newTransaction = {
      'Data Lançamento': newDocument.date,
      Histórico: newDocument.category || newDocument.type,
      Descrição: `${newDocument.description} (Doc: ${newDocument.file.name})`,
      Valor: newDocument.type === 'nota_fiscal' && newDocument.category !== 'receita' ? -Math.abs(newDocument.value) : newDocument.value,
      Saldo: data.length > 0 ? (parseFloat(data[data.length - 1].Saldo) + newDocument.value).toFixed(2) : newDocument.value,
      Origem: 'Documento'
    };

    // Adicionar à base de dados
    const updatedData = [...data, newTransaction];
    setData(updatedData);
    setFilteredData(updatedData);
    trackChange('Documento Processado', newTransaction);

    // Limpar formulário
    setNewDocument({
      type: 'nota_fiscal',
      description: '',
      value: 0,
      date: '',
      category: '',
      file: null
    });
    
    setShowDocumentModal(false);
    alert('Documento processado com sucesso!');
  };

  const deleteDocument = (documentId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleCloseDocumentModal = () => {
    setNewDocument({
      type: 'nota_fiscal',
      description: '',
      value: 0,
      date: '',
      category: '',
      file: null
    });
    setShowDocumentModal(false);
  };

  // Funções para gerenciar bancos
  const handleBankSubmit = (e) => {
    e.preventDefault();
    
    if (!newBank.name || !newBank.code || !newBank.agency || !newBank.account) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const bankToAdd = {
      id: Date.now(),
      ...newBank,
      balance: parseFloat(newBank.balance) || 0
    };

    setBanks(prev => [...prev, bankToAdd]);
    
    // Reset form
    setNewBank({
      name: '',
      code: '',
      agency: '',
      account: '',
      balance: 0,
      active: true
    });
    
    setShowBankModal(false);
    alert('Banco cadastrado com sucesso!');
  };

  const deleteBank = (bankId) => {
    if (confirm('Tem certeza que deseja excluir este banco?')) {
      setBanks(prev => prev.filter(bank => bank.id !== bankId));
    }
  };

  const toggleBankStatus = (bankId) => {
    setBanks(prev => prev.map(bank => 
      bank.id === bankId ? { ...bank, active: !bank.active } : bank
    ));
  };

  const chartData = filteredData.map(row => ({
    date: row['Data Lançamento'],
    saldo: row.Saldo,
    valor: row.Valor,
  }));

  // Preparar dados para gráfico de despesas por categoria
  const getExpensesByCategory = () => {
    const expenses = filteredData.filter(row => row.Valor < 0);
    const categoryMap = {};
    
    expenses.forEach(row => {
      const category = row.Histórico;
      if (categoryMap[category]) {
        categoryMap[category] += Math.abs(row.Valor);
      } else {
        categoryMap[category] = Math.abs(row.Valor);
      }
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      percentage: ((value / parseFloat(calculateTotals().gastos)) * 100).toFixed(1)
    }));
  };

  // Preparar dados para gráfico de receitas por categoria
  const getIncomeByCategory = () => {
    const income = filteredData.filter(row => row.Valor > 0);
    const categoryMap = {};
    
    income.forEach(row => {
      const category = row.Histórico;
      if (categoryMap[category]) {
        categoryMap[category] += row.Valor;
      } else {
        categoryMap[category] = row.Valor;
      }
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  // Preparar dados para evolução mensal
  const getMonthlyEvolution = () => {
    const monthlyData = {};
    
    filteredData.forEach(row => {
      const [day, month, year] = row['Data Lançamento'].split('/');
      const monthKey = `${month}/${year}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { receitas: 0, despesas: 0, saldo: 0 };
      }
      
      if (row.Valor > 0) {
        monthlyData[monthKey].receitas += row.Valor;
      } else {
        monthlyData[monthKey].despesas += Math.abs(row.Valor);
      }
      monthlyData[monthKey].saldo = row.Saldo;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      receitas: data.receitas,
      despesas: data.despesas,
      saldo: data.saldo
    }));
  };

  // Cores para os gráficos
  const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#EC4899', '#14B8A6'];

  // Dados dos gráficos
  const expensesData = getExpensesByCategory();
  const incomeData = getIncomeByCategory();
  const monthlyData = getMonthlyEvolution();

  // Componentes de Polimento Visual
  
  // Componente Toast
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg animate-notification cursor-pointer
            transition-all duration-300 hover:scale-105
            ${toast.type === 'success' ? 'bg-success text-white' : ''}
            ${toast.type === 'error' ? 'bg-error text-white' : ''}
            ${toast.type === 'warning' ? 'bg-warning text-white' : ''}
            ${toast.type === 'info' ? 'bg-info text-white' : ''}
            ${darkMode ? 'dark:shadow-dark-border' : ''}
          `}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {toast.type === 'success' && <Icons.Check size={16} />}
              {toast.type === 'error' && <Icons.Warning size={16} />}
              {toast.type === 'warning' && <Icons.Warning size={16} />}
              {toast.type === 'info' && <Icons.Document size={16} />}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente Skeleton Loading
  const SkeletonCard = () => (
    <div className={`p-6 rounded-lg border animate-pulse ${darkMode ? 'bg-dark-surface border-dark-border' : 'bg-white border-gray-200'}`}>
      <div className="space-y-3">
        <div className={`h-4 rounded ${darkMode ? 'bg-dark-border' : 'bg-gray-200'}`}></div>
        <div className={`h-8 rounded ${darkMode ? 'bg-dark-border' : 'bg-gray-200'}`}></div>
        <div className={`h-4 w-2/3 rounded ${darkMode ? 'bg-dark-border' : 'bg-gray-200'}`}></div>
      </div>
    </div>
  );

  // Componente Loading Spinner
  const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    
    return (
      <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
        </svg>
      </div>
    );
  };

  // Wrapper com loading state
  const LoadingWrapper = ({ loading, children, skeleton = false }) => {
    if (loading) {
      return skeleton ? <SkeletonCard /> : (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" className="text-primary-teal" />
        </div>
      );
    }
    return children;
  };

  // Landing Page Component
  const LandingPage = () => {
    const [scrollY, setScrollY] = React.useState(0);
    const [isVisible, setIsVisible] = React.useState({});

    React.useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting
            }));
          });
        },
        { threshold: 0.1 }
      );

      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, []);

    return (
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-inter">
        {/* Navigation */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg' : 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3 transform transition-transform duration-300 hover:scale-105">
                <img 
                  src="Images/LogoSul.jpeg" 
                  alt="Logo" 
                  className="h-8 w-auto object-contain rounded transition-transform duration-300 hover:rotate-3"
                />
                <span className="text-xl font-bold text-primary-teal">Sistema Financeiro</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#features" className="text-gray-700 hover:text-primary-teal transition-colors font-medium hidden sm:block">Recursos</a>
                <a href="#benefits" className="text-gray-700 hover:text-primary-teal transition-colors font-medium hidden sm:block">Benefícios</a>
                <a href="#pricing" className="text-gray-700 hover:text-primary-teal transition-colors font-medium hidden sm:block">Planos</a>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2 text-gray-700 hover:text-primary-teal transition-all duration-300 font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10">Entrar</span>
                  <div className="absolute inset-0 bg-primary-teal/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
                >
                  Começar Grátis
                </button>
              </div>
            </div>
          </div>
        </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-teal/10 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-gold/10 rounded-full blur-xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary-teal/5 rounded-full blur-lg animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left" data-animate id="hero-text">
              <div className={`transition-all duration-1000 transform ${isVisible['hero-text'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                  <span className="inline-block transform transition-transform duration-500 hover:scale-105">Gestão</span>
                  <span className="block text-primary-teal transform transition-all duration-700 hover:text-primary-teal/80">Financeira</span>
                  <span className="block text-accent-gold transform transition-all duration-900 hover:text-accent-gold/80">Inteligente</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed transform transition-all duration-1000 delay-200">
                  Transforme o controle financeiro da sua empresa com nossa plataforma moderna. 
                  Dashboard em tempo real, relatórios precisos e total controle dos seus recursos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transform transition-all duration-1000 delay-300">
                  <button 
                    onClick={() => setCurrentPage('register')}
                    className="px-8 py-4 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-bold text-lg shadow-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">Começar Agora</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-accent-gold opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                  <button 
                    onClick={() => setCurrentPage('login')}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-teal hover:text-primary-teal transition-all duration-300 transform hover:scale-105 font-bold text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">Fazer Login</span>
                    <div className="absolute inset-0 bg-primary-teal/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-8 mt-12 text-center transform transition-all duration-1000 delay-500">
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-primary-teal mb-1 transform transition-all duration-300 group-hover:scale-110">100%</div>
                    <div className="text-sm text-gray-600 font-medium">Seguro</div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-primary-teal mb-1 transform transition-all duration-300 group-hover:scale-110">24/7</div>
                    <div className="text-sm text-gray-600 font-medium">Disponível</div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-primary-teal mb-1 transform transition-all duration-300 group-hover:scale-110">2024</div>
                    <div className="text-sm text-gray-600 font-medium">Lançamento</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative" data-animate id="hero-dashboard">
              <div className={`transition-all duration-1000 delay-300 transform ${isVisible['hero-dashboard'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 transform transition-all duration-500 hover:shadow-3xl hover:scale-105 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/5 to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-100 transform transition-all duration-300 hover:bg-primary-teal/5 hover:border-primary-teal/20">
                      <span className="text-gray-600 font-medium">Receitas este mês</span>
                      <span className="text-primary-teal font-bold text-xl">R$ 125.400</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-100 transform transition-all duration-300 hover:bg-red-50 hover:border-red-200">
                      <span className="text-gray-600 font-medium">Despesas este mês</span>
                      <span className="text-red-500 font-bold text-xl">R$ 89.200</span>
                    </div>
                    <div className="flex items-center justify-between bg-primary-teal/5 rounded-lg p-4 border border-primary-teal/20 transform transition-all duration-300 hover:bg-primary-teal/10">
                      <span className="text-gray-600 font-medium">Lucro líquido</span>
                      <span className="text-primary-teal font-bold text-xl">R$ 36.200</span>
                    </div>
                    <div className="mt-6 p-4 bg-accent-gold/10 rounded-lg border border-accent-gold/20 transform transition-all duration-300 hover:bg-accent-gold/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-accent-gold rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700">Meta mensal: 87% atingida</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-accent-gold h-2 rounded-full transition-all duration-1000 ease-out" style={{width: isVisible['hero-dashboard'] ? '87%' : '0%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-teal/10 rounded-full blur-xl animate-pulse-soft"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-gold/10 rounded-full blur-xl animate-pulse-soft" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" data-animate id="features">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Recursos <span className="text-primary-teal">Poderosos</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para uma gestão financeira profissional e eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-primary-teal/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.1s'}}>
              <div className="w-14 h-14 bg-primary-teal/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-teal/20 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-7 h-7 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-teal transition-colors duration-300">Dashboard Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize todas as informações financeiras em tempo real com gráficos interativos e métricas importantes.
              </p>
            </div>

            <div className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-accent-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.2s'}}>
              <div className="w-14 h-14 bg-accent-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-accent-gold transition-colors duration-300">Gestão de Transações</h3>
              <p className="text-gray-600 leading-relaxed">
                Controle completo de receitas e despesas com categorização automática e histórico detalhado.
              </p>
            </div>

            <div className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-primary-teal/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.3s'}}>
              <div className="w-14 h-14 bg-primary-teal/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-teal/20 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-7 h-7 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-teal transition-colors duration-300">Metas e Orçamentos</h3>
              <p className="text-gray-600 leading-relaxed">
                Defina metas financeiras e monitore o progresso com alertas inteligentes e acompanhamento automático.
              </p>
            </div>

            <div className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-accent-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.4s'}}>
              <div className="w-14 h-14 bg-accent-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-accent-gold transition-colors duration-300">Relatórios Avançados</h3>
              <p className="text-gray-600 leading-relaxed">
                Gere relatórios detalhados e personalizados para análises financeiras profissionais e tomada de decisões.
              </p>
            </div>

            <div className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-primary-teal/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.5s'}}>
              <div className="w-14 h-14 bg-primary-teal/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-teal/20 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-7 h-7 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-teal transition-colors duration-300">Gestão de Contas</h3>
              <p className="text-gray-600 leading-relaxed">
                Gerencie múltiplas contas bancárias, cartões e investimentos em uma única plataforma integrada.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200 hover:border-primary-teal/50 transition-all hover:shadow-lg group">
              <div className="w-14 h-14 bg-accent-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent-gold/20 transition-colors">
                <svg className="w-7 h-7 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Segurança Total</h3>
              <p className="text-gray-600 leading-relaxed">
                Seus dados protegidos com criptografia avançada, backups automáticos e controle de acesso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" data-animate id="benefits">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 transform ${isVisible['benefits'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900">
                Por que escolher nosso <span className="text-primary-teal">Sistema</span>?
              </h2>
              <div className="space-y-8">
                <div className={`flex items-start space-x-4 transition-all duration-700 transform ${isVisible['benefits'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '0.2s'}}>
                  <div className="w-8 h-8 bg-primary-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transform transition-transform duration-300 hover:scale-110 hover:bg-primary-teal/30">
                    <svg className="w-4 h-4 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-primary-teal transition-colors duration-300">Interface Intuitiva</h3>
                    <p className="text-gray-600 leading-relaxed">Design limpo e moderno, focado na experiência do usuário sem complicações desnecessárias.</p>
                  </div>
                </div>
                <div className={`flex items-start space-x-4 transition-all duration-700 transform ${isVisible['benefits'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '0.4s'}}>
                  <div className="w-8 h-8 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transform transition-transform duration-300 hover:scale-110 hover:bg-accent-gold/30">
                    <svg className="w-4 h-4 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-accent-gold transition-colors duration-300">Dados em Tempo Real</h3>
                    <p className="text-gray-600 leading-relaxed">Atualizações instantâneas e sincronização automática de todas as informações financeiras.</p>
                  </div>
                </div>
                <div className={`flex items-start space-x-4 transition-all duration-700 transform ${isVisible['benefits'] ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} style={{transitionDelay: '0.6s'}}>
                  <div className="w-8 h-8 bg-primary-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transform transition-transform duration-300 hover:scale-110 hover:bg-primary-teal/30">
                    <svg className="w-4 h-4 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 hover:text-primary-teal transition-colors duration-300">Suporte Especializado</h3>
                    <p className="text-gray-600 leading-relaxed">Equipe técnica dedicada pronta para ajudar quando você mais precisar.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`relative transition-all duration-1000 transform ${isVisible['benefits'] ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{transitionDelay: '0.3s'}}>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="bg-primary-teal/5 rounded-lg p-6 border border-primary-teal/20 transform transition-all duration-300 hover:bg-primary-teal/10 hover:scale-105">
                    <div className="text-4xl font-bold text-primary-teal mb-2">99.9%</div>
                    <div className="text-sm text-gray-600 font-medium">Disponibilidade</div>
                  </div>
                  <div className="bg-accent-gold/5 rounded-lg p-6 border border-accent-gold/20 transform transition-all duration-300 hover:bg-accent-gold/10 hover:scale-105">
                    <div className="text-4xl font-bold text-accent-gold mb-2">24/7</div>
                    <div className="text-sm text-gray-600 font-medium">Suporte</div>
                  </div>
                  <div className="bg-primary-teal/5 rounded-lg p-6 border border-primary-teal/20">
                    <div className="text-4xl font-bold text-primary-teal mb-2">Novo</div>
                    <div className="text-sm text-gray-600 font-medium">Tecnologia</div>
                  </div>
                  <div className="bg-accent-gold/5 rounded-lg p-6 border border-accent-gold/20">
                    <div className="text-4xl font-bold text-accent-gold mb-2">100%</div>
                    <div className="text-sm text-gray-600 font-medium">Moderno</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-teal/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-accent-gold/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white" data-animate id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Escolha o <span className="text-primary-teal">Plano Ideal</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planos flexíveis para empresas de todos os tamanhos. Comece grátis e escale conforme sua necessidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plano Básico */}
            <div className={`bg-white rounded-2xl p-8 border border-gray-200 hover:border-primary-teal/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                  <p className="text-gray-600 mb-6">Para pequenas empresas</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">R$ 49,99</span>
                    <span className="text-gray-600 ml-2">/ mês</span>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('register')}
                    className="w-full px-6 py-3 border-2 border-primary-teal text-primary-teal rounded-lg hover:bg-primary-teal hover:text-white transition-all duration-300 font-bold"
                  >
                    Começar Agora
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Dashboard básico</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Até 100 transações/mês</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">1 usuário</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Suporte por email</span>
                  </div>
                  <div className="flex items-center opacity-60">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500 line-through">Relatórios avançados</span>
                  </div>
                  <div className="flex items-center opacity-60">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500 line-through">Integrações API</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano Pro */}
            <div className={`bg-white rounded-2xl p-8 border-2 border-primary-teal hover:border-primary-teal transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/5 to-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                  <p className="text-gray-600 mb-6">Para empresas em crescimento</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary-teal">R$ 149,00</span>
                    <span className="text-gray-600 ml-2">/ mês</span>
                  </div>
                  <button 
                    onClick={() => setCurrentPage('register')}
                    className="w-full px-6 py-3 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                  >
                    Começar Teste Grátis
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Dashboard completo</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Transações ilimitadas</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Até 5 usuários</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Relatórios avançados</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Suporte prioritário</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary-teal mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Integrações API</span>
                  </div>
                  <div className="flex items-center opacity-60">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500 line-through">Dashboard personalizado</span>
                  </div>
                  <div className="flex items-center opacity-60">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500 line-through">Gerente dedicado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano Enterprise */}
            <div className={`bg-white rounded-2xl p-8 border border-gray-200 hover:border-accent-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: '0.3s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <p className="text-gray-600 mb-6">Para grandes empresas</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">R$ 299</span>
                    <span className="text-gray-600 ml-2">/ mês</span>
                  </div>
                  <button 
                    onClick={() => window.open('https://wa.me/5548992250653', '_blank')}
                    className="w-full px-6 py-3 bg-accent-gold text-white rounded-lg hover:bg-accent-gold/90 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                  >
                    Falar com Vendas
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Dashboard personalizado</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Recursos ilimitados</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Usuários ilimitados</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">BI e Analytics avançado</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Gerente dedicado</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-accent-gold mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">SLA garantido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Garantia e informações extras */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-500 transform ${isVisible['pricing'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-primary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-teal/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Garantia 30 dias</h4>
                  <p className="text-gray-600 text-sm">Não ficou satisfeito? Devolvemos seu dinheiro</p>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-gold/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Setup Rápido</h4>
                  <p className="text-gray-600 text-sm">Configure sua conta em menos de 5 minutos</p>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-primary-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-teal/20 transition-colors duration-300">
                    <svg className="w-8 h-8 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Suporte Especializado</h4>
                  <p className="text-gray-600 text-sm">Equipe técnica pronta para ajudar você</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-teal/5 to-accent-gold/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Pronto para <span className="text-primary-teal">transformar</span> suas finanças?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Seja um dos primeiros a experimentar nossa plataforma inovadora de gestão financeira
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('register')}
              className="px-8 py-4 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
            >
              Começar Gratuitamente
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-teal hover:text-primary-teal transition-all font-bold text-lg"
            >
              Já sou cliente
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Configuração Rápida</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Suporte Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="Images/LogoSul.jpeg" 
                  alt="Logo" 
                  className="h-8 w-auto object-contain rounded"
                />
                <span className="text-xl font-bold text-primary-teal">Sistema Financeiro</span>
              </div>
              <p className="text-gray-600 max-w-md leading-relaxed mb-4">
                Sistema de gestão financeira desenvolvido pela Nuxter Soluções. 
                Controle, analise e cresça com segurança.
              </p>
              <div className="text-sm text-gray-500">
                Desenvolvido por <a href="https://nuxter.com.br/" target="_blank" rel="noopener noreferrer" className="text-primary-teal hover:text-primary-teal/80 font-medium">Nuxter Soluções</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-primary-teal transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-primary-teal transition-colors">Relatórios</a></li>
                <li><a href="#" className="hover:text-primary-teal transition-colors">Integração</a></li>
                <li><a href="#" className="hover:text-primary-teal transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="https://wa.me/5548992250653" target="_blank" rel="noopener noreferrer" className="hover:text-primary-teal transition-colors">WhatsApp</a></li>
                <li><a href="mailto:suporte@nuxter.com.br" className="hover:text-primary-teal transition-colors">E-mail Suporte</a></li>
                <li><a href="https://nuxter.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-teal transition-colors">Site Oficial</a></li>
                <li><a href="#" className="hover:text-primary-teal transition-colors">Documentação</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 Nuxter Soluções. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="https://www.instagram.com/_nuxtersolucoes" target="_blank" rel="noopener noreferrer" className="hover:text-primary-teal transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/nuxter-soluções-ltda" target="_blank" rel="noopener noreferrer" className="hover:text-primary-teal transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://wa.me/5548992250653" target="_blank" rel="noopener noreferrer" className="hover:text-primary-teal transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/5548992250653" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 group"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
        </svg>
        <div className="absolute -top-2 -left-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Suporte
        </div>
      </a>
    </div>
  );
  };

  // Registration Page Component
  const RegisterPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-teal/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <button 
              onClick={() => setCurrentPage('landing')}
              className="mb-6 text-gray-700 hover:text-gray-900 transition-colors flex items-center text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <div className="flex justify-center mb-4">
              <img 
                src="Images/LogoSul.jpeg" 
                alt="Logo" 
                className="h-12 w-auto object-contain rounded"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h2>
            <p className="text-gray-600">Comece sua jornada financeira conosco</p>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                placeholder="Nome da sua empresa"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                placeholder="Sua senha"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent transition-colors"
                placeholder="Confirme sua senha"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-primary-teal bg-gray-50 border-gray-300 rounded focus:ring-primary-teal focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Aceito os <a href="#" className="text-primary-teal hover:text-primary-teal/80 font-medium">termos de uso</a> e <a href="#" className="text-primary-teal hover:text-primary-teal/80 font-medium">política de privacidade</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-colors font-bold shadow-lg"
            >
              Criar Conta
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-primary-teal hover:text-primary-teal/80 transition-colors font-medium"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <ToastContainer />
      
      {/* Conditional rendering based on current page */}
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'register' && <RegisterPage />}
      
      {currentPage === 'login' && !isLoggedIn && (
        <div className="min-h-screen login-container flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-black/10 login-background-pattern">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-teal/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Lado esquerdo - Branding */}
              <div className="text-center lg:text-left space-y-6 fade-in-up">
                {/* Botão Voltar */}
                <div className="flex justify-center lg:justify-start">
                  <button 
                    onClick={() => setCurrentPage('landing')}
                    className="mb-4 text-white hover:text-gray-200 transition-colors flex items-center text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                  </button>
                </div>
                
                {/* Logo */}
                <div className="flex justify-center lg:justify-start mb-8">
                  <div className="logo-container">
                    <img 
                      src="Images/LogoSul.jpeg" 
                      alt="Logo" 
                      className="h-20 w-auto object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Sistema
                    <span className="block text-accent-gold">Financeiro</span>
                  </h1>
                  <p className="text-xl text-white/80 font-light max-w-lg">
                    Gestão financeira completa e inteligente para sua empresa crescer com segurança
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">100%</div>
                    <div className="text-sm text-white/70">Seguro</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-gold">24/7</div>
                    <div className="text-sm text-white/70">Disponível</div>
                  </div>
                </div>
              </div>

              {/* Lado direito - Login */}
              <div className="flex justify-center lg:justify-end fade-in-up">
                <div className="login-glass p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-dark-gray mb-2">Fazer Login</h2>
                    <p className="text-gray-600">Acesse sua conta para continuar</p>
                  </div>

                  <div className="space-y-6">
                    {/* Campo usuário */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Usuário ou E-mail
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Digite seu usuário ou e-mail"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          className="w-full p-4 pl-12 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent login-input-focus"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Campo senha */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full p-4 pl-12 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent login-input-focus"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>

                    {/* Lembrar e esqueci senha */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-teal focus:ring-primary-teal" />
                        <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
                      </label>
                      <a href="#" className="text-sm text-primary-teal hover:text-teal-700 transition-colors">
                        Esqueci minha senha
                      </a>
                    </div>

                    {/* Botão entrar */}
                    <button
                      onClick={handleLogin}
                      className="w-full p-4 bg-primary-teal text-white font-semibold rounded-lg login-button-hover login-main-button focus:outline-none focus:ring-2 focus:ring-primary-teal focus:ring-offset-2"
                    >
                      Entrar no Sistema
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou continue com</span>
                      </div>
                    </div>

                    {/* Login social */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="social-button flex items-center justify-center px-4 py-3 rounded-lg hover:bg-gray-50">
                        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="ml-2 text-sm">Google</span>
                      </button>
                      <button className="social-button flex items-center justify-center px-4 py-3 rounded-lg hover:bg-gray-50">
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="ml-2 text-sm">Facebook</span>
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      Não tem uma conta? 
                      <a href="#" className="text-primary-teal hover:text-teal-700 font-medium ml-1">
                        Solicitar acesso
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features footer */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center fade-in-up">
              <div className="flex items-center justify-center space-x-3 text-white/80">
                <svg className="h-6 w-6 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Dados Protegidos</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/80">
                <svg className="h-6 w-6 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Acesso Rápido</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/80">
                <svg className="h-6 w-6 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoggedIn && (
        <div className={`min-h-screen font-inter transition-colors duration-300 ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-neutral-gray'}`}>
          {/* Botão Hambúrguer */}
          <button 
            className={`hamburger-btn ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <div className="hamburger-lines">
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </div>
          </button>

          {/* Overlay para fechar sidebar */}
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="flex">
            {/* Sidebar */}
            <aside className={`sidebar-minimal ${sidebarOpen ? 'open' : ''}`}>
              {/* Campo de pesquisa - fixo no topo */}
              <div className="w-full px-4 mb-6 flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={sidebarSearch}
                    onChange={e => setSidebarSearch(e.target.value)}
                    placeholder="Pesquisar..."
                    className="search-iphone"
                  />
                  <span className="search-iphone-icon">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#2C7A7B" strokeWidth="2"/><path stroke="#2C7A7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
                  </span>
                </div>
              </div>
              
              {/* Menu de navegação - área rolável */}
              <nav className="space-y-2 w-full px-4 overflow-y-auto custom-scrollbar" style={{flex: '1 1 auto'}}>
                {filteredSidebarOptions.length === 0 ? (
                  <span className="block text-gray-400 py-2">Nenhuma opção encontrada</span>
                ) : (
                  filteredSidebarOptions.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => {
                        opt.action();
                        setSidebarOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                      <span>{opt.label}</span>
                    </button>
                  ))
                )}
              </nav>

              {/* Botão Sair fixo no final - sempre visível */}
              <div className="border-t border-gray-200 pt-4 pb-6 px-4 w-full flex-shrink-0" style={{marginTop: 'auto'}}>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-3 text-gray-400 hover:text-red-600"
                >
                  <span className="flex-shrink-0">
                    <Icons.Logout size={16} />
                  </span>
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            </aside>

            {/* Main content */}
            <main className="w-full p-8">
              {/* Barra superior com ações do usuário */}
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-semibold ml-16 ${darkMode ? 'text-dark-text' : 'text-dark-gray'}`}>
                  {currentView === 'dashboard' ? 'Business Overview' : 
                   currentView === 'documents' ? 'Gestão de Documentos' :
                   currentView === 'reports' ? 'Central de Relatórios' :
                   currentView === 'metas' ? 'Metas e Orçamentos' :
                   currentView === 'goals' ? 'Metas e Orçamentos' :
                   currentView === 'banks' ? 'Gestão de Bancos' :
                   currentView === 'faturas' ? 'Sistema de Faturas' :
                   currentView === 'contatos' ? 'Gestão de Relacionamentos' : 'Financeiro'}
                </h2>
                
                {/* Barra de Busca Global */}
                <div className="search-container relative flex-1 max-w-md mx-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Buscar transações, contatos, faturas..."
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors ${
                        darkMode 
                          ? 'bg-dark-surface border-dark-border text-dark-text placeholder-dark-text-secondary' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400 hover:text-gray-600">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Resultados da busca */}
                  {showSearchResults && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      {/* Filtros */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex space-x-2">
                          {[
                            { id: 'all', label: 'Todos' },
                            { id: 'transactions', label: 'Transações' },
                            { id: 'contacts', label: 'Contatos' },
                            { id: 'invoices', label: 'Faturas' }
                          ].map((filter) => (
                            <button
                              key={filter.id}
                              onClick={() => setSearchFilter(filter.id)}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                searchFilter === filter.id
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Lista de resultados */}
                      <div className="max-h-64 overflow-y-auto">
                        {(() => {
                          const results = performSearch(searchQuery, searchFilter);
                          if (results.length === 0) {
                            return (
                              <div className="p-4 text-center text-gray-500">
                                <Icons.Search size={24} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">Nenhum resultado encontrado</p>
                                <p className="text-xs text-gray-400 mt-1">Tente usar palavras-chave diferentes</p>
                              </div>
                            );
                          }
                          
                          return results.map((item) => {
                            const IconComponent = getSearchIcon(item.type);
                            return (
                              <div key={`${item.type}-${item.id}`} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0">
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-lg ${getSearchItemColor(item.type)}`}>
                                    {typeof IconComponent === 'string' ? (
                                      <span className="text-sm">{IconComponent}</span>
                                    ) : (
                                      <IconComponent size={14} />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.title}
                                      </p>
                                      {item.amount && (
                                        <span className="text-sm font-semibold text-gray-700 ml-2 flex-shrink-0">
                                          {item.amount}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-500">
                                        {item.category || item.phone || item.status}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        {item.date || item.dueDate || item.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      
                      {/* Footer */}
                      {performSearch(searchQuery, searchFilter).length > 0 && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Ver todos os resultados ({performSearch(searchQuery, searchFilter).length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Ações do usuário no canto direito */}
                <div className="flex items-center space-x-4">
                  {/* Modo Escuro Toggle */}
                  <button 
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title={darkMode ? 'Modo claro' : 'Modo escuro'}
                  >
                    {darkMode ? (
                      <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Configurações - minimalista */}
                  <button 
                    onClick={toggleSettings}
                    className="settings-button p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  {/* Notificações - minimalista */}
                  <button 
                    onClick={toggleNotifications}
                    className="notifications-button relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                    {/* Badge pequeno e discreto */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Separador sutil */}
                  <div className="h-6 w-px bg-gray-200"></div>

                  {/* Avatar e nome */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{username || 'Usuário'}</span>
                  </div>
                </div>
              </div>
              
              {/* Painel de Notificações */}
              {showNotifications && (
                <div className="relative mb-6">
                  <div className="notifications-panel absolute right-0 top-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header do painel */}
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Lista de notificações */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="mb-2">
                            <Icons.Check size={24} className="mx-auto text-gray-400" />
                          </div>
                          <p>Nenhuma notificação pendente</p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const IconComponent = getNotificationIcon(notification.icon);
                          return (
                            <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  <IconComponent size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                      {formatNotificationDate(notification.date)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {notification.description}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {notification.amount}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      notification.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {notification.priority === 'high' ? 'Urgente' :
                                       notification.priority === 'medium' ? 'Médio' : 'Baixo'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    
                    {/* Footer com ações */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                            Marcar todas como lidas
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-800">
                            Ver todas
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Painel de Configurações */}
              {showSettings && (
                <div className="relative mb-6">
                  <div className={`settings-panel absolute right-0 top-0 w-80 rounded-lg shadow-xl border z-50 ${
                    darkMode ? 'bg-dark-surface border-dark-border' : 'bg-white border-gray-200'
                  }`}>
                    {/* Header do painel */}
                    <div className={`px-4 py-3 border-b flex justify-between items-center ${
                      darkMode ? 'border-dark-border' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>Configurações</h3>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className={`hover:scale-110 transition-transform ${darkMode ? 'text-dark-text-secondary hover:text-dark-text' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Conteúdo das configurações */}
                    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                      {/* Perfil */}
                      <div className={`border-b pb-4 ${darkMode ? 'border-dark-border' : 'border-gray-100'}`}>
                        <h4 className={`font-medium mb-3 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Perfil
                        </h4>
                        <div className={`space-y-2 text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          <div className="flex justify-between">
                            <span>Nome:</span>
                            <span className={`font-medium ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>{username || 'Não definido'}</span>
                          </div>
                          <button 
                            className="text-blue-500 hover:text-blue-600 text-sm transition-colors"
                            onClick={() => showToast('Funcionalidade em breve', 'info')}
                          >
                            Editar perfil
                          </button>
                        </div>
                      </div>

                      {/* Aparência e Temas */}
                      <div className={`border-b pb-4 ${darkMode ? 'border-dark-border' : 'border-gray-100'}`}>
                        <h4 className={`font-medium mb-3 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4.5 4.5 0 01-4.5-4.5V5a2 2 0 012-2h14a2 2 0 012 2v11.5a4.5 4.5 0 01-4.5 4.5h-5.5" />
                          </svg>
                          Aparência
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Modo escuro</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={darkMode}
                                onChange={toggleDarkMode}
                                className="sr-only peer" 
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-teal"></div>
                            </label>
                          </div>
                          
                          {/* Seleção de Temas */}
                          <div className="space-y-2">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Tema de cores</span>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'default', name: 'Padrão', primary: '#2C7A7B', accent: '#FBBF24' },
                                { id: 'blue', name: 'Azul', primary: '#2563EB', accent: '#3B82F6' },
                                { id: 'green', name: 'Verde', primary: '#059669', accent: '#10B981' },
                                { id: 'purple', name: 'Roxo', primary: '#7C3AED', accent: '#8B5CF6' },
                                { id: 'red', name: 'Vermelho', primary: '#DC2626', accent: '#EF4444' },
                                { id: 'orange', name: 'Laranja', primary: '#EA580C', accent: '#F97316' }
                              ].map(theme => (
                                <button
                                  key={theme.id}
                                  onClick={() => changeTheme(theme.id)}
                                  className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                    currentTheme === theme.id 
                                      ? 'border-primary-teal shadow-md' 
                                      : darkMode ? 'border-dark-border hover:border-dark-text-secondary' : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  title={theme.name}
                                >
                                  <div className="flex space-x-1">
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: theme.primary }}
                                    ></div>
                                    <div 
                                      className="w-3 h-3 rounded-full" 
                                      style={{ backgroundColor: theme.accent }}
                                    ></div>
                                  </div>
                                  <span className={`text-xs mt-1 block ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                    {theme.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notificações */}
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
                          </svg>
                          Notificações
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Vencimentos</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Recebimentos</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Financeiro */}
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Icons.Money size={16} />
                          Financeiro
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Moeda padrão</label>
                            <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                              <option>Real (R$)</option>
                              <option>Dólar (US$)</option>
                              <option>Euro (€)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Formato de data</label>
                            <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                              <option>DD/MM/AAAA</option>
                              <option>MM/DD/AAAA</option>
                              <option>AAAA-MM-DD</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Segurança */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Segurança
                        </h4>
                        <div className="space-y-2">
                          <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1">
                            Alterar senha
                          </button>
                          <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1">
                            Sessões ativas
                          </button>
                          <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1">
                            Backup de dados
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-between text-sm">
                        <button className="text-gray-600 hover:text-gray-800">
                          Exportar dados
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Conteúdo condicional baseado na view atual */}
              {currentView === 'dashboard' ? (
                /* Dashboard Content - Expandido com Múltiplos Gráficos */
                <div className="space-y-6">
                  {/* Controles do Dashboard */}
                  <div className={`rounded-lg shadow-md p-4 animate-slide-up ${darkMode ? 'bg-dark-surface' : 'bg-white'}`}>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      {/* Filtros de Período */}
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${darkMode ? 'text-dark-text' : 'text-gray-700'}`}>Período:</span>
                        <div className="flex space-x-1">
                          {[
                            { id: '7days', label: '7d' },
                            { id: '30days', label: '30d' },
                            { id: '90days', label: '90d' },
                            { id: '6months', label: '6m' },
                            { id: '1year', label: '1a' }
                          ].map((period) => (
                            <button
                              key={period.id}
                              onClick={() => {
                                setLoadingState('dashboard', true);
                                setTimeout(() => {
                                  handlePeriodChange(period.id);
                                  setLoadingState('dashboard', false);
                                  showToast(`Período ${getPeriodLabel(period.id)} selecionado`, 'info', 2000);
                                }, 500);
                              }}
                              className={`px-3 py-1 text-xs rounded-md transition-all duration-200 hover:scale-105 ${
                                dashboardPeriod === period.id
                                  ? 'bg-primary-teal text-white shadow-lg'
                                  : darkMode 
                                    ? 'bg-dark-border text-dark-text-secondary hover:bg-dark-text hover:text-dark-bg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {getLoadingState('dashboard') && dashboardPeriod === period.id ? (
                                <LoadingSpinner size="sm" className="text-current" />
                              ) : (
                                period.label
                              )}
                            </button>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {getPeriodLabel(dashboardPeriod)}
                        </span>
                      </div>

                      {/* Seletores de Gráfico */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Visualização:</span>
                        <select 
                          value={selectedChart || 'all'} 
                          onChange={(e) => setSelectedChart(e.target.value === 'all' ? null : e.target.value)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">Todos os Gráficos</option>
                          <option value="overview">Visão Geral</option>
                          <option value="cashflow">Fluxo de Caixa</option>
                          <option value="categories">Por Categoria</option>
                          <option value="trends">Tendências</option>
                          <option value="comparison">Comparação</option>
                        </select>
                        
                        <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span>Layout</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Widgets</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modal de Drill-down */}
                  {chartDrillData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">
                            Detalhamento - {chartDrillData.period}
                          </h3>
                          <button
                            onClick={closeDrillDown}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {chartDrillData.data.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm font-medium">{item.name}</span>
                              </div>
                              <span className="text-sm font-semibold">
                                {formatCurrencyValue(item.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={closeDrillDown}
                            className="px-4 py-2 bg-primary-teal text-white rounded-md hover:bg-teal-600 transition-colors"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Primeira linha - Cards principais com dados dinâmicos */}
                  <LoadingWrapper loading={getLoadingState('dashboard')} skeleton={true}>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Cash Flow Card */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className={`text-sm font-medium uppercase tracking-wide ${
                            darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                          }`}>SALDO ATUAL</h3>
                          <button className={`transition-colors ${
                            darkMode ? 'text-dark-text-secondary hover:text-dark-text' : 'text-gray-400 hover:text-gray-600'
                          }`}>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                          </button>
                        </div>
                        <div className="mb-4">
                          <p className={`text-3xl font-bold animate-bounce-in ${
                            darkMode ? 'text-dark-text' : 'text-gray-900'
                          }`}>{currentDashboardData.balance}</p>
                          <p className={`text-sm ${
                            darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                          }`}>Período: {getPeriodLabel(dashboardPeriod)}</p>
                        </div>
                        <div className="h-24 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentDashboardData.chartData}>
                              <Line 
                                type="monotone" 
                                dataKey="receita" 
                                stroke="#10B981" 
                                strokeWidth={2} 
                                dot={{fill: '#10B981', strokeWidth: 0, r: 2}} 
                              />
                              <Line 
                                type="monotone" 
                                dataKey="despesa" 
                                stroke="#EF4444" 
                                strokeWidth={2} 
                                dot={{fill: '#EF4444', strokeWidth: 0, r: 2}} 
                              />
                              <XAxis dataKey="name" hide />
                              <YAxis hide />
                              <Tooltip 
                                formatter={(value, name) => [
                                  formatCurrencyValue(value), 
                                  name === 'receita' ? 'Receita' : 'Despesa'
                                ]}
                                labelFormatter={(label) => `Período: ${label}`}
                                contentStyle={{
                                  backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                  border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  color: darkMode ? '#E2E8F0' : '#1A202C'
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className={`flex items-center text-xs ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                        }`}>
                          <div className="flex items-center mr-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            <span>Receitas</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                            <span>Despesas</span>
                          </div>
                        </div>
                      </div>

                    {/* Receitas Card - Clicável */}
                    <div className={`rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-up ${
                      darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                    }`} style={{ animationDelay: '0.1s' }}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-sm font-medium uppercase tracking-wide ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>RECEITAS</h3>
                        <Icons.Chart size={16} className={darkMode ? 'text-dark-text-secondary' : 'text-gray-400'} />
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-green-600 animate-bounce-in">{currentDashboardData.revenue}</p>
                        <p className="text-sm text-green-500">{currentDashboardData.growth} vs período anterior</p>
                      </div>
                      <div className="h-24 mb-4" onClick={() => currentDashboardData.chartData[0] && handleChartClick(currentDashboardData.chartData[0], 'revenue')}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={currentDashboardData.chartData}>
                            <Bar 
                              dataKey="receita" 
                              fill="#10B981"
                              radius={[4, 4, 0, 0]}
                              cursor="pointer"
                            />
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip 
                              formatter={(value) => [formatCurrencyValue(value), 'Receita']}
                              labelFormatter={(label) => `Período: ${label}`}
                              contentStyle={{
                                backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                borderRadius: '8px',
                                color: darkMode ? '#E2E8F0' : '#1A202C'
                              }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                        <span>Clique no gráfico para detalhes</span>
                      </div>
                    </div>

                    {/* Despesas Card - Clicável */}
                    <div className={`rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-up ${
                      darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                    }`} style={{ animationDelay: '0.2s' }}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-sm font-medium uppercase tracking-wide ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>DESPESAS</h3>
                        <Icons.Chart size={16} className={darkMode ? 'text-dark-text-secondary' : 'text-gray-400'} />
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-red-600 animate-bounce-in">{currentDashboardData.expenses}</p>
                        <p className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                          Período: {getPeriodLabel(dashboardPeriod)}
                        </p>
                      </div>
                      <div className="h-24 mb-4" onClick={() => currentDashboardData.chartData[0] && handleChartClick(currentDashboardData.chartData[0], 'expenses')}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={currentDashboardData.chartData}>
                            <Bar 
                              dataKey="despesa" 
                              fill="#EF4444"
                              radius={[4, 4, 0, 0]}
                              cursor="pointer"
                            />
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip 
                              formatter={(value) => [formatCurrencyValue(value), 'Despesa']}
                              labelFormatter={(label) => `Período: ${label}`}
                              contentStyle={{
                                backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                borderRadius: '8px',
                                color: darkMode ? '#E2E8F0' : '#1A202C'
                              }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                        <span>Clique no gráfico para detalhes</span>
                      </div>
                    </div>

                    {/* ROI e Performance Card */}
                    <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-up ${
                      darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                    }`} style={{ animationDelay: '0.3s' }}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-sm font-medium uppercase tracking-wide ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>PERFORMANCE</h3>
                        <Icons.Chart size={16} className={darkMode ? 'text-dark-text-secondary' : 'text-gray-400'} />
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-blue-600 animate-bounce-in">85.4%</p>
                        <p className="text-sm text-blue-500">+4.2% eficiência</p>
                      </div>
                      <div className="h-24 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Eficiência', value: 85.4, fill: '#3B82F6' },
                                { name: 'Pendente', value: 14.6, fill: darkMode ? '#4A5568' : '#E5E7EB' }
                              ]}
                              cx="50%" 
                              cy="50%" 
                              innerRadius={20}
                              outerRadius={35} 
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Percentual']}
                              contentStyle={{
                                backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                borderRadius: '8px',
                                color: darkMode ? '#E2E8F0' : '#1A202C'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                        <span>Meta: 90% eficiência</span>
                      </div>
                    </div>
                  </div>
                </LoadingWrapper>

                  {/* Segunda linha - Gráficos Principais Expandidos */}
                  <LoadingWrapper loading={getLoadingState('dashboard-charts')} skeleton={true}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Fluxo de Caixa Detalhado */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.4s' }}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-sm font-medium uppercase tracking-wide ${
                            darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                          }`}>FLUXO DE CAIXA DETALHADO</h3>
                          <div className="flex space-x-2">
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}>Entrada</button>
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}>Saída</button>
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}>Líquido</button>
                          </div>
                        </div>
                        <div className="h-64 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentDashboardData.chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4A5568' : '#E5E7EB'} />
                              <XAxis 
                                dataKey="name" 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <YAxis 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <Tooltip 
                                formatter={(value, name) => [
                                  formatCurrencyValue(value), 
                                  name === 'receita' ? 'Receitas' : name === 'despesa' ? 'Despesas' : 'Saldo Líquido'
                                ]}
                                contentStyle={{
                                  backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                  border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  color: darkMode ? '#E2E8F0' : '#1A202C'
                                }}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  color: darkMode ? '#E2E8F0' : '#374151',
                                  fontSize: '12px'
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="receita" 
                                stroke="#10B981" 
                                strokeWidth={3} 
                                name="Receitas"
                                dot={{fill: '#10B981', strokeWidth: 2, r: 4}}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="despesa" 
                                stroke="#EF4444" 
                                strokeWidth={3} 
                                name="Despesas"
                                dot={{fill: '#EF4444', strokeWidth: 2, r: 4}}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="saldo" 
                                stroke="#3B82F6" 
                                strokeWidth={2} 
                                strokeDasharray="5 5"
                                name="Saldo Líquido"
                                dot={{fill: '#3B82F6', strokeWidth: 2, r: 3}}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Análise por Categorias */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.5s' }}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-sm font-medium uppercase tracking-wide ${
                            darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                          }`}>DISTRIBUIÇÃO POR CATEGORIAS</h3>
                          <select className={`px-2 py-1 text-xs border rounded transition-colors ${
                            darkMode 
                              ? 'bg-dark-bg border-dark-border text-dark-text' 
                              : 'bg-white border-gray-300 text-gray-700'
                          }`}>
                            <option>Receitas</option>
                            <option>Despesas</option>
                            <option>Ambos</option>
                          </select>
                        </div>
                        <div className="h-64 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Vendas', value: 45, fill: '#10B981' },
                                  { name: 'Serviços', value: 30, fill: '#3B82F6' },
                                  { name: 'Consultorias', value: 15, fill: '#8B5CF6' },
                                  { name: 'Outros', value: 10, fill: '#F59E0B' }
                                ]}
                                cx="50%" 
                                cy="50%" 
                                outerRadius={80} 
                                dataKey="value"
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelStyle={{ 
                                  fontSize: '12px', 
                                  fill: darkMode ? '#E2E8F0' : '#374151' 
                                }}
                              />
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Percentual']}
                                contentStyle={{
                                  backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                  border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  color: darkMode ? '#E2E8F0' : '#1A202C'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </LoadingWrapper>

                  {/* Terceira linha - Análises Avançadas */}
                  <LoadingWrapper loading={getLoadingState('dashboard-analytics')} skeleton={true}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Tendências e Projeções */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.6s' }}>
                        <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>TENDÊNCIAS & PROJEÇÕES</h3>
                        <div className="h-48 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { mes: 'Jan', realizado: 15000, projetado: 18000 },
                              { mes: 'Fev', realizado: 18000, projetado: 19000 },
                              { mes: 'Mar', realizado: 16000, projetado: 20000 },
                              { mes: 'Abr', realizado: 22000, projetado: 21000 },
                              { mes: 'Mai', realizado: 0, projetado: 23000 },
                              { mes: 'Jun', realizado: 0, projetado: 25000 }
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4A5568' : '#E5E7EB'} />
                              <XAxis 
                                dataKey="mes" 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <YAxis 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <Tooltip 
                                formatter={(value) => [formatCurrencyValue(value), 'Valor']}
                                contentStyle={{
                                  backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                  border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  color: darkMode ? '#E2E8F0' : '#1A202C'
                                }}
                              />
                              <Legend 
                                wrapperStyle={{ 
                                  color: darkMode ? '#E2E8F0' : '#374151',
                                  fontSize: '12px'
                                }}
                              />
                              <Bar dataKey="realizado" fill="#10B981" name="Realizado" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="projetado" fill="#93C5FD" name="Projetado" opacity={0.7} radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                          <p>📈 Crescimento projetado: +15% trimestre</p>
                        </div>
                      </div>

                      {/* Top Clientes/Fornecedores */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.7s' }}>
                        <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>TOP PARCEIROS</h3>
                        <div className="h-48 mb-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={[
                                { nome: 'Cliente A', valor: 25000 },
                                { nome: 'Cliente B', valor: 18000 },
                                { nome: 'Cliente C', valor: 15000 },
                                { nome: 'Cliente D', valor: 12000 },
                                { nome: 'Cliente E', valor: 8000 }
                              ]}
                              layout="horizontal"
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4A5568' : '#E5E7EB'} />
                              <XAxis 
                                type="number" 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <YAxis 
                                dataKey="nome" 
                                type="category" 
                                width={80} 
                                stroke={darkMode ? '#A0AEC0' : '#6B7280'}
                                fontSize={12}
                              />
                              <Tooltip 
                                formatter={(value) => [formatCurrencyValue(value), 'Faturamento']}
                                contentStyle={{
                                  backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                  border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  color: darkMode ? '#E2E8F0' : '#1A202C'
                                }}
                              />
                              <Bar dataKey="valor" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                          <p>🎯 Concentração: 68% nos top 3 clientes</p>
                        </div>
                      </div>

                      {/* Indicadores de Performance */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.8s' }}>
                        <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>KPIs FINANCEIROS</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Margem Líquida</span>
                            <div className="flex items-center">
                              <div className={`w-20 h-2 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div className="w-16 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                              </div>
                              <span className="text-sm font-semibold text-green-600 animate-bounce-in">28.5%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>ROI</span>
                            <div className="flex items-center">
                              <div className={`w-20 h-2 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div className="w-14 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
                              </div>
                              <span className="text-sm font-semibold text-blue-600 animate-bounce-in">18.3%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Liquidez</span>
                            <div className="flex items-center">
                              <div className={`w-20 h-2 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div className="w-18 h-2 bg-purple-500 rounded-full animate-pulse-soft"></div>
                              </div>
                              <span className="text-sm font-semibold text-purple-600 animate-bounce-in">2.4x</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>Crescimento</span>
                            <div className="flex items-center">
                              <div className={`w-20 h-2 rounded-full mr-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <div className="w-12 h-2 bg-orange-500 rounded-full animate-pulse-soft"></div>
                              </div>
                              <span className="text-sm font-semibold text-orange-600 animate-bounce-in">15.2%</span>
                            </div>
                          </div>

                          <div className={`pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-gray-200'}`}>
                            <div className="h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                  { periodo: 'T1', kpi: 75 },
                                  { periodo: 'T2', kpi: 82 },
                                  { periodo: 'T3', kpi: 78 },
                                  { periodo: 'T4', kpi: 88 }
                                ]}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="kpi" 
                                    stroke="#8B5CF6" 
                                    strokeWidth={3}
                                    dot={{fill: '#8B5CF6', strokeWidth: 2, r: 4}}
                                  />
                                  <XAxis dataKey="periodo" hide />
                                  <YAxis hide />
                                  <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Score Geral']}
                                    contentStyle={{
                                      backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                      border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                      borderRadius: '8px',
                                      color: darkMode ? '#E2E8F0' : '#1A202C'
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            <p className={`text-xs text-center mt-2 ${
                              darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                            }`}>Score Geral de Performance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LoadingWrapper>

                  {/* Quarta linha - Transações Recentes e Alertas */}
                  <LoadingWrapper loading={getLoadingState('dashboard-activity')} skeleton={true}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Transações Recentes Expandida */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '0.9s' }}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-sm font-medium uppercase tracking-wide ${
                            darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                          }`}>ATIVIDADE RECENTE</h3>
                          <div className="flex space-x-2">
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}>Todas</button>
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}>Receitas</button>
                            <button className={`px-2 py-1 text-xs rounded transition-colors ${
                              darkMode ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}>Despesas</button>
                          </div>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                          {currentDashboardData.transactions.map((transaction, index) => (
                            <div key={index} className={`flex justify-between items-center py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
                              darkMode ? 'bg-dark-bg hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full animate-pulse ${
                                  transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <div>
                                  <p className={`text-sm font-medium ${
                                    darkMode ? 'text-dark-text' : 'text-gray-900'
                                  }`}>{transaction.description}</p>
                                  <p className={`text-xs ${
                                    darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                                  }`}>{transaction.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-sm font-semibold ${
                                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.amount}
                                </span>
                                <p className={`text-xs ${
                                  darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                                }`}>Confirmado</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Central de Alertas e Insights */}
                      <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg animate-slide-up ${
                        darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                      }`} style={{ animationDelay: '1.0s' }}>
                        <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>INSIGHTS & ALERTAS</h3>
                        <div className="space-y-4">
                          {/* Alerta de Performance */}
                          <div className={`p-4 border-l-4 border-blue-400 rounded transition-all duration-300 hover:shadow-md animate-slide-in-left ${
                            darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                          }`}>
                            <div className="flex items-center">
                              <svg className={`w-5 h-5 mr-2 ${
                                darkMode ? 'text-blue-300' : 'text-blue-400'
                              }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className={`text-sm font-medium ${
                                  darkMode ? 'text-blue-300' : 'text-blue-800'
                                }`}>Performance Excepcional</p>
                                <p className={`text-xs ${
                                  darkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}>Receitas 18% acima da meta mensal</p>
                              </div>
                            </div>
                          </div>

                          {/* Alerta de Atenção */}
                          <div className={`p-4 border-l-4 border-yellow-400 rounded transition-all duration-300 hover:shadow-md animate-slide-in-left ${
                            darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
                          }`} style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center">
                              <svg className={`w-5 h-5 mr-2 ${
                                darkMode ? 'text-yellow-300' : 'text-yellow-400'
                              }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className={`text-sm font-medium ${
                                  darkMode ? 'text-yellow-300' : 'text-yellow-800'
                                }`}>Concentração de Clientes</p>
                                <p className={`text-xs ${
                                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                }`}>68% da receita vem de apenas 3 clientes</p>
                              </div>
                            </div>
                          </div>

                          {/* Oportunidade */}
                          <div className={`p-4 border-l-4 border-green-400 rounded transition-all duration-300 hover:shadow-md animate-slide-in-left ${
                            darkMode ? 'bg-green-900/20' : 'bg-green-50'
                          }`} style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center">
                              <svg className={`w-5 h-5 mr-2 ${
                                darkMode ? 'text-green-300' : 'text-green-400'
                              }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <p className={`text-sm font-medium ${
                                  darkMode ? 'text-green-300' : 'text-green-800'
                                }`}>Oportunidade de Crescimento</p>
                                <p className={`text-xs ${
                                  darkMode ? 'text-green-400' : 'text-green-600'
                                }`}>Potencial para 25% de aumento no Q2</p>
                              </div>
                            </div>
                          </div>

                          {/* Mini gráfico de tendência */}
                          <div className="pt-4">
                            <h4 className={`text-xs font-medium mb-2 ${
                              darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                            }`}>TENDÊNCIA ÚLTIMOS 30 DIAS</h4>
                            <div className="h-20">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                  { dia: 1, valor: 100 },
                                  { dia: 5, valor: 110 },
                                  { dia: 10, valor: 105 },
                                  { dia: 15, valor: 120 },
                                  { dia: 20, valor: 115 },
                                  { dia: 25, valor: 130 },
                                  { dia: 30, valor: 125 }
                                ]}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="valor" 
                                    stroke="#10B981" 
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                  <XAxis dataKey="dia" hide />
                                  <YAxis hide />
                                  <Tooltip 
                                    formatter={(value) => [`${value}%`, 'Performance']}
                                    contentStyle={{
                                      backgroundColor: darkMode ? '#2D3748' : '#FFFFFF',
                                      border: darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
                                      borderRadius: '8px',
                                      color: darkMode ? '#E2E8F0' : '#1A202C'
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </LoadingWrapper>
                </div>
              ) : currentView === 'documents' ? (
                /* Módulo de Documentos - Estilo ContaAzul com Dark Mode */
                <div className="space-y-6">
                  {/* Header com botão de upload */}
                  <div className={`rounded-lg shadow-md p-6 animate-slide-up ${
                    darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          darkMode ? 'text-dark-text' : 'text-gray-900'
                        }`}>Central de Documentos</h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>Faça upload de notas fiscais, recibos e outros documentos fiscais</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowDocumentModal(true);
                          showToast('Modal de upload aberto', 'info', 2000);
                        }}
                        className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
                      >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Novo Documento</span>
                      </button>
                    </div>

                    {/* Estatísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-up ${
                        darkMode ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-blue-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-blue-300' : 'text-blue-600'
                            }`}>Total de Documentos</p>
                            <p className={`text-2xl font-bold animate-bounce-in ${
                              darkMode ? 'text-blue-200' : 'text-blue-800'
                            }`}>{uploadedDocuments.length}</p>
                          </div>
                          <div className={`p-2 rounded-full ${
                            darkMode ? 'bg-blue-800/50' : 'bg-blue-100'
                          }`}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={darkMode ? '#93C5FD' : '#1D4ED8'}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-up ${
                        darkMode ? 'bg-green-900/30 border border-green-800/50' : 'bg-green-50'
                      }`} style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-green-300' : 'text-green-600'
                            }`}>Processados</p>
                            <p className={`text-2xl font-bold animate-bounce-in ${
                              darkMode ? 'text-green-200' : 'text-green-800'
                            }`}>{uploadedDocuments.filter(doc => doc.status === 'processed').length}</p>
                          </div>
                          <div className={`p-2 rounded-full ${
                            darkMode ? 'bg-green-800/50' : 'bg-green-100'
                          }`}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={darkMode ? '#86EFAC' : '#059669'}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-up ${
                        darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-slate-50'
                      }`} style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>Valor Total</p>
                            <p className={`text-2xl font-bold animate-bounce-in ${
                              darkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              R$ {uploadedDocuments.reduce((sum, doc) => sum + doc.value, 0).toFixed(2)}
                            </p>
                          </div>
                          <div className={`p-2 rounded-full ${
                            darkMode ? 'bg-slate-700/50' : 'bg-slate-100'
                          }`}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={darkMode ? '#CBD5E1' : '#475569'}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 rounded-lg transition-all duration-300 hover:scale-105 animate-slide-up ${
                        darkMode ? 'bg-orange-900/30 border border-orange-800/50' : 'bg-orange-50'
                      }`} style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-orange-300' : 'text-orange-600'
                            }`}>Pendentes</p>
                            <p className={`text-2xl font-bold animate-bounce-in ${
                              darkMode ? 'text-orange-200' : 'text-orange-800'
                            }`}>{uploadedDocuments.filter(doc => doc.status === 'pending').length}</p>
                          </div>
                          <div className={`p-2 rounded-full ${
                            darkMode ? 'bg-orange-800/50' : 'bg-orange-100'
                          }`}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={darkMode ? '#FDBA74' : '#EA580C'}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de documentos */}
                  <div className={`rounded-lg shadow-md overflow-hidden animate-slide-up ${
                    darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                  }`} style={{ animationDelay: '0.4s' }}>
                    <div className={`p-6 border-b ${
                      darkMode ? 'border-dark-border' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-lg font-semibold ${
                        darkMode ? 'text-dark-text' : 'text-gray-900'
                      }`}>Documentos Enviados</h3>
                    </div>
                    
                    {uploadedDocuments.length === 0 ? (
                      <div className={`p-12 text-center ${
                        darkMode ? 'text-dark-text-secondary' : 'text-gray-500'
                      }`}>
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto mb-4 opacity-50">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className={`text-lg font-medium mb-2 ${
                          darkMode ? 'text-dark-text' : 'text-gray-900'
                        }`}>Nenhum documento enviado</h4>
                        <p className={`mb-4 ${
                          darkMode ? 'text-dark-text-secondary' : 'text-gray-600'
                        }`}>Comece fazendo upload de suas notas fiscais e recibos</p>
                        <button
                          onClick={() => {
                            setShowDocumentModal(true);
                            showToast('Modal de upload aberto', 'info', 2000);
                          }}
                          className={`px-6 py-2 rounded-lg transition-all duration-300 shadow-sm hover:scale-105 btn-enhanced ${
                            darkMode 
                              ? 'bg-primary-teal text-white hover:bg-teal-600' 
                              : 'bg-slate-700 text-white hover:bg-slate-800'
                          }`}
                        >
                          Enviar Primeiro Documento
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className={darkMode ? 'bg-dark-bg' : 'bg-gray-50'}>
                            <tr>
                              <th className={`text-left py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Documento</th>
                              <th className={`text-left py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Tipo</th>
                              <th className={`text-left py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Descrição</th>
                              <th className={`text-right py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Valor</th>
                              <th className={`text-center py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Data</th>
                              <th className={`text-center py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Status</th>
                              <th className={`text-center py-3 px-6 font-medium ${
                                darkMode ? 'text-dark-text-secondary' : 'text-gray-700'
                              }`}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {uploadedDocuments.map((doc, index) => (
                              <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                                      <p className="text-sm text-gray-500">{doc.fileSize}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    doc.type === 'nota_fiscal' ? 'bg-blue-100 text-blue-800' :
                                    doc.type === 'recibo' ? 'bg-green-100 text-green-800' :
                                    'bg-orange-100 text-orange-800'
                                  }`}>
                                    {doc.type === 'nota_fiscal' ? 'Nota Fiscal' :
                                     doc.type === 'recibo' ? 'Recibo' : 'Outros'}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-700">
                                  {doc.description}
                                </td>
                                <td className={`py-4 px-6 text-right font-medium ${
                                  doc.value > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  R$ {doc.value.toFixed(2)}
                                </td>
                                <td className="py-4 px-6 text-center text-sm text-gray-700">
                                  {doc.date}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Processado
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => deleteDocument(doc.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Excluir documento"
                                  >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : currentView === 'reports' ? (
                /* Central de Relatórios - Estilo ContaAzul com Abas e Dark Mode */
                <div className="space-y-6">
                  {/* Header */}
                  <div className={`rounded-lg shadow-md overflow-hidden animate-slide-up ${
                    darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                  }`}>
                    {/* Abas/Tabs estilo QuickBooks */}
                    <div className={`border-b ${darkMode ? 'border-dark-border' : 'border-gray-200'}`}>
                      <nav className="flex space-x-8 px-6 custom-scrollbar overflow-x-auto">
                        {[
                          { id: 'financial', label: 'Transações bancárias', active: true },
                          { id: 'cashflow', label: 'Transações do app' },
                          { id: 'revenue', label: 'Receitas' },
                          { id: 'client', label: 'Conciliação' },
                          { id: 'goals', label: 'Regras' },
                          { id: 'trends', label: 'Plano de contas' },
                          { id: 'comparative', label: 'Transações recorrentes' }
                        ].map((tab, index) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setCurrentReport(tab.id);
                              showToast(`Relatório ${tab.label} selecionado`, 'info', 2000);
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                              currentReport === tab.id || (currentReport === '' && tab.active)
                                ? 'border-primary-teal text-primary-teal'
                                : darkMode 
                                  ? 'border-transparent text-dark-text-secondary hover:text-dark-text hover:border-dark-text-secondary'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Filtros Avançados */}
                    <div className={`p-6 ${
                      darkMode ? 'bg-dark-bg' : 'bg-gray-50'
                    }`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                          <input
                            type="date"
                            value={reportFilters.startDate}
                            onChange={(e) => setReportFilters({...reportFilters, startDate: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                          <input
                            type="date"
                            value={reportFilters.endDate}
                            onChange={(e) => setReportFilters({...reportFilters, endDate: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cliente/Fornecedor</label>
                          <select
                            value={reportFilters.client}
                            onChange={(e) => setReportFilters({...reportFilters, client: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todos os clientes</option>
                            <option value="cliente1">Amazon</option>
                            <option value="cliente2">Microsoft</option>
                            <option value="cliente3">Google</option>
                            <option value="fornecedor1">Fornecedor A</option>
                            <option value="fornecedor2">Fornecedor B</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                          <select
                            value={reportFilters.type || ''}
                            onChange={(e) => setReportFilters({...reportFilters, type: e.target.value, category: '', account: ''})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todos os tipos</option>
                            <option value="Receita">Receitas</option>
                            <option value="Despesa">Despesas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                          <select
                            value={reportFilters.category}
                            onChange={(e) => setReportFilters({...reportFilters, category: e.target.value, account: ''})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todas as categorias</option>
                            {reportFilters.type && getCategoryOptions(reportFilters.type).map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.code} - {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Conta</label>
                          <select
                            value={reportFilters.account || ''}
                            onChange={(e) => setReportFilters({...reportFilters, account: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todas as contas</option>
                            {reportFilters.type && reportFilters.category && 
                             getSubcategoryOptions(reportFilters.type, reportFilters.category).map(subcat => (
                              <option key={subcat.value} value={subcat.value}>
                                {subcat.code} - {subcat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Centro de Custo</label>
                          <select
                            value={reportFilters.costCenter || ''}
                            onChange={(e) => setReportFilters({...reportFilters, costCenter: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todos os centros</option>
                            {costCenters.map(center => (
                              <option key={center.id} value={center.code}>
                                {center.code} - {center.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                          <select
                            value={reportFilters.bank}
                            onChange={(e) => setReportFilters({...reportFilters, bank: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todos os bancos</option>
                            {banks.filter(bank => bank.active).map(bank => (
                              <option key={bank.id} value={bank.id}>
                                {bank.name} ({bank.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={reportFilters.status || ''}
                            onChange={(e) => setReportFilters({...reportFilters, status: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent text-sm"
                          >
                            <option value="">Todos os status</option>
                            <option value="Confirmada">Confirmada</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Cancelada">Cancelada</option>
                          </select>
                        </div>

                        <div className="flex items-end space-x-2">
                          <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors text-sm">
                            Filtrar
                          </button>
                          
                          <button 
                            onClick={handleRefreshData}
                            data-refresh
                            className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                            title="Atualizar dados"
                          >
                            ↻
                          </button>
                          
                          <button 
                            onClick={exportToCSV}
                            className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                            title="Exportar CSV"
                          >
                            ↓
                          </button>
                          
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                            title="Adicionar movimento"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Métricas Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Receita Total</p>
                          <p className="text-2xl font-bold text-blue-800">R$ {calculateTotals().receitas}</p>
                          <p className="text-xs text-blue-600 mt-1">+12% vs mês anterior</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1D4ED8">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">Despesas Total</p>
                          <p className="text-2xl font-bold text-red-800">R$ {Math.abs(calculateTotals().despesas)}</p>
                          <p className="text-xs text-red-600 mt-1">-8% vs mês anterior</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#DC2626">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Lucro Líquido</p>
                          <p className="text-2xl font-bold text-green-800">R$ {calculateTotals().saldo}</p>
                          <p className="text-xs text-green-600 mt-1">+25% vs mês anterior</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#059669">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">ROI</p>
                          <p className="text-2xl font-bold text-purple-800">18.5%</p>
                          <p className="text-xs text-purple-600 mt-1">Meta: 20%</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#7C3AED">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Relatório */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {(currentReport === 'financial' || currentReport === '') && (
                          <div className="flex items-center">
                            <Icons.Money size={20} className="mr-2" />
                            Transações Bancárias
                          </div>
                        )}
                        {currentReport === 'cashflow' && (
                          <div className="flex items-center">
                            <Icons.Mobile size={20} className="mr-2" />
                            Transações de App
                          </div>
                        )}
                        {currentReport === 'revenue' && '🧾 Recibos e Comprovantes'}
                        {currentReport === 'client' && (
                          <div className="flex items-center">
                            <Icons.Sync size={20} className="mr-2" />
                            Reconciliação
                          </div>
                        )}
                        {currentReport === 'goals' && (
                          <div className="flex items-center">
                            <Icons.Clipboard size={20} className="mr-2" />
                            Regras de Negócio
                          </div>
                        )}
                        {currentReport === 'trends' && (
                          <div className="flex items-center">
                            <Icons.Chart size={20} className="mr-2" />
                            Plano de Contas
                          </div>
                        )}
                        {currentReport === 'comparative' && '🔁 Transações Recorrentes'}
                      </h3>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          <Icons.Export size={16} className="mr-2" />
                          Exportar
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                          <Icons.Printer size={16} className="mr-2" />
                          Imprimir
                        </button>
                      </div>
                    </div>

                    {/* Gráfico Principal */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        {(currentReport === 'financial' || currentReport === '') && 'Evolução das Transações Bancárias'}
                        {currentReport === 'cashflow' && 'Fluxo de Transações por App'}
                        {currentReport === 'revenue' && 'Análise de Recibos'}
                        {currentReport === 'client' && 'Status de Reconciliação'}
                        {currentReport === 'goals' && 'Aplicação de Regras'}
                        {currentReport === 'trends' && 'Distribuição por Contas'}
                        {currentReport === 'comparative' && 'Padrão de Recorrência'}
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          {(currentReport === 'financial' || currentReport === '' || currentReport === 'trends') ? (
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2} name="Receitas" />
                              <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} name="Despesas" />
                            </LineChart>
                          ) : currentReport === 'cashflow' || currentReport === 'goals' ? (
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="saldo" fill="#3B82F6" name="Saldo" />
                            </BarChart>
                          ) : (
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Receitas', value: calculateTotals().receitas, fill: '#10B981' },
                                  { name: 'Despesas', value: Math.abs(calculateTotals().despesas), fill: '#EF4444' }
                                ]}
                                cx="50%" cy="50%" outerRadius={80} dataKey="value"
                              />
                              <Tooltip />
                            </PieChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Tabela de Dados */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">Valor</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.slice(0, 10).map((item, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {item['Data Lançamento'] || '-'}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-900">
                                {item.Histórico || '-'}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {item.Descrição || 'Geral'}
                                </span>
                              </td>
                              <td className={`py-3 px-4 text-sm text-right font-medium ${
                                (item.Valor || 0) > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                R$ {item.Valor ? item.Valor.toFixed(2) : '0.00'}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  Processado
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : currentView === 'banks' ? (
                /* Gestão de Bancos */
                <div className="space-y-6">
                  {/* Header com botão de cadastro */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Gestão de Bancos</h3>
                        <p className="text-sm text-gray-600">Cadastre e gerencie suas contas bancárias</p>
                      </div>
                      <button
                        onClick={() => setShowBankModal(true)}
                        className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
                      >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Novo Banco</span>
                      </button>
                    </div>

                    {/* Estatísticas dos bancos */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Total de Bancos</p>
                            <p className="text-2xl font-bold text-blue-800">{banks.length}</p>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1D4ED8">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v13.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Bancos Ativos</p>
                            <p className="text-2xl font-bold text-green-800">{banks.filter(bank => bank.active).length}</p>
                          </div>
                          <div className="bg-green-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#059669">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-600">Saldo Total</p>
                            <p className="text-2xl font-bold text-slate-800">
                              R$ {banks.reduce((sum, bank) => sum + bank.balance, 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </p>
                          </div>
                          <div className="bg-slate-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#475569">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402 2.599-1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Maior Saldo</p>
                            <p className="text-2xl font-bold text-purple-800">
                              R$ {Math.max(...banks.map(bank => bank.balance)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                            </p>
                          </div>
                          <div className="bg-purple-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#7C3AED">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de bancos */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Bancos Cadastrados</h3>
                    </div>
                    
                    {banks.length === 0 ? (
                      <div className="p-12 text-center">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" className="mx-auto mb-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v13.5" />
                        </svg>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum banco cadastrado</h4>
                        <p className="text-gray-600 mb-4">Comece cadastrando sua primeira conta bancária</p>
                        <button
                          onClick={() => setShowBankModal(true)}
                          className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          Cadastrar Primeiro Banco
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Banco</th>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Código</th>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Agência</th>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Conta</th>
                              <th className="text-right py-3 px-6 font-medium text-gray-700">Saldo</th>
                              <th className="text-center py-3 px-6 font-medium text-gray-700">Status</th>
                              <th className="text-center py-3 px-6 font-medium text-gray-700">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {banks.map((bank) => (
                              <tr key={bank.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v13.5" />
                                      </svg>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{bank.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {bank.code}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-700">
                                  {bank.agency}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-700">
                                  {bank.account}
                                </td>
                                <td className="py-4 px-6 text-right font-medium text-green-600">
                                  R$ {bank.balance.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => toggleBankStatus(bank.id)}
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      bank.active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {bank.active ? 'Ativo' : 'Inativo'}
                                  </button>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => deleteBank(bank.id)}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                    title="Excluir banco"
                                  >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
              
              {/* Módulo de Metas e Orçamentos */}
              {currentView === 'metas' && (
                <div className="space-y-6">
                  {/* Header de Metas com Alertas */}
                  <div className={`rounded-lg shadow-md p-6 animate-slide-up ${
                    darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                  }`}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                          Metas e Orçamentos
                        </h2>
                        <p className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          Controle total dos seus orçamentos em tempo real
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Filtros de Período */}
                        <select
                          value={goalsPeriod}
                          onChange={(e) => setGoalsPeriod(e.target.value)}
                          className={`px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-dark-input border-dark-border text-dark-text' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-teal`}
                        >
                          <option value="month">Este Mês</option>
                          <option value="quarter">Trimestre</option>
                          <option value="year">Ano</option>
                        </select>
                        
                        {/* Ordenação */}
                        <select
                          value={goalsSortBy}
                          onChange={(e) => setGoalsSortBy(e.target.value)}
                          className={`px-3 py-2 rounded-lg border ${
                            darkMode 
                              ? 'bg-dark-input border-dark-border text-dark-text' 
                              : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-primary-teal`}
                        >
                          <option value="usage">% Utilizado</option>
                          <option value="budget">Orçamento</option>
                          <option value="name">Nome</option>
                          <option value="priority">Prioridade</option>
                        </select>
                        
                        <button
                          onClick={handleCreateGoalCategory}
                          className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
                        >
                          <Icons.Target size={18} />
                          <span>Nova Meta</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Gerar relatório de metas
                            const reportData = getSortedGoalCategories().map(cat => ({
                              categoria: cat.name,
                              orcamento: formatCurrency(cat.monthlyBudget),
                              gasto: formatCurrency(cat.currentSpent),
                              disponivel: formatCurrency(cat.monthlyBudget - cat.currentSpent),
                              percentual: `${calculateBudgetProgress(cat.currentSpent, cat.monthlyBudget).toFixed(1)}%`,
                              status: getBudgetStatus(cat.currentSpent, cat.monthlyBudget)
                            }));
                            
                            console.log('Relatório de Metas:', reportData);
                            showToast('Relatório de metas gerado! (Verifique o console)', 'success');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Icons.Document size={18} />
                          <span>Exportar</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Alertas de Orçamento */}
                    {showGoalAlerts && getGoalAlerts().length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start space-x-3">
                          <Icons.Warning size={20} className="text-orange-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-orange-800 font-medium mb-2">Atenção aos Orçamentos!</h4>
                            <div className="space-y-1">
                              {getGoalAlerts().map((category, index) => (
                                <p key={index} className="text-orange-700 text-sm">
                                  <strong>{category.name}:</strong> {calculateBudgetProgress(category.currentSpent, category.monthlyBudget).toFixed(1)}% utilizado
                                  {getBudgetStatus(category.currentSpent, category.monthlyBudget) === 'exceeded' && ' (EXCEDIDO)'}
                                </p>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowGoalAlerts(false)}
                            className="text-orange-400 hover:text-orange-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Cards de Categorias de Metas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getSortedGoalCategories().map((category, index) => {
                      const progress = calculateBudgetProgress(category.currentSpent, category.monthlyBudget);
                      const status = getBudgetStatus(category.currentSpent, category.monthlyBudget);
                      const remaining = category.monthlyBudget - category.currentSpent;
                      
                      return (
                        <div
                          key={category.id}
                          className={`rounded-lg shadow-md p-6 animate-slide-up hover:shadow-lg transition-all duration-300 ${
                            darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Header da categoria */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${category.color}20` }}
                              >
                                <Icons.Target size={20} style={{ color: category.color }} />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                                  {category.name}
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                                  {category.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                category.priority === 'high' 
                                  ? 'bg-red-100 text-red-700' 
                                  : category.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {category.priority === 'high' ? 'Alta' : category.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                              
                              <div className="relative">
                                <button 
                                  onClick={() => handleEditGoalCategory(category)}
                                  className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-dark-hover' : ''}`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Valores principais */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                                Gasto / Orçamento
                              </span>
                              <div className="text-right">
                                <div className={`font-semibold ${getStatusColor(status)}`}>
                                  {formatCurrency(category.currentSpent)}
                                </div>
                                <div className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                  de {formatCurrency(category.monthlyBudget)}
                                </div>
                              </div>
                            </div>
                            
                            {/* Barra de progresso */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}>
                                  Progresso
                                </span>
                                <span className={`font-medium ${getStatusColor(status)}`}>
                                  {progress.toFixed(1)}%
                                </span>
                              </div>
                              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-dark-border' : 'bg-gray-200'}`}>
                                <div
                                  className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(status)}`}
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                            </div>
                            
                            {/* Valor restante */}
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-dark-border">
                              <span className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                                {remaining >= 0 ? 'Disponível' : 'Excedido'}
                              </span>
                              <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(remaining))}
                              </span>
                            </div>
                            
                            {/* Subcategorias (resumo) */}
                            {category.subcategories && category.subcategories.length > 0 && (
                              <div className="pt-2">
                                <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'} mb-2`}>
                                  Subcategorias:
                                </div>
                                <div className="space-y-1">
                                  {category.subcategories.slice(0, 2).map((subcat, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                      <span className={darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}>
                                        {subcat.name}
                                      </span>
                                      <span className={`${(subcat.spent / subcat.budget * 100) > 90 ? 'text-red-500' : 'text-green-500'}`}>
                                        {((subcat.spent / subcat.budget) * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  ))}
                                  {category.subcategories.length > 2 && (
                                    <div className={`text-xs ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                                      +{category.subcategories.length - 2} mais...
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Resumo Geral */}
                  <div className={`rounded-lg shadow-md p-6 animate-slide-up ${
                    darkMode ? 'bg-dark-surface border border-dark-border' : 'bg-white'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      Resumo Geral do Período
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Total Orçado */}
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                          {formatCurrency(goalCategories.reduce((sum, cat) => sum + cat.monthlyBudget, 0))}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          Total Orçado
                        </div>
                      </div>
                      
                      {/* Total Gasto */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {formatCurrency(goalCategories.reduce((sum, cat) => sum + cat.currentSpent, 0))}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          Total Gasto
                        </div>
                      </div>
                      
                      {/* Disponível */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(goalCategories.reduce((sum, cat) => sum + (cat.monthlyBudget - cat.currentSpent), 0))}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          Disponível
                        </div>
                      </div>
                      
                      {/* % Utilizado */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-teal">
                          {(goalCategories.reduce((sum, cat) => sum + cat.currentSpent, 0) / 
                           goalCategories.reduce((sum, cat) => sum + cat.monthlyBudget, 0) * 100).toFixed(1)}%
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                          Utilizado
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Transações View */}
              {(currentView === 'transactions' || (!['dashboard', 'documents', 'reports', 'metas', 'banks', 'faturas', 'contatos'].includes(currentView))) && (
                /* Conteúdo original das transações */
                <div>
                  {/* Filtros abaixo do título */}
                  <div className="ml-16 mb-6">
                    <div className="flex space-x-4 items-center">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                        <input
                          type="month"
                          value={selectedMonth}
                          onChange={e => setSelectedMonth(e.target.value)}
                          className="custom-date"
                          style={{ minWidth: '140px' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Histórico</label>
                        <select
                          value={selectedPlan}
                          onChange={e => setSelectedPlan(e.target.value)}
                          className="custom-select"
                          style={{ minWidth: '180px' }}
                        >
                          <option value="all">Todos os Históricos</option>
                          <option value="Pix enviado">Pix enviado</option>
                          <option value="Boleto de cobrança recebido">Boleto de cobrança recebido</option>
                          <option value="Pagamento efetuado">Pagamento efetuado</option>
                        </select>
                      </div>
                      <div className="pt-6">
                        <button
                          onClick={handleFilter}
                          className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-sm"
                        >
                          Filtrar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cards de resumo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="minimal-card glass-effect p-6">
                      <h3 className="font-semibold text-dark-gray mb-2">Gastos (Débitos)</h3>
                      <p className="text-2xl text-red-500 font-bold">R$ {calculateTotals().gastos}</p>
                    </div>
                    <div className="minimal-card glass-effect p-6">
                      <h3 className="font-semibold text-dark-gray mb-2">Faturamento (Créditos)</h3>
                      <p className="text-2xl text-dark-gray font-bold">R$ {calculateTotals().faturamento}</p>
                    </div>
                    <div className="minimal-card glass-effect p-6">
                      <h3 className="font-semibold text-dark-gray mb-2">Saldo Atual</h3>
                      <p className="text-2xl text-green-600 font-bold">R$ {calculateTotals().saldo}</p>
                    </div>
                  </div>

                  {/* Grid de transações estilo QuickBooks */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-dark-gray">Histórico de Transações</h3>
                        
                        {/* Botões de ação */}
                        <div className="flex space-x-2">
                          <button 
                            onClick={handleRefreshData}
                            data-refresh
                            className="px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm font-medium flex items-center space-x-2 shadow-sm"
                            title="Atualizar dados"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Atualizar</span>
                          </button>
                          
                          <button 
                            onClick={exportToCSV}
                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center space-x-2 shadow-sm"
                            title="Exportar CSV"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Exportar</span>
                          </button>
                          
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="px-3 py-1.5 bg-primary-teal text-white rounded-md hover:bg-teal-600 transition-colors text-sm font-medium flex items-center space-x-2 shadow-sm"
                            title="Adicionar movimento"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Adicionar</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Conta</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                              <th className="text-center py-3 px-4 font-medium text-gray-700">Centro Custo</th>
                              <th className="text-right py-3 px-4 font-medium text-gray-700">Valor</th>
                              <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                              <th className="text-center py-3 px-4 font-medium text-gray-700">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((row, index) => (
                              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm text-gray-700">
                                  {row['Data Lançamento']}
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    (row.Tipo || (row.Valor > 0 ? 'Receita' : 'Despesa')) === 'Receita' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {row.Tipo || (row.Valor > 0 ? 'Receita' : 'Despesa')}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {row.Categoria || 'Não categorizado'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                  {row.Conta || row.Histórico}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-700">
                                  {row.Descrição}
                                </td>
                                <td className="py-3 px-4 text-sm text-center text-gray-600">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {row.CentroCusto || 'ADM'}
                                  </span>
                                </td>
                                <td className={`py-3 px-4 text-sm text-right font-medium ${
                                  row.Valor > 0 ? 'text-green-600' : 'text-red-500'
                                }`}>
                                  R$ {Math.abs(row.Valor).toFixed(2)}
                                </td>
                                <td className="py-3 px-4 text-sm text-center">
                                  <div className="flex justify-center">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                      (row.Status || 'Confirmada') === 'Confirmada' 
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : (row.Status || 'Confirmada') === 'Pendente'
                                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                      {row.Status || 'Confirmada'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <button
                                    onClick={() => handleEdit(row, index)}
                                    className="px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm"
                                  >
                                    Editar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Sistema de Faturas */}
              {currentView === 'faturas' && (
                /* Sistema de Faturas */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-dark-gray flex items-center"> <Icons.Invoice size={24} className="mr-3" /> Sistema de Faturas</h1>
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center space-x-2"
                    >
                      <Icons.Invoice size={18} />
                      <span>Nova Fatura</span>
                    </button>
                  </div>

                  {/* Cards de Estatísticas de Faturas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2 text-slate-600">
                        <Icons.Money size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Total Faturas</h3>
                      <p className="text-2xl font-bold text-primary-teal">{invoices.length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2 text-green-600">
                        <Icons.Check size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Pagas</h3>
                      <p className="text-2xl font-bold text-green-600">{invoices.filter(inv => inv.status === 'Pago').length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2 text-yellow-600">
                        <Icons.Clock size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Pendentes</h3>
                      <p className="text-2xl font-bold text-orange-600">{invoices.filter(inv => inv.status === 'Pendente').length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2 text-blue-600">
                        <Icons.Chart size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Valor Total</h3>
                      <p className="text-xl font-bold text-primary-teal">
                        R$ {invoices.reduce((total, inv) => total + inv.valor, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Filtros e Ações Rápidas para Faturas */}
                  <div className="glass-effect rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-medium">
                          <Icons.Chart size={16} className="mr-2" />
                          Faturas Pagas
                        </button>
                        <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-medium">
                          <Icons.Clock size={16} className="mr-2" />
                          Pendentes
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium">
                          <Icons.Warning size={16} className="mr-2" />
                          Vencidas
                        </button>
                      </div>
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-gold">
                        <option value="">Período: Todos</option>
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 90 dias</option>
                      </select>
                    </div>
                  </div>

                  {/* Faturas Table */}
                  <div className="glass-effect rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-accent-gold/20 to-accent-gold/10">
                          <tr>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Número</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Cliente</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Data Emissão</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Vencimento</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Valor</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Status</th>
                            <th className="text-center py-4 px-6 text-dark-gray font-semibold">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.map((invoice, index) => (
                            <tr key={index} className="border-t border-gray-200/50 hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 px-6 text-sm text-dark-gray font-medium">{invoice.numero}</td>
                              <td className="py-3 px-6 text-sm text-dark-gray">{invoice.cliente}</td>
                              <td className="py-3 px-6 text-sm text-gray-600">{invoice.dataEmissao}</td>
                              <td className="py-3 px-6 text-sm text-gray-600">{invoice.vencimento}</td>
                              <td className="py-3 px-6 text-sm text-dark-gray font-medium">R$ {invoice.valor.toFixed(2)}</td>
                              <td className="py-3 px-6 text-sm text-center">
                                <div className="flex justify-center">
                                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                    invoice.status === 'Pago' 
                                      ? 'bg-green-100 text-green-800 border border-green-200'
                                      : invoice.status === 'Pendente'
                                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                      : 'bg-red-100 text-red-800 border border-red-200'
                                  }`}>
                                    {invoice.status}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setCurrentInvoice(invoice);
                                      setCurrentInvoiceIndex(index);
                                      setShowInvoiceModal(true);
                                    }}
                                    className="px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => {
                                      if(window.confirm('Tem certeza que deseja excluir esta fatura?')) {
                                        const newInvoices = [...invoices];
                                        newInvoices.splice(index, 1);
                                        setInvoices(newInvoices);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Gestão de Clientes/Fornecedores */}
              {currentView === 'contatos' && (
                /* Gestão de Clientes/Fornecedores */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-dark-gray flex items-center">
                      <Icons.Clipboard size={24} className="mr-3" />
                      Gestão de Relacionamentos
                    </h1>
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-sm"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Novo Contato
                      </span>
                    </button>
                  </div>

                  {/* Cards de Estatísticas de Contatos */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="glass-effect rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl mb-2">👥</div>
                          <h3 className="text-lg font-semibold text-dark-gray">Total Contatos</h3>
                          <p className="text-3xl font-bold text-primary-teal">{contacts.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl mb-2">🛒</div>
                          <h3 className="text-lg font-semibold text-dark-gray">Clientes</h3>
                          <p className="text-3xl font-bold text-blue-600">{contacts.filter(c => c.tipo === 'Cliente').length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-effect rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl mb-2">🏭</div>
                          <h3 className="text-lg font-semibold text-dark-gray">Fornecedores</h3>
                          <p className="text-3xl font-bold text-purple-600">{contacts.filter(c => c.tipo === 'Fornecedor').length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filtros e Busca */}
                  <div className="glass-effect rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Buscar por nome, email, telefone..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                        />
                      </div>
                      <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal">
                        <option value="">Todos os tipos</option>
                        <option value="Cliente">Clientes</option>
                        <option value="Fornecedor">Fornecedores</option>
                      </select>
                    </div>
                  </div>

                  {/* Contatos Table */}
                  <div className="glass-effect rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <tr>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Contato</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Tipo</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Documento</th>
                            <th className="text-left py-4 px-6 text-dark-gray font-semibold">Informações</th>
                            <th className="text-center py-4 px-6 text-dark-gray font-semibold">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((contact, index) => (
                            <tr key={index} className="border-t border-gray-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200">
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                    contact.tipo === 'Cliente' ? 'bg-blue-500' : 'bg-purple-500'
                                  }`}>
                                    {contact.nome.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-dark-gray">{contact.nome}</div>
                                    <div className="text-xs text-gray-500">#{index + 1}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                  contact.tipo === 'Cliente' 
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                                }`}>
                                  {contact.tipo === 'Cliente' ? '🛒 Cliente' : '🏭 Fornecedor'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-sm text-dark-gray">
                                <div className="font-mono">{contact.documento}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="space-y-1">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">📧</span>
                                    <span className="truncate max-w-[150px]">{contact.email}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <span className="mr-2">📞</span>
                                    <span>{contact.telefone}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-6 text-center">
                                <div className="flex justify-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setCurrentContact(contact);
                                      setCurrentContactIndex(index);
                                      setShowContactModal(true);
                                    }}
                                    className="px-3 py-1.5 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors text-sm"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => {
                                      if(window.confirm('Tem certeza que deseja excluir este contato?')) {
                                        const newContacts = [...contacts];
                                        newContacts.splice(index, 1);
                                        setContacts(newContacts);
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>

          {/* Edit Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="glass-effect p-8 rounded-xl w-full max-w-md animate-slide-up">
                <h2 className="text-xl font-semibold text-dark-gray mb-6">Editar Movimento</h2>
                <input
                  type="text"
                  value={currentRow['Data Lançamento']}
                  onChange={e => setCurrentRow({ ...currentRow, 'Data Lançamento': e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Data Lançamento"
                />
                <input
                  type="text"
                  value={currentRow.Histórico}
                  onChange={e => setCurrentRow({ ...currentRow, Histórico: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Histórico"
                />
                <input
                  type="text"
                  value={currentRow.Descrição}
                  onChange={e => setCurrentRow({ ...currentRow, Descrição: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Descrição"
                />
                <input
                  type="number"
                  value={currentRow.Valor}
                  onChange={e => setCurrentRow({ ...currentRow, Valor: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Valor"
                />
                <select
                  value={currentRow.Origem}
                  onChange={e => setCurrentRow({ ...currentRow, Origem: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                >
                  <option value="Banco">Banco</option>
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal - Plano de Contas Estruturado */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-dark-gray">Adicionar Transação</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1 - Informações Básicas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>
                      
                      {/* Data */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data da Transação *</label>
                        <input
                          type="date"
                          value={newRow['Data Lançamento']}
                          onChange={e => setNewRow({ ...newRow, 'Data Lançamento': e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Tipo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                        <select
                          value={newRow.Tipo || (newRow.Valor >= 0 ? 'Receita' : 'Despesa')}
                          onChange={e => setNewRow({ ...newRow, Tipo: e.target.value, Categoria: '', Subcategoria: '', Conta: '' })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          required
                        >
                          <option value="Receita">Receita</option>
                          <option value="Despesa">Despesa</option>
                        </select>
                      </div>

                      {/* Categoria */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                        <select
                          value={newRow.Categoria || ''}
                          onChange={e => setNewRow({ ...newRow, Categoria: e.target.value, Subcategoria: '', Conta: '' })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          required
                        >
                          <option value="">Selecione uma categoria</option>
                          {getCategoryOptions(newRow.Tipo || 'Receita').map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.code} - {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategoria */}
                      {newRow.Categoria && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Conta *</label>
                          <select
                            value={newRow.Conta || ''}
                            onChange={e => setNewRow({ ...newRow, Conta: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                            required
                          >
                            <option value="">Selecione uma conta</option>
                            {getSubcategoryOptions(newRow.Tipo || 'Receita', newRow.Categoria).map(subcat => (
                              <option key={subcat.value} value={subcat.value}>
                                {subcat.code} - {subcat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Centro de Custo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Centro de Custo *</label>
                        <select
                          value={newRow.CentroCusto || ''}
                          onChange={e => setNewRow({ ...newRow, CentroCusto: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          required
                        >
                          <option value="">Selecione um centro de custo</option>
                          {costCenters.map(center => (
                            <option key={center.id} value={center.code}>
                              {center.code} - {center.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Coluna 2 - Detalhes Financeiros */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Detalhes Financeiros</h3>
                      
                      {/* Valor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newRow.Valor || ''}
                          onChange={e => setNewRow({ ...newRow, Valor: parseFloat(e.target.value) || 0 })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          placeholder="0,00"
                          required
                        />
                      </div>

                      {/* Descrição */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                        <textarea
                          value={newRow.Descrição || ''}
                          onChange={e => setNewRow({ ...newRow, Descrição: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          rows="3"
                          placeholder="Descreva a transação..."
                          required
                        />
                      </div>

                      {/* Cliente/Fornecedor */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {(newRow.Tipo || 'Receita') === 'Receita' ? 'Cliente' : 'Fornecedor'}
                        </label>
                        <input
                          type="text"
                          value={(newRow.Tipo || 'Receita') === 'Receita' ? (newRow.Cliente || '') : (newRow.Fornecedor || '')}
                          onChange={e => setNewRow({ 
                            ...newRow, 
                            [(newRow.Tipo || 'Receita') === 'Receita' ? 'Cliente' : 'Fornecedor']: e.target.value 
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          placeholder={`Nome do ${(newRow.Tipo || 'Receita') === 'Receita' ? 'cliente' : 'fornecedor'}`}
                        />
                      </div>

                      {/* Forma de Pagamento */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                        <select
                          value={newRow.FormaPagamento || 'PIX'}
                          onChange={e => setNewRow({ ...newRow, FormaPagamento: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        >
                          <option value="PIX">PIX</option>
                          <option value="Transferência">Transferência</option>
                          <option value="Boleto">Boleto</option>
                          <option value="Cartão Crédito">Cartão de Crédito</option>
                          <option value="Cartão Débito">Cartão de Débito</option>
                          <option value="Dinheiro">Dinheiro</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>

                      {/* Número do Documento */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número do Documento</label>
                        <input
                          type="text"
                          value={newRow.NumeroDocumento || ''}
                          onChange={e => setNewRow({ ...newRow, NumeroDocumento: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          placeholder="Ex: NF-001, Boleto 123..."
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={newRow.Status || 'Confirmada'}
                          onChange={e => setNewRow({ ...newRow, Status: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        >
                          <option value="Confirmada">Confirmada</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                    <textarea
                      value={newRow.Observacoes || ''}
                      onChange={e => setNewRow({ ...newRow, Observacoes: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                      rows="2"
                      placeholder="Observações adicionais..."
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddSubmit}
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-sm"
                    >
                      Salvar Transação
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Upload de Documentos */}
          {showDocumentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Enviar Documento</h3>
                    <button
                      onClick={handleCloseDocumentModal}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleDocumentSubmit} className="space-y-4">
                    {/* Área de Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arquivo do Documento
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-teal transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setNewDocument({...newDocument, file: e.target.files[0]})}
                          className="hidden"
                          id="file-upload"
                          required
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="text-gray-600">
                            <span className="font-medium text-primary-teal">Clique para enviar</span> ou arraste o arquivo aqui
                          </div>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG até 10MB</p>
                        </label>
                        {newDocument.file && (
                          <div className="mt-3 text-sm text-gray-600">
                            <Icons.File size={16} className="mr-2" />
                            {newDocument.file.name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tipo de Documento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento
                      </label>
                      <select
                        value={newDocument.type}
                        onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="nota_fiscal">Nota Fiscal</option>
                        <option value="recibo">Recibo</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <input
                        type="text"
                        value={newDocument.description}
                        onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                        placeholder="Ex: Compra de material de escritório"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newDocument.value}
                        onChange={(e) => setNewDocument({...newDocument, value: parseFloat(e.target.value) || 0})}
                        placeholder="0,00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Data */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data do Documento
                      </label>
                      <input
                        type="date"
                        value={newDocument.date}
                        onChange={(e) => setNewDocument({...newDocument, date: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCloseDocumentModal}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
                      >
                        Enviar Documento
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Cadastro de Banco */}
          {showBankModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Cadastrar Novo Banco</h3>
                    <button
                      onClick={() => setShowBankModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleBankSubmit} className="space-y-4">
                    {/* Nome do Banco */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Banco *
                      </label>
                      <input
                        type="text"
                        value={newBank.name}
                        onChange={(e) => setNewBank({...newBank, name: e.target.value})}
                        placeholder="Ex: Banco do Brasil"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Código do Banco */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código do Banco *
                      </label>
                      <input
                        type="text"
                        value={newBank.code}
                        onChange={(e) => setNewBank({...newBank, code: e.target.value})}
                        placeholder="Ex: 001"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Agência */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agência *
                      </label>
                      <input
                        type="text"
                        value={newBank.agency}
                        onChange={(e) => setNewBank({...newBank, agency: e.target.value})}
                        placeholder="Ex: 1234-5"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Conta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número da Conta *
                      </label>
                      <input
                        type="text"
                        value={newBank.account}
                        onChange={(e) => setNewBank({...newBank, account: e.target.value})}
                        placeholder="Ex: 12345-6"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Saldo Inicial */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Saldo Inicial (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newBank.balance}
                        onChange={(e) => setNewBank({...newBank, balance: parseFloat(e.target.value) || 0})}
                        placeholder="0,00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newBank.active}
                          onChange={(e) => setNewBank({...newBank, active: e.target.checked})}
                          className="rounded border-gray-300 text-primary-teal focus:ring-primary-teal"
                        />
                        <span className="text-sm text-gray-700">Banco ativo</span>
                      </label>
                    </div>

                    {/* Botões */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowBankModal(false)}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
                      >
                        Cadastrar Banco
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* History Modal */}
          {showHistoryModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl w-full max-w-5xl max-h-[85vh] overflow-hidden shadow-xl">
                {/* Header Minimalista */}
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Histórico de Transações</h2>
                      <p className="text-sm text-gray-500">{transactionHistory.length} registros encontrados</p>
                    </div>
                    <button
                      onClick={() => setShowHistoryModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Filtros Minimalistas */}
                <div className="px-6 py-3 bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Todos
                      </button>
                      <button className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        Adicionados
                      </button>
                      <button className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                        Editados
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Buscar..."
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                      />
                      <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>Últimos 30 dias</option>
                        <option>Todo período</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Lista Minimalista */}
                <div className="overflow-auto max-h-96">
                  {transactionHistory.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-gray-300 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                      </div>
                      <p className="text-gray-500">Nenhum histórico encontrado</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {transactionHistory.map((history, index) => (
                        <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  history.Ação === 'Adicionado' ? 'bg-green-500' :
                                  history.Ação === 'Editado' ? 'bg-orange-500' :
                                  'bg-blue-500'
                                }`}></span>
                                <span className="text-sm font-medium text-gray-900">
                                  {history.Descrição || 'Transação sem descrição'}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  history.Ação === 'Adicionado' ? 'bg-green-100 text-green-700' :
                                  history.Ação === 'Editado' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {history.Ação}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <span>{history['Data Lançamento'] || '-'}</span>
                                <span>{history.Histórico || '-'}</span>
                                <span>{history.Origem || '-'}</span>
                                <span className="text-xs">{history.DataAlteração}</span>
                              </div>
                              
                              {history.Detalhes && (
                                <p className="text-xs text-gray-400 mt-1">{history.Detalhes}</p>
                              )}
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className={`text-sm font-semibold ${
                                (history.Valor || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {(history.Valor || 0) >= 0 ? '+' : ''}R$ {history.Valor ? Math.abs(history.Valor).toFixed(2) : '0,00'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Minimalista */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {transactionHistory.length} registros
                    </span>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all">
                        Exportar
                      </button>
                      <button
                        onClick={() => setShowHistoryModal(false)}
                        className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Modal */}
          {showInvoiceModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-dark-gray">
                      {currentInvoice ? 'Editar Fatura' : 'Nova Fatura'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowInvoiceModal(false);
                        setCurrentInvoice(null);
                        setCurrentInvoiceIndex(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Número da Fatura</label>
                      <input
                        type="text"
                        value={currentInvoice?.numero || ''}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, numero: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="INV-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                      <select
                        value={currentInvoice?.cliente || ''}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, cliente: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      >
                        <option value="">Selecione um cliente</option>
                        {contacts.filter(c => c.tipo === 'Cliente').map((client, idx) => (
                          <option key={idx} value={client.nome}>{client.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data de Emissão</label>
                      <input
                        type="date"
                        value={currentInvoice?.dataEmissao || ''}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, dataEmissao: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vencimento</label>
                      <input
                        type="date"
                        value={currentInvoice?.vencimento || ''}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, vencimento: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentInvoice?.valor || ''}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={currentInvoice?.status || 'Pendente'}
                        onChange={e => setCurrentInvoice(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Vencido">Vencido</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <textarea
                      value={currentInvoice?.descricao || ''}
                      onChange={e => setCurrentInvoice(prev => ({ ...prev, descricao: e.target.value }))}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      rows="3"
                      placeholder="Descrição dos serviços/produtos..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowInvoiceModal(false);
                        setCurrentInvoice(null);
                        setCurrentInvoiceIndex(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (currentInvoiceIndex !== null) {
                          // Edit existing invoice
                          const newInvoices = [...invoices];
                          newInvoices[currentInvoiceIndex] = currentInvoice;
                          setInvoices(newInvoices);
                        } else {
                          // Add new invoice
                          setInvoices([...invoices, currentInvoice]);
                        }
                        setShowInvoiceModal(false);
                        setCurrentInvoice(null);
                        setCurrentInvoiceIndex(null);
                      }}
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Modal */}
          {/* Modal de Metas e Orçamentos */}
          {showGoalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {goalModalType === 'create' ? 'Nova Categoria de Meta' : 'Editar Categoria'}
                    </h3>
                    <button
                      onClick={() => setShowGoalModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveGoalCategory();
                  }} className="space-y-4">
                    {/* Nome da categoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria *</label>
                      <input
                        type="text"
                        value={newGoalCategory.name}
                        onChange={(e) => setNewGoalCategory({...newGoalCategory, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        placeholder="Ex: Tecnologia da Informação"
                        required
                      />
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={newGoalCategory.description}
                        onChange={(e) => setNewGoalCategory({...newGoalCategory, description: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                        rows="3"
                        placeholder="Descreva o que esta categoria abrange..."
                      />
                    </div>

                    {/* Cor da categoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                      <div className="flex space-x-3">
                        {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewGoalCategory({...newGoalCategory, color})}
                            className={`w-8 h-8 rounded-full border-2 ${
                              newGoalCategory.color === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Orçamento Mensal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento Mensal *</label>
                        <input
                          type="number"
                          value={newGoalCategory.monthlyBudget}
                          onChange={(e) => setNewGoalCategory({
                            ...newGoalCategory, 
                            monthlyBudget: parseFloat(e.target.value) || 0,
                            yearlyBudget: (parseFloat(e.target.value) || 0) * 12
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      {/* Orçamento Anual (calculado automaticamente) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento Anual</label>
                        <input
                          type="number"
                          value={newGoalCategory.yearlyBudget}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                          placeholder="Calculado automaticamente"
                          disabled
                        />
                      </div>
                    </div>

                    {/* Prioridade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                      <select
                        value={newGoalCategory.priority}
                        onChange={(e) => setNewGoalCategory({...newGoalCategory, priority: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>

                    {/* Subcategorias */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategorias (Opcional)</label>
                      <div className="space-y-2">
                        {newGoalCategory.subcategories.map((subcat, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              value={subcat.name}
                              onChange={(e) => {
                                const newSubcats = [...newGoalCategory.subcategories];
                                newSubcats[index] = {...subcat, name: e.target.value};
                                setNewGoalCategory({...newGoalCategory, subcategories: newSubcats});
                              }}
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                              placeholder="Nome da subcategoria"
                            />
                            <input
                              type="number"
                              value={subcat.budget}
                              onChange={(e) => {
                                const newSubcats = [...newGoalCategory.subcategories];
                                newSubcats[index] = {...subcat, budget: parseFloat(e.target.value) || 0};
                                setNewGoalCategory({...newGoalCategory, subcategories: newSubcats});
                              }}
                              className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
                              placeholder="Valor"
                              min="0"
                              step="0.01"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSubcats = newGoalCategory.subcategories.filter((_, i) => i !== index);
                                setNewGoalCategory({...newGoalCategory, subcategories: newSubcats});
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setNewGoalCategory({
                              ...newGoalCategory, 
                              subcategories: [...newGoalCategory.subcategories, { name: '', budget: 0, spent: 0 }]
                            });
                          }}
                          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-teal hover:text-primary-teal transition-colors"
                        >
                          + Adicionar Subcategoria
                        </button>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex justify-between items-center pt-4">
                      <div>
                        {goalModalType === 'edit' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir esta categoria de meta?')) {
                                handleDeleteGoalCategory(selectedGoalCategory.id);
                                setShowGoalModal(false);
                              }
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Excluir Categoria
                          </button>
                        )}
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setShowGoalModal(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors"
                        >
                          {goalModalType === 'create' ? 'Criar Meta' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {showContactModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-dark-gray">
                      {currentContact ? 'Editar Contato' : 'Novo Contato'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowContactModal(false);
                        setCurrentContact(null);
                        setCurrentContactIndex(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome/Razão Social</label>
                      <input
                        type="text"
                        value={currentContact?.nome || ''}
                        onChange={e => setCurrentContact(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="Nome completo ou razão social"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                      <select
                        value={currentContact?.tipo || 'Cliente'}
                        onChange={e => setCurrentContact(prev => ({ ...prev, tipo: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                      >
                        <option value="Cliente">Cliente</option>
                        <option value="Fornecedor">Fornecedor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ/CPF</label>
                      <input
                        type="text"
                        value={currentContact?.documento || ''}
                        onChange={e => setCurrentContact(prev => ({ ...prev, documento: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={currentContact?.email || ''}
                        onChange={e => setCurrentContact(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={currentContact?.telefone || ''}
                        onChange={e => setCurrentContact(prev => ({ ...prev, telefone: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                      <input
                        type="text"
                        value={currentContact?.endereco || ''}
                        onChange={e => setCurrentContact(prev => ({ ...prev, endereco: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                        placeholder="Endereço completo"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => {
                        setShowContactModal(false);
                        setCurrentContact(null);
                        setCurrentContactIndex(null);
                      }}
                      className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (currentContactIndex !== null) {
                          // Edit existing contact
                          const newContacts = [...contacts];
                          newContacts[currentContactIndex] = currentContact;
                          setContacts(newContacts);
                        } else {
                          // Add new contact
                          setContacts([...contacts, currentContact]);
                        }
                        setShowContactModal(false);
                        setCurrentContact(null);
                        setCurrentContactIndex(null);
                      }}
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Logout */}
          {showLogoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-sm w-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                      <Icons.Logout size={20} color="#DC2626" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Saída</h3>
                    <p className="text-gray-600 mb-6">Tem certeza de que deseja sair do sistema?</p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={cancelLogout}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmLogout}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
