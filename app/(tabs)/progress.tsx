import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { Activity, Flame, Trophy, TrendingUp, ChevronRight } from 'lucide-react-native';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';

// Mock Data
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const WORKOUT_DAYS = [true, false, true, true, false, false, false]; // Mon, Wed, Thu

const CHART_DATA = [
  { week: 'W1', volume: 8500 },
  { week: 'W2', volume: 9200 },
  { week: 'W3', volume: 8800 },
  { week: 'W4', volume: 10500 },
  { week: 'W5', volume: 11200 },
  { week: 'W6', volume: 12450 },
];

const RECENT_ACHIEVEMENTS = [
  { id: '1', title: 'New PR: Bench Press', desc: '225 lbs x 5 reps', date: 'Yesterday', icon: Trophy },
  { id: '2', title: 'Consistency King', desc: '3 workouts in a row', date: '3 days ago', icon: Flame },
  { id: '3', title: 'Volume Milestone', desc: 'Lifted over 10k lbs', date: '1 week ago', icon: TrendingUp },
];

export default function ProgressScreen() {
  const theme = useTheme();
  const styles = useMemo(() => useStyles(theme), [theme]);

  
  const renderWeeklyConsistency = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <Text style={styles.sectionAction}>3/4 Workouts</Text>
      </View>
      <View style={styles.consistencyCard}>
        {WEEK_DAYS.map((day, index) => {
          const isCompleted = WORKOUT_DAYS[index];
          const isToday = index === 3; // Mocking Thursday as today
          
          return (
            <View key={index} style={styles.dayContainer}>
              <View style={[
                styles.dayCircle,
                isCompleted && styles.dayCircleCompleted,
                isToday && !isCompleted && styles.dayCircleToday
              ]}>
                {isCompleted && <Activity size={16} color={theme.colors.background} />}
              </View>
              <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderKeyMetrics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Flame size={24} color={theme.colors.primary} />
          <Text style={styles.metricValue}>3 Weeks</Text>
          <Text style={styles.metricLabel}>Active Streak</Text>
        </View>
        <View style={styles.metricCard}>
          <TrendingUp size={24} color={theme.colors.primary} />
          <Text style={styles.metricValue}>12.4k lbs</Text>
          <Text style={styles.metricLabel}>Total Volume</Text>
        </View>
        <View style={styles.metricCard}>
          <Trophy size={24} color={theme.colors.primary} />
          <Text style={styles.metricValue}>14</Text>
          <Text style={styles.metricLabel}>Workouts</Text>
        </View>
        <View style={styles.metricCard}>
          <Activity size={24} color={theme.colors.primary} />
          <Text style={styles.metricValue}>85%</Text>
          <Text style={styles.metricLabel}>Consistency</Text>
        </View>
      </View>
    </View>
  );

  const renderVolumeChart = () => {
    const chartHeight = 180;
    const chartWidth = 320;
    const maxVolume = Math.max(...CHART_DATA.map(d => d.volume)) * 1.1; // Add 10% padding to top
    const barWidth = 24;
    const gap = (chartWidth - (barWidth * CHART_DATA.length)) / (CHART_DATA.length - 1);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volume History</Text>
        <View style={styles.chartCard}>
          <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Grid Lines */}
            {[0, 0.5, 1].map((ratio, i) => (
              <G key={`grid-${i}`}>
                <Line 
                  x1="0" 
                  y1={chartHeight * ratio - (i === 1 ? 0 : 20)} 
                  x2={chartWidth} 
                  y2={chartHeight * ratio - (i === 1 ? 0 : 20)} 
                  stroke={theme.colors.border} 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
              </G>
            ))}

            {/* Bars */}
            {CHART_DATA.map((data, index) => {
              const barHeight = (data.volume / maxVolume) * (chartHeight - 40);
              const x = index * (barWidth + gap);
              const y = chartHeight - 30 - barHeight;

              return (
                <G key={`bar-${index}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={theme.colors.primary}
                    rx={4}
                  />
                  <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight - 10}
                    fill={theme.colors.textSecondary}
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {data.week}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </View>
      </View>
    );
  };

  const renderAchievements = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Achievements</Text>
      <View style={styles.achievementsCard}>
        {RECENT_ACHIEVEMENTS.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === RECENT_ACHIEVEMENTS.length - 1;
          
          return (
            <View key={item.id} style={[styles.achievementRow, !isLast && styles.achievementRowBorder]}>
              <View style={styles.achievementIconBg}>
                <Icon size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{item.title}</Text>
                <Text style={styles.achievementDesc}>{item.desc}</Text>
              </View>
              <View style={styles.achievementMeta}>
                <Text style={styles.achievementDate}>{item.date}</Text>
                <ChevronRight size={16} color={theme.colors.textSecondary} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
        </View>
        
        {renderWeeklyConsistency()}
        {renderKeyMetrics()}
        {renderVolumeChart()}
        {renderAchievements()}
        
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
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionAction: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // Weekly Consistency
  consistencyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleCompleted: {
    backgroundColor: theme.colors.primary,
  },
  dayCircleToday: {
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
  },
  dayText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextToday: {
    color: theme.colors.text,
  },
  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
    marginBottom: 4,
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  // Chart
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Achievements
  achievementsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  achievementRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  achievementIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  achievementInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDesc: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  achievementMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  achievementDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
