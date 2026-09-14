import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_SETTINGS,
  loadSessions,
  loadSettings,
  saveSessions,
  saveSettings,
  type Sessions,
  type Settings,
} from './storage';
import { todayKey } from './dates';

export type Mode = 'focus' | 'break';

type Store = {
  ready: boolean;
  mode: Mode;
  running: boolean;
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
  sessions: Sessions;
  settings: Settings;
  todayCount: number;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  clearSessions: () => void;
};

const PomodoroContext = createContext<Store | null>(null);

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<Sessions>({});
  const [mode, setMode] = useState<Mode>('focus');
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.workMinutes * 60);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [loadedSettings, loadedSessions] = await Promise.all([
        loadSettings(),
        loadSessions(),
      ]);
      if (cancelled) return;
      setSettings(loadedSettings);
      setSessions(loadedSessions);
      setSecondsLeft(loadedSettings.workMinutes * 60);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready) void saveSettings(settings);
  }, [settings, ready]);

  useEffect(() => {
    if (ready) void saveSessions(sessions);
  }, [sessions, ready]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!ready || !running || secondsLeft > 0) return;
    if (mode === 'focus') {
      // TODO: play short meow sound here (e.g. 'meow.mp3') when the focus session completes.
      const key = todayKey();
      setSessions((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
      setMode('break');
      setSecondsLeft(settings.breakMinutes * 60);
      setRunning(settings.autoStartBreaks);
    } else {
      setMode('focus');
      setSecondsLeft(settings.workMinutes * 60);
      setRunning(false);
    }
  }, [ready, running, secondsLeft, mode, settings]);

  const totalSeconds = useMemo(
    () => (mode === 'focus' ? settings.workMinutes : settings.breakMinutes) * 60,
    [mode, settings],
  );

  const toggle = useCallback(() => {
    setRunning((prev) => {
      if (prev) return false;
      setSecondsLeft((s) => (s <= 0 ? totalSeconds : s));
      return true;
    });
  }, [totalSeconds]);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  const skip = useCallback(() => {
    setRunning(false);
    const next: Mode = mode === 'focus' ? 'break' : 'focus';
    setMode(next);
    setSecondsLeft((next === 'focus' ? settings.workMinutes : settings.breakMinutes) * 60);
  }, [mode, settings]);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      if (!running) {
        setSecondsLeft((mode === 'focus' ? next.workMinutes : next.breakMinutes) * 60);
      }
    },
    [settings, running, mode],
  );

  const clearSessions = useCallback(() => setSessions({}), []);

  const todayCount = sessions[todayKey()] ?? 0;
  const progress = totalSeconds > 0 ? Math.max(0, Math.min(1, secondsLeft / totalSeconds)) : 0;

  const value: Store = {
    ready,
    mode,
    running,
    secondsLeft,
    totalSeconds,
    progress,
    sessions,
    settings,
    todayCount,
    toggle,
    reset,
    skip,
    updateSettings,
    clearSessions,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro(): Store {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used inside PomodoroProvider');
  return ctx;
}
