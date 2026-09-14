import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts, radius } from '../theme';

export type TabKey = 'timer' | 'stats' | 'settings';

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'timer', label: 'Timer', icon: 'clock' },
  { key: 'stats', label: 'Stats', icon: 'bars' },
  { key: 'settings', label: 'Settings', icon: 'sliders' },
];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const tint = isActive ? colors.accentDeep : colors.textFaint;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
                <Icon name={tab.icon} size={21} color={tint} />
              </View>
              <Text style={[styles.label, { color: tint }, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#D9B698',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  iconWrapActive: {
    backgroundColor: colors.accentSoft,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
  labelActive: {
    fontFamily: fonts.bold,
  },
});
