import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faBell, faHome, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { View, StyleSheet } from 'react-native';

type IconName = 'chart' | 'bell' | 'home' | 'book' | 'user';

interface TabBarIconProps {
  name: IconName;
  color: string;
  focused: boolean;
}

const iconMap: Record<IconName, any> = {
  chart: faChartLine,
  bell: faBell,
  home: faHome,
  book: faBook,
  user: faUser,
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <FontAwesomeIcon icon={iconMap[name]} size={28} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedIconContainer: {
    backgroundColor: '#4CAF50', // Cambia este color según tus necesidades
    borderRadius: 25,
    padding: 10,
  },
});
