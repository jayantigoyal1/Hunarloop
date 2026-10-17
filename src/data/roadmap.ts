export type RoadmapWeek = {
  week: number;
  focus: { en: string; hi: string };
  activities: { en: string[]; hi: string[] };
};

export type CareerRoadmap = {
  careerId: string;
  title: { en: string; hi: string };
  weeks: RoadmapWeek[];
  isDemoData: true;
};

export const weeklyPlans: CareerRoadmap[] = [
  {
    careerId: "solar-technician",
    title: { en: "Solar Installation Technician", hi: "सोलर इंस्टॉलेशन तकनीशियन" },
    weeks: [
      { week: 1, focus: { en: "Explore the work", hi: "काम को जानें" }, activities: { en: ["List what you already know about electricity and sunlight.", "Ask a trusted adult about a local solar installation."], hi: ["बिजली और धूप के बारे में जो जानते हैं, लिखें।", "किसी भरोसेमंद बड़े से स्थानीय सोलर इंस्टॉलेशन के बारे में पूछें।"] } },
      { week: 2, focus: { en: "Find a training option", hi: "प्रशिक्षण विकल्प खोजें" }, activities: { en: ["Check the nearest ITI or Skill India Digital Hub course.", "Write down travel cost, timing, and entry requirements."], hi: ["नज़दीकी ITI या Skill India Digital Hub कोर्स देखें।", "यात्रा खर्च, समय और प्रवेश की शर्तें लिखें।"] } },
      { week: 3, focus: { en: "Try a safe introduction", hi: "सुरक्षित परिचय लें" }, activities: { en: ["Watch an official beginner lesson with an adult.", "Make a list of safety questions; do not handle live electrical equipment."], hi: ["किसी बड़े के साथ आधिकारिक शुरुआती पाठ देखें।", "सुरक्षा सवालों की सूची बनाएं; चालू बिजली के उपकरण न छुएं।"] } },
      { week: 4, focus: { en: "Choose your next step", hi: "अगला कदम चुनें" }, activities: { en: ["Compare the course details with your schedule.", "Decide whether to ask for an admission visit or explore another path."], hi: ["कोर्स की जानकारी अपने समय से मिलाएं।", "तय करें कि प्रवेश जानकारी लें या कोई दूसरा रास्ता देखें।"] } },
    ],
    isDemoData: true,
  },
  {
    careerId: "dairy-assistant",
    title: { en: "Dairy Farm Assistant", hi: "डेयरी फार्म सहायक" },
    weeks: [
      { week: 1, focus: { en: "Notice local work", hi: "स्थानीय काम समझें" }, activities: { en: ["Write down familiar dairy tasks and questions.", "Ask a trusted adult about cooperative work nearby."], hi: ["डेयरी के परिचित काम और सवाल लिखें।", "किसी भरोसेमंद बड़े से पास के सहकारी काम के बारे में पूछें।"] } },
      { week: 2, focus: { en: "Explore training", hi: "प्रशिक्षण जानें" }, activities: { en: ["Contact a dairy cooperative or district animal husbandry office.", "Check whether a short course is free and reachable by bus."], hi: ["डेयरी सहकारी समिति या ज़िला पशुपालन कार्यालय से संपर्क करें।", "जानें कि छोटा कोर्स मुफ़्त है और बस से पहुंचा जा सकता है या नहीं।"] } },
      { week: 3, focus: { en: "Practice simple records", hi: "सरल रिकॉर्ड का अभ्यास" }, activities: { en: ["Use a notebook to record a pretend daily routine.", "Ask what information a worker should keep private."], hi: ["काल्पनिक रोज़ की दिनचर्या का रिकॉर्ड कॉपी में बनाएं।", "पूछें कि कर्मचारी को कौन-सी जानकारी निजी रखनी चाहिए।"] } },
      { week: 4, focus: { en: "Review your choice", hi: "अपनी पसंद पर सोचें" }, activities: { en: ["Talk through the daily schedule with a family member.", "Choose whether to visit a cooperative or keep exploring."], hi: ["परिवार के सदस्य के साथ रोज़ के समय पर बात करें।", "तय करें कि सहकारी समिति जाएं या और जानकारी लें।"] } },
    ],
    isDemoData: true,
  },
  {
    careerId: "data-entry-operator",
    title: { en: "Data Entry Operator", hi: "डेटा एंट्री ऑपरेटर" },
    weeks: [
      { week: 1, focus: { en: "Check device access", hi: "उपकरण की सुविधा देखें" }, activities: { en: ["Find out when you can use a phone or computer for practice.", "Try typing a short list in Hindi or English."], hi: ["पता करें कि अभ्यास के लिए फोन या कंप्यूटर कब मिल सकता है।", "हिंदी या अंग्रेज़ी में छोटी सूची टाइप करें।"] } },
      { week: 2, focus: { en: "Build careful habits", hi: "ध्यान से काम की आदत" }, activities: { en: ["Copy a sample list and check each entry twice.", "Practice saving work when offline if your device allows it."], hi: ["एक नमूना सूची लिखें और हर जानकारी दो बार जांचें।", "उपकरण में सुविधा हो तो बिना इंटरनेट काम सहेजने का अभ्यास करें।"] } },
      { week: 3, focus: { en: "Find a learning option", hi: "सीखने का विकल्प खोजें" }, activities: { en: ["Compare a local basic-computer course with Skill India Digital Hub.", "Ask about course cost, device access, and completion proof."], hi: ["स्थानीय बेसिक कंप्यूटर कोर्स की Skill India Digital Hub से तुलना करें।", "कोर्स खर्च, उपकरण और प्रमाणपत्र के बारे में पूछें।"] } },
      { week: 4, focus: { en: "Check real work safely", hi: "काम की सुरक्षित जांच" }, activities: { en: ["Browse official NCS listings with a trusted adult.", "Avoid any listing that asks for an application fee or sensitive details too early."], hi: ["भरोसेमंद बड़े के साथ आधिकारिक NCS नौकरी सूची देखें।", "आवेदन शुल्क या शुरुआत में संवेदनशील जानकारी मांगने वाली सूची से बचें।"] } },
    ],
    isDemoData: true,
  },
];

export const isDemoData = true;