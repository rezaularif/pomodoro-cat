import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';
import { colors } from '../theme';

export type CatMood = 'idle' | 'focus' | 'sleep' | 'happy';

const VB_W = 200;
const VB_H = 218;

const MOOD_CFG: Record<CatMood, { bob: number; dur: number; tilt: number }> = {
  idle: { bob: -6, dur: 2200, tilt: 1.6 },
  focus: { bob: -4, dur: 1200, tilt: 1 },
  sleep: { bob: -9, dur: 3200, tilt: 2.4 },
  happy: { bob: -10, dur: 520, tilt: 2 },
};

type Props = {
  mood: CatMood;
  size?: number;
};

export function CatCompanion({ mood, size = 170 }: Props) {
  const bob = useRef(new Animated.Value(0)).current;
  const [blinking, setBlinking] = useState(false);

  const cfg = MOOD_CFG[mood];

  useEffect(() => {
    bob.setValue(0);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: cfg.dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: cfg.dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [bob, cfg.dur]);

  useEffect(() => {
    if (mood === 'sleep') return;
    let blinkOff: ReturnType<typeof setTimeout>;
    let next: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(() => {
        setBlinking(true);
        blinkOff = setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 140);
      }, 2200 + Math.random() * 2600);
    };
    schedule();
    return () => {
      clearTimeout(next);
      clearTimeout(blinkOff);
    };
  }, [mood]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, cfg.bob] });
  const rotate = bob.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${cfg.tilt}deg`, `${cfg.tilt}deg`],
  });

  const eyesClosed = mood === 'sleep' || mood === 'happy' || blinking;
  const eyeRy = mood === 'focus' ? 8.4 : 9.6;

  const height = (size * VB_H) / VB_W;

  return (
    <View style={{ width: size, height }}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY }, { rotate }] },
        ]}
      >
        <Svg width={size} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
          {/* tail */}
          <Path
            d="M150 180 C 184 178 198 156 186 132"
            stroke={colors.amber}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M186 132 C 182 126 180 124 179 122"
            stroke={colors.amberDeep}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
          />

          {/* body */}
          <Ellipse cx={100} cy={176} rx={62} ry={42} fill={colors.amber} />
          <Ellipse cx={70} cy={202} rx={22} ry={12} fill={colors.cream} />
          <Ellipse cx={130} cy={202} rx={22} ry={12} fill={colors.cream} />
          <Ellipse cx={100} cy={182} rx={28} ry={25} fill={colors.cream} />

          {/* ears */}
          <Path d="M56 72 Q46 34 54 24 Q76 34 92 54 Z" fill={colors.amber} />
          <Path d="M63 66 Q57 42 61 34 Q74 42 84 56 Z" fill={colors.pink} />
          <Path d="M144 72 Q154 34 146 24 Q124 34 108 54 Z" fill={colors.amber} />
          <Path d="M137 66 Q143 42 139 34 Q126 42 116 56 Z" fill={colors.pink} />

          {/* head */}
          <Circle cx={100} cy={88} r={52} fill={colors.amber} />
          <Path d="M60 56 Q78 44 100 44" stroke={colors.amberDeep} strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M140 56 Q122 44 100 44" stroke={colors.amberDeep} strokeWidth={4} strokeLinecap="round" fill="none" />
          <Ellipse cx={100} cy={110} rx={36} ry={25} fill={colors.cream} />

          {/* whiskers */}
          <Path d="M68 108 L40 104 M68 116 L40 120" stroke="#EBCDAE" strokeWidth={2.6} strokeLinecap="round" fill="none" />
          <Path d="M132 108 L160 104 M132 116 L160 120" stroke="#EBCDAE" strokeWidth={2.6} strokeLinecap="round" fill="none" />

          {/* blush */}
          <Ellipse cx={60} cy={106} rx={10} ry={6.5} fill={colors.pink} opacity={0.45} />
          <Ellipse cx={140} cy={106} rx={10} ry={6.5} fill={colors.pink} opacity={0.45} />

          {/* eyes */}
          {eyesClosed ? (
            <>
              <Path d="M72 94 Q80 85 88 94" stroke={colors.text} strokeWidth={4} strokeLinecap="round" fill="none" />
              <Path d="M112 94 Q120 85 128 94" stroke={colors.text} strokeWidth={4} strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <Ellipse cx={80} cy={93} rx={7} ry={eyeRy} fill={colors.text} />
              <Ellipse cx={120} cy={93} rx={7} ry={eyeRy} fill={colors.text} />
              <Circle cx={82.2} cy={90} r={2} fill="#FFFFFF" />
              <Circle cx={122.2} cy={90} r={2} fill="#FFFFFF" />
            </>
          )}

          {/* nose + mouth */}
          <Polygon points="95,104 105,104 100,111" fill="#E3837A" />
          <Path d="M100 111 Q93 120 86 113" stroke={colors.text} strokeWidth={3} strokeLinecap="round" fill="none" />
          <Path d="M100 111 Q107 120 114 113" stroke={colors.text} strokeWidth={3} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>

      {mood === 'sleep' ? <FloatingZzz size={size} /> : null}
      {mood === 'happy' ? <Sparkles size={size} /> : null}
    </View>
  );
}

function useFloatLoop(count: number, duration: number) {
  const values = useMemo(
    () => Array.from({ length: count }, () => new Animated.Value(0)),
    [count],
  );
  useEffect(() => {
    const anims = values.map((value, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * (duration / count)),
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ),
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [values, duration, count]);
  return values;
}

function FloatingZzz({ size }: { size: number }) {
  const values = useFloatLoop(3, 2600);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.overlayTop]}>
      <View style={[styles.zWrap, { width: size * 0.6, height: size * 0.5 }]}>
        {values.map((v, i) => {
          const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.42] });
          const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [0, size * 0.1] });
          const opacity = v.interpolate({
            inputRange: [0, 0.15, 0.7, 1],
            outputRange: [0, 1, 1, 0],
          });
          const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] });
          return (
            <Animated.Text
              key={`z-${i}`}
              style={[
                styles.z,
                {
                  fontSize: size * (0.1 + i * 0.03),
                  opacity,
                  transform: [{ translateY }, { translateX }, { scale }],
                  marginLeft: i * size * 0.08,
                },
              ]}
            >
              z
            </Animated.Text>
          );
        })}
      </View>
    </View>
  );
}

function Sparkles({ size }: { size: number }) {
  const values = useFloatLoop(3, 1100);
  const spots = [
    { left: '8%', top: '34%' },
    { left: '80%', top: '22%' },
    { left: '72%', top: '62%' },
  ] as const;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {values.map((v, i) => {
        const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.22] });
        const opacity = v.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });
        const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
        return (
          <Animated.View
            key={`s-${i}`}
            style={[
              styles.sparkle,
              spots[i],
              { opacity, transform: [{ translateY }, { scale }] },
            ]}
          >
            <Svg width={size * 0.11} height={size * 0.11} viewBox="0 0 24 24">
              <Path
                d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z"
                fill={colors.accent}
              />
            </Svg>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlayTop: {
    alignItems: 'flex-start',
  },
  zWrap: {
    position: 'absolute',
    right: '-4%',
    top: '2%',
  },
  z: {
    position: 'absolute',
    color: colors.accent,
    fontWeight: '800',
  },
  sparkle: {
    position: 'absolute',
  },
});
