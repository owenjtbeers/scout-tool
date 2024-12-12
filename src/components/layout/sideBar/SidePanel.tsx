import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme } from '@rneui/themed';
import { WEB_TABS as TABS, TAB } from '../routeTabs';
import { useRouter } from 'expo-router';


const SidePanel = ({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (val: boolean) => void }) => {
  const { theme } = useTheme();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      {/* <TouchableOpacity onPress={toggleCollapse} style={styles.collapseButton}>
        <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} type="feather" color={theme.colors.secondary} />
      </TouchableOpacity> */}

      <View style={styles.content}>
        {TABS.map((item, index) => (
          <NavigationItem key={index} Tab={item} collapsed={collapsed} />
        ))}
        {/* Add more content here */}
      </View>
    </ScrollView>
  );
};

const NavigationItem = ({ Tab, collapsed }: { Tab: TAB, collapsed: boolean }) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.navigationItemContainer} onPress={() => {
      router.push(Tab.path);
    }} >
      <Tab.component focused={false} color={theme.colors.secondary} />
      {collapsed ? null : <Text style={{ ...styles.navigationItemText, color: theme.colors.secondary }}>{Tab.name.toUpperCase()}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  collapseButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 50,
    gap: 30,
    width: 130,
  },
  navigationItemText: {

  },
  navigationItemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  }
});

export default SidePanel;