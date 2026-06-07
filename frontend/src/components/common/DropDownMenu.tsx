import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface DropDownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropDownMenuProps {
  options: DropDownOption[];
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

const DropDownMenu = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
}: DropDownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = containerRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const minWidth = 160; // ensure enough space for labels
    setMenuPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX, width: Math.max(rect.width, minWidth) });

    const handleResize = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + window.scrollY + 8, left: r.left + window.scrollX, width: r.width });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  const handleSelection = (option: DropDownOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {label && <p className="mb-2 text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-bg-surface px-4 py-2.5 text-left text-sm font-medium text-white transition hover:border-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/50 ${buttonClassName}`}
      >
        <span className={`${selectedOption ? 'text-white' : 'text-text-muted'}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-accent" />
      </button>

      {isOpen && menuPos
        ? createPortal(
            <div
              ref={menuRef}
              style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
              className={`absolute z-50 mt-2 overflow-hidden rounded-3xl border border-border/80 bg-bg-surface/95 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl ${menuClassName}`}
            >
              <ul className="max-h-64 overflow-y-auto p-2">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li key={option.value} className="rounded-2xl">
                      <button
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleSelection(option)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm text-left transition ${
                          option.disabled
                            ? 'cursor-not-allowed text-text-muted opacity-50'
                            : isSelected
                            ? 'bg-accent/15 text-white'
                            : 'text-text-muted hover:bg-border/60 hover:text-white'
                        }`}
                      >
                        <span className="whitespace-nowrap">{option.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-accent" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default DropDownMenu;
