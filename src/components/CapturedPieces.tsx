import React from 'react';
import { ChessPiece, PieceType, PieceColor } from './ChessPiece';

interface CapturedPiecesProps {
  captured: { type: PieceType; color: PieceColor }[];
  color: PieceColor;
  title: string;
  isTurn: boolean;
}

const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  captured,
  color,
  title,
  isTurn,
}) => {
  const sortedPieces = [...captured].sort((a, b) => PIECE_VALUES[b.type] - PIECE_VALUES[a.type]);
  const isWhite = color === 'w';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all ${
        isTurn
          ? isWhite
            ? 'bg-amber-100 border-2 border-red-400 shadow-sm ring-2 ring-amber-300'
            : 'bg-slate-100 border-2 border-red-400 shadow-sm ring-2 ring-amber-300'
          : 'bg-white/80 border border-amber-200'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-3.5 h-3.5 rounded-full inline-block border-2 ${
            isWhite ? 'bg-white border-red-500' : 'bg-slate-800 border-slate-950'
          }`}
        />
        <span className="text-xs font-black text-amber-950">{title}:</span>
      </div>

      <div className="flex items-center flex-wrap gap-0.5 min-h-[28px]">
        {sortedPieces.length === 0 ? (
          <span className="text-xs text-amber-800/60 font-semibold italic">Chưa mất quân</span>
        ) : (
          sortedPieces.map((piece, idx) => (
            <div
              key={`${piece.type}-${idx}`}
              className="w-6 h-6 transform hover:scale-125 transition-transform"
              title={`${piece.type}`}
            >
              <ChessPiece type={piece.type} color={piece.color} size="100%" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
