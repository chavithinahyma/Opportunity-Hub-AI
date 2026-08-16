import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { opportunities } from '@/data/opportunities';
import { useAppState } from '@/context/AppState';
import { useColors } from '@/hooks/useColors';

export default function OpportunityDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const opportunity = opportunities.find((item) => item.id === id);
  const { isSaved, isApplied, toggleSaved, applyToOpportunity } = useAppState();

  if (!opportunity) {
    return <View style={[styles.missing, { backgroundColor: colors.background }]}><Text style={[styles.missingTitle, { color: colors.foreground }]}>Opportunity not found</Text><Pressable onPress={() => router.back()}><Text style={[styles.link, { color: colors.primary }]}>Go back</Text></Pressable></View>;
  }

  const applied = isApplied(opportunity.id);
  const saved = isSaved(opportunity.id);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120 }} showsVerticalScrollIndicator={false}>
        <View style={styles.toolbar}>
          <Pressable testID="back" onPress={() => router.back()} style={styles.iconButton}><Feather name="arrow-left" size={20} color={colors.foreground} /></Pressable>
          <Pressable testID="detail-save" onPress={() => toggleSaved(opportunity.id)} style={[styles.iconButton, { borderColor: colors.border }]}><Feather name="bookmark" size={19} color={saved ? colors.accent : colors.foreground} /></Pressable>
        </View>
        <View style={[styles.heroMark, { backgroundColor: opportunity.accent }]}><Text style={styles.heroMarkText}>{opportunity.company.slice(0, 2).toUpperCase()}</Text></View>
        <Text style={[styles.category, { color: colors.primary }]}>{opportunity.category}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{opportunity.title}</Text>
        <Text style={[styles.company, { color: colors.mutedForeground }]}>{opportunity.company}</Text>
        <View style={styles.facts}>
          <Fact icon="map-pin" label="Location" value={opportunity.location} colors={colors} />
          <Fact icon="clock" label="Deadline" value={opportunity.deadline} colors={colors} />
          <Fact icon="target" label="Match" value={`${opportunity.match}%`} colors={colors} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Why this could be a fit</Text>
        <Text style={[styles.copy, { color: colors.mutedForeground }]}>{opportunity.longDescription}</Text>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>What you’ll bring</Text>
        <View style={styles.skills}>{opportunity.skills.map((skill) => <View key={skill} style={[styles.skill, { backgroundColor: colors.secondary }]}><Text style={[styles.skillText, { color: colors.foreground }]}>{skill}</Text></View>)}</View>
        <Pressable
          testID="apply-now"
          onPress={() => applied ? Alert.alert('Already started', 'This opportunity is already in your Applications list.') : applyToOpportunity(opportunity.id, opportunity.title, opportunity.applyUrl)}
          style={({ pressed }) => [styles.applyButton, { backgroundColor: applied ? colors.secondary : colors.primary, opacity: pressed ? 0.76 : 1 }]}
        >
          <Feather name={applied ? 'check' : 'external-link'} size={17} color={applied ? colors.primary : colors.primaryForeground} />
          <Text style={[styles.applyText, { color: applied ? colors.primary : colors.primaryForeground }]}>{applied ? 'Application started' : 'Apply now'}</Text>
        </Pressable>
        <Pressable testID="open-official" onPress={() => void Linking.openURL(opportunity.applyUrl)} style={styles.official}><Text style={[styles.officialText, { color: colors.primary }]}>Open official listing</Text><Feather name="arrow-up-right" size={15} color={colors.primary} /></Pressable>
      </ScrollView>
    </View>
  );
}

function Fact({ icon, label, value, colors }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={styles.fact}><Feather name={icon} size={15} color={colors.accent} /><Text style={[styles.factLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.factValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: { paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderWidth: 1, borderColor: 'transparent', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  heroMark: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 25 },
  heroMarkText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#203238' },
  category: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginHorizontal: 20, marginTop: 20 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 36, lineHeight: 40, marginHorizontal: 20, marginTop: 8 },
  company: { fontFamily: 'Inter_500Medium', fontSize: 14, marginHorizontal: 20, marginTop: 6 },
  facts: { marginHorizontal: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e4ddd1', marginTop: 24, paddingVertical: 15, gap: 11 },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  factLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, width: 70 },
  factValue: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, marginHorizontal: 20, marginTop: 27 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, marginHorizontal: 20, marginTop: 9 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 20, marginTop: 12 },
  skill: { borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8 },
  skillText: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  applyButton: { marginHorizontal: 20, minHeight: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 33 },
  applyText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  official: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  officialText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  missingTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  link: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});