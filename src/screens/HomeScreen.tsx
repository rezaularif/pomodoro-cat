import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Icon } from '../components/Icon';
import { CircularTimer } from '../components/CircularTimer';
import { CatCompanion, type CatMood } from '../components/CatCompanion';
import { usePomodoro } from '../store';
import { colors, fonts, radius, shadow } from '../theme';
import { formatClock } from '../dates';

const ACCENT = {
  focus: { from: '#F7AC67', to: '#EC7A4C', tint: colors.accentDeep, soft: colors.accentSoft },
  break: { from: '#8FD5B8', to: '#5CB893', tint: '#3E9B77', soft: colors.mintSoft },
};

const BUBBLE: Record<CatMood, string> = {
  idle: "Purr-fect timing!",
  focus: 'Purr-fect focus...',
  sleep: 'Zzz... nap time',
  happy: 'Amazing work!',
};

export function HomeScreen() {
  const {
    mode,
    running,
    secondsLeft,
    totalSeconds,
    progress,
    todayCount,
    settings,
    toggle,
    reset,
    skip,
  } = usePomodoro();

  const { width } = useWindowDimensions();
  const ringSize = Math.min(width - 110, 268);
  const catSize = Math.min(width * 0.4, 156);

  const [celebrate, setCelebrate] = useState(false);
  const prevCount = useRef(todayCount);

  useEffect(() => {
    if (todayCount > prevCount.current) {
      setCelebrate(true);
      prevCount.current = todayCount;
      const t = setTimeout(() => setCelebrate(false), 4200);
      return () => clearTimeout(t);
    }
    prevCount.current = todayCount;
    return undefined;
  }, [todayCount]);

  const mood: CatMood = celebrate
    ? 'happy'
    : mode === 'break'
      ? 'sleep'
      : running
        ? 'focus'
        : 'idle';

  const accent = ACCENT[mode];
  const paused = !running && secondsLeft > 0 && secondsLeft < totalSeconds;
  const primaryLabel = running ? 'Pause' : paused ? 'Resume' : 'Start';
  const goal = Math.max(1, settings.dailyGoal);
  const filled = Math.min(todayCount, goal);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: accent.tint }]}>
            {mode === 'focus' ? 'FOCUS SESSION' : 'BREAK TIME'}
          </Text>
          <Text style={styles.title}>Pomodoro Cat</Text>
        </View>
        <View style={styles.badge}>
          <Icon name="paw" size={15} color={accent.tint} />
          <Text style={[styles.badgeCount, { color: accent.tint }]}>{todayCount}</Text>
          <Text style={styles.badgeLabel}>today</Text>
        </View>
      </View>

      <View style={styles.catCard}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{BUBBLE[mood]}</Text>
        </View>
        <View style={styles.bubbleTail} />
        <CatCompanion mood={mood} size={catSize} />
      </View>

      <View style={styles.timerWrap}>
        <CircularTimer
          size={ringSize}
          progress={progress}
          from={accent.from}
          to={accent.to}
          gradientId={`ring-${mode}`}
        >
          <View style={[styles.modePill, { backgroundColor: accent.soft }]}>
            <Text style={[styles.modePillText, { color: accent.tint }]}>
              {mode === 'focus' ? 'FOCUS' : 'BREAK'}
            </Text>
          </View>
          <Text style={styles.clock}>{formatClock(secondsLeft)}</Text>
          <View style={styles.dots}>
            {Array.from({ length: goal }).map((_, i) => (
              <View
                key={`dot-${i}`}
                style={[
                  styles.dot,
                  { backgroundColor: i < filled ? accent.tint : colors.track },
                ]}
              />
            ))}
          </View>
          <Text style={styles.dotsLabel}>
            {todayCount >= goal
              ? 'Daily goal reached'
              : `${todayCount} of ${goal} sessions done`}
          </Text>
        </CircularTimer>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={reset}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Reset timer"
        >
          <Icon name="reset" size={22} color={colors.textSoft} />
        </Pressable>

        <Pressable
          onPress={toggle}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: accent.tint },
            pressed && styles.primaryButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={primaryLabel}
        >
          <Icon name={running ? 'pause' : 'play'} size={20} color="#FFFFFF" />
          <Text style={styles.primaryLabel}>{primaryLabel}</Text>
        </Pressable>

        <Pressable
          onPress={skip}
          style={({ pressed }) => [styles.roundButton, pressed && styles.roundButtonPressed]}
          accessibilityRole="button"
          accessibilityLabel="Skip to next session"
        >
          <Icon name="skip" size={22} color={colors.textSoft} />
        </Pressable>
      </View>
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11.5,
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.text,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeCount: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  badgeLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSoft,
  },
  catCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  bubble: {
    backgroundColor: colors.cardSoft,
    borderRadius: radius.lg,
    paddingVertical: 9,
    paddingHorizontal: 18,
  },
  bubbleText: {
    fontFamily: fonts.bold,
    fontSize: 14.5,
    color: colors.accentDeep,
  },
  bubbleTail: {
    alignSelf: 'center',
    width: 12,
    height: 12,
    marginTop: -6,
    marginBottom: 2,
    backgroundColor: colors.cardSoft,
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  timerWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
  modePill: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  modePillText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  clock: {
    fontFamily: fonts.bold,
    fontSize: 54,
    color: colors.text,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotsLabel: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 2,
  },
  roundButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  roundButtonPressed: {
    backgroundColor: colors.cardSoft,
    transform: [{ scale: 0.95 }],
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minWidth: 158,
    height: 58,
    borderRadius: 29,
    paddingHorizontal: 26,
    ...shadow.accent,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.94,
  },
  primaryLabel: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
});
