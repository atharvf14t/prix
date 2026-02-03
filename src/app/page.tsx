'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateCelebrationAnimation } from '@/ai/flows/generate-celebration-animation';
import { sendAgreedEmail } from './actions';
import { SparkleOverlay } from '@/components/SparkleOverlay';
import { Heart, Stars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EternalFlamePage() {
  const [isCelebration, setIsCelebration] = useState(false);
  const [animationUri, setAnimationUri] = useState<string | null>(null);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
      
      // Show intermediate loading state for AI
      setIsCelebration(true);
      
      // Trigger GenAI Animation
      const result = await generateCelebrationAnimation({
        theme: 'romantic pink and red hearts with sparkling glitter',
        text: 'Good girl'
      });
      
      if (result.animationDataUri) {
        setAnimationUri(result.animationDataUri);
      }
      
      // Show for 5 seconds to let her enjoy it
      setTimeout(() => {
        setIsCelebration(false);
        setAnimationUri(null);
      }, 5000);

    } catch (error) {
      console.error('Action failed:', error);
      setIsCelebration(false);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Even the universe is overwhelmed by your beauty. Please try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
              {isLoading ? 'Wait...' : 'YES'}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-500">
          <SparkleOverlay />
          <div className="text-center relative max-w-lg px-4">
            {animationUri ? (
              <div className="animate-in zoom-in duration-1000">
                <img 
                  src={animationUri} 
                  alt="Celebration" 
                  className="max-w-full h-auto rounded-3xl shadow-[0_0_50px_rgba(255,105,180,0.5)] mb-8 object-contain border-4 border-white"
                />
                <h2 className="font-headline text-6xl md:text-8xl text-accent animate-bounce drop-shadow-lg">
                  Good girl
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 bg-primary/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                  <Stars className="w-32 h-32 text-primary animate-spin" />
                </div>
                <p className="font-headline text-3xl text-primary animate-pulse">
                  Creating your special moment...
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 text-xs text-primary/40 font-body">
        Eternal Flame © 2024
      </div>
    </main>
  );
}
