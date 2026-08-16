import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { opportunities } from '@/data/opportunities';
import { useAppState } from '@/context/AppState';
import { useColors } from '@/hooks/useColors';

export default function ApplicationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { applications } = useAppState();
  const applied = applications.map((item) => ({ ...item, opportunity: opportunities.find((opportunity) => opportunity.id === item.opportunityId) })).filter((item) => item.opportunity);
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={applied}
        keyExtractor={(item) => item.opportunityId}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: insets.bottom + 92, flexGrow: 1 }}
        ListHeaderComponent={<><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR MOMENTUM</Text><Text style={[styles.title, { color: colors.foreground }]}>Applications.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Every started application is a small step forward.</Text></>}
        renderItem={({ item }) => <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.mark, { backgroundColor: item.opportunity?.accent ?? colors.secondary }]}><Text style={styles.markText}>{item.opportunity?.company.slice(0, 2).toUpperCase()}</Text></View><View style={styles.rowMain}><Text style={[styles.rowTitle, { color: colors.foreground }]} numberOfLines={1}>{item.opportunity?.title}</Text><Text style={[styles.rowCompany, { color: colors.mutedForeground }]}>{item.opportunity?.company}</Text></View><View style={[styles.status, { backgroundColor: '#d8eee6' }]}><Feather name="check" size={12} color="#2b725d" /><Text style={styles.statusText}>Started</Text></View></View>}
        ListEmptyComponent={<View style={[styles.empty, { borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="check-circle" size={25} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No applications yet</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>When you tap Apply now, your progress will appear here.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 31, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 20 },
  row: { borderWidth: 1, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 10 },
  mark: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#203238' },
  rowMain: { flex: 1 },
  rowTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  rowCompany: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  status: { borderRadius: 9, paddingHorizontal: 8, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#2b725d' },
  empty: { flex: 1, minHeight: 310, borderWidth: 1, borderStyle: 'dashed', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 25, marginTop: 20 },
  icon: { width: 55, height: 55, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 14 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 6 },
});