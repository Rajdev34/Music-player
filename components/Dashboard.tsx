"use client";

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchTracks, setCurrentIndex, togglePlayPause } from '@/redux/musicSlice';
import Sidebar from './Sidebar';
import Player from './Player';
import Loader from './ui/Loader';
import { Search, ChevronLeft, ChevronRight, User, Play, Pause, Disc3, Heart, MoreHorizontal, Grid, Menu } from 'lucide-react';

export default function Dashboard() {
  const dispatch = useDispatch() as any;
const { tracks, currentIndex, loading, isPlaying } = useSelector((state: RootState) => (state as any).music);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    dispatch(fetchTracks({offset :0}));
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(fetchTracks({ query: searchQuery, offset: 0 }));
      setOffset(0);
  };

const playTrack = (index: number) => {
    dispatch(setCurrentIndex(index));
    dispatch(togglePlayPause());
  };

  const loadmore = useCallback(() => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    dispatch(fetchTracks({offset: newOffset}))
  },[setOffset, offset, dispatch]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
   const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

   const isBottom = scrollHeight - scrollTop <= clientHeight + 100;

   if (isBottom && !loading) {
      loadmore();
   }
   }, [loadmore, loading]);

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden spotify-main-gradient font-lexend">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div onScroll={handleScroll} className="flex-1 flex flex-col min-h-0 bg-gradient-to-t from-black/80 to-[#121212]/30 relative overflow-y-auto scrollbar-none m-2 rounded-xl">
          <header className="sticky top-0 z-20 p-4 md:p-6 flex items-center justify-between bg-black/10 backdrop-blur-md gap-3">
             <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                {/* Hamburger — mobile/tablet only */}
                <button
                  className="lg:hidden flex-shrink-0 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-zinc-300" />
                </button>

                <div className="flex items-center gap-2 flex-shrink-0">
                   <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60">
                      <ChevronLeft className="w-5 h-5 text-zinc-400" />
                   </div>
                   <div className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center cursor-not-allowed">
                      <ChevronRight className="w-5 h-5 text-zinc-700" />
                   </div>
                </div>
                <form onSubmit={handleSearch} className="relative group flex-1 min-w-0 max-w-80">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                   <input 
                      type="text" 
                      placeholder="What do you want to listen to?" 
                      className="bg-zinc-800/80 hover:bg-zinc-800/90 focus:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-white border-white/5 py-2 pl-10 pr-4 rounded-full w-full text-sm placeholder:text-zinc-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </form>
             </div>
             
             <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                <button className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-white hover:scale-105 transition-all">Support</button>
                <div className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 border border-white/5">
                   <User className="w-5 h-5 text-zinc-300" />
                </div>
             </div>
          </header>

          <main className="flex-1 px-4 md:px-8 pb-32">
             <div className="mb-8 md:mb-10">
                <h1 className="text-2xl md:text-4xl font-black mb-2 md:mb-4 tracking-tight">Welcome to Spotify Clone</h1>
                <p className="text-zinc-400 text-sm font-medium">Powered by Jamendo Music</p>
             </div>

             <div className="mb-12">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight hover:underline cursor-pointer">
                     Browse Albums
                  </h2>
                  <span className="text-xs font-bold text-zinc-400 hover:text-white uppercase cursor-pointer tracking-wider">
                     Show all
                  </span>
               </div>

               {loading && tracks.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                     {[...Array(12)].map((_, i) => (
                     <div
                        key={i}
                        className="bg-zinc-800/50 h-[200px] md:h-[240px] rounded-xl animate-pulse"
                     />
                     ))}
                  </div>
               ) : (
                  <>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                     {tracks.map((track: any, index: number) => (
                        <div
                           key={`${track.id}-${index}`}
                           className="bg-zinc-900/40 hover:bg-zinc-800/60 p-3 md:p-4 rounded-xl group transition-all duration-300 border border-white/5 shadow-xl relative"
                        >
                           <div className="aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-3 md:mb-4 shadow-2xl relative">
                           {track.album_image || track.image ? (
                              <img
                                 src={track.album_image || track.image}
                                 alt={track.name}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                 <Disc3 className="w-16 h-16 text-zinc-700 animate-spin-slow" />
                              </div>
                           )}

                           <button 
                              className="absolute bottom-2 right-2 w-10 h-10 md:w-12 md:h-12 bg-spotify-green rounded-full shadow-2xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation();
                                playTrack(index);
                              }}
                           >
                              {(currentIndex === index && isPlaying) ? (
                                 <Pause className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" />
                              ) : (
                                 <Play className="w-5 h-5 md:w-6 md:h-6 text-black fill-current ml-1" />
                              )}
                           </button>
                           </div>

                           <h3 className="text-xs md:text-sm font-bold truncate mb-1">
                           {track.name}
                           </h3>
                           <p className="text-xs text-zinc-500 font-medium truncate">
                           {track.artist_name}
                           </p>
                        </div>
                     ))}
                     </div>
                  {loading && <Loader />}
                  </>
               )}
            </div>

             {/* Library View (as requested: artists, albums, tracks) */}
             {/* <div className="flex flex-col gap-8">
                <div>
                   <h2 className="text-2xl font-black mb-6 tracking-tight">Your Library</h2>
                   <div className="space-y-4">
                      {tracks.slice(12, 20).map((track: any, index: number) => {
                         const actualIndex = index + 12;
                         const isActive = currentIndex === actualIndex;
                         return (
                            <div 
                               key={track.id} 
                               className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 group transition-colors cursor-pointer ${isActive ? 'bg-white/10' : ''}`}
                               onClick={() => playTrack(actualIndex)}
                            >
                               <div className="w-10 h-10 bg-zinc-800 rounded shadow flex items-center justify-center relative overflow-hidden">
                                  {track.album_image || track.image ? (
                                     <img src={track.album_image || track.image} className="w-full h-full object-cover" />
                                  ) : (
                                     <Disc3 className="w-6 h-6 text-zinc-600" />
                                  )}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <h4 className={`text-sm font-bold truncate ${isActive ? 'text-spotify-green' : 'text-white'}`}>{track.name}</h4>
                                  <p className="text-xs text-zinc-500 font-medium truncate">{track.artist_name}</p>
                               </div>
                               <div className="text-xs text-zinc-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Heart className="w-4 h-4" />
                               </div>
                               <div className="text-xs text-zinc-500 font-medium tabular-nums ml-4">
                                  {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '3:45'}
                               </div>
                               <MoreHorizontal className="w-5 h-5 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                            </div>
                         );
                      })}
                   </div>
                </div>
             </div> */}
          </main>
        </div>
      </div>

      {/* Persistent Player */}
      <Player />
    </div>
  );
}
