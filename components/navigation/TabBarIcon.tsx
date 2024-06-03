import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartLine, faBell, faHome, faMap, faUser } from '@fortawesome/free-solid-svg-icons';
import { View, StyleSheet } from 'react-native';

type IconName = 'chart' | 'bell' | 'home' | 'map' | 'user';

interface TabBarIconProps {
  name: IconName;
  color: string;
  focused: boolean;
}

const iconMap: Record<IconName, any> = {
  chart: faChartLine,
  bell: faBell,
  home: faHome,
  map: faMap,
  user: faUser,
};

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <View style={[ styles.iconContainer, focused && styles.focusContainer]}>
      <View style={focused && styles.focusedIconContainer}>
        <FontAwesomeIcon icon={iconMap[name]} size={28} color={color} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  focusedIconContainer: {
    marginBottom: 0,
    backgroundColor: '#407157', // Cambia este color según tus necesidades
    color: '#ffffff',
    borderRadius: 99,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  focusContainer:{
    backgroundColor: '#40715766',
    borderRadius: 99,
    marginBottom: 25,
    paddingVertical: 28,
    paddingHorizontal: 7,
  }
});
