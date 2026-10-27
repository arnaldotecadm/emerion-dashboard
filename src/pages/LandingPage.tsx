import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  X,
  Send,
  Receipt,
  Database,
  Network,
  Maximize2,
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Boxes,
  Activity,
} from 'lucide-react';
import EmerionBrandLogo from '../components/EmerionBrandLogo';
import cockpitImg from '../assets/images/cockpit_executivo_1787559312663.jpg';
import comercialImg from '../assets/images/inteligencia_comercial_1787559324051.jpg';
import financeiroImg from '../assets/images/saude_financeira_1787559337003.jpg';
import estoqueImg from '../assets/images/inteligencia_estoque_1787559348726.jpg';

interface LandingPageProps {
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  const [activeImageTab, setActiveImageTab] = useState<'cockpit' | 'comercial' | 'financeiro' | 'estoque' | 'nfe'>('cockpit');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  // Preview capabilities data guided by the provided images
  const previewCapabilities = [
    {
      id: 'cockpit' as const,
      label: 'Cockpit Executivo',
      icon: LayoutDashboard,
      badge: 'Visão Geral & Faturamento',
      title: 'Acompanhamento Consolidado de Vendas e Rentabilidade',
      brief: 'Visibilidade em tempo real do faturamento acumulado, taxa de conversão do pipeline e apuração do markup médio real praticado.',
      image: cockpitImg,
      metricTag: 'Markup Médio: 148.8% • Conversão: 67.5%'
    },
    {
      id: 'comercial' as const,
      label: 'Inteligência Comercial',
      icon: TrendingUp,
      badge: 'Curva ABC & Clientes',
      title: 'Concentração de Carteira & Prevenção de Inatividade',
      brief: 'Identificação imediata das contas estratégicas da Classe A e alertas automáticos de clientes sem compras para tomada de decisão ágil.',
      image: comercialImg,
      metricTag: 'Classe A: 70.7% da Receita • Monitoramento Ativo'
    },
    {
      id: 'financeiro' as const,
      label: 'Saúde Financeira',
      icon: Wallet,
      badge: 'Fluxo 30 Dias & Liquidez',
      title: 'Projeção Diária de Caixa & Conciliação de Títulos',
      brief: 'Curva de liquidez dia a dia para os próximos 30 dias, apontando datas críticas de desembolso e controle de inadimplência.',
      image: financeiroImg,
      metricTag: 'Projeção 30D • Inadimplência: 3.4%'
    },
    {
      id: 'estoque' as const,
      label: 'Estoque & Reposição',
      icon: Boxes,
      badge: 'Custos & Insumos',
      title: 'Custos de Reposição & Prevenção de Ruptura',
      brief: 'Cruzamento de saldos físicos com o ritmo de produção, comparando o custo médio ponderado e os reajustes da última compra.',
      image: estoqueImg,
      metricTag: 'Capital Estocado • Alerta de Ponto Mínimo'
    },
    {
      id: 'nfe' as const,
      label: 'Auditoria de NF-e',
      icon: Receipt,
      badge: 'Fiscal • Em Pouco Tempo',
      title: 'Cruzamento de Notas Fiscais: Entradas vs Saídas',
      brief: 'Auditoria fiscal através da leitura direta dos XMLs da SEFAZ para apurar tributos (ST, DIFAL) e calcular a margem líquida real nota a nota.',
      image: null, // Visual card representation
      metricTag: 'Adição Iminente • Rentabilidade Líquida Real'
    }
  ];

  const currentPreview = previewCapabilities.find(p => p.id === activeImageTab) || previewCapabilities[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-slate-950">
      
      {/* Lightbox Modal para visualização ampliada das imagens */}
      {lightboxOpen && currentPreview.image && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-7xl w-full">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
              title="Fechar"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={currentPreview.image}
              alt={currentPreview.title}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-white">{currentPreview.title}</span>
              <span className="font-mono text-emerald-300">{currentPreview.metricTag}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Imponente */}
      <header className="sticky top-0 z-40 relative border-b border-slate-200 bg-white/95 px-6 py-3.5 shadow-md shadow-slate-900/5 backdrop-blur-xl transition-all sm:px-10 sm:py-4">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            className="rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Voltar ao início"
          >
            <EmerionBrandLogo
              size="lg"
              subtitleText="EXTRAÇÃO UNIVERSAL DE DADOS • CONEXÃO VIA API"
            />
          </button>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-emerald-700/20 ring-1 ring-emerald-300/40 transition-all hover:scale-[1.02] hover:shadow-emerald-700/30 active:scale-[0.98] sm:text-sm"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal Minimalista & Guiado pelas Imagens */}
      <main className="space-y-20 pb-20">
          
          {/* Hero Minimalista */}
          <section className="relative pt-16 pb-6 px-6 sm:px-10 text-center max-w-6xl mx-auto">
            {/* Efeito Glow Suave */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Badge Factual */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card border border-emerald-200 text-emerald-800 text-xs font-medium shadow-sm">
                <Network className="w-3.5 h-3.5" />
                <span>Ferramenta de extração de dados conectável a qualquer sistema via API</span>
              </div>

              {/* Título Principal */}
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Inteligência Analítica & Tomada de Decisão
              </h1>

              {/* Descrição Concisa (Poucas informações) */}
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mx-auto leading-relaxed">
                O Emerion Web conecta-se a qualquer banco de dados ou ERP através de API para extrair indicadores essenciais de vendas, margens, caixa e, em pouco tempo, Notas Fiscais (NF-e).
              </p>

              {/* Ações Centrais */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onSignIn}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-700/20 transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Acessar o Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#contato"
                  className="px-5 py-2.5 rounded-xl bg-card hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm transition"
                >
                  Solicitar Integração de Sistema
                </a>
              </div>
            </div>
          </section>

          {/* Vislumbre Visual das Capacidades Guiado pelas Imagens Fornecidas */}
          <section className="px-6 sm:px-10 max-w-7xl mx-auto">
            <div className="space-y-4">
              
              {/* Seletor Visual de Capacidades (Tabs Elegantes) */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {previewCapabilities.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeImageTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveImageTab(tab.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 font-bold'
                          : 'bg-card text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Moldura da Tela / Screenshot com Poucas Informações e Foco Visual */}
              <div className="rounded-3xl bg-card border border-slate-200 p-4 sm:p-6 shadow-xl relative overflow-hidden">
                
                {/* Header da Moldura com Informações Resumidas */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {currentPreview.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Vislumbre do Sistema</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {currentPreview.title}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                      {currentPreview.brief}
                    </p>
                  </div>

                  {/* Tag de Métrica Rápida & Zoom */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-emerald-800">
                      {currentPreview.metricTag}
                    </div>

                    {currentPreview.image && (
                      <button
                        onClick={() => setLightboxOpen(true)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                        title="Ampliar visualização"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Exibição da Imagem Fornecida ou Card Especial de NF-e */}
                {currentPreview.image ? (
                  <div
                    onClick={() => setLightboxOpen(true)}
                    className="relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner"
                  >
                    <img
                      src={currentPreview.image}
                      alt={currentPreview.title}
                      className="w-full h-auto aspect-video object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                    
                    {/* Hover Overlay com Botão de Ampliar */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm shadow-xl flex items-center gap-2">
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                        Clique para ampliar a interface
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Card Especial: Módulo de Notas Fiscais (NF-e) que será adicionado em pouco tempo */
                  <div className="aspect-video w-full rounded-2xl bg-gradient-to-tr from-slate-50 via-card to-emerald-50 border border-emerald-200 p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
                        <Receipt className="w-3.5 h-3.5" />
                        Próxima Adição do Sistema • Em Pouco Tempo
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                        Auditoria de Notas Fiscais Eletrônicas (NF-e)
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                        Conexão direta com XMLs emitidos e autorizados na SEFAZ. O módulo cruzará notas fiscais de entrada de compras com as notas de saída faturadas para apurar tributos e revelar a rentabilidade líquida real de cada pedido.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Entradas vs Saídas</span>
                        <strong className="text-emerald-800">Margem Líquida Real</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Apuração de Impostos</span>
                        <strong className="text-cyan-400">ICMS-ST, DIFAL & IPI</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200">
                        <span className="text-slate-500 block text-[10px]">Validação SEFAZ</span>
                        <strong className="text-purple-400">Zero Divergência Fiscal</strong>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* 3 Pilares Rápidos: Apenas o Essencial (Poucas informações) */}
          <section className="px-6 sm:px-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-card border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Conexão Universal via API</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Liga-se a qualquer banco de dados ou ERP através de API REST sem interromper as telas em uso.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Apoio Direto à Decisão</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consolida dados operacionais em indicadores executivos de rentabilidade, giro de estoque e liquidez.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-slate-200 shadow-sm space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Auditoria Fiscal (Em Breve)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cruzamento automático de notas fiscais de compra e venda para validação de margens e tributos.
                </p>
              </div>

            </div>
          </section>

          {/* Área de Contato e Dúvidas Limpa */}
          <section id="contato" className="px-6 sm:px-10 max-w-6xl mx-auto pt-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-card border border-slate-200 shadow-xl">
              
              <div className="text-center max-w-xl mx-auto mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                  Contato & Integração
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  Dúvidas ou Solicitações sobre o Emerion Web
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Envie observações, tire dúvidas ou solicite a conexão do seu sistema via API:
                </p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Mensagem Enviada!</h4>
                  <p className="text-xs text-slate-600">
                    A equipe responsável pelo Emerion Web recebeu sua mensagem.
                  </p>
                  <button
                    onClick={onSignIn}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Acessar o Painel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Nome / Cargo:</label>
                      <input
                        type="text"
                        required
                        placeholder="Seu nome"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">E-mail:</label>
                      <input
                        type="email"
                        required
                        placeholder="seuemail@empresa.com.br"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Empresa / Sistema Atual:</label>
                    <input
                      type="text"
                      placeholder="Nome da empresa e sistema ERP utilizado"
                      value={contactCompany}
                      onChange={(e) => setContactCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mensagem ou Observação:</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva observações ou parâmetros desejados..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-slate-500">
                      Conexão segura via API e sigilo dos registros operacionais.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Mensagem</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </section>

        </main>

      {/* Rodapé */}
      <footer className="border-t border-slate-200 bg-card px-6 py-8 text-xs text-slate-500 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <EmerionBrandLogo
            size="sm"
            subtitleText="FERRAMENTA DE EXTRAÇÃO DE DADOS • API UNIVERSAL"
          />
          <button
            onClick={onSignIn}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-emerald-800 transition hover:border-emerald-200 hover:bg-emerald-50"
          >
            Acessar Painel do Usuário →
          </button>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
