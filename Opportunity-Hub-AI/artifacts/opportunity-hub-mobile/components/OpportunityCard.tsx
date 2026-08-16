import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAppState } from '@/context/AppState';
import type { Opportunity } from '@/data/opportunities';

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const colors = useColors();
  const router = useRouter();
  const { isSaved, toggleSaved } = useAppState();
  const saved = isSaved(opportunity.id);

  return (
    <Pressable
      testID={`opportunity-card-${opportunity.id}`}
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.86 : 1 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.mark, { backgroundColor: opportunity.accent }]}>
          <Text style={styles.markText}>{opportunity.company.slice(0, 2).toUpperCase()}</Text>
        </View>
        <Pressable
          testID={`save-${opportunity.id}`}
          accessibilityLabel={saved ? `Unsave ${opportunity.title}` : `Save ${opportunity.title}`}
          onPress={() => toggleSaved(opportunity.id)}
          hitSlop={10}
          style={({ pressed }) => [styles.saveButton, { borderColor: colors.border, opacity: pressed ? 0.55 : 1 }]}
        >
          <Feather name={saved ? 'bookmark' : 'bookmark'} size={18} color={saved ? colors.accent : colors.mutedForeground} />
        </Pressable>
      </View>
      <Text style={[styles.category, { color: colors.primary }]}>{opportunity.category}</Text>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>{opportunity.title}</Text>
      <Text style={[styles.company, { color: colors.mutedForeground }]}>{opportunity.company}</Text>
      <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>{opportunity.description}</Text>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Feather name="map-pin" size={13} color={colors.accent} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{opportunity.location}</Text>
        </View>
        <View style={styles.meta}>
          <Feather name="target" size={13} color={colors.accent} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{opportunity.match}% match</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mark: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#203238' },
  saveButton: { width: 34, height: 34, borderWidth: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  category: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 15, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 6, lineHeight: 24 },
  company: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 3 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 12 },
  metaRow: { flexDirection: 'row', gap: 15, marginTop: 15 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
});