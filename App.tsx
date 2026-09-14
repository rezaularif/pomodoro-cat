import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { PomodoroProvider } from './src/store';
import { TabBar, type TabKey } from './src/components/TabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors } from './src/theme';

function Shell() {
  const [tab, setTab] = useState<TabKey>('timer');

  return (
    <View style={styles.shell}>
      <View style={styles.screen}>
        {tab === 'timer' ? <HomeScreen /> : null}
        {tab === 'stats' ? <StatsScreen /> : null}
        {tab === 'settings' ? <SettingsScreen /> : null}
      </View>
      <TabBar active={tab} onChange={setTab} />
    </View>
  );
}

export default function App() {
  return (
    <PomodoroProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <Shell />
      </SafeAreaView>
    </PomodoroProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  shell: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
