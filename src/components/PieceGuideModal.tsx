import React, { useState } from 'react';
import { ChessPiece, PieceType, PIECE_NAMES } from './ChessPiece';
import { sound } from '../utils/audio';

interface PieceGuideModalProps {
  onClose: () => void;
}

export const PieceGuideModal: React.FC<PieceGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'pieces'>('rules');
  const [selectedPiece, setSelectedPiece] = useState<PieceType>('p');

  const pieceList: PieceType[] = ['p', 'n', 'b', 'r', 'q', 'k'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-red-500 ring-4 ring-amber-300/80 transform animate-in zoom-in-95 duration-200">
        {/* Header in Red & Gold */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl sm:text-2xl font-black text-red-600 flex items-center gap-1.5">
              <span>Hướng Dẫn Chơi Cờ</span>
              <span className="text-amber-500">⭐</span>
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-red-800 font-black text-lg flex items-center justify-center cursor-pointer transition border border-amber-300"
          >
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 my-3 bg-amber-50 p-1.5 rounded-2xl border-2 border-amber-200">
          <button
            onClick={() => {
              sound.playSelect();
              setActiveTab('rules');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-red-500 text-white shadow-sm border border-amber-300'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <span>📜</span> 5 Điều Cần Nhớ
          </button>
          <button
            onClick={() => {
              sound.playSelect();
              setActiveTab('pieces');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-sm transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pieces'
                ? 'bg-red-500 text-white shadow-sm border border-amber-300'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <span>👑</span> Cách Đi Từng Quân
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3">
          {activeTab === 'rules' ? (
            <div className="space-y-3">
              <div className="bg-amber-50/90 p-4 rounded-2xl border-2 border-amber-300">
                <h4 className="font-black text-red-700 text-base mb-3 flex items-center gap-2">
                  <span>⭐</span> Luật Chơi Cơ Bản:
                </h4>
                <ul className="space-y-2.5 text-slate-800 font-bold text-sm sm:text-base">
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl shadow-xs border border-amber-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-amber-100 flex items-center justify-center font-black text-xs border border-amber-300">
                      1
                    </span>
                    <span><strong>Trắng đi trước.</strong> (Hàng dưới đi trước)</span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl shadow-xs border border-amber-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-amber-100 flex items-center justify-center font-black text-xs border border-amber-300">
                      2
                    </span>
                    <span><strong>Hai bạn lần lượt đi quân.</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl shadow-xs border border-amber-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-amber-100 flex items-center justify-center font-black text-xs border border-amber-300">
                      3
                    </span>
                    <span><strong>Chạm vào quân, rồi chạm vào ô muốn đi.</strong> (Ô xanh là ô đi được)</span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl shadow-xs border border-amber-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-amber-100 flex items-center justify-center font-black text-xs border border-amber-300">
                      4
                    </span>
                    <span><strong>Đi đúng luật để bảo vệ Vua của mình.</strong></span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white p-3 rounded-xl shadow-xs border border-amber-200">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-amber-100 flex items-center justify-center font-black text-xs border border-amber-300">
                      5
                    </span>
                    <span><strong>Mục tiêu là chiếu hết Vua đối phương.</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 p-3.5 rounded-2xl border-2 border-red-200 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                <span className="text-xl">💡</span>
                <span>
                  Nếu đi chưa đúng, trò chơi sẽ nhắc con thử lại thật nhẹ nhàng nhé!
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-1.5 bg-amber-100/70 p-1.5 rounded-2xl border border-amber-300">
                {pieceList.map((p) => {
                  const isSelected = selectedPiece === p;
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        sound.playSelect();
                        setSelectedPiece(p);
                      }}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition cursor-pointer ${
                        isSelected
                          ? 'bg-white shadow-md border-2 border-red-500 scale-105'
                          : 'hover:bg-amber-200'
                      }`}
                    >
                      <div className="w-8 h-8">
                        <ChessPiece type={p} color="w" size="100%" />
                      </div>
                      <span className="text-[11px] font-black text-slate-800 mt-1">
                        {PIECE_NAMES[p].vi}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Piece Details */}
              <div className="bg-gradient-to-br from-amber-50 to-red-50 p-4 rounded-2xl border-2 border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-white p-2 rounded-2xl shadow-sm border-2 border-amber-300 flex items-center justify-center">
                    <ChessPiece type={selectedPiece} color="w" size="100%" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-red-700 flex items-center gap-1.5">
                      <span>Quân {PIECE_NAMES[selectedPiece].vi}</span>
                      <span>{PIECE_NAMES[selectedPiece].emoji}</span>
                    </h4>
                    <p className="text-xs text-amber-800 font-bold">
                      {selectedPiece === 'k' && 'Quân quan trọng nhất'}
                      {selectedPiece === 'q' && 'Quân mạnh nhất'}
                      {selectedPiece === 'r' && 'Quân nặng'}
                      {selectedPiece === 'b' && 'Quân nhẹ'}
                      {selectedPiece === 'n' && 'Quân hiệp sĩ'}
                      {selectedPiece === 'p' && 'Đội quân dũng cảm'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 text-slate-800 font-bold text-sm leading-relaxed">
                  {PIECE_NAMES[selectedPiece].desc}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer in Red & Gold */}
        <div className="pt-3 border-t border-amber-100">
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-amber-100 font-black text-base shadow-md hover:shadow-lg cursor-pointer transition border-2 border-amber-300"
          >
            Đã hiểu rồi, vào chơi thôi! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
