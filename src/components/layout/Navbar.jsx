import { Search, User, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-skin-primary">
                    <Droplets /> GlowCare
                </Link>
                <div className="hidden md:flex space-x-8 text-slate-600 font-medium">
                    <Link to="/analysis" className="hover:text-skin-primary transition">Analysis</Link>
                    <Link to="/timeline" className="hover:text-skin-primary transition">Treatment + Routine</Link>
                    <Link to="/appointments" className="hover:text-skin-primary transition">Doctors</Link>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <input type="text" placeholder="Search ingredients..." className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary" />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    </div>
                    <User className="text-slate-600 cursor-pointer" />
                </div>
            </div>
        </nav>
    );
}