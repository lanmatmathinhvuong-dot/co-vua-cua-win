import React from 'react';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
  size?: number | string;
  animate?: boolean;
}

export const PIECE_NAMES: Record<PieceType, { vi: string; emoji: string; desc: string }> = {
  k: { vi: 'Vua', emoji: '👑', desc: 'Đi 1 ô theo mọi hướng. Vua bị bắt là thua!' },
  q: { vi: 'Hậu', emoji: '👸', desc: 'Đi thẳng, ngang, chéo bao nhiêu ô tùy ý. Rất mạnh!' },
  r: { vi: 'Xe', emoji: '🏰', desc: 'Đi thẳng và đi ngang bao nhiêu ô tùy ý.' },
  b: { vi: 'Tượng', emoji: '🧙‍♂️', desc: 'Đi chéo theo màu ô của mình bao nhiêu ô tùy ý.' },
  n: { vi: 'Mã', emoji: '🐴', desc: 'Đi theo hình chữ L (2 ô thẳng + 1 ô ngang) và có thể nhảy qua quân khác!' },
  p: { vi: 'Tốt', emoji: '🛡️', desc: 'Đi thẳng 1 ô (nước đầu được 2 ô), ăn chéo 1 ô. Đến cuối bàn cờ được biến hình!' },
};

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color,
  className = '',
  size = '100%',
}) => {
  const isWhite = color === 'w';

  // SVG color palette
  const mainFill = isWhite ? '#FFFFFF' : '#2D3748';
  const strokeColor = isWhite ? '#4A5568' : '#1A202C';
  const highlightColor = isWhite ? '#E2E8F0' : '#4A5568';
  const accentColor = isWhite ? '#F6E05E' : '#9F7AEA'; // Gold for white, purple/gold for black
  const eyeColor = isWhite ? '#2D3748' : '#FFFFFF';

  const renderPieceSvg = () => {
    switch (type) {
      case 'k': // King
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M20,84 C20,80 30,76 50,76 C70,76 80,80 80,84 L80,90 C80,92 78,94 75,94 L25,94 C22,94 20,92 20,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Body */}
            <path
              d="M26,76 C28,58 35,50 32,38 C40,44 60,44 68,38 C65,50 72,58 74,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Robe fold detail */}
            <path
              d="M40,55 C46,65 54,65 60,55"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Crown Head */}
            <path
              d="M30,38 C28,26 40,28 50,28 C60,28 72,26 70,38 C65,42 35,42 30,38 Z"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Cross on top */}
            <path
              d="M50,10 L50,26 M42,16 L58,16"
              stroke={isWhite ? '#D69E2E' : '#FAF089'}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Friendly King Smile / Eyes */}
            <circle cx="43" cy="34" r="2.5" fill={eyeColor} />
            <circle cx="57" cy="34" r="2.5" fill={eyeColor} />
            <path
              d="M46,37 Q50,40 54,37"
              stroke={eyeColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Jewels */}
            <circle cx="36" cy="30" r="2" fill="#E53E3E" />
            <circle cx="50" cy="24" r="2.5" fill="#3182CE" />
            <circle cx="64" cy="30" r="2" fill="#38A169" />
          </svg>
        );

      case 'q': // Queen
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M20,84 C20,80 30,76 50,76 C70,76 80,80 80,84 L80,90 C80,92 78,94 75,94 L25,94 C22,94 20,92 20,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Body */}
            <path
              d="M28,76 C30,58 36,46 34,36 C42,42 58,42 66,36 C64,46 70,58 72,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Tiara / Crown Spikes */}
            <path
              d="M26,38 L22,18 L36,30 L50,14 L64,30 L78,18 L74,38 Z"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Pearls on Tiara */}
            <circle cx="22" cy="17" r="3.5" fill="#ED8936" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="50" cy="13" r="4.5" fill="#E53E3E" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="78" cy="17" r="3.5" fill="#ED8936" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="36" cy="28" r="2.5" fill="#3182CE" />
            <circle cx="64" cy="28" r="2.5" fill="#3182CE" />
            {/* Cute Queen Face */}
            <circle cx="43" cy="50" r="2.5" fill={eyeColor} />
            <circle cx="57" cy="50" r="2.5" fill={eyeColor} />
            {/* Blush */}
            <circle cx="39" cy="54" r="2.5" fill="#FEB2B2" opacity="0.8" />
            <circle cx="61" cy="54" r="2.5" fill="#FEB2B2" opacity="0.8" />
            {/* Smile */}
            <path
              d="M46,55 Q50,59 54,55"
              stroke={eyeColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'r': // Rook / Castle
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M22,82 C22,78 30,76 50,76 C70,76 78,78 78,82 L78,90 C78,92 76,94 73,94 L27,94 C24,94 22,92 22,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Tower Wall */}
            <path
              d="M30,76 L32,36 L68,36 L70,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Battlements (Top Castle Turret) */}
            <path
              d="M26,36 L26,18 L36,18 L36,26 L44,26 L44,18 L56,18 L56,26 L64,26 L64,18 L74,18 L74,36 Z"
              fill={highlightColor}
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Brick accents */}
            <path
              d="M40,48 L60,48 M34,60 L50,60 M52,60 L66,60"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Cute Door / Eyes */}
            <circle cx="42" cy="42" r="2.5" fill={eyeColor} />
            <circle cx="58" cy="42" r="2.5" fill={eyeColor} />
            {/* Castle Arch Gate */}
            <path
              d="M42,76 L42,66 C42,62 58,62 58,66 L58,76 Z"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
          </svg>
        );

      case 'b': // Bishop
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M24,84 C24,80 32,76 50,76 C68,76 76,80 76,84 L76,90 C76,92 74,94 71,94 L29,94 C26,94 24,92 24,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Body */}
            <path
              d="M32,76 C32,60 38,54 36,44 C36,30 42,20 50,18 C58,20 64,30 64,44 C62,54 68,60 68,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Bishop Hat Cutout / Slit */}
            <path
              d="M44,24 L56,38 M48,46 L60,34"
              stroke={accentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Top Orb */}
            <circle
              cx="50"
              cy="14"
              r="4.5"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Eyes */}
            <circle cx="43" cy="52" r="2.5" fill={eyeColor} />
            <circle cx="57" cy="52" r="2.5" fill={eyeColor} />
            <path
              d="M46,58 Q50,62 54,58"
              stroke={eyeColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'n': // Knight / Cute Horse
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M22,84 C22,80 30,76 50,76 C70,76 78,80 78,84 L78,90 C78,92 76,94 73,94 L27,94 C24,94 22,92 22,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Horse Head & Mane */}
            <path
              d="M30,76 C28,65 24,52 32,36 C34,32 30,22 36,18 C40,16 46,22 48,22 C56,16 66,22 72,30 C78,38 78,48 70,52 C65,54 66,62 70,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Mane Spikes */}
            <path
              d="M33,30 C26,34 26,42 30,48 C24,52 26,60 30,64"
              stroke={accentColor}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Horse Ear */}
            <path
              d="M48,22 L54,12 L58,20 Z"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Friendly Horse Eye with Sparkle */}
            <circle cx="60" cy="34" r="3.5" fill={eyeColor} />
            <circle cx="61.5" cy="32.5" r="1.2" fill="#FFFFFF" />
            {/* Muzzle / Nostril */}
            <circle cx="70" cy="44" r="2" fill={strokeColor} />
            {/* Cheerful bridle / harness */}
            <path
              d="M56,38 C60,44 68,46 72,46"
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'p': // Pawn / Cute Soldier
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path
              d="M26,84 C26,80 34,76 50,76 C66,76 74,80 74,84 L74,90 C74,92 72,94 69,94 L31,94 C28,94 26,92 26,90 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Body */}
            <path
              d="M36,76 C36,60 42,52 40,46 C44,48 56,48 60,46 C58,52 64,60 64,76 Z"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Collar */}
            <path
              d="M38,46 C42,50 58,50 62,46"
              fill={accentColor}
              stroke={strokeColor}
              strokeWidth="3"
            />
            {/* Round Head */}
            <circle
              cx="50"
              cy="28"
              r="17"
              fill={mainFill}
              stroke={strokeColor}
              strokeWidth="3.5"
            />
            {/* Cute Little Face */}
            <circle cx="44" cy="27" r="2.2" fill={eyeColor} />
            <circle cx="56" cy="27" r="2.2" fill={eyeColor} />
            <path
              d="M46,33 Q50,37 54,33"
              stroke={eyeColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Little Shield/Star on chest */}
            <circle cx="50" cy="62" r="3.5" fill={accentColor} stroke={strokeColor} strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center transition-transform duration-150 select-none pointer-events-none ${className}`}
    >
      {renderPieceSvg()}
    </div>
  );
};
