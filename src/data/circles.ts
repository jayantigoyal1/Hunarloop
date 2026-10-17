export type LearningCircle = {
  id: string;
  name: { en: string; hi: string };
  interest: string;
  description: { en: string; hi: string };
  meetingFormat: string;
  location: string;
  members: number;
  isDemoData: true;
};

export const circles: LearningCircle[] = [
  { id: "solar-makers", name: { en: "Solar Makers", hi: "सोलर मेकर समूह" }, interest: "Technical Trades", description: { en: "Explore how small solar devices work and share safe, guided practice ideas.", hi: "छोटे सोलर उपकरणों के काम करने का तरीका जानें और सुरक्षित, निगरानी वाले अभ्यास साझा करें।" }, meetingFormat: "Weekly school or community-centre meetup", location: "Jaipur district", members: 8, isDemoData: true },
  { id: "creative-corners", name: { en: "Creative Corners", hi: "रचनात्मक कोना" }, interest: "Creative", description: { en: "Try storytelling, drawing, and simple phone photography prompts together.", hi: "कहानी, चित्रकारी और फोन से सरल तस्वीरों के अभ्यास साथ करें।" }, meetingFormat: "Weekly in-person meetup; phone-friendly activities", location: "Chomu area", members: 11, isDemoData: true },
  { id: "kheti-club", name: { en: "Kheti Club", hi: "खेती क्लब" }, interest: "Agriculture & Allied", description: { en: "Learn about crops, water use, and local agriculture through guided activities.", hi: "निगरानी वाली गतिविधियों से फसलों, पानी और स्थानीय खेती के बारे में जानें।" }, meetingFormat: "Fortnightly meetup with a local facilitator", location: "Sambhar area", members: 9, isDemoData: true },
  { id: "digital-saathi", name: { en: "Digital Saathi", hi: "डिजिटल साथी" }, interest: "Digital", description: { en: "Practice everyday phone and computer tasks with peers, one small step at a time.", hi: "साथियों के साथ रोज़मर्रा के फोन और कंप्यूटर काम एक-एक कदम करके सीखें।" }, meetingFormat: "Weekly school lab session; offline worksheets available", location: "Jaipur district", members: 10, isDemoData: true },
];

export const isDemoData = true;