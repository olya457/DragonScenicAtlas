import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  ScrollView,
  Modal,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/background.png');
const ICON_BACK = require('../assets/back.png');

type PlaceArticle = {
  id: string;
  title: string;
  country: 'Australia' | 'Canada';
  region: string;
  coords: string;
  teaser: string;
  body: string;
  facts: string[];
};

const ARTICLES: PlaceArticle[] = [
  {
    id: 'a1',
    title: 'Uluru (Ayers Rock)',
    country: 'Australia',
    region: 'Northern Territory • Red Centre',
    coords: '-25.3444, 131.0369',
    teaser:
      'A living sandstone monolith where color, light, and scale feel unreal — especially at sunrise and sunset.',
    body:
      'Uluru rises from the flat desert like a myth made of stone. Up close, its surface is full of curves, caves, and subtle textures shaped by time. The experience is not just “seeing a rock” — it is watching how the landscape changes minute by minute with wind and light.\n\nFor travelers, the most memorable moments often happen on the walking tracks rather than from a distance. The base walk reveals hidden waterholes, ancient grooves, and quiet viewpoints where the desert feels endless. The atmosphere is calm, spacious, and deeply cinematic.\n\nIf you plan to visit, prioritize sunrise or golden-hour light and bring water — the open terrain makes distance feel deceptive.',
    facts: [
      'Color shift is strongest at sunrise and sunset, when the sandstone glows orange-red.',
      'The base walk is about 10 km and offers the most varied views and textures.',
      'After rain, temporary waterfalls can appear on the rock face.',
    ],
  },
  {
    id: 'a2',
    title: 'Peyto Lake',
    country: 'Canada',
    region: 'Alberta • Banff National Park',
    coords: '51.7167, -116.5500',
    teaser:
      'A turquoise glacial lake shaped like a fox — famous from above, but even better when you linger in silence.',
    body:
      'Peyto Lake is a classic Canadian Rockies moment: a bright, unreal blue set in dark forest and sharp peaks. The “magic” comes from fine glacial rock flour suspended in the water, scattering light and creating that iconic color.\n\nThe main viewpoint is quick to reach, but the best travel rhythm is slow: arrive early, let the crowd pass, then watch how the lake tone shifts under moving clouds. In late season, the water looks deeper; in summer, it can glow intensely.\n\nBring layers — temperatures can change fast at elevation. And if you love photos, overcast days can make the turquoise look even more saturated.',
    facts: [
      'The lake’s color is caused by glacial dust (rock flour) suspended in the water.',
      'The viewpoint is one of the most photographed in Banff.',
      'Early mornings reduce crowds and wind, improving reflections.',
    ],
  },
  {
    id: 'a3',
    title: 'The Twelve Apostles',
    country: 'Australia',
    region: 'Victoria • Great Ocean Road',
    coords: '-38.6650, 143.1040',
    teaser:
      'Sea stacks carved by waves — dramatic, loud, and constantly changing with weather and tide.',
    body:
      'The Twelve Apostles are ocean-sculpted limestone stacks rising from a wild southern coastline. Wind, spray, and erosion are the “artists” here, and the best way to feel it is to stand at the lookout and listen to the surf.\n\nThe scenery is strongest when the sea is active: stormy skies, foamy waves, and fast-moving clouds turn the coast into a live performance. Sunset can be spectacular, but even midday has a rugged beauty when the light cuts through spray.\n\nIf you’re road-tripping, pair this stop with nearby coastal walks — you’ll get quieter angles and a better sense of the cliffline landscape.',
    facts: [
      'The stacks were formed primarily by ocean erosion of limestone cliffs.',
      'The number of visible stacks has changed over time due to collapses.',
      'Golden hour adds depth to the cliffs and makes spray glow.',
    ],
  },
  {
    id: 'a4',
    title: 'Daintree Rainforest',
    country: 'Australia',
    region: 'Queensland • Tropical North',
    coords: '-16.1700, 145.4180',
    teaser:
      'An ancient rainforest where jungle meets reef — dense, humid, and full of quiet surprises.',
    body:
      'Daintree is one of those places that feels older than memory. The rainforest is thick with green layers, giant ferns, and winding creeks. Trails often feel like tunnels of leaves where sound changes — birds, insects, and distant water replace the usual “human” noise.\n\nThe experience is best when you mix short boardwalks with slower scenic drives and lookout stops. The forest is also close to the coast, creating rare moments where rainforest and ocean share the same horizon.\n\nTravel tip: aim for early morning or late afternoon when the heat softens and the forest feels more active. Bring insect repellent, and keep your camera ready for unexpected details.',
    facts: [
      'Often described as older than the Amazon rainforest.',
      'Rainforest and coastline meet here, creating unique scenery.',
      'Short boardwalks are ideal for a “first-time” visit without heavy hiking.',
    ],
  },
  {
    id: 'a5',
    title: 'Athabasca Glacier',
    country: 'Canada',
    region: 'Alberta • Jasper National Park',
    coords: '52.1950, -117.2430',
    teaser:
      'A massive tongue of ice you can approach closely — cold, bright, and humbling in scale.',
    body:
      'Athabasca Glacier is one of the most accessible glaciers in North America, and that’s exactly why it’s such a powerful travel moment. The landscape around it is stark: pale rock, gray moraine, and the glacier itself — a textured surface of ice and meltwater.\n\nEven a short walk near the viewpoint reveals how the terrain tells a story of retreat and time. The air feels sharper, the soundscape quieter, and the contrast between summer warmth and glacial cold is unforgettable.\n\nSafety matters here: stay on marked areas and treat the environment with respect. The beauty is real, but so are the hazards of ice and meltwater.',
    facts: [
      'Located along the Icefields Parkway in Jasper National Park.',
      'Best viewed in clear weather when ice texture is most visible.',
      'Marked paths help keep visitors safe near unstable surfaces.',
    ],
  },
  {
    id: 'a6',
    title: 'Bungle Bungle Range (Purnululu)',
    country: 'Australia',
    region: 'Western Australia • Kimberley',
    coords: '-17.5000, 128.4000',
    teaser:
      'Striped dome formations that look like nature’s architecture — remote, warm, and surreal.',
    body:
      'The Bungle Bungle Range is famous for its banded, dome-like formations — orange and dark stripes that look painted. Standing among them feels like stepping into a geological labyrinth: narrow gorges, curved walls, and sudden open chambers.\n\nThis is a destination for travelers who love “earned” scenery. The remoteness adds to the atmosphere, and the changing light makes the domes shift in tone throughout the day.\n\nIf you visit, plan for heat, dust, and long drives. But the reward is a landscape that looks like nowhere else — the kind of place you remember as a feeling, not just a photo.',
    facts: [
      'Known for dome-shaped banded sandstone formations.',
      'The area includes dramatic gorges and sheltered walking corridors.',
      'Sunrise and sunset bring out the strongest striping contrast.',
    ],
  },
  {
    id: 'a7',
    title: 'Hopewell Rocks',
    country: 'Canada',
    region: 'New Brunswick • Bay of Fundy',
    coords: '45.8170, -64.5720',
    teaser:
      'Stone “flowerpots” transformed by some of the world’s highest tides — two landscapes in one day.',
    body:
      'Hopewell Rocks are a perfect travel story because the scene changes completely with the tide. At low tide, you can walk on the ocean floor around towering rock pillars. At high tide, the same pillars become islands surrounded by deep water.\n\nThis creates a rare sense of “time travel” in a single visit: you see the same place in two different realities. The cliffs, the mudflats, and the changing shoreline make it feel alive.\n\nPlan your visit around tide times. The best day is when you can experience both low and high tides — it’s the full magic of Fundy in one itinerary.',
    facts: [
      'Their appearance changes due to the ebb and flow of tides.',
      'You can walk on the ocean floor at low tide (when permitted).',
      'Tide timing is essential for planning the best experience.',
    ],
  },
  {
    id: 'a8',
    title: 'Horizontal Falls',
    country: 'Australia',
    region: 'Western Australia • Kimberley',
    coords: '-16.3870, 123.9940',
    teaser:
      'Not a classic waterfall — a tidal phenomenon where ocean water surges through narrow gaps.',
    body:
      'Horizontal Falls are created by powerful tides pushing seawater through tight rock channels. The “falls” happen when water levels change rapidly, forcing water to accelerate like a river squeezed through a gate.\n\nWhat makes it special for travelers is the feeling of raw energy: the surface boils, swirls, and forms standing waves. It’s a reminder that the sea has its own rhythm and strength.\n\nEven from a distance, the patterns are mesmerizing. If you’re exploring the Kimberley, this is one of the most unique water landscapes you can witness — less about height, more about force.',
    facts: [
      'Created by tidal flows between narrow rock gaps.',
      'Best viewed when tidal movement is strong.',
      'The phenomenon is driven by changing sea levels, not a cliff drop.',
    ],
  },
  {
    id: 'a9',
    title: 'Columbia Icefield',
    country: 'Canada',
    region: 'Alberta • Icefields Parkway',
    coords: '52.2000, -117.2000',
    teaser:
      'A vast icefield feeding multiple glaciers — a grand, open panorama of cold geography.',
    body:
      'The Columbia Icefield is one of the largest icefields in the Rockies, and it shapes the landscape around it. It’s not just a single viewpoint — it’s a whole region of ice, peaks, and glaciers that define the feel of the road.\n\nFor travelers, the impact is scale: enormous white surfaces framed by dark rock and dramatic clouds. The area can look gentle from afar, but close up it reveals creases, ridges, and shifting textures.\n\nA scenic drive along the Parkway is already a highlight — but the icefield is the moment where the journey feels “big.” It’s a place to slow down, breathe, and remember how wild nature can be.',
    facts: [
      'Feeds glacier and river systems across the region.',
      'The viewpoint area offers classic Rocky Mountain panoramas.',
      'Weather can change quickly; layers are essential.',
    ],
  },
  {
    id: 'a10',
    title: 'Lake Hillier',
    country: 'Australia',
    region: 'Western Australia • Recherche Archipelago',
    coords: '-34.0950, 123.2030',
    teaser:
      'A pink lake beside the ocean — one of Australia’s strangest color contrasts.',
    body:
      'Lake Hillier is famous for its pink water, sitting right next to blue ocean and pale sand. The contrast looks almost edited — a natural palette that feels impossible until you see it.\n\nThe experience is often about perspective: aerial views show the strongest color separation, but even without a flight, the story of the lake is the wonder. It’s a reminder that nature can be playful, strange, and beautiful.\n\nTravelers who love unique scenery will appreciate it as a “highlight” destination — a place that feels like a postcard from another planet.',
    facts: [
      'Known for its pink color.',
      'The color contrasts strongly with nearby ocean blues.',
      'One of Australia’s most iconic “unusual” natural sights.',
    ],
  },
  {
    id: 'a11',
    title: 'Kings Canyon',
    country: 'Australia',
    region: 'Northern Territory • Watarrka',
    coords: '-24.2570, 131.5640',
    teaser:
      'Deep red canyon walls and a rim walk with vast desert views — dramatic but approachable.',
    body:
      'Kings Canyon delivers instant drama: steep red walls, rugged cliffs, and sweeping desert panoramas from the rim. The famous rim walk is a journey through changing terrain — from exposed viewpoints to sheltered pockets of greenery.\n\nIt’s a strong travel choice if you want big scenery without needing remote logistics. The canyon feels epic, and the light makes the rock glow, especially early or late in the day.\n\nTake water seriously. The trail is beautiful, but the climate is not forgiving. Done right, it becomes one of those hikes you talk about for years.',
    facts: [
      'Known for deep red canyon walls.',
      'Rim views provide wide desert panoramas.',
      'Morning starts are best for cooler temperatures.',
    ],
  },
  {
    id: 'a12',
    title: 'Blue Mountains',
    country: 'Australia',
    region: 'New South Wales • Near Sydney',
    coords: '-33.7000, 150.3000',
    teaser:
      'A misty, eucalyptus-scented mountain region where cliffs and valleys feel endless.',
    body:
      'The Blue Mountains feel like a natural balcony above the world: layered valleys, cliff edges, and haze that turns distant ridgelines blue. That color effect is linked to fine oil droplets from eucalyptus trees mixing with light and atmosphere.\n\nFor travelers, it’s perfect for day trips or slow weekends. You can choose short lookouts or deeper hikes, and the scenery adapts to your energy. Foggy days are especially magical — they make the landscape feel cinematic and soft.\n\nIf you love viewpoints, go early. If you love walks, explore beyond the busiest lookout spots for quieter trails.',
    facts: [
      'Named for the blue haze created by eucalyptus oils and light scattering.',
      'Great mix of lookouts and hiking trails.',
      'Fog and overcast often enhance the atmosphere.',
    ],
  },
  {
    id: 'a13',
    title: 'Ningaloo Reef',
    country: 'Australia',
    region: 'Western Australia • Coral Coast',
    coords: '-22.3000, 113.8000',
    teaser:
      'A reef close to shore — clear water, coastal wilderness, and an easy path into marine scenery.',
    body:
      'Ningaloo Reef is special because it’s accessible from the coast. You don’t need long boat trips to find vibrant water and reef scenery. The coastline is wild and spacious, balancing desert-like land tones with bright ocean color.\n\nFor travelers, it’s a “do what you want” destination: beaches, snorkeling, simple coastal walks, and stargazing at night. The vibe is relaxed, natural, and open.\n\nIf you plan a longer trip, pair Ningaloo with nearby road-trip stops — this region rewards slow exploration more than rushing.',
    facts: [
      'Located close to shore, making reef exploration easier.',
      'Mixes coastal wilderness with clear water scenery.',
      'A great destination for calm, unhurried travel days.',
    ],
  },
  {
    id: 'a14',
    title: 'Gros Morne Tablelands',
    country: 'Canada',
    region: 'Newfoundland • Gros Morne National Park',
    coords: '49.6000, -57.8000',
    teaser:
      'An otherworldly landscape of mantle rock — orange-brown terrain that looks like another planet.',
    body:
      'The Tablelands in Gros Morne are famous for their rare geology: exposed mantle rock that creates a stark, rust-colored landscape. Vegetation is sparse, the ground feels raw, and the scene is unlike most “green” hiking destinations.\n\nFor travelers, it’s the contrast that makes it memorable. Nearby you’ll find typical Newfoundland beauty — forests, water, cliffs — and then suddenly the Tablelands feel like a different world.\n\nWalk slowly and notice texture. This is a place where the ground itself is the story, and the atmosphere is quiet, open, and dramatic.',
    facts: [
      'Unique for exposed mantle rocks.',
      'The terrain has an “otherworldly” look due to mineral composition.',
      'Pairs well with other Gros Morne scenery for contrast.',
    ],
  },
  {
    id: 'a15',
    title: 'Spirit Island',
    country: 'Canada',
    region: 'Alberta • Jasper National Park',
    coords: '52.2150, -117.2240',
    teaser:
      'A tiny island in a glacial lake with mountain walls behind it — calm, iconic, and timeless.',
    body:
      'Spirit Island is one of those places that feels like a symbol rather than a location: a small, forested island sitting in brilliant glacial water, framed by steep peaks. The scene is quiet, balanced, and visually perfect.\n\nTravelers love it because it represents the Rockies in a single view — clean lines, cold color, and wide space. It’s also a reminder that the most powerful landscapes often feel peaceful rather than extreme.\n\nIf you can, give the moment time. Sit, watch the lake surface change, and let the scenery become a memory rather than just a photo.',
    facts: [
      'Located on a glacial lake in Jasper National Park.',
      'One of the most iconic “postcard” views in the Canadian Rockies.',
      'Calm conditions create mirror-like reflections.',
    ],
  },
];

function countryBadgeColor(country: 'Australia' | 'Canada') {
  return country === 'Australia' ? 'rgba(255,180,94,0.22)' : 'rgba(120,200,255,0.18)';
}

export default function ScenicArticlesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const padH = isTiny ? 12 : isSmall ? 14 : 18;
  const titleSize = isTiny ? 12 : isSmall ? 13 : 14;

  const cardR = isTiny ? 18 : isSmall ? 20 : 24;
  const cardPad = isTiny ? 12 : isSmall ? 14 : 16;

  const btnH = isTiny ? 40 : isSmall ? 44 : 48;
  const btnR = isTiny ? 14 : isSmall ? 16 : 18;

  const [active, setActive] = useState<PlaceArticle | null>(null);

  const onShare = useCallback(async () => {
    if (!active) return;
    const msg =
      `${active.title}\n` +
      `${active.country} • ${active.region}\n` +
      `Coordinates: ${active.coords}\n\n` +
      `${active.teaser}\n\n` +
      `${active.facts.map(f => `• ${f}`).join('\n')}`;
    try {
      await Share.share({ message: msg });
    } catch {}
  }, [active]);

  const headerTop = Math.max(8, insets.top ? 6 : 8);
  const listBottomPad = Math.max(16, insets.bottom + (isTiny ? 14 : 18));

  const intro = useMemo(
    () =>
      '15 atmospheric place notes for travelers — Australia and Canada. Each card opens a full mini-article with coordinates and quick facts.',
    []
  );

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { paddingTop: headerTop }]}>
          <Pressable onPress={() => navigation?.goBack?.()} style={styles.backBtn} hitSlop={10}>
            <Image source={ICON_BACK} style={styles.backIcon} />
          </Pressable>
          <Text style={[styles.topTitle, { fontSize: titleSize }]}>SCENIC ATLAS</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={{ paddingHorizontal: padH, paddingTop: 10, paddingBottom: 8 }}>
          <Text style={[styles.pageTitle, { fontSize: isTiny ? 18 : isSmall ? 20 : 24 }]}>
            Dragon Scenic Atlas
          </Text>
          <Text
            style={[
              styles.pageSub,
              { fontSize: isTiny ? 11.5 : isSmall ? 12.5 : 13.5, lineHeight: isTiny ? 16 : 19 },
            ]}
          >
            {intro}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: padH, paddingBottom: listBottomPad }}
          showsVerticalScrollIndicator={false}
        >
          {ARTICLES.map(item => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  borderRadius: cardR,
                  padding: cardPad,
                },
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.countryPill, { backgroundColor: countryBadgeColor(item.country) }]}>
                  <Text style={styles.countryPillText}>{item.country.toUpperCase()}</Text>
                </View>
                <Text style={styles.coordsText}>{item.coords}</Text>
              </View>

              <Text style={[styles.cardTitle, { fontSize: isTiny ? 15 : isSmall ? 16 : 18 }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardMeta, { fontSize: isTiny ? 11 : 11.5 }]}>{item.region}</Text>

              <Text
                style={[
                  styles.cardTeaser,
                  { fontSize: isTiny ? 12 : isSmall ? 12.5 : 13.5, lineHeight: isTiny ? 17 : 20 },
                ]}
                numberOfLines={3}
              >
                {item.teaser}
              </Text>

              <View style={{ height: 12 }} />

              <View style={styles.cardBtnRow}>
                <Pressable
                  style={[styles.readBtn, { height: btnH, borderRadius: btnR, minWidth: isTiny ? 120 : 140 }]}
                  onPress={() => setActive(item)}
                >
                  <Text style={styles.readBtnText}>READ</Text>
                </Pressable>

                <Pressable
                  style={[styles.ghostBtn, { height: btnH, borderRadius: btnR }]}
                  onPress={async () => {
                    const msg =
                      `${item.title}\n${item.country} • ${item.region}\nCoordinates: ${item.coords}\n\n${item.teaser}`;
                    try {
                      await Share.share({ message: msg });
                    } catch {}
                  }}
                >
                  <Text style={styles.ghostBtnText}>SHARE</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>

        <Modal visible={!!active} animationType="fade" transparent onRequestClose={() => setActive(null)}>
          <View style={styles.modalRoot}>
            <Pressable style={styles.dim} onPress={() => setActive(null)} />

            <View style={[styles.modalCenter, { paddingHorizontal: padH }]}>
              <View
                style={[
                  styles.modalCard,
                  {
                    width: Math.min(460, W - padH * 2),
                    borderRadius: isTiny ? 20 : isSmall ? 22 : 26,
                    padding: isTiny ? 14 : isSmall ? 16 : 20,
                  },
                ]}
              >
                <View style={styles.modalTopRow}>
                  <View
                    style={[
                      styles.countryPill,
                      {
                        backgroundColor: active
                          ? countryBadgeColor(active.country)
                          : 'rgba(255,255,255,0.12)',
                      },
                    ]}
                  >
                    <Text style={styles.countryPillText}>{active?.country.toUpperCase()}</Text>
                  </View>

                  <Pressable onPress={() => setActive(null)} hitSlop={10} style={styles.closeBtn}>
                    <Text style={styles.closeText}>✕</Text>
                  </Pressable>
                </View>

                <Text style={[styles.modalTitle, { fontSize: isTiny ? 18 : isSmall ? 20 : 22 }]}>
                  {active?.title}
                </Text>
                <Text style={styles.modalMeta}>{active?.region}</Text>
                <Text style={styles.modalCoords}>Coordinates: {active?.coords}</Text>

                <View style={{ height: 10 }} />

                <ScrollView style={{ maxHeight: isTiny ? 320 : isSmall ? 380 : 460 }} showsVerticalScrollIndicator={false}>
                  <Text style={[styles.modalBody, { fontSize: isTiny ? 12.5 : 13.5, lineHeight: isTiny ? 18 : 20 }]}>
                    {active?.body}
                  </Text>

                  <View style={{ height: 14 }} />

                  <Text style={styles.factsTitle}>Quick facts</Text>
                  <View style={{ height: 8 }} />
                  {(active?.facts ?? []).map((f, i) => (
                    <Text key={`${active?.id}_f_${i}`} style={styles.factLine}>
                      • {f}
                    </Text>
                  ))}

                  <View style={{ height: 10 }} />
                </ScrollView>

                <View style={{ height: 12 }} />

                <View style={styles.modalBtnRow}>
                  <Pressable style={[styles.readBtn, { height: btnH, borderRadius: btnR, flex: 1 }]} onPress={onShare}>
                    <Text style={styles.readBtnText}>SHARE</Text>
                  </Pressable>

                  <View style={{ width: 10 }} />

                  <Pressable
                    style={[styles.ghostBtn, { height: btnH, borderRadius: btnR, flex: 1 }]}
                    onPress={() => setActive(null)}
                  >
                    <Text style={styles.ghostBtnText}>CLOSE</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  topBar: {
    paddingHorizontal: 14,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },

  pageTitle: { color: '#fff', fontWeight: '900', textAlign: 'left' },
  pageSub: { color: 'rgba(255,255,255,0.84)', fontWeight: '700' },

  // ✅ СДЕЛАЛИ КАРТОЧКИ ТЕМНЕЕ (в стиле красно-бордовой апки)
  card: {
    // Было: rgba(0,0,0,0.16)
    backgroundColor: 'rgba(18, 0, 0, 0.58)',

    // Чуть “теплее” и плотнее рамка, чтобы карточка читалась поверх яркого фона
    borderWidth: 1,
    borderColor: 'rgba(255, 180, 94, 0.18)',

    marginBottom: 12,

    // Тень для отделения от фона
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  countryPillText: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.6,
  },

  // Чуть ярче координаты (на тёмной карточке будет лучше)
  coordsText: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '900',
    fontSize: 11,
  },

  cardTitle: { color: '#fff', fontWeight: '900', marginTop: 10 },

  // Чуть повысили контраст меты
  cardMeta: { color: 'rgba(255,255,255,0.80)', fontWeight: '800', marginTop: 3 },

  // Тизер чуть ярче для читабельности на фоне
  cardTeaser: { color: 'rgba(255,255,255,0.90)', fontWeight: '700', marginTop: 10 },

  cardBtnRow: { flexDirection: 'row', gap: 10 },
  readBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  readBtnText: { color: '#0b0b0b', fontWeight: '900', letterSpacing: 0.4, fontSize: 13.5 },

  ghostBtn: {
    // Тоже чуть темнее, чтобы выглядело цельно с карточкой
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderWidth: 2,
    borderColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    flex: 1,
  },
  ghostBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 0.4, fontSize: 13.5 },

  modalRoot: { flex: 1, justifyContent: 'center' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  modalCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  modalCard: {
    backgroundColor: 'rgba(110,12,12,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  modalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  closeText: { color: 'rgba(255,255,255,0.92)', fontWeight: '900', fontSize: 14 },

  modalTitle: { color: '#fff', fontWeight: '900', marginTop: 12, textAlign: 'left' },
  modalMeta: { color: 'rgba(255,255,255,0.78)', fontWeight: '800', marginTop: 4 },
  modalCoords: { color: 'rgba(255,255,255,0.70)', fontWeight: '800', marginTop: 6 },

  modalBody: { color: 'rgba(255,255,255,0.90)', fontWeight: '700' },

  factsTitle: { color: '#fff', fontWeight: '900', fontSize: 14 },
  factLine: {
    color: 'rgba(255,255,255,0.86)',
    fontWeight: '700',
    lineHeight: Platform.select({ ios: 19, android: 20, default: 19 }),
    marginBottom: 6,
  },

  modalBtnRow: { flexDirection: 'row', alignItems: 'center' },
});