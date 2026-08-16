import { Feather } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OpportunityCard } from '@/components/OpportunityCard';
import { opportunities } from '@/data/opportunities';
import { useAppState } from '@/context/AppState';
import { useColors } from '@/hooks/useColors';

export default function SavedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { savedIds } = useAppState();
  const saved = opportunities.filter((item) => savedIds.includes(item.id));
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: insets.bottom + 92, flexGrow: 1 }}
        ListHeaderComponent={<><Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR WORKSPACE</Text><Text style={[styles.title, { color: colors.foreground }]}>Saved for later.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Keep the opportunities you want to return to close at hand.</Text></>}
        ListEmptyComponent={<View style={[styles.empty, { borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: colors.secondary }]}><Feather name="bookmark" size={24} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your shortlist is quiet</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>Tap the bookmark on any opportunity to save it here.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 31, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 20 },
  empty: { flex: 1, minHeight: 310, borderWidth: 1, borderStyle: 'dashed', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 25, marginTop: 20 },
  icon: { width: 55, height: 55, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 14 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 6 },
});