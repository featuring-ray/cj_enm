import { Routes, Route, Link } from 'react-router-dom'
import { Home, Settings, ChevronRight } from 'lucide-react'

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center hover:shadow-md transition-shadow">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Home size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">CJ ENM Project</h1>
        <p className="text-slate-500 mb-8">React + TailwindCSS + Vite Setup is complete.</p>

        <Link
          to="/settings"
          className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl transition-colors w-full font-medium"
        >
          <span>Go to Settings</span>
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center hover:shadow-md transition-shadow">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Settings size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-500 mb-8">Routing is working perfectly.</p>

        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl transition-colors w-full font-medium"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 px-6 py-4 flex items-center justify-between z-10">
        <div className="font-bold text-lg text-slate-800 tracking-tight">CJ<span className="text-blue-600">ENM</span></div>
        <nav className="flex space-x-6">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/settings" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Settings</Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
