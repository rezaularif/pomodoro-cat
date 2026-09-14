import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../components/Icon';
import { usePomodoro } from '../store';
import { colors, fonts, radius, shadow } from '../theme';
import { formatMinutes, lastDays, todayKey } from '../dates';

const TRACK_HEIGHT = 148;

export function StatsScreen() {
  const { sessions, settings, todayCount } = usePomodoro();

  const days = lastDays(7);
  const values = days.map((d) => sessions[d.key] ?? 0);
  const weekTotal = values.reduce((sum, v) => sum + v, 0);
  const max = Math.max(1, ...values);
  const todayMinutes = todayCount * settings.workMinutes;
  const bestDay = Math.max(...values);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.eyebrow}>PROGRESS</Text>
        <Text style={styles.title}>Your week</Text>
        <Text style={styles.subtitle}>Every finished focus session is a paw print.</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.summaryPrimary]}>
          <View style={styles.summaryIcon}>
            <Icon name="paw" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.summaryValueLight}>{todayCount}</Text>
          <Text style={styles.summaryLabelLight}>
            {todayCount === 1 ? 'session today' : 'sessions today'}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{formatMinutes(todayMinutes)}</Text>
          <Text style={styles.summaryLabel}>focused today</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{weekTotal}</Text>
          <Text style={styles.summaryLabel}>this week</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.cardTitle}>Sessions per day</Text>
          <View style={styles.chartLegend}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendText}>focus</Text>
          </View>
        </View>

        <View style={styles.chart}>
          {days.map((day, i) => {
            const value = values[i];
            const isToday = day.key === todayKey();
            const height = value === 0 ? 0 : Math.max(10, (value / max) * TRACK_HEIGHT);
            return (
              <View key={day.key} style={styles.barCol}>
                <Text style={[styles.barValue, isToday && styles.barValueToday]}>
                  {value > 0 ? value : ''}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height },
                      isToday ? styles.barFillToday : styles.barFillMuted,
                    ]}
                  />
                </View>
                <View style={[styles.barLabelWrap, isToday && styles.barLabelWrapToday]}>
                  <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>
                    {day.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.chartFooter}>
          <Text style={styles.footerText}>
            {weekTotal === 0
              ? 'No sessions yet — your first focus fills the chart.'
              : `Best day this week: ${bestDay} session${bestDay === 1 ? '' : 's'}. Daily goal ${settings.dailyGoal}.`}
          </Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <Icon name="clock" size={18} color={colors.accentDeep} />
        <Text style={styles.tipText}>
          {settings.workMinutes} min focus, {settings.breakMinutes} min break — one full loop is a
          pomodoro.
        </Text>
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
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
    gap: 6,
    minHeight: 104,
    justifyContent: 'space-between',
    ...shadow.soft,
  },
  summaryPrimary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  summaryValueLight: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    color: colors.textSoft,
  },
  summaryLabelLight: {
    fontFamily: fonts.medium,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.92)',
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSoft,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barValue: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.textSoft,
    height: 16,
  },
  barValueToday: {
    color: colors.accentDeep,
  },
  barTrack: {
    width: '100%',
    height: TRACK_HEIGHT,
    backgroundColor: colors.cardSoft,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barFillMuted: {
    backgroundColor: colors.amberSoft,
  },
  barFillToday: {
    backgroundColor: colors.accent,
  },
  barLabelWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barLabelWrapToday: {
    backgroundColor: colors.accentSoft,
  },
  barLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textFaint,
  },
  barLabelToday: {
    fontFamily: fonts.bold,
    color: colors.accentDeep,
  },
  chartFooter: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
    lineHeight: 18,
  },
  tipCard: {
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
  tipText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
    lineHeight: 18,
  },
});
