import AsyncStorage from '@react-native-async-storage/async-storage';

export type Settings = {
  workMinutes: number;
  breakMinutes: number;
  dailyGoal: number;
  autoStartBreaks: boolean;
};

export type Sessions = Record<string, number>;

export const DEFAULT_SETTINGS: Settings = {
  workMinutes: 25,
  breakMinutes: 5,
  dailyGoal: 4,
  autoStartBreaks: false,
};

const SETTINGS_KEY = 'pomodoroCat.settings.v1';
const SESSIONS_KEY = 'pomodoroCat.sessions.v1';

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // best-effort persistence
  }
}

export async function loadSessions(): Promise<Sessions> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Sessions;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveSessions(sessions: Sessions): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // best-effort persistence
  }
}
