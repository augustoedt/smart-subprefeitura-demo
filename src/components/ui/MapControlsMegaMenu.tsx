import React, { ReactNode, useId } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface MapControlsMegaMenuGroup {
  id: string;
  label: string;
  value?: string;
  icon: ReactNode;
  content: ReactNode;
}

interface MapControlsMegaMenuProps {
  groups: MapControlsMegaMenuGroup[];
}

export default function MapControlsMegaMenu({ groups }: MapControlsMegaMenuProps) {
  const instanceId = useId().replace(/:/g, '');
  const menuId = `map-megamenu-${instanceId}`;

  const closeOpenPopovers = () => {
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[id^="map-megamenu-"]:popover-open').forEach((popover) => {
        popover.hidePopover();
      });
    });
  };

  return (
    <div className="absolute left-3 right-3 top-3 z-[35] pointer-events-none sm:left-4 sm:right-4">
      <button
        type="button"
        className="btn btn-sm pointer-events-auto border-slate-700 bg-slate-900/95 text-white shadow-xl backdrop-blur-md hover:bg-slate-800 sm:hidden"
        popoverTarget={menuId}
        aria-label="Abrir controles do mapa"
      >
        <SlidersHorizontal className="h-4 w-4 text-sky-400" />
        Controles
      </button>

      <div
        id={menuId}
        popover="auto"
        className="megamenu megamenu-xs megamenu-wide max-sm:megamenu-vertical pointer-events-auto w-full border border-slate-700/80 bg-slate-900/95 p-1 text-white shadow-2xl backdrop-blur-md sm:rounded-xl"
      >
        <span className="megamenu-active bg-white/10" aria-hidden="true" />

        {groups.map((group) => {
          const popoverId = `${menuId}-${group.id}`;

          return (
            <React.Fragment key={group.id}>
              <button
                type="button"
                popoverTarget={popoverId}
                className="min-w-0 gap-1.5 rounded-lg px-2 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                {group.icon}
                <span className="text-[10px] font-semibold">{group.label}</span>
                {group.value && (
                  <span className="max-w-24 truncate text-[9px] font-medium text-slate-400">
                    {group.value}
                  </span>
                )}
              </button>

              <div
                id={popoverId}
                popover="auto"
                className="max-w-none overflow-visible border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl"
                onClickCapture={(event) => {
                  if ((event.target as HTMLElement).closest('[data-close-megamenu]')) {
                    closeOpenPopovers();
                  }
                }}
              >
                <div className="flex min-h-12 flex-wrap items-center gap-1.5 p-2">
                  {group.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
