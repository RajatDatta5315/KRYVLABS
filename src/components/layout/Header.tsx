import { UserNav } from './UserNav';
import { useState, useEffect } from 'react';

const Header = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-[52px] border-b border-lab-border bg-lab-panel/80 backdrop-blur-xl flex items-center px-5 justify-between flex-shrink-0 z-40">
      <div className="flex items-center gap-3">
        {/* Your logo from /public/logo.png */}
        <img
          src="/logo.png"
          alt="KRYVLABS"
          className="w-7 h-7 rounded-lg object-contain"
        />
        <div>
          <span className="font-display font-bold text-sm text-white tracking-tight">KRYVLABS</span>
          <span className="text-lab-muted font-mono text-[10px] ml-2">// agent factory</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="status-dot-active" />
          <span className="font-mono text-[10px] text-lab-muted">SYSTEM ONLINE</span>
        </div>
        <span className="font-mono text-[10px] text-lab-muted tabular-nums">
          {time.toLocaleTimeString('en-US', { hour12: false })} UTC
        </span>
      </div>

      <UserNav />
    </header>
  );
};
export default Header;
