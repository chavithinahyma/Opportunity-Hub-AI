import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OpportunityCard } from '@/components/OpportunityCard';
import { opportunities } from '@/data/opportunities';
import { useAppState } from '@/context/AppState';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedIds, applications } = useAppState();
  const featured = opportunities.filter((item) => item.featured !== false).slice(0, 4);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 98 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>OPPORTUNITY HUB AI / INDIA</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Good morning, Hyma.</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>H</Text>
          </View>
        </View>
        <View style={[styles.hero, { backgroundColor: colors.sidebar }]}>
          <View style={styles.heroOrb} />
          <Text style={[styles.heroKicker, { color: colors.accent }]}>CURATED FOR YOU</Text>
          <Text style={[styles.heroTitle, { color: colors.sidebarForeground }]}>Find your next move.</Text>
          <Text style={[styles.heroCopy, { color: '#c4cecb' }]}>A focused set of roles, programs, and challenges matched to your skills and ambition.</Text>
          <Pressable testID="explore-hero" onPress={() => router.push('/explore')} style={({ pressed }) => [styles.heroButton, { backgroundColor: colors.accent, opacity: pressed ? 0.75 : 1 }]}>
            <Text style={[styles.heroButtonText, { color: colors.sidebar }]}>Explore opportunities</Text>
            <Feather name="arrow-up-right" size={16} color={colors.sidebar} />
          </Pressable>
        </View>
        <View style={styles.stats}>
          <Stat label="Fresh matches" value={String(opportunities.length)} colors={colors} />
          <Stat label="Saved" value={String(savedIds.length)} colors={colors} />
          <Stat label="Applications" value={String(applications.length)} colors={colors} />
        </View>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Picked for you</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Worth a closer look today.</Text>
          </View>
          <Pressable testID="see-all" onPress={() => router.push('/explore')}><Text style={[styles.link, { color: colors.primary }]}>See all</Text></Pressable>
        </View>
        {featured.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  eyebrow: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 1.1 },
  greeting: { fontFamily: 'Inter_700Bold', fontSize: 25, marginTop: 6 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', color: '#203238', fontSize: 15 },
  hero: { marginHorizontal: 16, borderRadius: 24, padding: 22, overflow: 'hidden', minHeight: 245 },
  heroOrb: { position: 'absolute', width: 210, height: 210, borderWidth: 1, borderColor: 'rgba(232,121,79,0.35)', borderRadius: 105, right: -78, top: -86 },
  heroKicker: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 36, lineHeight: 39, marginTop: 18, maxWidth: 280 },
  heroCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 13, maxWidth: 300 },
  heroButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, marginTop: 18 },
  heroButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  stats: { flexDirection: 'row', gap: 9, paddingHorizontal: 16, marginTop: 14 },
  stat: { flex: 1, borderWidth: 1, borderRadius: 15, padding: 12 },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 4 },
  sectionHeader: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 28, marginBottom: 13 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  sectionSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 12 },
});