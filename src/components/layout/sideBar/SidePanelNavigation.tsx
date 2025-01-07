import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import SidePanel from './SidePanel';

export const SidePanelNavigation = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  return (
    <View style={styles.container}>
      <View style={{ width: isCollapsed ? 60 : 130 }}>
        <SidePanel collapsed={isCollapsed} setCollapsed={setIsCollapsed} />
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
});