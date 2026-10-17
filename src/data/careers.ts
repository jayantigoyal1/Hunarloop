export type CareerCategory =
  | "Technical Trades"
  | "Agriculture & Allied"
  | "Healthcare"
  | "Creative"
  | "Digital"
  | "Education"
  | "Business/Retail"
  | "Government";

export type LocalizedText = { en: string; hi: string };

export type Career = {
  id: string;
  title: LocalizedText;
  category: CareerCategory;
  whyRecommended: LocalizedText;
  skillsMatched: string[];
  incomeRange: { min: number; max: number; source: string };
  timeToFirstIncome: string;
  nearbyTraining: LocalizedText;
  difficulty: "beginner" | "moderate" | "advanced";
  isDemoData: true;
};

const incomeSource = "Illustrative demo estimate only; confirm current pay with local employers and official job listings.";

export const careers: Career[] = [
  {
    id: "solar-technician",
    title: { en: "Solar Installation Technician", hi: "सोलर इंस्टॉलेशन तकनीशियन" },
    category: "Technical Trades",
    whyRecommended: { en: "A practical, hands-on path for learners who enjoy tools, outdoor work, and solving everyday problems.", hi: "उन विद्यार्थियों के लिए एक व्यावहारिक रास्ता जिन्हें औज़ार, बाहर काम करना और रोज़मर्रा की समस्याएं सुलझाना पसंद है।" },
    skillsMatched: ["tool use", "observation", "problem solving"],
    incomeRange: { min: 9000, max: 22000, source: incomeSource },
    timeToFirstIncome: "3-9 months after entry-level training; demo estimate",
    nearbyTraining: { en: "Check the nearest ITI and Skill India Digital Hub for current solar or electrical courses.", hi: "सोलर या इलेक्ट्रिकल कोर्स के लिए नज़दीकी ITI और Skill India Digital Hub पर जानकारी लें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "electrician-helper",
    title: { en: "Electrician Trainee", hi: "इलेक्ट्रीशियन प्रशिक्षु" },
    category: "Technical Trades",
    whyRecommended: { en: "Builds on careful observation and practical interests, with supervised practice before independent work.", hi: "ध्यान से देखने और हाथों से काम करने की रुचि को आगे बढ़ाता है; स्वतंत्र काम से पहले निगरानी में अभ्यास होता है।" },
    skillsMatched: ["careful work", "following steps", "repair interest"],
    incomeRange: { min: 8000, max: 18000, source: incomeSource },
    timeToFirstIncome: "2-6 months in a supervised trainee role; demo estimate",
    nearbyTraining: { en: "Rajasthan ITI courses and registered local electrical contractors; verify safety training first.", hi: "राजस्थान ITI कोर्स और पंजीकृत स्थानीय ठेकेदार; पहले सुरक्षा प्रशिक्षण की पुष्टि करें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "dairy-assistant",
    title: { en: "Dairy Farm Assistant", hi: "डेयरी फार्म सहायक" },
    category: "Agriculture & Allied",
    whyRecommended: { en: "Connects local livestock knowledge with routine record keeping, animal care, and cooperative work.", hi: "स्थानीय पशुपालन की जानकारी को नियमित रिकॉर्ड, पशु देखभाल और सहकारी काम से जोड़ता है।" },
    skillsMatched: ["routine", "animal care", "record keeping"],
    incomeRange: { min: 7000, max: 16000, source: incomeSource },
    timeToFirstIncome: "1-3 months with a local dairy or cooperative; demo estimate",
    nearbyTraining: { en: "Ask the district animal husbandry office or dairy cooperative about current short courses.", hi: "मौजूदा छोटे प्रशिक्षण के लिए ज़िला पशुपालन कार्यालय या डेयरी सहकारी समिति से पूछें।" },
    difficulty: "beginner",
    isDemoData: true,
  },
  {
    id: "irrigation-assistant",
    title: { en: "Drip Irrigation Field Assistant", hi: "ड्रिप सिंचाई फील्ड सहायक" },
    category: "Agriculture & Allied",
    whyRecommended: { en: "A local, practical role for learners curious about water use, crops, and helping farmers use equipment.", hi: "पानी, फसलों और किसानों को उपकरण इस्तेमाल करने में मदद करने में रुचि रखने वालों के लिए स्थानीय व्यावहारिक काम।" },
    skillsMatched: ["outdoor work", "measurement", "communication"],
    incomeRange: { min: 8000, max: 18000, source: incomeSource },
    timeToFirstIncome: "2-5 months after seasonal or employer training; demo estimate",
    nearbyTraining: { en: "Contact the local Krishi Vigyan Kendra for agriculture and irrigation demonstrations.", hi: "खेती और सिंचाई प्रदर्शन के लिए स्थानीय कृषि विज्ञान केंद्र से संपर्क करें।" },
    difficulty: "beginner",
    isDemoData: true,
  },
  {
    id: "health-programme-assistant",
    title: { en: "Community Health Programme Assistant", hi: "सामुदायिक स्वास्थ्य कार्यक्रम सहायक" },
    category: "Healthcare",
    whyRecommended: { en: "A supervised, non-clinical path focused on organising community information and helping people find public services.", hi: "समुदाय की जानकारी व्यवस्थित करने और लोगों को सार्वजनिक सेवाएं खोजने में मदद करने का निगरानी वाला, गैर-चिकित्सीय रास्ता।" },
    skillsMatched: ["listening", "organisation", "community communication"],
    incomeRange: { min: 7000, max: 15000, source: incomeSource },
    timeToFirstIncome: "Varies by programme opening and required training; demo estimate",
    nearbyTraining: { en: "Check Rajasthan health department and district programme notices for eligible non-clinical roles.", hi: "पात्र गैर-चिकित्सीय भूमिकाओं के लिए राजस्थान स्वास्थ्य विभाग और ज़िला कार्यक्रम सूचनाएं देखें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "tailoring-maker",
    title: { en: "Tailoring and Repair Maker", hi: "सिलाई और मरम्मत कारीगर" },
    category: "Creative",
    whyRecommended: { en: "Combines creativity and careful handwork, and can begin with small local repair projects.", hi: "रचनात्मकता और ध्यान से हाथ का काम जोड़ता है; छोटे स्थानीय मरम्मत कार्यों से शुरुआत हो सकती है।" },
    skillsMatched: ["creativity", "fine handwork", "customer listening"],
    incomeRange: { min: 5000, max: 20000, source: incomeSource },
    timeToFirstIncome: "2-6 months with practice and local customers; demo estimate",
    nearbyTraining: { en: "Check local ITI or community skill centres for tailoring and garment courses.", hi: "सिलाई और परिधान कोर्स के लिए स्थानीय ITI या सामुदायिक कौशल केंद्र देखें।" },
    difficulty: "beginner",
    isDemoData: true,
  },
  {
    id: "digital-content-helper",
    title: { en: "Local Digital Content Assistant", hi: "स्थानीय डिजिटल सामग्री सहायक" },
    category: "Creative",
    whyRecommended: { en: "Turns interest in stories, photos, and local events into simple communication tasks using a phone.", hi: "कहानियों, तस्वीरों और स्थानीय कार्यक्रमों की रुचि को फोन से किए जाने वाले सरल संचार काम में बदलता है।" },
    skillsMatched: ["storytelling", "visual ideas", "phone basics"],
    incomeRange: { min: 4000, max: 18000, source: incomeSource },
    timeToFirstIncome: "3-9 months after building samples and finding local clients; demo estimate",
    nearbyTraining: { en: "Start with free Skill India Digital Hub learning and supervised practice for a local group.", hi: "Skill India Digital Hub की मुफ़्त पढ़ाई और किसी स्थानीय समूह के लिए निगरानी में अभ्यास से शुरुआत करें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "data-entry-operator",
    title: { en: "Data Entry Operator", hi: "डेटा एंट्री ऑपरेटर" },
    category: "Digital",
    whyRecommended: { en: "Offers structured computer tasks for learners who like sorting information and checking details.", hi: "जानकारी व्यवस्थित करना और विवरण जांचना पसंद करने वालों के लिए कंप्यूटर पर व्यवस्थित काम।" },
    skillsMatched: ["accuracy", "basic typing", "organisation"],
    incomeRange: { min: 8000, max: 20000, source: incomeSource },
    timeToFirstIncome: "2-6 months after practice and a verified entry-level role; demo estimate",
    nearbyTraining: { en: "Look for basic computer courses through Skill India Digital Hub or an accredited local centre.", hi: "Skill India Digital Hub या मान्यता प्राप्त स्थानीय केंद्र से बेसिक कंप्यूटर कोर्स देखें।" },
    difficulty: "beginner",
    isDemoData: true,
  },
  {
    id: "computer-support-trainee",
    title: { en: "Computer Support Trainee", hi: "कंप्यूटर सहायता प्रशिक्षु" },
    category: "Digital",
    whyRecommended: { en: "A hands-on digital path for learners who enjoy figuring out why devices or apps are not working.", hi: "उपकरण या ऐप काम न करने का कारण समझना पसंद करने वालों के लिए डिजिटल और व्यावहारिक रास्ता।" },
    skillsMatched: ["curiosity", "step-by-step thinking", "helpfulness"],
    incomeRange: { min: 9000, max: 22000, source: incomeSource },
    timeToFirstIncome: "4-9 months with guided practice; demo estimate",
    nearbyTraining: { en: "Check local ITI computer courses and Skill India Digital Hub for current options.", hi: "मौजूदा विकल्पों के लिए स्थानीय ITI कंप्यूटर कोर्स और Skill India Digital Hub देखें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "learning-facilitator",
    title: { en: "Learning Centre Assistant", hi: "लर्निंग सेंटर सहायक" },
    category: "Education",
    whyRecommended: { en: "Supports group learning through preparation, practice activities, and encouragement; it is not a licensed teaching role.", hi: "तैयारी, अभ्यास गतिविधियों और प्रोत्साहन से समूह में सीखने में मदद; यह लाइसेंस प्राप्त शिक्षक की भूमिका नहीं है।" },
    skillsMatched: ["patience", "explaining ideas", "group organisation"],
    incomeRange: { min: 6000, max: 16000, source: incomeSource },
    timeToFirstIncome: "3-8 months depending on local programme openings; demo estimate",
    nearbyTraining: { en: "Ask local education NGOs and community centres about supervised assistant roles.", hi: "निगरानी वाली सहायक भूमिकाओं के लिए स्थानीय शिक्षा NGO और सामुदायिक केंद्र से पूछें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "retail-associate",
    title: { en: "Retail Sales Associate", hi: "रिटेल बिक्री सहयोगी" },
    category: "Business/Retail",
    whyRecommended: { en: "Builds on communication and practical organisation in nearby shops, cooperatives, or service counters.", hi: "नज़दीकी दुकानों, सहकारी समितियों या सेवा काउंटर पर बातचीत और व्यावहारिक व्यवस्था के कौशल को बढ़ाता है।" },
    skillsMatched: ["communication", "basic arithmetic", "reliability"],
    incomeRange: { min: 8000, max: 18000, source: incomeSource },
    timeToFirstIncome: "1-4 months after a suitable local opening; demo estimate",
    nearbyTraining: { en: "Check NCS listings and local employers for verified roles and any required training.", hi: "सत्यापित नौकरी और ज़रूरी प्रशिक्षण के लिए NCS सूची और स्थानीय नियोक्ता देखें।" },
    difficulty: "beginner",
    isDemoData: true,
  },
  {
    id: "small-business-assistant",
    title: { en: "Small Business Bookkeeping Assistant", hi: "छोटे व्यवसाय का लेखा सहायक" },
    category: "Business/Retail",
    whyRecommended: { en: "A structured local role for learners who enjoy keeping lists, counting items, and helping customers.", hi: "सूची बनाना, सामान गिनना और ग्राहकों की मदद करना पसंद करने वालों के लिए स्थानीय व्यवस्थित काम।" },
    skillsMatched: ["record keeping", "basic arithmetic", "careful checking"],
    incomeRange: { min: 7000, max: 18000, source: incomeSource },
    timeToFirstIncome: "2-6 months after basic practice and a local opening; demo estimate",
    nearbyTraining: { en: "Look for basic accounting or digital literacy courses at a nearby ITI or accredited centre.", hi: "नज़दीकी ITI या मान्यता प्राप्त केंद्र पर बेसिक लेखा या डिजिटल साक्षरता कोर्स देखें।" },
    difficulty: "moderate",
    isDemoData: true,
  },
  {
    id: "public-service-assistant",
    title: { en: "Public Service Exam Pathway", hi: "लोक सेवा परीक्षा का रास्ता" },
    category: "Government",
    whyRecommended: { en: "A longer-term option for learners interested in public service; roles require official eligibility and selection, with no job guarantee.", hi: "लोक सेवा में रुचि रखने वालों के लिए लंबी अवधि का विकल्प; पदों में आधिकारिक पात्रता और चयन ज़रूरी है, नौकरी की गारंटी नहीं।" },
    skillsMatched: ["reading", "consistent practice", "civic interest"],
    incomeRange: { min: 18000, max: 45000, source: "Illustrative demo range across varied entry-level public roles; check the relevant official recruitment notice for actual pay." },
    timeToFirstIncome: "Usually multiple years of study and selection; demo pathway, not a prediction",
    nearbyTraining: { en: "Use official Rajasthan recruitment notices and free public library or school study resources.", hi: "राजस्थान की आधिकारिक भर्ती सूचनाएं और सार्वजनिक पुस्तकालय या स्कूल के मुफ़्त अध्ययन साधन देखें।" },
    difficulty: "advanced",
    isDemoData: true,
  },
];

export const isDemoData = true;