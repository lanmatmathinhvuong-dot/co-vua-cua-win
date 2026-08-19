import React from 'react';
import { ChessPiece } from './ChessPiece';
import { sound } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
  onOpenGuide: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onOpenGuide }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-amber-100 via-amber-50 to-yellow-100 select-none overflow-hidden relative">
      {/* Playful Floating Red & Gold Background Accents */}
      <div className="absolute top-5 left-5 text-4xl sm:text-5xl animate-bounce duration-1000 select-none pointer-events-none">
        🎈
      </div>
      <div className="absolute top-10 right-6 text-4xl sm:text-5xl animate-bounce delay-300 select-none pointer-events-none">
        🎈
      </div>
      <div className="absolute bottom-12 left-6 text-3xl sm:text-4xl animate-pulse select-none pointer-events-none">
        🎁
      </div>
      <div className="absolute bottom-12 right-6 text-3xl sm:text-4xl animate-pulse delay-500 select-none pointer-events-none">
        ⭐
      </div>
      <div className="absolute top-1/4 left-4 text-3xl text-amber-400 opacity-80 select-none pointer-events-none">
        ⭐
      </div>
      <div className="absolute top-1/3 right-5 text-3xl text-red-400 opacity-70 select-none pointer-events-none">
        ✨
      </div>

      {/* Top Birthday Ribbon in Festive Red & Gold */}
      <header className="w-full max-w-lg mx-auto text-center pt-2 sm:pt-4 z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 text-amber-100 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-black text-base sm:text-lg shadow-xl shadow-red-500/25 border-3 border-amber-300 transform -rotate-1 hover:rotate-0 transition-transform">
          <span className="text-xl sm:text-2xl animate-bounce">🎂</span>
          <span className="text-white drop-shadow-xs">Chúc mừng sinh nhật Win 7 tuổi!</span>
          <span className="text-xl sm:text-2xl animate-bounce">🎉</span>
        </div>
      </header>

      {/* Center Gift & Welcome Card */}
      <main className="w-full max-w-md mx-auto my-auto text-center bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-500 relative z-10 ring-4 ring-amber-300/60">
        {/* Animated Friendly Chess Piece Mascots with Red & Gold touches */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-3xl p-2.5 border-3 border-amber-400 shadow-md transform -rotate-6 hover:rotate-0 transition-transform">
            <ChessPiece type="k" color="w" size="100%" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-red-500 animate-pulse">
            👑
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-3xl p-2.5 border-3 border-red-400 shadow-md transform rotate-6 hover:rotate-0 transition-transform">
            <ChessPiece type="k" color="b" size="100%" />
          </div>
        </div>

        {/* Title in Proud Red */}
        <h1 className="text-3xl sm:text-4xl font-black text-red-600 tracking-tight mb-2 drop-shadow-xs flex items-center justify-center gap-2">
          <span>⭐</span>
          <span>Cờ Vua Của Win</span>
          <span>⭐</span>
        </h1>

        {/* Birthday Blessing Message in Warm Gold & Red Accent */}
        <div className="bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 p-3.5 sm:p-4 rounded-2xl border-2 border-amber-300 shadow-inner mb-6">
          <p className="text-amber-950 font-extrabold text-base sm:text-lg leading-snug">
            “Chúc con luôn thông minh, vui vẻ và yêu cờ vua.” 🌟
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5">
          {/* Main Prominent Button in Festive Red & Gold */}
          <button
            onClick={() => {
              sound.playSelect();
              onStart();
            }}
            className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:to-rose-600 text-amber-100 font-black text-xl sm:text-2xl shadow-xl shadow-red-500/35 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-3 border-3 border-amber-300 group"
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">🎮</span>
            <span className="text-white drop-shadow-sm tracking-wide">Vào chơi cờ</span>
            <span className="text-amber-200">⭐</span>
          </button>

          {/* Guide Button in Soft Warm Gold */}
          <button
            onClick={() => {
              sound.playSelect();
              onOpenGuide();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-100 hover:bg-amber-200 text-red-900 font-extrabold text-base sm:text-lg border-2 border-amber-400 shadow-sm active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📖</span>
            <span>Hướng dẫn chơi</span>
          </button>
        </div>

        {/* Kid safety guarantee */}
        <div className="mt-5 pt-3.5 border-t border-amber-100 flex items-center justify-center gap-2 text-xs font-bold text-amber-800/80">
          <span>🛡️</span>
          <span>Không quảng cáo • Chơi 2 người trên 1 máy • Tặng bé Win</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs sm:text-sm text-red-800/80 font-bold pb-2 z-10">
        Món quà sinh nhật đặc biệt dành tặng bé Win 🎂
      </footer>
    </div>
  );
};
