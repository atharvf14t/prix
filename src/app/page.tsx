'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateCelebrationAnimation } from '@/ai/flows/generate-celebration-animation';
import { sendAgreedEmail } from './actions';
import { SparkleOverlay } from '@/components/SparkleOverlay';
import { Heart, Stars } from 'lucide-react';

export default function EternalFlamePage() {
  const [isCelebration, setIsCelebration] = useState(false);
  const [animationUri, setAnimationUri] = useState<string | null>(null);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const noButtonRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 50;
    const newX = Math.random() * (maxX - 100);
    const newY = Math.random() * (maxY - 100);
    setNoButtonPos({ x: newX, y: newY });
  };

  const handleYesClick = async () => {
    setIsLoading(true);
    try {
      // Trigger Email
      await sendAgreedEmail();
      
      // Trigger GenAI Animation
      const result = await generateCelebrationAnimation({
        theme: 'romantic valentine with sparkles and hearts',
        text: 'Good girl'
      });
      
      if (result.animationDataUri) {
        setAnimationUri(result.animationDataUri);
      }
      
      setIsCelebration(true);
      
      // Hide celebration after 2 seconds
      setTimeout(() => {
        setIsCelebration(false);
        setAnimationUri(null);
      }, 2000);

    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initially position the No button relative to the parent or a fixed spot
  useEffect(() => {
    // Start it near the Yes button but not exactly on top
    setNoButtonPos({ x: 0, y: 0 });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-primary/20 animate-pulse">
        <Heart size={120} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-primary/20 animate-pulse delay-1000">
        <Heart size={180} fill="currentColor" />
      </div>

      <Card ref={cardRef} className="max-w-md w-full shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm z-10 p-8 rounded-[2rem]">
        <CardContent className="flex flex-col items-center text-center p-0">
          <div className="mb-6 p-4 bg-primary/10 rounded-full">
            <Heart className="text-primary w-12 h-12" fill="currentColor" />
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl text-accent mb-8 leading-tight">
            Naisha, will you be my valentine?
          </h1>

          <div className="flex items-center justify-center gap-8 w-full relative h-20">
            {/* YES Button */}
            <Button 
              size="lg"
              className="font-headline text-2xl h-16 px-10 bg-primary hover:bg-primary/90 transition-transform active:scale-95 shadow-lg"
              onClick={handleYesClick}
              disabled={isLoading}
            >
              YES
            </Button>

            {/* NO Button Container for Absolute Positioning */}
            <div 
              ref={noButtonRef}
              className="transition-all duration-200"
              style={{
                position: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'static' : 'fixed',
                left: noButtonPos.x !== 0 ? `${noButtonPos.x}px` : 'auto',
                top: noButtonPos.y !== 0 ? `${noButtonPos.y}px` : 'auto',
              }}
              onMouseEnter={moveNoButton}
              onTouchStart={(e) => {
                e.preventDefault();
                moveNoButton();
              }}
            >
              <Button 
                variant="outline"
                size="sm"
                className="font-body text-base border-accent text-accent hover:bg-accent/5 pointer-events-auto shadow-sm"
              >
                NO
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Celebratory Overlay */}
      {isCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl animate-in fade-in duration-500">
          <SparkleOverlay />
          <div className="text-center relative">
            {animationUri ? (
              <img 
                src={animationUri} 
                alt="Celebration" 
                className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl mb-8 object-cover"
              />
            ) : (
              <div className="w-96 h-96 bg-primary/20 rounded-2xl flex items-center justify-center mb-8">
                <Stars className="w-24 h-24 text-primary animate-spin" />
              </div>
            )}
            <h2 className="font-headline text-7xl text-accent animate-bounce">
              Good girl
            </h2>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-xs text-primary/40 font-body">
        Eternal Flame © 2024
      </div>
    </main>
  );
}
