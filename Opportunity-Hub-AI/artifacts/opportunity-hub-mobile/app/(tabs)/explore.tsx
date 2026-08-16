import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OpportunityCard } from '@/components/OpportunityCard';
import { categories, opportunities, type OpportunityCategory } from '@/data/opportunities';
import { useColors } from '@/hooks/useColors';

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<OpportunityCategory | 'All'>('All');
  const filtered = useMemo(() => opportunities.filter((item) => {
    const haystack = `${item.title} ${item.company} ${item.description} ${item.skills.join(' ')}`.toLowerCase();
    return (category === 'All' || item.category === category) && haystack.includes(query.toLowerCase().trim());
  }), [category, query]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} />}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: insets.bottom + 92 }}
        ListHeaderComponent={
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>DISCOVER</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Explore your paths.</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Search roles, programs, and challenges that feel like a good next step.</Text>
            <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={18} color={colors.mutedForeground} />
              <TextInput testID="search-opportunities" value={query} onChangeText={setQuery} placeholder="Search roles or skills" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} returnKeyType="search" />
            </View>
            <FlatList
              horizontal
              data={['All', ...categories]}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
              renderItem={({ item }) => <Pressable onPress={() => setCategory(item as OpportunityCategory | 'All')} style={[styles.chip, { borderColor: category === item ? colors.primary : colors.border, backgroundColor: category === item ? colors.primary : colors.card }]}><Text style={[styles.chipText, { color: category === item ? colors.primaryForeground : colors.mutedForeground }]}>{item}</Text></Pressable>}
            />
            <Text style={[styles.count, { color: colors.mutedForeground }]}>{filtered.length} opportunities</Text>
          </View>
        }
        ListEmptyComponent={<View style={[styles.empty, { borderColor: colors.border }]}><Feather name="search" size={26} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Nothing matched that search</Text><Text style={[styles.emptyCopy, { color: colors.mutedForeground }]}>Try a different skill, category, or company.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 31, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 8 },
  search: { height: 49, borderWidth: 1, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 13, marginTop: 19 },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13 },
  chips: { gap: 8, paddingVertical: 14 },
  chip: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  count: { fontFamily: 'Inter_500Medium', fontSize: 11, marginBottom: 10 },
  empty: { minHeight: 220, borderWidth: 1, borderStyle: 'dashed', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, marginTop: 13 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', marginTop: 6 },
});