"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation, Map, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface NavigationDropdownProps {
  lat: number;
  lng: number;
}

export function NavigationDropdown({ lat, lng }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('StationDetail');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center gap-2 rounded bg-[#0078BE] py-3 font-medium text-white transition-colors hover:bg-[#006098]"
      >
        <Navigation className="h-5 w-5" />
        <span>{t('startRoute')}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg z-10">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-[#003050] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Map className="h-4 w-4" />
            Google Maps
          </a>
          <a
            href={`http://maps.apple.com/?daddr=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-[#003050] hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            <Map className="h-4 w-4" />
            Apple Maps
          </a>
        </div>
      )}
    </div>
  );
}
