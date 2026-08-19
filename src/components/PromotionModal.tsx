import React from 'react';
import { ChessPiece, PieceColor } from './ChessPiece';
import { sound } from '../utils/audio';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const options: { type: 'q' | 'r' | 'b' | 'n'; label: string; desc: string; bg: string }[] = [
    { type: 'q', label: 'Hậu', desc: 'Mạnh nhất bàn cờ!', bg: 'hover:bg-red-50 border-red-300' },
    { type: 'r', label: 'Xe', desc: 'Công thành dũng mãnh', bg: 'hover:bg-amber-50 border-amber-300' },
    { type: 'b', label: 'Tượng', desc: 'Phù thủy đi chéo', bg: 'hover:bg-yellow-50 border-yellow-300' },
    { type: 'n', label: 'Mã', desc: 'Chiến mã nhảy vọt', bg: 'hover:bg-orange-50 border-orange-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-red-500 ring-4 ring-amber-300/80 text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="inline-block p-3 bg-amber-100 rounded-full mb-3 text-3xl border-2 border-amber-300">
          🌟👑
        </div>
        <h3 className="text-2xl font-black text-red-600 mb-1">
          Tốt Đã Đến Đích!
        </h3>
        <p className="text-amber-950 font-bold text-sm mb-6">
          Con muốn biến quân Tốt thành quân gì nào?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                sound.playSelect();
                onSelect(opt.type);
              }}
              className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all active:scale-95 bg-white cursor-pointer shadow-sm hover:shadow-md ${opt.bg}`}
            >
              <div className="w-16 h-16 mb-2">
                <ChessPiece type={opt.type} color={color} size="100%" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                {opt.label}
              </span>
              <span className="text-xs text-amber-800 font-medium">
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
