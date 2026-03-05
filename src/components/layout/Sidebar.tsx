import { NavLink } from 'react-router-dom';
import { Bot, BrainCircuit, Rocket, Settings, LayoutDashboard, ChevronRight } from 'lucide-react';

const navItems = [
  { href: '/',          icon: LayoutDashboard, label: 'Fleet Control',   desc: 'Agent dashboard' },
  { href: '/builder',  icon: Bot,              label: 'Agent Builder',   desc: 'Create & configure' },
  { href: '/knowledge',icon: BrainCircuit,     label: 'Knowledge Base',  desc: 'RAG & memory' },
  { href: '/publish',  icon: Rocket,           label: 'Publish → KRIYEX',desc: 'Deploy to marketplace', highlight: true },
  { href: '/settings', icon: Settings,         label: 'Settings',        desc: 'API keys & config' },
];

const Sidebar = () => (
  <aside className="w-56 border-r border-lab-border flex flex-col bg-lab-panel/40 flex-shrink-0">
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map(({ href, icon: Icon, label, desc, highlight }) => (
        <NavLink
          key={href}
          to={href}
          end={href === '/'}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-xs ${
              isActive
                ? 'bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan'
                : highlight
                ? 'border border-dashed border-lab-cyan/20 text-lab-cyan/70 hover:bg-lab-cyan/5 hover:text-lab-cyan hover:border-lab-cyan/40'
                : 'text-lab-muted hover:bg-lab-glow hover:text-lab-text border border-transparent'
            }`
          }
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-mono font-medium truncate">{label}</p>
            <p className="text-[10px] opacity-60 truncate">{desc}</p>
          </div>
          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
        </NavLink>
      ))}
    </nav>

    {/* Bottom ecosystem badge */}
    <div className="p-3 border-t border-lab-border">
      <a href="https://kryv.network" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-lab-glow transition-all">
        <div className="w-5 h-5 rounded bg-lab-cyan/20 border border-lab-cyan/30 flex items-center justify-center">
          <span className="text-lab-cyan font-mono text-[9px] font-bold">⟁</span>
        </div>
        <div>
          <p className="font-mono text-[10px] text-lab-muted">KRYV NETWORK</p>
          <p className="font-mono text-[9px] text-lab-muted/50">24 products live</p>
        </div>
      </a>
    </div>
  </aside>
);
export default Sidebar;
