import React, { KeyboardEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface ControlDropdownOption {
  id: string;
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onSelect: () => void;
}

interface ControlDropdownProps {
  label: string;
  value: string;
  icon?: ReactNode;
  options: ControlDropdownOption[];
  selectionMode?: 'single' | 'multiple';
  disabled?: boolean;
  disabledReason?: string;
  align?: 'start' | 'end';
  className?: string;
}

export default function ControlDropdown({
  label,
  value,
  icon,
  options,
  selectionMode = 'single',
  disabled = false,
  disabledReason,
  align = 'end',
  className = ''
}: ControlDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvedAlign, setResolvedAlign] = useState(align);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const focusOption = (requestedIndex: number, direction: 1 | -1 = 1) => {
    if (options.length === 0) return;

    let index = requestedIndex;
    for (let attempts = 0; attempts < options.length; attempts += 1) {
      index = (index + options.length) % options.length;
      if (!options[index]?.disabled) {
        optionRefs.current[index]?.focus();
        return;
      }
      index += direction;
    }
  };

  const resolveMenuAlignment = () => {
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    if (!triggerRect) return align;

    const menuWidth = Math.min(288, window.innerWidth - 16);
    const fitsStart = triggerRect.left + menuWidth <= window.innerWidth - 8;
    const fitsEnd = triggerRect.right - menuWidth >= 8;

    if (align === 'start' && !fitsStart && fitsEnd) return 'end';
    if (align === 'end' && !fitsEnd && fitsStart) return 'start';
    return align;
  };

  const openAndFocus = (optionIndex = 0, direction: 1 | -1 = 1) => {
    if (disabled) return;
    setResolvedAlign(resolveMenuAlignment());
    setIsOpen(true);
    requestAnimationFrame(() => focusOption(optionIndex, direction));
  };

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setResolvedAlign(resolveMenuAlignment());
    setIsOpen(true);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openAndFocus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAndFocus(options.length - 1, -1);
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const currentIndex = optionRefs.current.findIndex((element) => element === document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(currentIndex + 1, 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(currentIndex < 0 ? options.length - 1 : currentIndex - 1, -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0, 1);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusOption(options.length - 1, -1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`dropdown ${resolvedAlign === 'end' ? 'dropdown-end' : 'dropdown-start'} ${isOpen ? 'dropdown-open' : ''} ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-sm min-h-8 h-8 gap-1.5 border-slate-700 bg-slate-800/90 px-2.5 font-semibold normal-case text-slate-100 shadow-none hover:border-slate-600 hover:bg-slate-700 disabled:border-slate-800 disabled:bg-slate-900 disabled:text-slate-500"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-describedby={disabledReason ? descriptionId : undefined}
        disabled={disabled}
        title={disabledReason}
        onClick={toggleMenu}
        onKeyDown={handleTriggerKeyDown}
      >
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span>
        <span className="max-w-28 truncate text-xs text-white">{value}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {disabledReason && (
        <span id={descriptionId} className="sr-only">
          {disabledReason}
        </span>
      )}

      {isOpen && !disabled && (
        <ul
          id={menuId}
          role="menu"
          aria-label={label}
          className="dropdown-content menu z-[1000] mt-2 w-72 max-w-[calc(100vw-1rem)] rounded-xl border border-slate-700 bg-slate-950 p-1.5 text-slate-100 shadow-xl"
          onKeyDown={handleMenuKeyDown}
        >
          <li className="menu-title px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </li>
          {options.map((option, index) => (
            <li key={option.id}>
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role={selectionMode === 'multiple' ? 'menuitemcheckbox' : 'menuitemradio'}
                aria-checked={Boolean(option.selected)}
                aria-disabled={option.disabled || undefined}
                disabled={option.disabled}
                className={`my-0.5 flex min-h-11 items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                  option.selected
                    ? 'border-blue-500/60 bg-blue-600/20 text-white'
                    : 'border-transparent text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                }`}
                title={option.disabledReason}
                onClick={() => {
                  option.onSelect();
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
                    selectionMode === 'multiple' ? 'rounded' : 'rounded-full'
                  } ${
                    option.selected
                      ? 'border-blue-400 bg-blue-600 text-white'
                      : 'border-slate-600 bg-slate-900 text-transparent'
                  }`}
                  aria-hidden="true"
                >
                  {option.selected && <Check className="h-3 w-3" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold">{option.label}</span>
                  {(option.description || option.disabledReason) && (
                    <span className="mt-0.5 block text-[10px] leading-snug text-slate-400">
                      {option.disabledReason || option.description}
                    </span>
                  )}
                </span>
                {option.selected && (
                  <span className="badge badge-info badge-xs mt-0.5 border-0 text-[9px] font-bold text-white">
                    Ativo
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
