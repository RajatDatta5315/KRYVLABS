import { Bot, BrainCircuit, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { href: '/', icon: Bot, label: 'Agent Fleet' },
    { href: '/knowledge', icon: BrainCircuit, label: 'Knowledge Base' },
    { href: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
    return (
        <aside className="w-64 border-r border-kryv-border p-4 flex flex-col">
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isActive 
                                    ? 'bg-kryv-panel-dark text-kryv-text-primary' 
                                    : 'text-kryv-text-secondary hover:bg-kryv-panel-dark hover:text-kryv-text-primary'
                            }`
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
