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
    <View style={[styles.iconContainer, focused && styles.focusedIconContainer]}>
      <FontAwesomeIcon icon={iconMap[name]} size={28} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  focusedIconContainer: {
    marginBottom: 20,
    backgroundColor: '#407157', // Cambia este color según tus necesidades
    color: '#ffffff',
    borderRadius: 99,
    paddingVertical: 20,
    paddingHorizontal: 13,
    shadowColor: '#407157', // Color de la sombra
    shadowOpacity: 1, // Opacidad de la sombra (valor entre 0 y 1)
    shadowRadius: 6, // Radio de la sombra
    shadowOffset: {
      width: 0, // Desplazamiento horizontal
      height: 0, // Desplazamiento vertical
    },
    elevation: 4, // Solo para Android
  },
});
