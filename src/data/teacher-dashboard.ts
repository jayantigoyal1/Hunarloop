import type { Language } from "@/lib/store";

export type LocalText = Record<Language, string>;
export type TeacherDeskRecord = {
  interests: LocalText[];
  skills: LocalText[];
  pendingSkills: LocalText[];
  goal: LocalText;
  signal: "overwhelm" | "disengagement" | "steady";
  signalReason: LocalText;
  suggestedAction: LocalText;
  support: { seating: LocalText; instructions: LocalText; responses: LocalText };
  activityId: string;
  activity: LocalText;
  opportunityId: string;
};

const txt = (en: string, hi: string): LocalText => ({ en, hi });
const support = (seat: LocalText, instructions: LocalText, responses: LocalText) => ({ seating: seat, instructions, responses });

// Fictional classroom records. Signals describe activity patterns, not a student's ability or health.
export const teacherDesk: Record<string, TeacherDeskRecord> = {
  "asha-demo": {
    interests: [txt("Making things", "चीज़ें बनाना"), txt("Drawing", "चित्र बनाना")], skills: [txt("Drawing", "चित्र बनाना")], pendingSkills: [txt("repairing things", "चीज़ों की मरम्मत")], goal: txt("Explore a practical local course", "पास के व्यावहारिक कोर्स जानना"), signal: "steady", signalReason: txt("Recent activity is growing.", "हाल की गतिविधि बढ़ रही है।"), suggestedAction: txt("Invite her to choose a practical activity.", "उन्हें अपनी पसंद की व्यावहारिक गतिविधि चुनने दें।"), support: support(txt("Offer a seat with a clear view of the demonstration.", "प्रदर्शन साफ़ दिखे ऐसी जगह बैठने का विकल्प दें।"), txt("Offer spoken steps alongside a picture.", "चित्र के साथ बोलकर छोटे चरण बताएं।"), txt("Let the student show, say or write an answer.", "बोलकर, लिखकर या करके उत्तर देने दें।")), activityId: "make-repair-card", activity: txt("Make a simple repair plan", "मरम्मत की छोटी योजना बनाएं"), opportunityId: "jaipur-iti-courses",
  },
  "meera-demo": {
    interests: [txt("Craft", "हस्तकला")], skills: [txt("Pattern drawing", "पैटर्न बनाना")], pendingSkills: [txt("measuring", "माप लेना")], goal: txt("Build a sample folder", "नमूनों का फ़ोल्डर बनाना"), signal: "steady", signalReason: txt("Activity stayed steady across four weeks.", "चार हफ़्तों से गतिविधि स्थिर है।"), suggestedAction: txt("Offer a new sample project if she wants one.", "इच्छा हो तो नया नमूना प्रोजेक्ट दें।"), support: support(txt("Offer a well-lit workspace.", "अच्छी रोशनी वाली जगह दें।"), txt("Show one finished example.", "एक पूरा नमूना दिखाएं।"), txt("Accept a sketch or spoken explanation.", "चित्र या बोलकर उत्तर स्वीकार करें।")), activityId: "pattern-card", activity: txt("Draw a reusable pattern", "दोबारा उपयोग होने वाला पैटर्न बनाएं"), opportunityId: "nsp-school-scholarship",
  },
  "salim-demo": {
    interests: [txt("Farming", "खेती")], skills: [txt("Seed sorting", "बीज छांटना")], pendingSkills: [txt("record keeping", "रिकॉर्ड रखना")], goal: txt("Try an agriculture activity", "खेती से जुड़ी गतिविधि आज़माना"), signal: "overwhelm", signalReason: txt("Starts stayed fairly high while finished tasks fell; this may mean the current task has too many steps.", "शुरू किए काम लगभग समान रहे, पर पूरे किए काम घटे; शायद अभी काम में बहुत चरण हैं।"), suggestedAction: txt("Ask what felt hard, offer one step at a time, and check again next week.", "पूछें कौन सा चरण कठिन लगा, एक बार में एक चरण दें, अगले हफ़्ते फिर देखें।"), support: support(txt("Offer a quieter seat if requested.", "इच्छा हो तो शांत जगह दें।"), txt("Break the task into short steps.", "काम छोटे चरणों में बांटें।"), txt("Let him point to a picture or explain aloud.", "चित्र दिखाकर या बोलकर उत्तर देने दें।")), activityId: "seed-card", activity: txt("Sort and label local seeds", "स्थानीय बीज छांटें और नाम लिखें"), opportunityId: "jaipur-iti-courses",
  },
  "kavita-demo": {
    interests: [txt("Helping people", "लोगों की मदद")], skills: [txt("Storytelling", "कहानी सुनाना")], pendingSkills: [txt("organising notes", "नोट्स व्यवस्थित करना")], goal: txt("Explore community work", "सामुदायिक काम जानना"), signal: "steady", signalReason: txt("Recent activity is growing.", "हाल की गतिविधि बढ़ रही है।"), suggestedAction: txt("Invite her to lead a short group story if she chooses.", "इच्छा हो तो छोटी समूह कहानी सुनाने दें।"), support: support(txt("Offer a place near the group circle.", "समूह के पास बैठने का विकल्प दें।"), txt("Pair words with a picture example.", "शब्दों के साथ चित्र का नमूना दें।"), txt("Accept an audio or written response.", "बोलकर या लिखकर उत्तर लें।")), activityId: "story-card", activity: txt("Create a community story card", "समुदाय की कहानी का कार्ड बनाएं"), opportunityId: "nsp-school-scholarship",
  },
  "imran-demo": {
    interests: [txt("Mobile tools", "मोबाइल औज़ार")], skills: [txt("Phone setup", "फ़ोन सेट करना")], pendingSkills: [txt("explaining a process", "तरीका समझाना")], goal: txt("Explore digital work", "डिजिटल काम जानना"), signal: "disengagement", signalReason: txt("Few activities were started in each of the past four weeks; the reason is unknown.", "पिछले चार हफ़्तों में कम गतिविधियां शुरू हुईं; कारण ज्ञात नहीं है।"), suggestedAction: txt("Check in privately about interests, timing or access; offer a choice without pressure.", "रुचि, समय या पहुंच के बारे में अकेले में पूछें; बिना दबाव विकल्प दें।"), support: support(txt("Offer a seat near a charging point when available.", "संभव हो तो चार्जिंग पॉइंट के पास जगह दें।"), txt("Offer a short hands-on example.", "छोटा करके दिखाने वाला नमूना दें।"), txt("Let him demonstrate or explain aloud.", "करके या बोलकर उत्तर देने दें।")), activityId: "phone-card", activity: txt("Make a phone safety checklist", "फ़ोन सुरक्षा सूची बनाएं"), opportunityId: "ncs-entry-task-search",
  },
  "pinki-demo": {
    interests: [txt("Retail", "दुकानदारी")], skills: [txt("Counting stock", "सामान गिनना")], pendingSkills: [txt("customer greeting", "ग्राहक का स्वागत")], goal: txt("Practise safe retail work", "सुरक्षित दुकानदारी का अभ्यास"), signal: "steady", signalReason: txt("Recent activity is growing.", "हाल की गतिविधि बढ़ रही है।"), suggestedAction: txt("Offer a role-play or stock-count choice.", "बातचीत या सामान गिनने का विकल्प दें।"), support: support(txt("Offer a clear view of the board.", "बोर्ड साफ़ दिखे ऐसी जगह दें।"), txt("Show a short shop example.", "दुकान का छोटा नमूना दिखाएं।"), txt("Accept a role-play or written list.", "बातचीत या लिखी सूची स्वीकार करें।")), activityId: "stock-card", activity: txt("Count and label sample stock", "नमूने के सामान की गिनती करें"), opportunityId: "nsp-school-scholarship",
  },
  "rohan-demo": {
    interests: [txt("Solar energy", "सौर ऊर्जा")], skills: [txt("Simple circuits", "सरल सर्किट")], pendingSkills: [txt("tool safety", "औज़ार की सुरक्षा")], goal: txt("Explore solar training", "सौर प्रशिक्षण जानना"), signal: "overwhelm", signalReason: txt("Starts recovered but fewer multi-step tasks were finished; this may reflect task load or access.", "काम शुरू होना फिर बढ़ा, पर कई चरण वाले कम काम पूरे हुए; काम या पहुंच का असर हो सकता है।"), suggestedAction: txt("Ask which part was difficult and offer a shorter offline practice.", "पूछें कौन सा हिस्सा कठिन था और छोटा ऑफ़लाइन अभ्यास दें।"), support: support(txt("Offer a place with room for tools.", "औज़ारों के लिए जगह दें।"), txt("Demonstrate one safe step at a time.", "सुरक्षित तरीका एक-एक चरण में दिखाएं।"), txt("Let him build or describe the result.", "बनाकर या समझाकर उत्तर देने दें।")), activityId: "solar-card", activity: txt("Build a paper solar layout", "कागज़ पर सौर योजना बनाएं"), opportunityId: "jaipur-iti-courses",
  },
  "sita-demo": {
    interests: [txt("Teaching", "सिखाना")], skills: [txt("Explaining stories", "कहानियां समझाना")], pendingSkills: [txt("planning activities", "गतिविधि की योजना")], goal: txt("Help younger learners", "छोटे छात्रों की मदद"), signal: "disengagement", signalReason: txt("Starts remain low and vary week to week; the reason is unknown.", "शुरू किए काम कम हैं और हफ़्ते-दर-हफ़्ते बदलते हैं; कारण ज्ञात नहीं है।"), suggestedAction: txt("Ask about interests and access, then let her select a small first activity.", "रुचि और पहुंच के बारे में पूछें, फिर छोटा पहला काम चुनने दें।"), support: support(txt("Offer a comfortable place beside a partner.", "साथी के पास सहज जगह दें।"), txt("Give a short example before practice.", "अभ्यास से पहले छोटा नमूना दें।"), txt("Accept a drawing, speech or written answer.", "चित्र, बोलकर या लिखकर उत्तर लें।")), activityId: "teach-card", activity: txt("Plan a five-minute story activity", "पांच मिनट की कहानी गतिविधि बनाएं"), opportunityId: "nsp-school-scholarship",
  },
};
