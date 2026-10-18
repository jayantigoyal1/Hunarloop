import { careers } from "@/data/careers";

export function buildParentSummary(chosenCareerId: string | null, language: "en" | "hi") {
  const career = careers.find((item) => item.id === chosenCareerId);
  const hi = language === "hi";
  const tuition = career?.difficulty === "advanced" ? 2500 : career?.difficulty === "moderate" ? 1500 : 600;
  const money = (amount: number) => "₹" + amount.toLocaleString("en-IN");
  return [
    { key: "career", text: career ? (hi ? "चुना गया रास्ता: " : "Chosen path: ") + career.title[language] + (hi ? "। यह जानने का विकल्प है, पक्की नौकरी नहीं।" : ". This is a path to explore, not a confirmed job.") : (hi ? "अभी करियर नहीं चुना गया है। मिलकर रुचियों के रास्ते जानें।" : "No career is chosen yet. Explore interests together before deciding.") },
    { key: "cost", text: career ? (hi ? "पहले महीने का डेमो बजट: कोर्स " + money(tuition) + ", यात्रा ₹400, सामग्री ₹200; कुल " + money(tuition + 600) + "। स्रोत: योजना का बनाया गया अनुमान, प्रदाता का शुल्क नहीं।" : "Illustrative first-month budget: course " + money(tuition) + ", travel ₹400, materials ₹200; total " + money(tuition + 600) + ". Source: invented planning estimate, not a provider quote.") : (hi ? "करियर चुनने के बाद कोर्स, यात्रा और सामग्री का खर्च मिलकर जांचें। अभी कोई शुल्क अनुमान तय नहीं है।" : "After choosing a career, check course, travel and material costs together. No fee estimate is set yet.") },
    { key: "scholarship", text: hi ? "राष्ट्रीय छात्रवृत्ति पोर्टल पर स्कूल छात्रवृत्ति की जानकारी लें। यह डेमो सुझाव है; पात्रता, रकम और तारीखें जांचनी हैं। छात्रवृत्ति मंज़ूर नहीं हुई है।" : "Enquire about school scholarships through the National Scholarship Portal. This is a demo suggestion; eligibility, amounts and dates need checking. No scholarship has been approved." },
    { key: "income", text: career ? (hi ? "मासिक आय का डेमो उदाहरण " + money(career.incomeRange.min) + " से " + money(career.incomeRange.max) + " है। स्रोत: बनाया गया डेमो अनुमान। असली वेतन नियोक्ता या आधिकारिक सूचना से जांचें; आय की गारंटी नहीं है।" : "Illustrative monthly income is " + money(career.incomeRange.min) + " to " + money(career.incomeRange.max) + ". Source: " + career.incomeRange.source + " Income is not guaranteed.") : (hi ? "करियर चुने बिना आय की सीमा बताना सही नहीं होगा। आगे का अनुमान भी केवल डेमो होगा।" : "Choose a career before viewing its income range. Any later estimate remains illustrative.") },
    { key: "choice", text: hi ? "छात्र को छोटा अगला कदम और सीखने का तरीका चुनने दें। सहायता लेना वैकल्पिक है। यह सारांश इसी डिवाइस पर है; कुछ भेजा नहीं गया।" : "Let the student choose a small next step and learning format. Support is optional. This summary stays on this device; nothing has been sent." },
  ];
}

export const familySources = {
  scholarship: "https://scholarships.gov.in/",
  career: "https://www.ncs.gov.in/",
  health: "https://www.nhm.gov.in/images/pdf/programmes/RBSK/Operational_Guidelines/Operational-Guidelines-DEIC-RBSK.pdf",
};
