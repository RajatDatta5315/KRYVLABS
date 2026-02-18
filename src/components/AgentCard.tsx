import React from 'react';

interface AgentCardProps {
  name: string;
  status: 'ACTIVE' | 'IDLE' | 'SYNCING';
  load: number;
}

export const AgentCard: React.FC<AgentCardProps> = ({ name, status, load }) => {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{name}</h3>
        <span className={`text-[10px] px-2 py-1 rounded bg-black border border-white/10 ${
          status === 'ACTIVE' ? 'text-emerald-400' : 'text-cyan-400'
        }`}>
          {status}
        </span>
      </div>
      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
        <div 
          className="bg-cyan-500 h-full transition-all duration-500" 
          style={{ width: `${load}%` }} 
        />
      </div>
    </div>
  );
};
