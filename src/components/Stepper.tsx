import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { colors, fonts, radius } from '../theme';

type Props = {
  label: string;
  hint?: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function Stepper({ label, hint, value, unit, min, max, step, onChange }: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={styles.control}>
        <Pressable
          onPress={dec}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            value <= min && styles.buttonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
        >
          <Icon name="minus" size={18} color={value <= min ? colors.textFaint : colors.accentDeep} />
        </Pressable>
        <View style={styles.valueWrap}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
        <Pressable
          onPress={inc}
          disabled={value >= max}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            value >= max && styles.buttonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
        >
          <Icon name="plus" size={18} color={value >= max ? colors.textFaint : colors.accentDeep} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 16.5,
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    color: colors.textSoft,
    marginTop: 2,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSoft,
    borderRadius: radius.pill,
    padding: 5,
    gap: 4,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  buttonPressed: {
    backgroundColor: colors.accentSoft,
  },
  buttonDisabled: {
    backgroundColor: colors.bgDeep,
  },
  valueWrap: {
    minWidth: 62,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    color: colors.textSoft,
  },
});
