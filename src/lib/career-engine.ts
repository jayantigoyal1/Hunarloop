import { careers, type Career } from "@/data/careers";
import type { StudentProfile } from "@/lib/store";

export type CareerRoute = "nearby" | "earn" | "long";
// Distances and timing are scenario fixtures, not geolocation or verified placements.
export const careerDetails: Record<string, { distanceKm: number; months: number; keywords: string[]; timeHi: string }> = {
  "solar-technician": {
    "distanceKm": 18,
    "months": 6,
    "keywords": [
      "solar",
      "tools",
      "repair",
      "hands-on",
      "सोलर",
      "औज़ार",
      "मरम्मत"
    ],
    "timeHi": "3–9 महीने, शुरुआती प्रशिक्षण के बाद"
  },
  "electrician-helper": {
    "distanceKm": 12,
    "months": 4,
    "keywords": [
      "electric",
      "repair",
      "tools",
      "hands-on",
      "बिजली",
      "मरम्मत"
    ],
    "timeHi": "2–6 महीने, निगरानी वाले प्रशिक्षण में"
  },
  "dairy-assistant": {
    "distanceKm": 6,
    "months": 2,
    "keywords": [
      "animal",
      "dairy",
      "farm",
      "routine",
      "पशु",
      "डेयरी",
      "खेती"
    ],
    "timeHi": "1–3 महीने, स्थानीय डेयरी में"
  },
  "irrigation-assistant": {
    "distanceKm": 10,
    "months": 4,
    "keywords": [
      "crop",
      "water",
      "farm",
      "outdoor",
      "खेती",
      "पानी",
      "फसल"
    ],
    "timeHi": "2–5 महीने, प्रशिक्षण के बाद"
  },
  "health-programme-assistant": {
    "distanceKm": 22,
    "months": 12,
    "keywords": [
      "help",
      "people",
      "listen",
      "community",
      "मदद",
      "लोग",
      "समुदाय"
    ],
    "timeHi": "कार्यक्रम और प्रशिक्षण पर निर्भर"
  },
  "tailoring-maker": {
    "distanceKm": 8,
    "months": 4,
    "keywords": [
      "creativ",
      "draw",
      "sew",
      "hand",
      "रचनात्मक",
      "चित्र",
      "सिलाई"
    ],
    "timeHi": "2–6 महीने, अभ्यास और ग्राहक मिलने पर"
  },
  "digital-content-helper": {
    "distanceKm": 15,
    "months": 6,
    "keywords": [
      "creativ",
      "photo",
      "story",
      "draw",
      "phone",
      "तस्वीर",
      "कहानी",
      "चित्र"
    ],
    "timeHi": "3–9 महीने, नमूने और ग्राहक मिलने पर"
  },
  "data-entry-operator": {
    "distanceKm": 20,
    "months": 4,
    "keywords": [
      "typ",
      "computer",
      "list",
      "accuracy",
      "कंप्यूटर",
      "सूची",
      "टाइप"
    ],
    "timeHi": "2–6 महीने, अभ्यास और उपयुक्त काम मिलने पर"
  },
  "computer-support-trainee": {
    "distanceKm": 26,
    "months": 7,
    "keywords": [
      "computer",
      "repair",
      "device",
      "curiosity",
      "कंप्यूटर",
      "मरम्मत",
      "उपकरण"
    ],
    "timeHi": "4–9 महीने, मार्गदर्शन वाले अभ्यास के साथ"
  },
  "learning-facilitator": {
    "distanceKm": 14,
    "months": 6,
    "keywords": [
      "help",
      "teach",
      "explain",
      "people",
      "मदद",
      "पढ़ाना",
      "समझाना"
    ],
    "timeHi": "3–8 महीने, स्थानीय कार्यक्रम पर निर्भर"
  },
  "retail-associate": {
    "distanceKm": 5,
    "months": 2,
    "keywords": [
      "people",
      "shop",
      "count",
      "help",
      "दुकान",
      "गिनती",
      "मदद"
    ],
    "timeHi": "1–4 महीने, उपयुक्त स्थानीय अवसर मिलने पर"
  },
  "small-business-assistant": {
    "distanceKm": 9,
    "months": 4,
    "keywords": [
      "list",
      "count",
      "record",
      "business",
      "सूची",
      "गिनती",
      "लेखा",
      "व्यापार"
    ],
    "timeHi": "2–6 महीने, अभ्यास और स्थानीय अवसर के बाद"
  },
  "public-service-assistant": {
    "distanceKm": 30,
    "months": 36,
    "keywords": [
      "public",
      "government",
      "study",
      "reading",
      "सरकारी",
      "सेवा",
      "पढ़ाई"
    ],
    "timeHi": "कई वर्ष की पढ़ाई और चयन; कोई गारंटी नहीं"
  }
};

export function recommendCareers(profile: StudentProfile, route: CareerRoute) {
  const ranked = careers.map((career, index) => {
    const detail = careerDetails[career.id];
    const matches = (values: string[]) => values.filter((value) => detail.keywords.some((key) => value.toLocaleLowerCase().includes(key)));
    const interests = matches([...profile.interests, ...profile.enjoys]);
    const skills = matches(profile.skills);
    const goalMatch = matches(profile.goals).length > 0;
    const localFit = /bus|walk|बस|पैदल/i.test(profile.constraints.transport) && detail.distanceKm <= 15;
    const budgetFit = /low|कम/i.test(profile.constraints.budget) && career.difficulty === "beginner";
    const score = Math.min(95, 50 + Math.min(18, interests.length * 6) + Math.min(18, skills.length * 9) + (goalMatch ? 5 : 0) + (localFit ? 3 : 0) + (budgetFit ? 3 : 0));
    const routeBonus = route === "nearby" ? Math.max(0, 32 - detail.distanceKm) : route === "earn" ? Math.max(0, 35 - detail.months * 5) : detail.months;
    return { career, interests: [...new Set(interests)], skills, localFit, budgetFit, score, rank: score + routeBonus, index };
  }).sort((a, b) => b.rank - a.rank || a.index - b.index);
  const counts = new Map<Career["category"], number>();
  return ranked.filter(({ career }) => {
    const count = counts.get(career.category) ?? 0;
    if (count >= 2) return false;
    counts.set(career.category, count + 1);
    return true;
  }).slice(0, 6);
}
