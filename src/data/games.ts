import type { GameId } from "@/lib/game-engine";

export const games: { id: GameId; emoji: string; title: { en: string; hi: string }; instruction: { en: string; hi: string } }[] = [
  { id: "word-pop", emoji: "🥭", title: { en: "Word Pop", hi: "शब्द बुलबुले" }, instruction: { en: "Listen, then tap the matching picture. You can switch to picture matching at any time.", hi: "सुनें, फिर सही तस्वीर छुएं। आप कभी भी तस्वीर मिलाने का विकल्प चुन सकते हैं।" } },
  { id: "sequence-memory", emoji: "🔷", title: { en: "Sequence Memory", hi: "क्रम याद करें" }, instruction: { en: "Watch the glowing shapes. Then tap them in the same order. Each round adds one shape.", hi: "चमकती आकृतियां देखें। फिर उसी क्रम में छुएं। हर दौर में एक आकृति बढ़ती है।" } },
  { id: "catch-star", emoji: "⭐", title: { en: "Catch the Star", hi: "तारा पकड़ें" }, instruction: { en: "Tap the gold stars. Leave the grey circles. Go at your own pace.", hi: "सुनहरे तारे छुएं। धूसर गोलों को छोड़ दें। अपनी गति से खेलें।" } },
];

export const roadmapGames = [
  { emoji: "🥁", en: "Rhythm Tap", hi: "ताल पर छुएं" },
  { emoji: "🎧", en: "Noise Choice", hi: "आवाज़ की पसंद" },
  { emoji: "🧩", en: "Instruction Recall", hi: "निर्देश याद करें" },
];

export const words = [
  { id: "mango", emoji: "🥭", en: "Mango", hi: "आम" },
  { id: "apple", emoji: "🍎", en: "Apple", hi: "सेब" },
  { id: "banana", emoji: "🍌", en: "Banana", hi: "केला" },
  { id: "grapes", emoji: "🍇", en: "Grapes", hi: "अंगूर" },
  { id: "orange", emoji: "🍊", en: "Orange", hi: "संतरा" },
  { id: "watermelon", emoji: "🍉", en: "Watermelon", hi: "तरबूज़" },
];

const skillLabels: Record<string, { en: string; hi: string }> = {
  "listening and matching": { en: "Listening and matching", hi: "सुनकर मिलान करना" },
  "visual matching": { en: "Visual matching", hi: "तस्वीरें मिलाना" },
  "pattern memory": { en: "Pattern memory", hi: "क्रम याद रखना" },
  "hand-eye coordination": { en: "Hand-eye coordination", hi: "देखकर हाथ से सही जगह छूना" },
  "trying new activities": { en: "Trying new activities", hi: "नई गतिविधियां आज़माना" },
};

export function gameSkillLabel(skill: string, language: "en" | "hi") {
  return skillLabels[skill]?.[language] ?? skill;
}
