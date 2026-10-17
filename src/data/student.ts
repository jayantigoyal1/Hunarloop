export const sampleStudent = {
  id: "student-asha-demo",
  name: "Asha",
  age: 16,
  classLevel: "Class 10",
  village: "Khejroli",
  district: "Jaipur",
  state: "Rajasthan",
  preferredLanguage: "Hindi",
  budget: "low",
  transport: "bus",
  device: "low-end Android phone",
  connectivity: "patchy mobile data",
  isDemoData: true,
} as const;

export type SampleStudent = typeof sampleStudent;