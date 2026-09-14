import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Line,
  Path,
  Polygon,
  Rect,
} from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  | 'play'
  | 'pause'
  | 'reset'
  | 'skip'
  | 'clock'
  | 'bars'
  | 'sliders'
  | 'paw'
  | 'minus'
  | 'plus';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = colors.text, strokeWidth = 2.4 }: Props) {
  const common = { width: size, height: size };

  switch (name) {
    case 'play':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Polygon points="8.5,5.5 18.5,12 8.5,18.5" fill={color} />
        </Svg>
      );
    case 'pause':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Rect x="7.2" y="5.5" width="3.6" height="13" rx="1.8" fill={color} />
          <Rect x="13.2" y="5.5" width="3.6" height="13" rx="1.8" fill={color} />
        </Svg>
      );
    case 'reset':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Path
            d="M6.2 8.4A7.5 7.5 0 1 0 12 4.5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
          <Polygon points="4.6,3.4 9.4,5.3 5.6,8.6" fill={color} />
        </Svg>
      );
    case 'skip':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Polygon points="5.5,6 13,12 5.5,18" fill={color} />
          <Rect x="14.5" y="6" width="3.2" height="12" rx="1.6" fill={color} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Circle cx="12" cy="12" r="8.4" stroke={color} strokeWidth={strokeWidth} fill="none" />
          <Line x1="12" y1="6.8" x2="12" y2="12.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="12" y1="12.4" x2="16" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );
    case 'bars':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Rect x="4" y="12.5" width="4.2" height="7.5" rx="2.1" fill={color} />
          <Rect x="9.9" y="7" width="4.2" height="13" rx="2.1" fill={color} />
          <Rect x="15.8" y="10" width="4.2" height="10" rx="2.1" fill={color} />
        </Svg>
      );
    case 'sliders':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
            <Line x1="4" y1="7.5" x2="20" y2="7.5" />
            <Line x1="4" y1="16.5" x2="20" y2="16.5" />
          </G>
          <Circle cx="9" cy="7.5" r="2.6" fill={color} />
          <Circle cx="15" cy="16.5" r="2.6" fill={color} />
        </Svg>
      );
    case 'paw':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Ellipse cx="12" cy="15.6" rx="5.1" ry="4.2" fill={color} />
          <Ellipse cx="6.7" cy="10" rx="2.5" ry="3" fill={color} />
          <Ellipse cx="11" cy="8.1" rx="2.5" ry="3.1" fill={color} />
          <Ellipse cx="15.4" cy="8.5" rx="2.5" ry="3" fill={color} />
          <Ellipse cx="18.6" cy="11.9" rx="2.3" ry="2.7" fill={color} />
        </Svg>
      );
    case 'minus':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Rect x="5.5" y="10.6" width="13" height="2.8" rx="1.4" fill={color} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg viewBox="0 0 24 24" {...common}>
          <Rect x="5.5" y="10.6" width="13" height="2.8" rx="1.4" fill={color} />
          <Rect x="10.6" y="5.5" width="2.8" height="13" rx="1.4" fill={color} />
        </Svg>
      );
    default:
      return <View style={{ width: size, height: size }} />;
  }
}

export const iconStyles = StyleSheet.create({});
