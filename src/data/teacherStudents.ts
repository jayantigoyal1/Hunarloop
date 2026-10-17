export type TeacherStudent = {
  id: string;
  name: string;
  classLevel: string;
  village: string;
  progress: number;
  engagementTrend: "increasing" | "steady" | "variable";
  weeklyEngagement: number[];
  supportCards: { id: string; title: string; detail: string }[];
  isDemoData: true;
};

export const teacherStudents: TeacherStudent[] = [
  { id: "asha-demo", name: "Asha", classLevel: "Class 10", village: "Khejroli", progress: 42, engagementTrend: "increasing", weeklyEngagement: [1, 2, 2, 3], supportCards: [{ id: "asha-audio", title: "Audio-first option", detail: "Offer spoken instructions when she chooses them." }, { id: "asha-steps", title: "Small steps", detail: "Show one task at a time and let her set the pace." }], isDemoData: true },
  { id: "meera-demo", name: "Meera", classLevel: "Class 9", village: "Chomu", progress: 58, engagementTrend: "steady", weeklyEngagement: [2, 2, 2, 2], supportCards: [{ id: "meera-visual", title: "Visual examples", detail: "Offer a sample before inviting her to try." }], isDemoData: true },
  { id: "salim-demo", name: "Salim", classLevel: "Class 10", village: "Sambhar", progress: 31, engagementTrend: "variable", weeklyEngagement: [3, 1, 2, 1], supportCards: [{ id: "salim-offline", title: "Offline option", detail: "Keep a printable activity ready when connectivity is patchy." }], isDemoData: true },
  { id: "kavita-demo", name: "Kavita", classLevel: "Class 8", village: "Phulera", progress: 67, engagementTrend: "increasing", weeklyEngagement: [1, 2, 3, 3], supportCards: [{ id: "kavita-audio", title: "Audio instructions", detail: "Offer a spoken version alongside written steps." }], isDemoData: true },
  { id: "imran-demo", name: "Imran", classLevel: "Class 9", village: "Bagru", progress: 24, engagementTrend: "steady", weeklyEngagement: [1, 1, 1, 1], supportCards: [{ id: "imran-checkin", title: "Choice of check-in", detail: "Ask whether he prefers a quick conversation or a written prompt." }], isDemoData: true },
  { id: "pinki-demo", name: "Pinki", classLevel: "Class 10", village: "Dudu", progress: 76, engagementTrend: "increasing", weeklyEngagement: [2, 2, 3, 4], supportCards: [{ id: "pinki-practice", title: "Extra practice choice", detail: "Offer an optional practice round before moving on." }], isDemoData: true },
  { id: "rohan-demo", name: "Rohan", classLevel: "Class 8", village: "Amer", progress: 49, engagementTrend: "variable", weeklyEngagement: [2, 3, 1, 2], supportCards: [{ id: "rohan-offline", title: "Low-data materials", detail: "Let him download or view activities when the connection is available." }], isDemoData: true },
  { id: "sita-demo", name: "Sita", classLevel: "Class 9", village: "Jamwa Ramgarh", progress: 35, engagementTrend: "steady", weeklyEngagement: [1, 2, 1, 2], supportCards: [{ id: "sita-choice", title: "More response choices", detail: "Let her answer by speaking, typing, or selecting a card." }], isDemoData: true },
];

export const isDemoData = true;