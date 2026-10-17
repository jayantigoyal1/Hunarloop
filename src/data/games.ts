export type TalentGame = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  skillSignals: string[];
  estimatedMinutes: number;
  isDemoData: true;
};

export const games: TalentGame[] = [
  { id: "pattern-path", title: { en: "Pattern Path", hi: "पैटर्न का रास्ता" }, description: { en: "Continue a simple picture pattern and notice how you approach it.", hi: "एक सरल चित्र पैटर्न आगे बढ़ाएं और देखें कि आप इसे कैसे हल करते हैं।" }, skillSignals: ["pattern noticing", "trying another way"], estimatedMinutes: 3, isDemoData: true },
  { id: "story-builder", title: { en: "Story Builder", hi: "कहानी बनाएं" }, description: { en: "Put a few picture cards in an order that tells a story.", hi: "कुछ चित्र कार्ड को ऐसे क्रम में लगाएं जिससे कहानी बने।" }, skillSignals: ["storytelling", "sequencing", "imagination"], estimatedMinutes: 4, isDemoData: true },
  { id: "everyday-planner", title: { en: "Everyday Planner", hi: "रोज़मर्रा की योजना" }, description: { en: "Choose steps to prepare for a familiar task with the time and items available.", hi: "उपलब्ध समय और सामान से परिचित काम की तैयारी के कदम चुनें।" }, skillSignals: ["planning", "practical reasoning"], estimatedMinutes: 4, isDemoData: true },
  { id: "helpful-hands", title: { en: "Helpful Hands", hi: "मददगार हाथ" }, description: { en: "Explore different ways to help a community member solve a small problem.", hi: "किसी समुदाय के सदस्य की छोटी समस्या सुलझाने के अलग-अलग तरीके देखें।" }, skillSignals: ["communication", "care", "problem solving"], estimatedMinutes: 3, isDemoData: true },
];

export const isDemoData = true;