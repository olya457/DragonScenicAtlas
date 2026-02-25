import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = require('../assets/background.png');
const BG2 = require('../assets/background2.png');
const ICON_BACK = require('../assets/back.png');

type ChoiceId = 'A' | 'B' | 'C';
type Choice = { id: ChoiceId; text: string };
type Question = { id: string; text: string; choices: Choice[]; correct: ChoiceId };
type Phase = 'intro' | 'question' | 'result';

const QUESTIONS_PER_ROUND = 10;
const PASS_THRESHOLD = 7;

const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    text: 'In which country is Uluru located?',
    choices: [
      { id: 'A', text: 'A) New Zealand' },
      { id: 'B', text: 'B) South Africa' },
      { id: 'C', text: 'C) Australia' },
    ],
    correct: 'C',
  },
  {
    id: 'q2',
    text: 'What gives Peyto Lake its turquoise color?',
    choices: [
      { id: 'A', text: 'A) Algae' },
      { id: 'B', text: 'B) Glacial dust' },
      { id: 'C', text: 'C) Volcanic ash' },
    ],
    correct: 'B',
  },
  {
    id: 'q3',
    text: 'The Twelve Apostles were formed by:',
    choices: [
      { id: 'A', text: 'A) Volcanic activity' },
      { id: 'B', text: 'B) Ocean erosion' },
      { id: 'C', text: 'C) Earthquakes' },
    ],
    correct: 'B',
  },
  {
    id: 'q4',
    text: 'The Daintree Rainforest is known for being:',
    choices: [
      { id: 'A', text: 'A) The youngest rainforest' },
      { id: 'B', text: 'B) Older than the Amazon' },
      { id: 'C', text: 'C) Completely artificial' },
    ],
    correct: 'B',
  },
  {
    id: 'q5',
    text: 'In which country is the Athabasca Glacier located?',
    choices: [
      { id: 'A', text: 'A) Iceland' },
      { id: 'B', text: 'B) Canada' },
      { id: 'C', text: 'C) Norway' },
    ],
    correct: 'B',
  },
  {
    id: 'q6',
    text: 'The Bungle Bungle Range is known for:',
    choices: [
      { id: 'A', text: 'A) Ice caves' },
      { id: 'B', text: 'B) Dome-shaped banded formations' },
      { id: 'C', text: 'C) Active volcanoes' },
    ],
    correct: 'B',
  },
  {
    id: 'q7',
    text: 'The Hopewell Rocks change their appearance due to:',
    choices: [
      { id: 'A', text: 'A) Strong winds' },
      { id: 'B', text: 'B) Frequent earthquakes' },
      { id: 'C', text: 'C) Ebb and flow of tides' },
    ],
    correct: 'C',
  },
  {
    id: 'q8',
    text: 'What natural phenomenon creates Horizontal Falls?',
    choices: [
      { id: 'A', text: 'A) Waterfall from a height' },
      { id: 'B', text: 'B) Tidal flows between rocks' },
      { id: 'C', text: 'C) Melting glaciers' },
    ],
    correct: 'B',
  },
  {
    id: 'q9',
    text: 'Icefield Columbia feeds:',
    choices: [
      { id: 'A', text: 'A) Sandy deserts' },
      { id: 'B', text: 'B) Ocean currents' },
      { id: 'C', text: 'C) River systems' },
    ],
    correct: 'C',
  },
  {
    id: 'q10',
    text: 'Lake Hillier is known for:',
    choices: [
      { id: 'A', text: 'A) Round shape' },
      { id: 'B', text: 'B) Pink color of water' },
      { id: 'C', text: 'C) Hot temperature' },
    ],
    correct: 'B',
  },
  {
    id: 'q11',
    text: 'Kings Canyon is known for:',
    choices: [
      { id: 'A', text: 'A) Sand dunes' },
      { id: 'B', text: 'B) Deep red walls' },
      { id: 'C', text: 'C) Ice cracks' },
    ],
    correct: 'B',
  },
  {
    id: 'q12',
    text: 'Blue Mountains got their name from:',
    choices: [
      { id: 'A', text: 'A) Color of rocks' },
      { id: 'B', text: 'B) Mist from eucalyptus trees' },
      { id: 'C', text: 'C) Proximity to the ocean' },
    ],
    correct: 'B',
  },
  {
    id: 'q13',
    text: 'Ningaloo Reef is located:',
    choices: [
      { id: 'A', text: 'A) Far from the coast' },
      { id: 'B', text: 'B) Near the coast' },
      { id: 'C', text: 'C) Under the ice' },
    ],
    correct: 'B',
  },
  {
    id: 'q14',
    text: 'Gros Morne Tablelands are unique in that they have:',
    choices: [
      { id: 'A', text: 'A) Volcanic craters' },
      { id: 'B', text: 'B) Mantle rocks' },
      { id: 'C', text: 'C) Coral reefs' },
    ],
    correct: 'B',
  },
  {
    id: 'q15',
    text: 'Spirit Island is located:',
    choices: [
      { id: 'A', text: 'A) In a desert' },
      { id: 'B', text: 'B) On a river' },
      { id: 'C', text: 'C) On a glacial lake' },
    ],
    correct: 'C',
  },
  {
    id: 'q16',
    text: 'Simpson Desert is known for:',
    choices: [
      { id: 'A', text: 'A) Stone plateaus' },
      { id: 'B', text: 'B) Parallel dunes' },
      { id: 'C', text: 'C) Rainforests' },
    ],
    correct: 'B',
  },
  {
    id: 'q17',
    text: 'Mount Assiniboine is often compared to:',
    choices: [
      { id: 'A', text: 'A) Mount Fuji' },
      { id: 'B', text: 'B) Matterhorn' },
      { id: 'C', text: 'C) Mount Kilimanjaro' },
    ],
    correct: 'B',
  },
  {
    id: 'q18',
    text: 'Karlu Karlu consists of:',
    choices: [
      { id: 'A', text: 'A) Sharp cliffs' },
      { id: 'B', text: 'B) Sand hills' },
      { id: 'C', text: 'C) Rounded boulders' },
    ],
    correct: 'C',
  },
  {
    id: 'q19',
    text: 'Haida Gwaii is:',
    choices: [
      { id: 'A', text: 'A) Mountain range' },
      { id: 'B', text: 'B) Archipelago' },
      { id: 'C', text: 'C) Lake' },
    ],
    correct: 'B',
  },
  {
    id: 'q20',
    text: 'Stonehammer Geopark showcases:',
    choices: [
      { id: 'A', text: 'A) Modern architecture' },
      { id: 'B', text: 'B) Geological history of the region' },
      { id: 'C', text: 'C) Active volcanoes' },
    ],
    correct: 'B',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickQuestions(bank: Question[]): Question[] {
  return shuffle(bank).slice(0, QUESTIONS_PER_ROUND);
}

export default function QuizScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<ChoiceId | null>(null);

  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appearQ = useRef(new Animated.Value(0)).current;
  const appearA = useRef(new Animated.Value(0)).current;

  const current = questions[idx];
  const passed = score >= PASS_THRESHOLD;

  const padH = isTiny ? 16 : isSmall ? 18 : 22;
  const topTitleSize = isTiny ? 12.5 : isSmall ? 13 : 14;

  const qTextSize = isTiny ? 14 : isSmall ? 15 : 17;
  const qLine = isTiny ? 20 : isSmall ? 22 : 26;

  const btnH = isTiny ? 46 : isSmall ? 50 : 56;
  const btnR = isTiny ? 18 : isSmall ? 20 : 24;

  const mainMinW = isTiny ? 220 : isSmall ? 240 : 260;

  const progress = useMemo(() => `${idx + 1}/${QUESTIONS_PER_ROUND}`, [idx]);

  useEffect(() => {
    return () => {
      if (tRef.current) clearTimeout(tRef.current);
      tRef.current = null;
    };
  }, []);

  const runQuestionAnim = useCallback(() => {
    appearQ.setValue(0);
    appearA.setValue(0);

    Animated.sequence([
      Animated.timing(appearQ, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(appearA, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [appearA, appearQ]);

  const resetAll = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = null;

    setPhase('intro');
    setQuestions([]);
    setIdx(0);
    setScore(0);
    setSelected(null);
    setLocked(false);

    appearQ.setValue(0);
    appearA.setValue(0);
  }, [appearA, appearQ]);

  useEffect(() => {
    const unsub = navigation?.addListener?.('blur', resetAll);
    return unsub;
  }, [navigation, resetAll]);

  const startRound = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);

    setQuestions(pickQuestions(QUESTION_BANK));
    setIdx(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setPhase('question');

    requestAnimationFrame(() => runQuestionAnim());
  }, [runQuestionAnim]);

  const toMenu = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = null;
    setPhase('intro');
    setSelected(null);
    setLocked(false);
  }, []);

  const onChoose = useCallback(
    (choiceId: ChoiceId) => {
      if (!current) return;
      if (locked) return;

      setLocked(true);
      setSelected(choiceId);

      if (current.correct === choiceId) setScore(s => s + 1);

      if (tRef.current) clearTimeout(tRef.current);
      tRef.current = setTimeout(() => {
        const isLast = idx >= QUESTIONS_PER_ROUND - 1;

        setSelected(null);
        setLocked(false);

        if (isLast) {
          setPhase('result');
        } else {
          setIdx(i => i + 1);
          runQuestionAnim();
        }
      }, 620);
    },
    [current, locked, idx, runQuestionAnim]
  );

  const onRetry = useCallback(() => startRound(), [startRound]);

  const qTranslate = appearQ.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const aTranslate = appearA.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  const introQuote =
    '“Knowledge is not what you store — it is what you become. Each question is a small door. Open it honestly, and you’ll see more than you expected.”';

  if (phase === 'intro') {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <View pointerEvents="none" style={styles.overlayTop} />
        <View pointerEvents="none" style={styles.overlayCenter} />

        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={[styles.topBar, { paddingTop: Math.max(8, insets.top ? 6 : 8) }]}>
            <Pressable onPress={() => navigation?.goBack?.()} style={styles.backBtn} hitSlop={10}>
              <Image source={ICON_BACK} style={styles.backIcon} />
            </Pressable>
            <Text style={[styles.topTitle, { fontSize: topTitleSize }]}>QUIZ</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={[styles.center, { paddingHorizontal: padH }]}>
            <View style={[styles.quoteCard, { transform: [{ translateY: -30 }] }]}>
              <Text
                style={[
                  styles.quoteText,
                  {
                    fontSize: isTiny ? 12.5 : isSmall ? 13.5 : 14.5,
                    lineHeight: isTiny ? 18 : isSmall ? 20 : 22,
                  },
                ]}
              >
                {introQuote}
              </Text>

              <Text style={[styles.quoteSub, { fontSize: isTiny ? 11 : 12 }]}>
                10 questions • pass with 7+ correct
              </Text>
            </View>

            <View style={{ height: isTiny ? 16 : 22 }} />

            <Pressable
              style={[styles.mainBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
              onPress={startRound}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
            >
              <Text style={[styles.mainBtnText, { fontSize: isTiny ? 14 : 15 }]}>START</Text>
            </Pressable>

            <View style={{ height: Math.max(16, insets.bottom + 10) }} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (phase === 'result') {
    return (
      <ImageBackground source={BG2} style={styles.bg} resizeMode="cover">
        <View pointerEvents="none" style={styles.overlayTop} />
        <View pointerEvents="none" style={styles.overlayCenter} />

        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={{ height: Math.max(8, insets.top ? 6 : 8) }} />

          <View style={[styles.resultCenter, { paddingHorizontal: padH }]}>
            <View style={[styles.resultCard, { borderRadius: isTiny ? 20 : 24, padding: isTiny ? 14 : 18 }]}>
              <Text style={[styles.resultTitle, { fontSize: isTiny ? 16 : isSmall ? 18 : 22 }]}>
                {passed ? 'ROUND COMPLETE' : 'ROUND FAILED'}
              </Text>

              <Text style={[styles.resultScore, { fontSize: isTiny ? 13 : 15, marginTop: 10 }]}>
                Correct answers: {score}/{QUESTIONS_PER_ROUND}
              </Text>

              <Text
                style={[
                  styles.resultHint,
                  {
                    fontSize: isTiny ? 12 : 13,
                    lineHeight: isTiny ? 17 : 19,
                    marginTop: 8,
                  },
                ]}
              >
                {passed ? 'You passed. Want another round?' : `You need at least ${PASS_THRESHOLD} correct to pass.`}
              </Text>

              <View style={{ height: 14 }} />

              <Pressable
                style={[styles.mainBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
                onPress={onRetry}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              >
                <Text style={[styles.mainBtnText, { fontSize: isTiny ? 14 : 15 }]}>PLAY AGAIN</Text>
              </Pressable>

              <View style={{ height: 10 }} />

              <Pressable
                style={[styles.menuBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
                onPress={toMenu}
                android_ripple={{ color: 'rgba(255,180,94,0.10)' }}
              >
                <Text style={[styles.menuBtnText, { fontSize: isTiny ? 14 : 15 }]}>MENU</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ height: Math.max(16, insets.bottom + 10) }} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <View pointerEvents="none" style={styles.overlayTop} />
      <View pointerEvents="none" style={styles.overlayCenter} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { paddingTop: Math.max(8, insets.top ? 6 : 8) }]}>
          <Pressable onPress={toMenu} style={styles.backBtn} hitSlop={10}>
            <Image source={ICON_BACK} style={styles.backIcon} />
          </Pressable>

          <Text style={[styles.topTitle, { fontSize: topTitleSize }]}>{progress}</Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.qCenterWrap, { paddingHorizontal: padH }]}>
          <Animated.View style={{ opacity: appearQ, transform: [{ translateY: qTranslate }] }}>
            <Text style={[styles.qText, { fontSize: qTextSize, lineHeight: qLine }]}>{current?.text}</Text>
          </Animated.View>

          <View style={{ height: isTiny ? 14 : 18 }} />

          <Animated.View style={{ opacity: appearA, transform: [{ translateY: aTranslate }], width: '100%' }}>
            {current?.choices.map(c => {
              const picked = selected === c.id;
              const correct = c.id === current?.correct;

              const base: any[] = [
                styles.answerBtn,
                {
                  height: btnH,
                  borderRadius: btnR,
                  maxWidth: isTiny ? 380 : 420,
                  marginBottom: isTiny ? 10 : 12,
                },
              ];

              if (locked && correct) base.push(styles.answerCorrect);
              if (locked && picked && !correct) base.push(styles.answerWrong);

              return (
                <Pressable
                  key={c.id}
                  style={base}
                  onPress={() => onChoose(c.id)}
                  disabled={locked}
                  android_ripple={{ color: 'rgba(0,0,0,0.10)' }}
                >
                  <Text style={[styles.answerText, { fontSize: isTiny ? 13 : 14.2 }]}>{c.text}</Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <View style={{ height: 10 }} />

          <Text style={[styles.helperLine, { fontSize: isTiny ? 11.2 : 12 }]}>
            Score: {score}/{QUESTIONS_PER_ROUND} • Need {PASS_THRESHOLD}
          </Text>
        </View>

        <View style={{ height: Math.max(16, insets.bottom + 10) }} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  overlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  overlayCenter: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 420,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

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

  center: { flex: 1, justifyContent: 'center' },

  quoteCard: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 460,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(0,0,0,0.26)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  quoteText: {
    color: 'rgba(255,255,255,0.90)',
    fontWeight: '800',
    textAlign: 'center',
  },
  quoteSub: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '800',
    textAlign: 'center',
  },

  mainBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 5 },
    }),
  },
  mainBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  qCenterWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  qText: {
    color: 'rgba(255,255,255,0.94)',
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  answerBtn: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  answerWrong: { backgroundColor: '#FF1A1A' },
  answerCorrect: { backgroundColor: '#39E75F' },
  answerText: { color: '#0b0b0b', fontWeight: '900', textAlign: 'center' },

  helperLine: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '800',
    ...Platform.select({ android: { paddingBottom: 1 } }),
  },

  resultCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(110,12,12,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  resultTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultScore: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultHint: { color: 'rgba(255,255,255,0.84)', fontWeight: '700', textAlign: 'center' },

  menuBtn: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: 2,
    borderColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  menuBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 0.6 },
});