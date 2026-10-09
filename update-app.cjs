const fs = require('fs');
let code = fs.readFileSync('./src/App.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { X, Info } from 'lucide-react';",
  "import { X, Info, LogOut, User, Building2, HardHat } from 'lucide-react';\nimport { UserSession } from './LoginTypes';\nimport LoginScreen from './components/LoginScreen';"
);

// Add session state
code = code.replace(
  "const [currentSection, setCurrentSection] = useState<Section>('modulo_social');",
  "const [session, setSession] = useState<UserSession | null>(null);\n  const [currentSection, setCurrentSection] = useState<Section>('modulo_social');"
);

// We need to return early if no session
code = code.replace(
  "return (",
  `if (!session) {
    return <LoginScreen onLogin={(s) => {
      setSession(s);
      if (s.role === 'FUNCIONARIO') {
        setCurrentSection('app_campo');
      } else {
        setCurrentSection('sala_situacao');
      }
    }} />;
  }

  const roleLabels = {
    CENTRAL: 'Central (Secretaria)',
    GESTOR: 'Gestor de Subprefeitura',
    FUNCIONARIO: 'Funcionário de Campo'
  };

  const getRoleIcon = () => {
    if (session.role === 'CENTRAL') return <Building2 className="w-4 h-4 text-blue-100" />;
    if (session.role === 'GESTOR') return <User className="w-4 h-4 text-emerald-100" />;
    return <HardHat className="w-4 h-4 text-amber-100" />;
  };

  const activeSubName = session.role === 'GESTOR' 
    ? subprefeituras.find(s => s.id === session.subprefeituraId)?.nome 
    : 'Todas (Visão Global)';

  return (`
);

// Add global header for role
code = code.replace(
  /<div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">/,
  `<div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative pt-10">
      {/* Global Role Header */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-800 text-white flex items-center justify-between px-4 z-50 text-xs font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {getRoleIcon()}
            <span className="opacity-90">{roleLabels[session.role || 'CENTRAL']}</span>
          </div>
          {session.role !== 'FUNCIONARIO' && (
            <>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="text-slate-300">
                Região: <span className="text-white font-bold">{activeSubName}</span>
              </div>
            </>
          )}
          {session.role === 'FUNCIONARIO' && (
             <>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="text-slate-300">
                Matrícula: <span className="text-white font-bold">{session.matricula}</span>
              </div>
            </>
          )}
        </div>
        <button onClick={() => setSession(null)} className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors">
          Trocar Perfil <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>`
);


// Conditionally render sidebar based on role
code = code.replace(
  /<Sidebar\n\s*currentSection=\{currentSection\}\n\s*onSectionChange=\{setCurrentSection\}\n\s*onOpenAbout=\{\(\) => setIsAboutOpen\(true\)\}\n\s*\/>/,
  `{session.role !== 'FUNCIONARIO' && (
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={setCurrentSection} 
          onOpenAbout={() => setIsAboutOpen(true)}
        />
      )}`
);

fs.writeFileSync('./src/App.tsx', code);
console.log('done');
