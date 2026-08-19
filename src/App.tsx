import React, { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { PieceGuideModal } from './components/PieceGuideModal';
import { sound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'game'>('start');
  const [showGuideFromStart, setShowGuideFromStart] = useState(false);

  const handleStartGame = () => {
    sound.playClick();
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    sound.playClick();
    setCurrentScreen('start');
  };

  return (
    <div className="min-h-screen w-full font-sans antialiased text-slate-800">
      {currentScreen === 'start' ? (
        <StartScreen
          onStart={handleStartGame}
          onOpenGuide={() => {
            sound.playClick();
            setShowGuideFromStart(true);
          }}
        />
      ) : (
        <GameScreen onBackToHome={handleBackToHome} />
      )}

      {showGuideFromStart && (
        <PieceGuideModal onClose={() => setShowGuideFromStart(false)} />
      )}
    </div>
  );
}
