export type DemoBadge = {
  id: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  points: number;
  isDemoData: true;
};

export const badges: DemoBadge[] = [
  { id: "first-step", title: { en: "First Step", hi: "पहला कदम" }, description: { en: "Started exploring your interests.", hi: "अपनी रुचियां जानना शुरू किया।" }, points: 10, isDemoData: true },
  { id: "curious-explorer", title: { en: "Curious Explorer", hi: "जिज्ञासु खोजी" }, description: { en: "Tried your first talent game.", hi: "अपना पहला हुनर खेल आज़माया।" }, points: 15, isDemoData: true },
  { id: "passport-maker", title: { en: "Passport Maker", hi: "पासपोर्ट निर्माता" }, description: { en: "Added your own ideas to your Hunar Passport.", hi: "अपने हुनर पासपोर्ट में अपने विचार जोड़े।" }, points: 20, isDemoData: true },
  { id: "path-finder", title: { en: "Path Finder", hi: "रास्ता खोजी" }, description: { en: "Saved a career path to explore.", hi: "जानने के लिए एक करियर रास्ता सहेजा।" }, points: 20, isDemoData: true },
  { id: "steady-steps", title: { en: "Steady Steps", hi: "लगातार कदम" }, description: { en: "Completed four different plan milestones.", hi: "योजना के चार अलग कदम पूरे किए।" }, points: 25, isDemoData: true },
];

export const isDemoData = true;
