import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { 
  User, 
  Settings, 
  Bell, 
  Moon, 
  HelpCircle, 
  Shield, 
  LogOut, 
  ChevronRight,
  Crown,
  Scale,
  Ruler,
  Target
} from 'lucide-react-native';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'edit_profile', title: 'Edit Profile', icon: User },
      { id: 'subscription', title: 'Subscription', icon: Crown, value: 'Pro' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'units', title: 'Units', icon: Scale, value: 'lbs / in' },
      { id: 'theme', title: 'Dark Mode', icon: Moon, isToggle: true, value: true },
      { id: 'notifications', title: 'Notifications', icon: Bell },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'help', title: 'Help Center', icon: HelpCircle },
      { id: 'privacy', title: 'Privacy Policy', icon: Shield },
    ]
  }
];

import { useThemeStore } from '../../store/useThemeStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);
  const { theme: themeState, toggleTheme } = useThemeStore();

  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        <User size={40} color={theme.colors.textSecondary} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Alex Fitness</Text>
        <Text style={styles.userHandle}>@alex_lifts</Text>
        <View style={styles.badgeContainer}>
          <Crown size={12} color={theme.colors.background} />
          <Text style={styles.badgeText}>PRO MEMBER</Text>
        </View>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Scale size={20} color={theme.colors.primary} />
        <Text style={styles.statValue}>185</Text>
        <Text style={styles.statLabel}>lbs</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCard}>
        <Ruler size={20} color={theme.colors.primary} />
        <Text style={styles.statValue}>5'10"</Text>
        <Text style={styles.statLabel}>Height</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCard}>
        <Target size={20} color={theme.colors.primary} />
        <Text style={styles.statValue}>Muscle</Text>
        <Text style={styles.statLabel}>Goal</Text>
      </View>
    </View>
  );

  const renderMenuSection = (section: typeof MENU_SECTIONS[0]) => (
    <View key={section.title} style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{section.title}</Text>
      <View style={styles.menuCard}>
        {section.items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === section.items.length - 1;
          
          return (
            <View key={item.id}>
              <TouchableOpacity 
                style={styles.menuItem} 
                activeOpacity={item.isToggle ? 1 : 0.7}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Icon size={20} color={theme.colors.text} />
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                
                <View style={styles.menuItemRight}>
                  {item.value !== undefined && !item.isToggle && (
                    <Text style={styles.menuItemValue}>{item.value}</Text>
                  )}
                  {item.isToggle ? (
                    <Switch
                      value={item.id === 'theme' ? themeState === 'dark' : (item.value as boolean)}
                      onValueChange={() => {
                        if (item.id === 'theme') {
                          toggleTheme();
                        }
                      }}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor={theme.colors.text}
                    />
                  ) : (
                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                  )}
                </View>
              </TouchableOpacity>
              {!isLast && <View style={styles.menuDivider} />}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Profile</Text>
        
        {renderHeader()}
        {renderStats()}
        
        {MENU_SECTIONS.map(renderMenuSection)}
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Bit-Muscles v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.background,
  },
  // Stats
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  // Menu
  menuSection: {
    marginBottom: theme.spacing.lg,
  },
  menuSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 16 + 32 + theme.spacing.md, // Align with text
  },
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)', // Subtle red border
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
});
