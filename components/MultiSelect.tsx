
import React, { useMemo } from 'react';

interface GroupedOption {
  title: string;
  options: string[];
}

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  labels?: Record<string, string>;
  title?: string;
  onEnlarge?: () => void;
  groups?: GroupedOption[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, labels, title = "Select Items", onEnlarge, groups }) => {
  const isAllSelected = selected.length === options.length && options.length > 0;

  const toggleSelection = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleToggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

  const displayGroups = useMemo(() => {
    if (groups && groups.length > 0) return groups;
    return [{ title: '', options: options }];
  }, [groups, options]);

  return (
    <div className="bg-slate-800/20 border border-slate-800/50 p-3.5 rounded-2xl w-full backdrop-blur-md relative group">
      <div className="flex justify-between items-start mb-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-400/90">{title}</span>
          <span className="text-[10px] font-bold text-slate-500 mt-0.5">{selected.length} of {options.length} Selected</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleToggleAll}
            className={`text-[9px] font-black px-2 py-0.5 rounded-lg border transition-all active:scale-95 shadow-md ${
              isAllSelected 
                ? 'bg-slate-700/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white' 
                : 'bg-violet-600/20 text-violet-400 border-violet-500/30 hover:bg-violet-600 hover:text-white'
            }`}
          >
            {isAllSelected ? 'NONE' : 'ALL'}
          </button>

          {onEnlarge && (
            <button 
              onClick={onEnlarge}
              className="text-slate-100 hover:text-violet-400 transition-all p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg shadow-md border border-slate-700/50 group/icon"
              title="View in large screen"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="11" 
                height="11" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="group-hover/icon:scale-110 transition-transform"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[160px] pr-1 py-0.5 space-y-1.5">
        {displayGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.title && (
              <div className="px-1.5 flex items-center gap-2 mb-1">
                 <div className="w-1 h-1 rounded-full bg-violet-500/40"></div>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{group.title}</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              {group.options.map(option => (
                <button
                  key={option}
                  onClick={() => toggleSelection(option)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all border ${
                    selected.includes(option)
                      ? 'bg-violet-600 border-violet-400 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-500 shadow-inner'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                    selected.includes(option) ? 'bg-white text-violet-600 shadow-sm' : 'bg-slate-900/50 text-slate-500 border border-slate-700'
                  }`}>
                    {selected.includes(option) ? <span className="text-[9px] font-black">✓</span> : ''}
                  </div>
                  <span className={`font-bold text-[11px] leading-tight text-left flex-1 break-words ${selected.includes(option) ? 'text-white' : 'text-slate-100'}`}>
                    {labels ? labels[option] : option}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <div className="text-[10px] text-slate-600 font-bold italic py-4 w-full text-center border border-dashed border-slate-800/50 rounded-xl">
            No active sources
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
