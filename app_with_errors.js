const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } = Recharts;

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
    { label: "📊 Dashboard", action: () => setCurrentView('dashboard') },
    { label: "💳 Transações", action: () => setCurrentView('transactions') },
    { label: "📄 Documentos", action: () => setCurrentView('documents') },
    { label: "📈 Relatórios", action: () => setCurrentView('reports') },
    { label: "🏦 Bancos", action: () => setCurrentView('banks') },
    { label: "� Faturas", action: () => setCurrentView('faturas') },
    { label: "🤝 Clientes/Fornecedores", action: () => setCurrentView('contatos') },
    { label: "Histórico", action: () => setShowHistoryModal(true) },
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
      setDocumentForm({ ...documentForm, file });
    }
  };

  const handleDocumentSubmit = () => {
    if (!documentForm.file || !documentForm.description || !documentForm.value || !documentForm.date) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newDocument = {
      id: Date.now(),
      ...documentForm,
      fileName: documentForm.file.name,
      fileSize: (documentForm.file.size / 1024).toFixed(2) + ' KB',
      uploadDate: new Date().toLocaleDateString('pt-BR'),
      status: 'processed'
    };

    // Adicionar documento à lista
    setUploadedDocuments(prev => [...prev, newDocument]);

    // Criar transação automática baseada no documento
    const newTransaction = {
      'Data Lançamento': documentForm.date,
      Histórico: documentForm.category || documentForm.type,
      Descrição: `${documentForm.description} (Doc: ${documentForm.file.name})`,
      Valor: documentForm.type === 'nota_fiscal' && documentForm.category !== 'receita' ? -Math.abs(documentForm.value) : documentForm.value,
      Saldo: data.length > 0 ? (parseFloat(data[data.length - 1].Saldo) + documentForm.value).toFixed(2) : documentForm.value,
      Origem: 'Documento'
    };

    // Adicionar à base de dados
    const updatedData = [...data, newTransaction];
    setData(updatedData);
    setFilteredData(updatedData);
    trackChange('Documento Processado', newTransaction);

    // Limpar formulário
    setDocumentForm({
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

  return (
    <>
      {!isLoggedIn ? (
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
      ) : (
        <div className="min-h-screen bg-neutral-gray font-inter">
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
              <div className="w-full px-4 mb-6 mt-8">
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
              <nav className="space-y-2 w-full">
                {filteredSidebarOptions.length === 0 ? (
                  <span className="block text-gray-400 px-4 py-2">Nenhuma opção encontrada</span>
                ) : (
                  filteredSidebarOptions.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => {
                        opt.action();
                        setSidebarOpen(false);
                      }} 
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))
                )}
              </nav>
            </aside>

            {/* Main content */}
            <main className="w-full p-8">
              {/* Barra superior com ações do usuário */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-dark-gray ml-16">
                  {currentView === 'dashboard' ? 'Business Overview' : 
                   currentView === 'documents' ? 'Gestão de Documentos' :
                   currentView === 'reports' ? 'Central de Relatórios' :
                   currentView === 'banks' ? 'Gestão de Bancos' :
                   currentView === 'faturas' ? 'Sistema de Faturas' :
                   currentView === 'contatos' ? 'Gestão de Relacionamentos' : 'Financeiro'}
                </h2>
                
                {/* Ações do usuário no canto direito */}
                <div className="flex items-center space-x-4">
                  {/* Botão Configurações */}
                  <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#374151">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>                  {/* Botão Notificações */}
                  <button className="relative p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#374151">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3c1.105 0 2 .895 2 2v5c0 1.657.343 3.228.955 4.594.267.596.445 1.259.445 1.906 0 1.105-.895 2-2 2h-4c-1.105 0-2-.895-2-2 0-.647.178-1.31.445-1.906C8.657 13.228 9 11.657 9 10V5c0-1.105.895-2 2-2z" />
                    </svg>
                    {/* Badge de notificação */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Perfil do usuário */}
                  <div className="flex items-center space-x-3 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-teal to-dark-gray rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {username ? username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{username || 'Usuário'}</p>
                      <p className="text-gray-500 text-xs">Administrador</p>
                    </div>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo condicional baseado na view atual */}
              {currentView === 'dashboard' ? (
                /* Dashboard Content - Estilo QuickBooks */
                <div className="space-y-6">
                  {/* Primeira linha - Cards principais */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cash Flow Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">CASH FLOW</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-gray-900">R$ {calculateTotals().saldo}</p>
                        <p className="text-sm text-gray-500">Saldo atual</p>
                      </div>
                      <div className="h-32 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData.slice(-7)}>
                            <Line 
                              type="monotone" 
                              dataKey="saldo" 
                              stroke="#10B981" 
                              strokeWidth={2} 
                              dot={{fill: '#10B981', strokeWidth: 0, r: 3}} 
                            />
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip 
                              formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Saldo']}
                              labelFormatter={(label) => `Data: ${label}`}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="flex items-center mr-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Entradas
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          Saídas
                        </div>
                      </div>
                    </div>

                    {/* Expenses Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">DESPESAS</h3>
                        <span className="text-xs text-gray-500">Por categoria</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-gray-900">R$ {calculateTotals().gastos}</p>
                        <p className="text-sm text-gray-500">Total de gastos</p>
                      </div>
                      <div className="h-32 mb-4 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expensesData.slice(0, 4)}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {expensesData.slice(0, 4).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1 text-xs">
                        {expensesData.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index] }}
                              ></div>
                              <span className="truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <span className="font-medium">R$ {item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Profit and Loss Card */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">RECEITAS VS DESPESAS</h3>
                        <span className="text-xs text-gray-500">Período atual</span>
                      </div>
                      <div className="mb-6">
                        <p className="text-3xl font-bold text-gray-900">
                          R$ {(parseFloat(calculateTotals().faturamento) - parseFloat(calculateTotals().gastos)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Resultado líquido</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Receitas</span>
                            <span className="text-sm font-medium text-green-600">
                              R$ {calculateTotals().faturamento}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                              style={{
                                width: `${Math.min((parseFloat(calculateTotals().faturamento) / 
                                (parseFloat(calculateTotals().faturamento) + parseFloat(calculateTotals().gastos))) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Despesas</span>
                            <span className="text-sm font-medium text-red-600">
                              R$ {calculateTotals().gastos}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                              style={{
                                width: `${Math.min((parseFloat(calculateTotals().gastos) / 
                                (parseFloat(calculateTotals().faturamento) + parseFloat(calculateTotals().gastos))) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Taxa de Lucro</span>
                            <span className={`text-sm font-bold ${
                              parseFloat(calculateTotals().faturamento) > parseFloat(calculateTotals().gastos) 
                                ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(((parseFloat(calculateTotals().faturamento) - parseFloat(calculateTotals().gastos)) / 
                                parseFloat(calculateTotals().faturamento)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segunda linha - Análises detalhadas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Evolução Mensal */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">EVOLUÇÃO MENSAL</h3>
                      <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip 
                              formatter={(value, name) => [
                                `R$ ${value.toFixed(2)}`, 
                                name === 'receitas' ? 'Receitas' : name === 'despesas' ? 'Despesas' : 'Saldo'
                              ]}
                            />
                            <Bar dataKey="receitas" fill="#10B981" name="receitas" />
                            <Bar dataKey="despesas" fill="#EF4444" name="despesas" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Distribuição de Receitas */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">RECEITAS</h3>
                        <span className="text-xs text-gray-500">Por categoria</span>
                      </div>
                      <div className="mb-4">
                        <p className="text-3xl font-bold text-gray-900">R$ {calculateTotals().faturamento}</p>
                        <p className="text-sm text-gray-500">Total de receitas</p>
                      </div>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={incomeData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, value}) => `${name}: R$${value.toFixed(0)}`}
                              labelLine={false}
                            >
                              {incomeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Resumo de Transações */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">RESUMO</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-green-800">Total de Transações</span>
                            <span className="text-2xl font-bold text-green-600">{filteredData.length}</span>
                          </div>
                          <div className="text-sm text-green-600">
                            {filteredData.filter(row => row.Valor > 0).length} receitas • {' '}
                            {filteredData.filter(row => row.Valor < 0).length} despesas
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-blue-800">Maior Receita</span>
                            <span className="text-xl font-bold text-blue-600">
                              R$ {Math.max(...filteredData.filter(row => row.Valor > 0).map(row => row.Valor)).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-blue-600">
                            {filteredData.find(row => row.Valor === Math.max(...filteredData.filter(r => r.Valor > 0).map(r => r.Valor)))?.['Data Lançamento']}
                          </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-red-800">Maior Despesa</span>
                            <span className="text-xl font-bold text-red-600">
                              R$ {Math.max(...filteredData.filter(row => row.Valor < 0).map(row => Math.abs(row.Valor))).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-red-600">
                            {filteredData.find(row => Math.abs(row.Valor) === Math.max(...filteredData.filter(r => r.Valor < 0).map(r => Math.abs(r.Valor))))?.['Data Lançamento']}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">Ticket Médio</span>
                            <span className="text-lg font-bold text-gray-600">
                              R$ {(filteredData.reduce((sum, row) => sum + Math.abs(row.Valor), 0) / filteredData.length).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentView === 'documents' ? (
                /* Módulo de Documentos - Estilo ContaAzul */
                <div className="space-y-6">
                  {/* Header com botão de upload */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Central de Documentos</h3>
                        <p className="text-sm text-gray-600">Faça upload de notas fiscais, recibos e outros documentos fiscais</p>
                      </div>
                      <button
                        onClick={() => setShowDocumentModal(true)}
                        className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center space-x-2 shadow-sm"
                      >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Novo Documento</span>
                      </button>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Novo Documento</span>
                      </button>
                    </div>

                    {/* Estatísticas rápidas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">Total de Documentos</p>
                            <p className="text-2xl font-bold text-blue-800">{uploadedDocuments.length}</p>
                          </div>
                          <div className="bg-blue-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#1D4ED8">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">Processados</p>
                            <p className="text-2xl font-bold text-green-800">{uploadedDocuments.filter(doc => doc.status === 'processed').length}</p>
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
                            <p className="text-sm font-medium text-slate-600">Valor Total</p>
                            <p className="text-2xl font-bold text-slate-800">
                              R$ {uploadedDocuments.reduce((sum, doc) => sum + doc.value, 0).toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#475569">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">Este Mês</p>
                            <p className="text-2xl font-bold text-purple-800">
                              {uploadedDocuments.filter(doc => {
                                const docMonth = new Date(doc.uploadDate.split('/').reverse().join('-')).getMonth();
                                const currentMonth = new Date().getMonth();
                                return docMonth === currentMonth;
                              }).length}
                            </p>
                          </div>
                          <div className="bg-purple-100 p-2 rounded-full">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#7C3AED">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de documentos */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Documentos Enviados</h3>
                    </div>
                    
                    {uploadedDocuments.length === 0 ? (
                      <div className="p-12 text-center">
                        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" className="mx-auto mb-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento enviado</h4>
                        <p className="text-gray-600 mb-4">Comece fazendo upload de suas notas fiscais e recibos</p>
                        <button
                          onClick={() => setShowDocumentModal(true)}
                          className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          Enviar Primeiro Documento
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Documento</th>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Tipo</th>
                              <th className="text-left py-3 px-6 font-medium text-gray-700">Descrição</th>
                              <th className="text-right py-3 px-6 font-medium text-gray-700">Valor</th>
                              <th className="text-center py-3 px-6 font-medium text-gray-700">Data</th>
                              <th className="text-center py-3 px-6 font-medium text-gray-700">Status</th>
                              <th className="text-center py-3 px-6 font-medium text-gray-700">Ações</th>
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
                /* Central de Relatórios - Estilo ContaAzul com Abas */
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Abas/Tabs estilo QuickBooks */}
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8 px-6">
                        {[
                          { id: 'financial', label: 'Bank transactions', active: true },
                          { id: 'cashflow', label: 'App transactions' },
                          { id: 'revenue', label: 'Receipts' },
                          { id: 'client', label: 'Reconcile' },
                          { id: 'goals', label: 'Rules' },
                          { id: 'trends', label: 'Chart of accounts' },
                          { id: 'comparative', label: 'Recurring transactions' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setCurrentReport(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              currentReport === tab.id || (currentReport === '' && tab.active)
                                ? 'border-primary-teal text-primary-teal'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Filtros Avançados */}
                    <div className="p-6 bg-gray-50">
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

                        <div className="flex items-end space-x-3">
                          <div className="flex-1">
                            <button className="w-full bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
                              🔍 Filtrar
                            </button>
                          </div>
                          
                          {/* Botão Atualizar/Sincronizar */}
                          <div className="flex space-x-2">
                            <button 
                              onClick={handleRefreshData}
                              data-refresh
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center min-w-[40px]"
                              title="Atualizar dados"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            </button>
                            
                            {/* Botão Exportar CSV */}
                            <button 
                              onClick={exportToCSV}
                              className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center min-w-[40px] shadow-sm"
                              title="Exportar CSV"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            
                            {/* Botão Adicionar Movimento */}
                            <button 
                              onClick={() => setShowAddModal(true)}
                              className="bg-slate-700 text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium flex items-center justify-center min-w-[40px] shadow-sm"
                              title="Adicionar movimento"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
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
                        {(currentReport === 'financial' || currentReport === '') && '💰 Transações Bancárias'}
                        {currentReport === 'cashflow' && '📱 Transações de App'}
                        {currentReport === 'revenue' && '🧾 Recibos e Comprovantes'}
                        {currentReport === 'client' && '🔄 Reconciliação'}
                        {currentReport === 'goals' && '📋 Regras de Negócio'}
                        {currentReport === 'trends' && '📊 Plano de Contas'}
                        {currentReport === 'comparative' && '🔁 Transações Recorrentes'}
                      </h3>
                      <div className="flex gap-2">
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                          📤 Exportar
                        </button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                          🖨️ Imprimir
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
                        className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center space-x-2 shadow-sm"
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
                                    className="text-red-600 hover:text-red-800 transition-colors"
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
              
              {/* Transações View */}
              {(currentView === 'transactions' || (!['dashboard', 'documents', 'reports', 'banks', 'faturas', 'contatos'].includes(currentView))) && (
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
                          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
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
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center space-x-2"
                            title="Atualizar dados"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Atualizar</span>
                          </button>
                          
                          <button 
                            onClick={exportToCSV}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center space-x-2"
                            title="Exportar CSV"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Exportar</span>
                          </button>
                          
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium flex items-center space-x-2 shadow-sm"
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
                                    className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
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
                    <h1 className="text-2xl font-bold text-dark-gray">� Sistema de Faturas</h1>
                    <button
                      onClick={() => setShowInvoiceModal(true)}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
                    >
                      + Nova Fatura
                    </button>
                  </div>

                  {/* Cards de Estatísticas de Faturas */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2">💰</div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Total Faturas</h3>
                      <p className="text-2xl font-bold text-primary-teal">{invoices.length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2">✅</div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Pagas</h3>
                      <p className="text-2xl font-bold text-green-600">{invoices.filter(inv => inv.status === 'Pago').length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2">⏳</div>
                      <h3 className="text-lg font-semibold text-dark-gray mb-1">Pendentes</h3>
                      <p className="text-2xl font-bold text-orange-600">{invoices.filter(inv => inv.status === 'Pendente').length}</p>
                    </div>
                    <div className="glass-effect rounded-xl p-6 text-center">
                      <div className="text-3xl mb-2">📊</div>
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
                          📊 Faturas Pagas
                        </button>
                        <button className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-medium">
                          ⏳ Pendentes
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium">
                          ⚠️ Vencidas
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
                                    className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
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
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
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
                    <h1 className="text-2xl font-bold text-dark-gray">🤝 Gestão de Relacionamentos</h1>
                    <button
                      onClick={() => setShowContactModal(true)}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
                    >
                      + Novo Contato
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
                          placeholder="🔍 Buscar por nome, email, telefone..."
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
                                    className="px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
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
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
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
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddSubmit}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
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
                      onClick={() => setShowDocumentModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleDocumentUpload} className="space-y-4">
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
                            📄 {newDocument.file.name}
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
                        onClick={() => setShowDocumentModal(false)}
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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="glass-effect p-8 rounded-xl w-full max-w-4xl h-3/4 overflow-y-auto">
                <h2 className="text-xl font-semibold text-dark-gray mb-6">Histórico de Edições</h2>
                <table className="w-full">
                  <thead>
                    <tr className="bg-dark-gray text-white">
                      <th className="p-3 text-left">Data Lançamento</th>
                      <th className="p-3 text-left">Histórico</th>
                      <th className="p-3 text-left">Descrição</th>
                      <th className="p-3 text-left">Valor (R$)</th>
                      <th className="p-3 text-left">Origem</th>
                      <th className="p-3 text-left">Ação</th>
                      <th className="p-3 text-left">Detalhes</th>
                      <th className="p-3 text-left">Data Alteração</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((history, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-3">{history['Data Lançamento'] || '-'}</td>
                        <td className="p-3">{history.Histórico || '-'}</td>
                        <td className="p-3">{history.Descrição || '-'}</td>
                        <td className="p-3">{history.Valor ? history.Valor.toFixed(2) : '-'}</td>
                        <td className="p-3">{history.Origem || '-'}</td>
                        <td className="p-3">{history.Ação || '-'}</td>
                        <td className="p-3">{history.Detalhes || '-'}</td>
                        <td className="p-3">{history.DataAlteração || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                >
                  Fechar
                </button>
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
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Modal */}
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
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
