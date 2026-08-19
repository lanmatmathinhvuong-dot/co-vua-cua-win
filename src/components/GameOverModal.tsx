import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { PieceColor } from './ChessPiece';

interface GameOverModalProps {
  winner: PieceColor | 'draw';
  reason: string;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  reason,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    sound.playVictory();

    // Launch celebratory Red & Gold confetti fireworks
    const duration = 2.8 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      // Left side burst
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: ['#EF4444', '#F59E0B', '#FCD34D', '#DC2626', '#FEF08A', '#EA580C'],
      });
      // Right side burst
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: ['#EF4444', '#F59E0B', '#FCD34D', '#DC2626', '#FEF08A', '#EA580C'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const isDraw = winner === 'draw';
  const isWhiteWin = winner === 'w';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-red-500 text-center transform scale-100 animate-in zoom-in-90 duration-300 relative overflow-hidden ring-4 ring-amber-300/80">
        {/* Warm ambient Red & Gold background flares */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200/70 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-red-200/70 rounded-full blur-xl pointer-events-none" />

        {/* Big Golden Trophy with Red Star Details */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-200 border-4 border-amber-400 flex items-center justify-center text-5xl sm:text-6xl shadow-inner animate-bounce">
            {isDraw ? '🤝' : '🏆'}
          </div>
          <span className="absolute -top-2 -right-2 text-2xl sm:text-3xl animate-spin">⭐</span>
          <span className="absolute -bottom-1 -left-2 text-2xl sm:text-3xl">🎉</span>
        </div>

        {/* Checkmate Tagline in Vibrant Red & Gold */}
        {!isDraw && (
          <div className="inline-block bg-gradient-to-r from-red-500 to-rose-600 text-amber-100 font-black text-sm sm:text-base px-5 py-1.5 rounded-full mb-2 shadow-md border-2 border-amber-300 animate-pulse">
            💥 Chiếu hết rồi! ⭐
          </div>
        )}

        {/* Winner Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          {isDraw ? (
            <span className="text-amber-600">Trận Đấu Hòa!</span>
          ) : isWhiteWin ? (
            <span className="text-red-600">Trắng Thắng! 🏆</span>
          ) : (
            <span className="text-slate-800">Đen Thắng! 🏆</span>
          )}
        </h2>

        {/* Cheerful praise */}
        <p className="text-amber-950 font-extrabold text-base sm:text-lg mb-2">
          {isDraw
            ? 'Hai bạn đều chơi rất thông minh và kiên cường! 🌟'
            : isWhiteWin
            ? 'Bên Trắng đã chiếu hết Vua! Quá xuất sắc! 🌟'
            : 'Bên Đen đã chiếu hết Vua! Quá xuất sắc! 🌟'}
        </p>

        <p className="text-xs text-amber-900 font-bold mb-6 bg-amber-50 py-1.5 px-4 rounded-full inline-block border border-amber-300">
          {reason}
        </p>

        {/* Action Buttons: Red & Gold styled */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              sound.playSelect();
              onRestart();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-600 hover:to-rose-600 text-amber-100 font-black text-lg sm:text-xl shadow-lg hover:shadow-xl active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-2 border-3 border-amber-300"
          >
            <span>🔄</span>
            <span className="text-white">Chơi lại ván mới</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onHome();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-100 hover:bg-amber-200 text-red-950 font-extrabold text-base border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>Quay về màn hình chính</span>
          </button>
        </div>
      </div>
    </div>
  );
};
