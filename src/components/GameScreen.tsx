import React, { useState, useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessPiece, PieceType, PieceColor, PIECE_NAMES } from './ChessPiece';
import { CapturedPieces } from './CapturedPieces';
import { PromotionModal } from './PromotionModal';
import { GameOverModal } from './GameOverModal';
import { PieceGuideModal } from './PieceGuideModal';
import { sound } from '../utils/audio';

interface GameScreenProps {
  onBackToHome: () => void;
}

interface PendingMove {
  from: Square;
  to: Square;
}

// 8x8 standard board files and ranks
// Rank 8 is the top row (Black backrank), Rank 1 is the bottom row (White backrank)
// File a is the leftmost column, File h is the rightmost column
const FILES: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS: string[] = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const GameScreen: React.FC<GameScreenProps> = ({ onBackToHome }) => {
  // Game instance & reactive FEN string to trigger dependable React re-renders
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState<string>(() => chess.fen());

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'normal' | 'error' | 'check' | 'capture';
  }>({
    text: 'Trắng đi trước. Con hãy chạm vào một quân Trắng ở hàng 1 hoặc 2 để đi!',
    type: 'normal',
  });
  const [showFeedbackShake, setShowFeedbackShake] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingMove | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // Derived states from current chess position (depends on `fen`)
  const turn = chess.turn(); // 'w' | 'b'
  const isCheck = chess.isCheck();
  const isGameOver = chess.isGameOver();

  // Find King square for check highlight
  const kingSquareInCheck = useMemo(() => {
    if (!isCheck) return null;
    const currentTurn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.type === 'k' && p.color === currentTurn) {
          return `${FILES[c]}${8 - r}` as Square;
        }
      }
    }
    return null;
  }, [chess, isCheck, fen]);

  // Calculate captured pieces
  const capturedPieces = useMemo(() => {
    const whiteCaptured: { type: PieceType; color: PieceColor }[] = [];
    const blackCaptured: { type: PieceType; color: PieceColor }[] = [];

    const initialCounts: Record<string, number> = {
      wp: 8, wn: 2, wb: 2, wr: 2, wq: 1, wk: 1,
      bp: 8, bn: 2, bb: 2, br: 2, bq: 1, bk: 1,
    };

    const currentCounts: Record<string, number> = {
      wp: 0, wn: 0, wb: 0, wr: 0, wq: 0, wk: 0,
      bp: 0, bn: 0, bb: 0, br: 0, bq: 0, bk: 0,
    };

    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          const key = `${piece.color}${piece.type}`;
          currentCounts[key] = (currentCounts[key] || 0) + 1;
        }
      }
    }

    const types: PieceType[] = ['p', 'n', 'b', 'r', 'q'];
    types.forEach((type) => {
      const lostWhite = Math.max(0, initialCounts[`w${type}`] - (currentCounts[`w${type}`] || 0));
      for (let i = 0; i < lostWhite; i++) {
        whiteCaptured.push({ type, color: 'w' });
      }

      const lostBlack = Math.max(0, initialCounts[`b${type}`] - (currentCounts[`b${type}`] || 0));
      for (let i = 0; i < lostBlack; i++) {
        blackCaptured.push({ type, color: 'b' });
      }
    });

    return {
      whiteLost: whiteCaptured,
      blackLost: blackCaptured,
    };
  }, [chess, fen]);

  // Gentle alert animation & sound
  const triggerErrorAlert = (message: string) => {
    sound.playInvalid();
    setFeedbackMessage({
      text: message,
      type: 'error',
    });
    setShowFeedbackShake(true);
    setTimeout(() => {
      setShowFeedbackShake(false);
    }, 600);
  };

  // Handle Square Click
  const handleSquareClick = (square: Square) => {
    if (isGameOver || pendingPromotion) return;

    const pieceAtSquare = chess.get(square);

    // Case 1: No piece is currently selected
    if (!selectedSquare) {
      if (!pieceAtSquare) {
        // Tapped empty square
        triggerErrorAlert(`Con hãy chạm vào quân ${turn === 'w' ? 'Trắng' : 'Đen'} của mình để chọn nước đi nhé!`);
        return;
      }

      // Check piece turn
      if (pieceAtSquare.color !== turn) {
        triggerErrorAlert('Chưa đến lượt quân này.');
        return;
      }

      // Valid selection of current player's piece
      sound.playSelect();
      setSelectedSquare(square);

      const legalMoves = chess.moves({ square, verbose: true }).map((m) => m.to);
      setPossibleMoves(legalMoves);

      const pieceName = PIECE_NAMES[pieceAtSquare.type]?.vi || 'Quân cờ';
      if (legalMoves.length === 0) {
        setFeedbackMessage({
          text: `Quân ${pieceName} ở ô ${square.toUpperCase()} đang bị chặn, con hãy chọn quân khác nhé!`,
          type: 'normal',
        });
      } else {
        setFeedbackMessage({
          text: `Đang chọn ${pieceName} ở ô ${square.toUpperCase()}. Con hãy chạm vào ô xanh để đi!`,
          type: 'normal',
        });
      }
      return;
    }

    // Case 2: A piece is already selected
    // If clicked the exact same square -> Deselect
    if (selectedSquare === square) {
      sound.playSelect();
      setSelectedSquare(null);
      setPossibleMoves([]);
      setFeedbackMessage({
        text: `Đến lượt ${turn === 'w' ? 'Trắng' : 'Đen'}. Con hãy chạm vào một quân cờ để đi!`,
        type: 'normal',
      });
      return;
    }

    // If clicked another piece of the SAME color -> Switch selection smoothly
    if (pieceAtSquare && pieceAtSquare.color === turn) {
      sound.playSelect();
      setSelectedSquare(square);
      const legalMoves = chess.moves({ square, verbose: true }).map((m) => m.to);
      setPossibleMoves(legalMoves);
      const pieceName = PIECE_NAMES[pieceAtSquare.type]?.vi || 'Quân cờ';
      setFeedbackMessage({
        text: `Đang chọn ${pieceName} ở ô ${square.toUpperCase()}. Con hãy chạm vào ô xanh để đi!`,
        type: 'normal',
      });
      return;
    }

    // If clicked a square, verify if it is in legal moves
    const isLegal = possibleMoves.includes(square);
    if (!isLegal) {
      triggerErrorAlert('Nước đi này chưa đúng, con thử lại nhé!');
      return;
    }

    // Check if it's a pawn promotion move
    const movingPiece = chess.get(selectedSquare);
    const isPawnPromotion =
      movingPiece?.type === 'p' &&
      ((movingPiece.color === 'w' && square.endsWith('8')) ||
        (movingPiece.color === 'b' && square.endsWith('1')));

    if (isPawnPromotion) {
      setPendingPromotion({ from: selectedSquare, to: square });
      return;
    }

    // Execute standard move
    executeMove(selectedSquare, square);
  };

  // Execute verified move
  const executeMove = (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
    try {
      const movingPiece = chess.get(from);
      const targetPiece = chess.get(to);
      const isCapture = !!targetPiece || (movingPiece?.type === 'p' && from[0] !== to[0]);

      const result = chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });

      if (result) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        setLastMove({ from, to });
        setFen(chess.fen());

        // Sounds & Messages
        if (chess.isCheckmate()) {
          sound.playVictory();
          setFeedbackMessage({
            text: `🎉 Chiếu hết! ${result.color === 'w' ? 'Trắng' : 'Đen'} đã chiến thắng! 🏆`,
            type: 'check',
          });
        } else if (chess.isCheck()) {
          sound.playCheck();
          setFeedbackMessage({
            text: '⚠️ Vua đang bị chiếu! Hãy bảo vệ Vua nhé!',
            type: 'check',
          });
        } else if (isCapture) {
          sound.playCapture();
          setFeedbackMessage({
            text: '🌟 Bắt được quân rồi! Giỏi quá!',
            type: 'capture',
          });
        } else {
          sound.playMove();
          const nextPlayer = chess.turn() === 'w' ? 'Trắng' : 'Đen';
          setFeedbackMessage({
            text: `Nước đi rất hay! Đến lượt ${nextPlayer}.`,
            type: 'normal',
          });
        }
      }
    } catch {
      triggerErrorAlert('Nước đi này chưa đúng, con thử lại nhé!');
    }
  };

  // Handle promotion choice
  const handlePromotionSelect = (piece: 'q' | 'r' | 'b' | 'n') => {
    if (pendingPromotion) {
      executeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    }
  };

  // Undo Move
  const handleUndo = () => {
    sound.playClick();
    const undone = chess.undo();
    if (undone) {
      setSelectedSquare(null);
      setPossibleMoves([]);
      setLastMove(null);
      setFen(chess.fen());
      setFeedbackMessage({
        text: `Đã lùi lại 1 nước! Đến lượt ${chess.turn() === 'w' ? 'Trắng' : 'Đen'}.`,
        type: 'normal',
      });
    }
  };

  // Restart Game
  const handleRestart = () => {
    sound.playClick();
    chess.reset();
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setShowRestartConfirm(false);
    setFen(chess.fen());
    setFeedbackMessage({
      text: 'Trắng đi trước. Con hãy chạm vào một quân Trắng ở hàng 1 hoặc 2 để đi!',
      type: 'normal',
    });
  };

  // Determine game over outcome
  let winner: PieceColor | 'draw' | null = null;
  let reason = '';
  if (isGameOver) {
    if (chess.isCheckmate()) {
      winner = turn === 'w' ? 'b' : 'w';
      reason = 'Chiếu hết (Checkmate)';
    } else if (chess.isDraw()) {
      winner = 'draw';
      if (chess.isStalemate()) reason = 'Hòa do hết nước đi (Stalemate)';
      else if (chess.isThreefoldRepetition()) reason = 'Hòa do lặp lại thế cờ 3 lần';
      else if (chess.isInsufficientMaterial()) reason = 'Hòa do không đủ quân chiếu hết';
      else reason = 'Hòa cờ';
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-2 sm:p-4 bg-gradient-to-b from-amber-100 via-amber-50 to-yellow-100 select-none">
      {/* Header Bar in Red & Gold */}
      <header className="w-full max-w-2xl flex items-center justify-between gap-2 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-red-400 shadow-md ring-2 ring-amber-300/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSelect();
              onBackToHome();
            }}
            className="p-2 sm:px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-red-900 font-black text-sm flex items-center gap-1 cursor-pointer transition active:scale-95 border border-amber-300"
            title="Quay về màn hình chính"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">Trang Chủ</span>
          </button>

          <div className="flex flex-col">
            <span className="font-black text-red-600 text-sm sm:text-base leading-tight flex items-center gap-1">
              <span>⭐</span>
              <span>Cờ Vua Của Win</span>
            </span>
            <span className="text-[10px] sm:text-xs text-amber-900 font-extrabold hidden sm:inline">
              🎂 Mừng sinh nhật Win 7 tuổi!
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const next = sound.toggleSound();
              setIsSoundOn(next);
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base cursor-pointer transition active:scale-95 border ${
              isSoundOn ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-200 text-slate-400 border-slate-300'
            }`}
            title="Bật/Tắt âm thanh"
          >
            {isSoundOn ? '🔊' : '🔇'}
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setShowGuide(true);
            }}
            className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-red-900 flex items-center justify-center text-base font-bold cursor-pointer transition active:scale-95 border border-amber-300"
            title="Xem hướng dẫn"
          >
            📖
          </button>

          <button
            onClick={() => setShowRestartConfirm(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-amber-100 flex items-center justify-center text-base cursor-pointer transition active:scale-95 border border-amber-300 shadow-sm"
            title="Chơi lại ván mới"
          >
            🔄
          </button>
        </div>
      </header>

      {/* Main Chess Area */}
      <main className="w-full max-w-md sm:max-w-lg flex flex-col items-center gap-2.5 my-auto py-1">
        {/* Top Player (Black) Info */}
        <div className="w-full flex items-center justify-between gap-2 px-1">
          <CapturedPieces
            captured={capturedPieces.blackLost}
            color="b"
            title="Quân Đen mất"
            isTurn={turn === 'b'}
          />

          {/* Turn Indicator */}
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-xs sm:text-sm border-2 shadow-sm transition-all ${
              turn === 'w'
                ? 'bg-amber-100 border-red-500 text-red-950 ring-2 ring-amber-300'
                : 'bg-slate-900 border-red-500 text-amber-100 ring-2 ring-amber-300'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${turn === 'w' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`} />
            <span>Đến lượt {turn === 'w' ? 'Trắng (Dưới)' : 'Đen (Trên)'}</span>
          </div>
        </div>

        {/* 8x8 Chessboard Container in Warm Red-Amber Mahogany with Gold Coordinates */}
        <div className="relative w-full aspect-square max-w-[min(92vw,500px)] bg-amber-950 p-2 sm:p-3 rounded-3xl shadow-2xl border-4 border-red-500 ring-4 ring-amber-400/80 flex flex-col justify-between">
          
          {/* Top File Coordinates (a - h) */}
          <div className="grid grid-cols-8 text-center text-amber-200 font-black text-xs sm:text-sm pl-5 pr-5 select-none pb-1">
            {FILES.map((file) => (
              <span key={`top-${file}`} className="uppercase tracking-wider drop-shadow-xs">
                {file}
              </span>
            ))}
          </div>

          {/* Middle Row: Left Ranks (8-1) + 8x8 Board + Right Ranks (8-1) */}
          <div className="flex items-center flex-1 w-full gap-1.5">
            {/* Left Rank Coordinates (8 at top, 1 at bottom) */}
            <div className="grid grid-rows-8 h-full text-amber-200 font-black text-xs sm:text-sm select-none w-4 text-center items-center">
              {RANKS.map((rank) => (
                <span key={`left-${rank}`} className="flex items-center justify-center drop-shadow-xs">
                  {rank}
                </span>
              ))}
            </div>

            {/* 8x8 Board Grid */}
            <div className="flex-1 h-full aspect-square grid grid-cols-8 grid-rows-8 rounded-2xl overflow-hidden shadow-inner border-2 border-amber-950 relative">
              {RANKS.map((rank, rankIdx) =>
                FILES.map((file, fileIdx) => {
                  const square = `${file}${rank}` as Square;
                  const piece = chess.get(square);
                  // Warm, soft, non-glaring squares: Cream Gold vs Warm Caramel
                  const isLight = (fileIdx + rankIdx) % 2 === 0;

                  const isSelected = selectedSquare === square;
                  const isPossibleMove = possibleMoves.includes(square);
                  const isLastMoveSquare =
                    lastMove && (lastMove.from === square || lastMove.to === square);
                  const isCheckedKing = kingSquareInCheck === square;
                  const isCaptureTarget = isPossibleMove && !!piece;

                  return (
                    <button
                      key={square}
                      type="button"
                      onClick={() => handleSquareClick(square)}
                      className={`relative w-full h-full flex items-center justify-center cursor-pointer select-none transition-colors p-0 m-0 border-0 outline-none ${
                        isLight ? 'bg-[#FFF9EE]' : 'bg-[#C68B59]'
                      } ${
                        isSelected
                          ? '!bg-amber-300 ring-4 ring-red-500 ring-inset z-20 shadow-md'
                          : isLastMoveSquare
                          ? '!bg-amber-200/95'
                          : ''
                      } ${
                        isCheckedKing
                          ? '!bg-rose-500 animate-pulse ring-4 ring-rose-600 ring-inset z-20'
                          : ''
                      }`}
                      title={square.toUpperCase()}
                    >
                      {/* Subtle corner square coordinate for beginners */}
                      {fileIdx === 0 && (
                        <span
                          className={`absolute top-0.5 left-1 text-[9px] font-black select-none pointer-events-none opacity-40 ${
                            isLight ? 'text-amber-950' : 'text-amber-100'
                          }`}
                        >
                          {rank}
                        </span>
                      )}
                      {rankIdx === 7 && (
                        <span
                          className={`absolute bottom-0.5 right-1 text-[9px] font-black select-none pointer-events-none opacity-40 ${
                            isLight ? 'text-amber-950' : 'text-amber-100'
                          }`}
                        >
                          {file}
                        </span>
                      )}

                      {/* Legal Move Indicators */}
                      {/* Normal Move: Glowing Green Dot with Gold Ring */}
                      {isPossibleMove && !isCaptureTarget && (
                        <div className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 shadow-md ring-2 ring-amber-300 animate-pulse pointer-events-none z-20" />
                      )}

                      {/* Capture Move: Red Target Ring */}
                      {isCaptureTarget && (
                        <div className="absolute inset-1 rounded-full border-4 border-rose-500 bg-rose-500/30 animate-ping pointer-events-none z-20" />
                      )}

                      {/* Chess Piece */}
                      {piece && (
                        <div
                          className={`w-[85%] h-[85%] relative z-10 transition-transform ${
                            isSelected ? 'scale-115 drop-shadow-xl animate-bounce' : 'hover:scale-105'
                          }`}
                        >
                          <ChessPiece type={piece.type} color={piece.color} size="100%" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Right Rank Coordinates (8 at top, 1 at bottom) */}
            <div className="grid grid-rows-8 h-full text-amber-200 font-black text-xs sm:text-sm select-none w-4 text-center items-center">
              {RANKS.map((rank) => (
                <span key={`right-${rank}`} className="flex items-center justify-center drop-shadow-xs">
                  {rank}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom File Coordinates (a - h) */}
          <div className="grid grid-cols-8 text-center text-amber-200 font-black text-xs sm:text-sm pl-5 pr-5 select-none pt-1">
            {FILES.map((file) => (
              <span key={`bottom-${file}`} className="uppercase tracking-wider drop-shadow-xs">
                {file}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Player (White) Info */}
        <div className="w-full flex items-center justify-between gap-2 px-1">
          <CapturedPieces
            captured={capturedPieces.whiteLost}
            color="w"
            title="Quân Trắng mất"
            isTurn={turn === 'w'}
          />

          {/* Undo Button in Warm Gold */}
          <button
            onClick={handleUndo}
            disabled={chess.history().length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 hover:bg-white text-red-950 font-extrabold text-xs sm:text-sm border-2 border-amber-300 shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            title="Đi lại 1 nước"
          >
            <span>↩️</span>
            <span>Đi lại</span>
          </button>
        </div>

        {/* Friendly Kid Feedback Banner in Red & Gold */}
        <div
          className={`w-full max-w-md p-3 rounded-2xl border-2 text-center text-xs sm:text-sm font-black transition-all ${
            showFeedbackShake ? 'animate-bounce' : ''
          } ${
            feedbackMessage.type === 'error'
              ? 'bg-red-50 border-red-400 text-red-700 shadow-md ring-2 ring-red-200'
              : feedbackMessage.type === 'check'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 border-amber-300 text-amber-100 shadow-md ring-2 ring-amber-400'
              : feedbackMessage.type === 'capture'
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-sm'
              : 'bg-white/95 border-amber-300 text-amber-950 shadow-xs'
          }`}
        >
          {feedbackMessage.text}
        </div>
      </main>

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <PromotionModal
          color={chess.get(pendingPromotion.from)?.color || 'w'}
          onSelect={handlePromotionSelect}
        />
      )}

      {/* Game Over Modal */}
      {winner && (
        <GameOverModal
          winner={winner}
          reason={reason}
          onRestart={handleRestart}
          onHome={onBackToHome}
        />
      )}

      {/* Rules / Guide Modal */}
      {showGuide && <PieceGuideModal onClose={() => setShowGuide(false)} />}

      {/* Restart Confirmation Modal */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-red-500 ring-4 ring-amber-300/80 text-center">
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="text-xl font-black text-red-600 mb-2">
              Bắt Đầu Ván Mới?
            </h3>
            <p className="text-amber-950 text-sm font-semibold mb-6">
              Ván cờ hiện tại sẽ được xếp lại từ đầu. Hai bạn có chắc chắn muốn chơi lại không?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-red-950 font-bold text-sm cursor-pointer transition border border-amber-300"
              >
                Tiếp tục chơi
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-600 text-amber-100 font-black text-sm shadow-md cursor-pointer transition border border-amber-300"
              >
                Chơi lại ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
