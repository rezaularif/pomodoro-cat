import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Icon } from '../components/Icon';
import { Stepper } from '../components/Stepper';
import { usePomodoro } from '../store';
import { colors, fonts, radius, shadow } from '../theme';

export function SettingsScreen() {
  const { settings, updateSettings, clearSessions } = usePomodoro();

  const confirmClear = () => {
    Alert.alert('Clear all stats?', 'This removes every recorded focus session.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearSessions },
    ]);
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.eyebrow}>PREFERENCES</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Tune the rhythm to match your cat.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Timers</Text>
        <Stepper
          label="Focus"
          hint="How long you work"
          value={settings.workMinutes}
          unit="min"
          min={5}
          max={90}
          step={5}
          onChange={(workMinutes) => updateSettings({ workMinutes })}
        />
        <View style={styles.divider} />
        <Stepper
          label="Break"
          hint="How long you rest"
          value={settings.breakMinutes}
          unit="min"
          min={1}
          max={30}
          step={1}
          onChange={(breakMinutes) => updateSettings({ breakMinutes })}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Goals & flow</Text>
        <Stepper
          label="Daily goal"
          hint="Sessions to feel proud of"
          value={settings.dailyGoal}
          unit="sets"
          min={1}
          max={12}
          step={1}
          onChange={(dailyGoal) => updateSettings({ dailyGoal })}
        />
        <View style={styles.divider} />
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Auto-start breaks</Text>
            <Text style={styles.switchHint}>Roll straight into rest when focus ends</Text>
          </View>
          <Switch
            value={settings.autoStartBreaks}
            onValueChange={(autoStartBreaks) => updateSettings({ autoStartBreaks })}
            trackColor={{ false: colors.track, true: colors.accentSoft }}
            thumbColor={settings.autoStartBreaks ? colors.accent : '#FFFFFF'}
            ios_backgroundColor={colors.track}
          />
        </View>
      </View>

      <View style={styles.preview}>
        <Icon name="clock" size={18} color={colors.accentDeep} />
        <Text style={styles.previewText}>
          A full pomodoro takes {settings.workMinutes + settings.breakMinutes} minutes.
        </Text>
      </View>

      <Pressable
        onPress={confirmClear}
        style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerPressed]}
        accessibilityRole="button"
        accessibilityLabel="Clear all stats"
      >
        <Text style={styles.dangerText}>Clear all stats</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 18,
    gap: 18,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11.5,
    letterSpacing: 1.6,
    color: colors.accentDeep,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.text,
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13.5,
    color: colors.textSoft,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.textFaint,
    marginTop: 12,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 12,
  },
  switchText: {
    flex: 1,
  },
  switchLabel: {
    fontFamily: fonts.medium,
    fontSize: 16.5,
    color: colors.text,
  },
  switchHint: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
    marginTop: 2,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardSoft,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
  },
  dangerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.accentSoft,
    backgroundColor: colors.card,
  },
  dangerPressed: {
    backgroundColor: colors.accentSoft,
  },
  dangerText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.accentDeep,
  },
});
