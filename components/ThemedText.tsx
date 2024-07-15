import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'subtitleBold' | 'link' | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'subtitleBold' ? styles.subtitleBold : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'JostRegular'
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: 'JostSemiBold'
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'JostRegular'
  },
  subtitleBold: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'JostBold'
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'JostRegular'
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    fontFamily: 'JostRegular'
  },
  caption: {
    lineHeight: 30,
    fontSize: 16,
    color: '#878787',
    fontFamily: 'JostRegular'
  },
});
