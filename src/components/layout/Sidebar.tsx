import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore"
import { LayoutDashboard, ArrowRightLeft, BellRing, LogOut, Wallet } from "lucide-react"
import { supabase } from "../../core/supabaseClient"

export const Sidebar = () => {
    const user = useAuthStore(store => store.user)
    const navigate = useNavigate()
    const location = useLocation()

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
        { name: 'Reminders', path: '/reminders', icon: BellRing },
    ];

    const handleLogout = async ()=>{
        await supabase.auth.signOut();
        navigate('/login')

    }




    return (
        <>
            <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Wallet className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-gray-800">FinTrack</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                                {user?.email}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )

}
