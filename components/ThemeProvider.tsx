'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccentColor } from '@/lib/data';

interface ThemeContextType {
  themeMode: 'dark' | 'light';
  toggleThemeMode: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  contrast: 'normal' | 'high';
  setContrast: (contrast: 'normal' | 'high') => void;
  preset: string;
  applyPreset: (preset: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<'dark' | 'light'>('dark');
  const [accent, setAccentState] = useState<AccentColor>('sky');
  const [contrast, setContrastState] = useState<'normal' | 'high'>('normal');
  const [preset, setPresetState] = useState<string>('antigravity-sky');

  // Load persisted theme preferences on client mount
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('ashoka-themeMode') as 'dark' | 'light' | null;
      if (savedMode === 'dark' || savedMode === 'light') {
        setThemeModeState(savedMode);
      }

      const savedAccent = localStorage.getItem('ashoka-accent') as AccentColor | null;
      if (savedAccent && ['sky', 'emerald', 'indigo', 'amber'].includes(savedAccent)) {
        setAccentState(savedAccent);
      }

      const savedContrast = localStorage.getItem('ashoka-contrast') as 'normal' | 'high' | null;
      if (savedContrast === 'normal' || savedContrast === 'high') {
        setContrastState(savedContrast);
      }

      const savedPreset = localStorage.getItem('ashoka-preset');
      if (savedPreset) {
        setPresetState(savedPreset);
      }
    } catch {
      // Ignore localStorage read errors in SSR/sandboxed mode
    }
  }, []);

  // Update HTML document classes & data attributes in real time
  useEffect(() => {
    const root = document.documentElement;

    // Dark / Light class
    if (themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Accent classes
    root.classList.remove('theme-accent-sky', 'theme-accent-emerald', 'theme-accent-indigo', 'theme-accent-amber');
    root.classList.add(`theme-accent-${accent}`);

    // Contrast classes
    root.classList.remove('theme-contrast-normal', 'theme-contrast-high');
    root.classList.add(`theme-contrast-${contrast}`);

    // Data attributes for direct CSS selection
    root.setAttribute('data-theme-mode', themeMode);
    root.setAttribute('data-theme-accent', accent);
    root.setAttribute('data-theme-contrast', contrast);
    root.setAttribute('data-theme-preset', preset);
  }, [themeMode, accent, contrast, preset]);

  const toggleThemeMode = () => {
    setThemeModeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('ashoka-themeMode', next);
      } catch {}
      return next;
    });
  };

  const setThemeMode = (mode: 'dark' | 'light') => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('ashoka-themeMode', mode);
    } catch {}
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    let matchedPreset = 'antigravity-sky';
    if (newAccent === 'emerald') matchedPreset = 'emerald-inclusive';
    else if (newAccent === 'indigo') matchedPreset = 'indigo-corporate';
    else if (newAccent === 'amber') matchedPreset = 'amber-sunset';
    setPresetState(matchedPreset);

    try {
      localStorage.setItem('ashoka-accent', newAccent);
      localStorage.setItem('ashoka-preset', matchedPreset);
    } catch {}
  };

  const setContrast = (newContrast: 'normal' | 'high') => {
    setContrastState(newContrast);
    try {
      localStorage.setItem('ashoka-contrast', newContrast);
    } catch {}
  };

  const applyPreset = (presetName: string) => {
    setPresetState(presetName);
    let acc: AccentColor = 'sky';
    if (presetName === 'emerald-inclusive') {
      acc = 'emerald';
    } else if (presetName === 'indigo-corporate') {
      acc = 'indigo';
    } else if (presetName === 'amber-sunset') {
      acc = 'amber';
    } else {
      acc = 'sky';
    }
    setAccentState(acc);

    try {
      localStorage.setItem('ashoka-preset', presetName);
      localStorage.setItem('ashoka-accent', acc);
    } catch {}
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleThemeMode,
        setThemeMode,
        accent,
        setAccent,
        contrast,
        setContrast,
        preset,
        applyPreset,
      }}
    >
      <div className={`theme-accent-${accent} theme-contrast-${contrast} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
