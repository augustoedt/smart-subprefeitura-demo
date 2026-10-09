import React from 'react';
import { useApp } from '../context/AppContext';
import ToastContainer from './ToastContainer';
import PitchModeBar from './PitchModeBar';
import { Section } from './Sidebar';

interface AppOverlaysProps {
  currentSection: Section;
  onNavigateToSection: (sec: Section) => void;
}

export default function AppOverlays({ currentSection, onNavigateToSection }: AppOverlaysProps) {
  const { 
    notifications, 
    dismissNotification, 
    isPitchTourOpen, 
    setIsPitchTourOpen 
  } = useApp();

  return (
    <>
      <ToastContainer 
        notifications={notifications} 
        onDismiss={dismissNotification} 
        onNavigate={onNavigateToSection}
      />
      
      <PitchModeBar
        isOpen={isPitchTourOpen}
        onClose={() => setIsPitchTourOpen(false)}
        currentSection={currentSection}
        onNavigate={onNavigateToSection}
      />
    </>
  );
}
