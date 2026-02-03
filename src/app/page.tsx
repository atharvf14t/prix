'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sendAgreedEmail } from './actions';
import { SparkleOverlay } from '@/components/SparkleOverlay';
import { Heart, Stars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EternalFlamePage() {
  const [isCelebration, setIsCelebration] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const noButtonRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    // Calculate bounds to keep button within viewport
    const maxX = typeof window !== 'undefined' ? window.innerWidth - 100 : 500;
    const maxY = typeof window !== 'undefined' ? window.innerHeight - 50 : 500;
    
    // Avoid putting it too close to the edges
    const newX = Math.max(20, Math.random() * (maxX - 40));
    const newY = Math.max(20, Math.random() * (maxY - 40));
    
    setNoButtonPos({ x: newX, y: newY });
  };

  const handleYesClick = async () => {
    setIsLoading(true);
    try {
      // Trigger Email (simulated server action)
      await sendAgreedEmail();
      
      // Permanently switch to celebration mode
      setIsCelebration(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Even the universe is overwhelmed. Please try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize position
    setNoButtonPos({ x: 0, y: 0 });
  }, []);

  // If YES was pressed, render ONLY the celebration screen
  if (isCelebration) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden animate-in fade-in duration-1000">
        <SparkleOverlay />
        <div className="text-center relative max-w-2xl px-4 animate-in zoom-in slide-in-from-bottom-10 duration-1000">
          <div className="flex flex-col items-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Heart size={200} className="text-primary relative animate-bounce" fill="currentColor" />
              <Stars size={60} className="absolute -top-4 -right-4 text-accent animate-spin" />
            </div>
            
            <h2 className="font-headline text-7xl md:text-9xl text-accent drop-shadow-[0_5px_15px_rgba(0,0,0,0.1)] mb-4">
              Good girl
            </h2>
            <p className="font-body text-2xl text-primary animate-pulse">
              YAYAYYYYYY LESSSGOOOOO BABYDOLL MUAHHHHH 😚😚😚😚!
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 text-sm text-primary/40 font-body">
          Made For Naisha
        </div>
      </main>
    );
  }

  // Otherwise, render the proposal screen
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden selection:bg-primary/30">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-primary/10 animate-pulse pointer-events-none">
        <Heart size={120} fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-primary/10 animate-pulse delay-1000 pointer-events-none">
        <Heart size={180} fill="currentColor" />
      </div>

      <Card className="max-w-md w-full shadow-2xl border-primary/20 bg-white/40 backdrop-blur-md z-10 p-8 rounded-[3rem] border-2">
        <CardContent className="flex flex-col items-center text-center p-0">
          <div className="mb-8 p-6 bg-primary/10 rounded-full animate-bounce">
            <Heart className="text-primary w-16 h-16" fill="currentColor" />
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl text-accent mb-12 leading-tight">
            Naisha, will you be my valentine?
          </h1>

          <div className="flex items-center justify-center gap-12 w-full relative h-24">
            {/* YES Button */}
            <Button 
              size="lg"
              className="font-headline text-3xl h-20 px-12 bg-primary hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(255,105,180,0.4)] rounded-2xl"
              onClick={handleYesClick}
              disabled={isLoading}
            >
              {isLoading ? 'Wait...' : 'YES'}
            </Button>

            {/* NO Button Container for Absolute Positioning */}
            <div 
              ref={noButtonRef}
              className="transition-all duration-300 ease-out"
              style={{
                position: noButtonPos.x === 0 && noButtonPos.y === 0 ? 'static' : 'fixed',
                left: noButtonPos.x !== 0 ? `${noButtonPos.x}px` : 'auto',
                top: noButtonPos.y !== 0 ? `${noButtonPos.y}px` : 'auto',
                zIndex: 50
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
                className="font-body text-lg border-accent/30 text-accent/60 hover:bg-transparent cursor-default px-6 rounded-xl"
              >
                NO
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-6 left-6 text-sm text-primary/40 font-body">
        Made for Naisha
      </div>
    </main>
  );
}
