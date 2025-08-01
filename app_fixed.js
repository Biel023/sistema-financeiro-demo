const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

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

  const sidebarOptions = [
    { label: "Sincronizar Extratos", action: handleFilter },
    { label: "Adicionar Movimento", action: () => setShowAddModal(true) },
    { label: "Histórico", action: () => setShowHistoryModal(true) },
    { label: "Exportar CSV", action: exportToCSV },
  ];

  const filteredSidebarOptions = sidebarOptions.filter(opt =>
    opt.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

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
    const updatedData = [...data, { ...newRow, Saldo: data.length > 0 ? (parseFloat(data[data.length - 1].Saldo) + newRow.Valor).toFixed(2) : newRow.Valor }];
    setData(updatedData);
    setFilteredData(updatedData);
    trackChange('Adicionado', newRow);
    setShowAddModal(false);
    setNewRow({
      'Data Lançamento': '',
      Histórico: '',
      Descrição: '',
      Valor: 0,
      Saldo: 0,
      Origem: 'Banco',
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

  const chartData = filteredData.map(row => ({
    date: row['Data Lançamento'],
    saldo: row.Saldo,
  }));

  return (
    <>
      {!isLoggedIn ? (
        <div className="min-h-screen bg-gradient-to-br from-primary-teal to-dark-gray flex items-center justify-center p-4">
          <div className="glass-effect p-8 rounded-xl shadow-2xl w-full max-w-md animate-slide-up">
            <h2 className="text-3xl font-bold text-dark-gray mb-6 text-center font-inter">Bem-vindo ao Financeiro</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Usuário"
                className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold font-inter"
                onChange={e => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full p-3 rounded-lg bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-gold font-inter"
                onChange={e => setPassword(e.target.value)}
              />
              <button
                onClick={handleLogin}
                className="w-full p-3 bg-accent-gold text-dark-gray font-semibold rounded-lg hover:bg-yellow-400 transition-colors font-inter hover-scale"
              >
                Entrar
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-black font-inter">
              Gestão financeira simplificada e moderna
            </p>
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
                      className="w-full text-left px-4 py-2 rounded-lg"
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
                <h2 className="text-2xl font-semibold text-dark-gray ml-16">Financeiro</h2>
                
                {/* Ações do usuário no canto direito */}
                <div className="flex items-center space-x-4">
                  {/* Botão Configurações */}
                  <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#374151">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Botão Notificações */}
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
                      className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
                  <h3 className="text-lg font-semibold text-dark-gray mb-4">Histórico de Transações</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Histórico</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Valor</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Origem</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((row, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {row['Data Lançamento']}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {row.Histórico}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              {row.Descrição}
                            </td>
                            <td className={`py-3 px-4 text-sm text-right font-medium ${
                              row.Valor > 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                              R$ {Math.abs(row.Valor).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm text-center text-gray-600">
                              {row.Origem}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleEdit(row, index)}
                                className="px-3 py-1 bg-accent-gold text-dark-gray rounded-lg hover:bg-yellow-400 transition-colors text-sm"
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
                    className="px-4 py-2 bg-accent-gold text-dark-gray rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="glass-effect p-8 rounded-xl w-full max-w-md animate-slide-up">
                <h2 className="text-xl font-semibold text-dark-gray mb-6">Adicionar Movimento</h2>
                <input
                  type="text"
                  value={newRow['Data Lançamento']}
                  onChange={e => setNewRow({ ...newRow, 'Data Lançamento': e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Data Lançamento"
                />
                <input
                  type="text"
                  value={newRow.Histórico}
                  onChange={e => setNewRow({ ...newRow, Histórico: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Histórico"
                />
                <input
                  type="text"
                  value={newRow.Descrição}
                  onChange={e => setNewRow({ ...newRow, Descrição: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Descrição"
                />
                <input
                  type="number"
                  value={newRow.Valor}
                  onChange={e => setNewRow({ ...newRow, Valor: parseFloat(e.target.value) })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                  placeholder="Valor"
                />
                <select
                  value={newRow.Origem}
                  onChange={e => setNewRow({ ...newRow, Origem: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-accent-gold"
                >
                  <option value="Banco">Banco</option>
                </select>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 text-dark-gray rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddSubmit}
                    className="px-4 py-2 bg-accent-gold text-dark-gray rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    Salvar
                  </button>
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
                  className="mt-6 px-4 py-2 bg-accent-gold text-dark-gray rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
