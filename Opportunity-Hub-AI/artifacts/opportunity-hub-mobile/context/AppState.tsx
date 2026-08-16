import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Alert, Linking } from 'react-native';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type Application = {
  opportunityId: string;
  appliedAt: string;
  status: 'Started';
};

type AppStateValue = {
  savedIds: string[];
  applications: Application[];
  hydrated: boolean;
  isSaved: (id: string) => boolean;
  isApplied: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  applyToOpportunity: (id: string, title: string, applyUrl: string) => void;
};

const SAVED_KEY = '@opportunity-hub/saved';
const APPLICATIONS_KEY = '@opportunity-hub/applications';

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const [saved, applied] = await Promise.all([
          AsyncStorage.getItem(SAVED_KEY),
          AsyncStorage.getItem(APPLICATIONS_KEY),
        ]);
        if (saved) setSavedIds(JSON.parse(saved) as string[]);
        if (applied) setApplications(JSON.parse(applied) as Application[]);
      } catch {
        Alert.alert('Could not restore your activity', 'You can still use the app, but saved items may not be restored.');
      } finally {
        setHydrated(true);
      }
    }
    void hydrate();
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      void AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return next;
    });
  }, []);

  const applyToOpportunity = useCallback(
    (id: string, title: string, applyUrl: string) => {
      if (applications.some((item) => item.opportunityId === id)) {
        Alert.alert('Already started', `You already started an application for ${title}.`);
        return;
      }
      const nextApplication: Application = {
        opportunityId: id,
        appliedAt: new Date().toISOString(),
        status: 'Started',
      };
      setApplications((current) => {
        const next = [...current, nextApplication];
        void AsyncStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next));
        return next;
      });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Application started', `Opening the official application page for ${title}.`);
      void Linking.openURL(applyUrl);
    },
    [applications],
  );

  const value = useMemo<AppStateValue>(
    () => ({
      savedIds,
      applications,
      hydrated,
      isSaved: (id) => savedIds.includes(id),
      isApplied: (id) => applications.some((item) => item.opportunityId === id),
      toggleSaved,
      applyToOpportunity,
    }),
    [applications, hydrated, savedIds, toggleSaved, applyToOpportunity],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}