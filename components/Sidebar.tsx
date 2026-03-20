"use client";

import { Home, Search, Library, PlusSquare, Heart, Music2, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile/Tablet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={[
          "flex flex-col h-full bg-black p-6 gap-8 select-none z-40 transition-transform duration-300 ease-in-out",
          // Desktop: always visible, part of flex flow
          "lg:relative lg:translate-x-0 lg:w-[240px] lg:flex-shrink-0",
          // Mobile/Tablet: fixed drawer from left
          "max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:bottom-0 max-lg:w-[280px]",
          isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
        ].join(" ")}
      >
        {/* Logo + Close button row */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Music2 className="text-black w-5 h-5 fill-current" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">Spotify Clone</span>
          </div>
          {/* Close button — mobile/tablet only */}
          <button
            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <div className="sidebar-link active">
            <Home className="w-6 h-6" />
            <span>Home</span>
          </div>
          <div className="sidebar-link">
            <Search className="w-6 h-6" />
            <span>Search</span>
          </div>
          <div className="sidebar-link">
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </div>
        </nav>

        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2">Playlists</h3>
          <div className="sidebar-link">
            <div className="p-1 bg-gray-400 rounded-sm">
              <PlusSquare className="w-4 h-4 text-black" />
            </div>
            <span>Create Playlist</span>
          </div>
          <div className="sidebar-link">
            <div className="p-1 bg-gradient-to-br from-indigo-700 to-blue-300 rounded-sm">
              <Heart className="w-4 h-4 text-white fill-current" />
            </div>
            <span>Liked Songs</span>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto scrollbar-none">
            {['Discover Weekly', 'Release Radar', 'Daily Mix 1', 'Chill Vibes', 'Gym Motivation'].map((playlist) => (
              <div key={playlist} className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer truncate px-2">
                {playlist}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
