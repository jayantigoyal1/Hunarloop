import { opportunities, type Opportunity } from "@/data/opportunities";
import { sampleStudent } from "@/data/student";

export type EligibilityRule = "age14" | "age18" | "class" | "state" | "women" | "provider";
export type OpportunityDetails = {
  nameHi: string; providerHi: string; distanceKm: number; deadlineAt: string | null;
  accommodations: boolean; rights: boolean; tagsHi: string[]; documentsHi: string[]; rules: EligibilityRule[];
};
export type OpportunityListing = Opportunity & OpportunityDetails;
export type OpportunityDownload = { listing: OpportunityListing; updatedAt: string };
export const demoApplicant = { name: sampleStudent.name, age: sampleStudent.age, classNumber: 10, state: sampleStudent.state, gender: null };
// Dates, eligibility rules, distances and support flags are illustrative fixtures, not scheme terms.
const details: Record<string, OpportunityDetails> = {
  "nsp-school-scholarship": {
    "nameHi": "स्कूल छात्रवृत्ति खोज (डेमो)",
    "providerHi": "राष्ट्रीय छात्रवृत्ति पोर्टल",
    "distanceKm": 0,
    "deadlineAt": "2026-10-24T23:59:59+05:30",
    "accommodations": false,
    "rights": true,
    "tagsHi": [
      "छात्रवृत्ति",
      "कक्षा 10",
      "राष्ट्रीय"
    ],
    "documentsHi": [
      "छात्र पहचान प्रमाण",
      "स्कूल में नामांकन की जानकारी",
      "योजना में ज़रूरी हो तो बैंक की जानकारी"
    ],
    "rules": [
      "class",
      "provider"
    ]
  },
  "rajasthan-social-scholarship": {
    "nameHi": "राजस्थान छात्रवृत्ति जानकारी (डेमो)",
    "providerHi": "राजस्थान सामाजिक न्याय एवं अधिकारिता विभाग",
    "distanceKm": 22,
    "deadlineAt": "2026-11-15T23:59:59+05:30",
    "accommodations": false,
    "rights": true,
    "tagsHi": [
      "छात्रवृत्ति",
      "राजस्थान",
      "स्कूल"
    ],
    "documentsHi": [
      "निवास प्रमाण",
      "स्कूल प्रमाणपत्र",
      "लागू होने पर आय या श्रेणी प्रमाणपत्र"
    ],
    "rules": [
      "state",
      "provider"
    ]
  },
  "jaipur-iti-courses": {
    "nameHi": "ITI कोर्स जानकारी (डेमो)",
    "providerHi": "राजस्थान तकनीकी शिक्षा विभाग",
    "distanceKm": 8,
    "deadlineAt": "2026-10-28T23:59:59+05:30",
    "accommodations": true,
    "rights": true,
    "tagsHi": [
      "ITI",
      "तकनीकी हुनर",
      "प्रशिक्षण"
    ],
    "documentsHi": [
      "कक्षा की अंकतालिका",
      "पहचान और निवास प्रमाण",
      "हाल की तस्वीर"
    ],
    "rules": [
      "age14",
      "class",
      "provider"
    ]
  },
  "skill-india-course": {
    "nameHi": "डिजिटल और व्यावसायिक कोर्स खोज (डेमो)",
    "providerHi": "स्किल इंडिया डिजिटल हब",
    "distanceKm": 0,
    "deadlineAt": null,
    "accommodations": true,
    "rights": false,
    "tagsHi": [
      "डिजिटल",
      "व्यावसायिक",
      "प्रशिक्षण"
    ],
    "documentsHi": [
      "फोन नंबर",
      "कोर्स में ज़रूरी हो तो पहचान की जानकारी"
    ],
    "rules": [
      "age14",
      "provider"
    ]
  },
  "naps-apprenticeship": {
    "nameHi": "अप्रेंटिसशिप रिक्तियां खोजें (डेमो)",
    "providerHi": "राष्ट्रीय अप्रेंटिसशिप प्रोत्साहन योजना पोर्टल",
    "distanceKm": 18,
    "deadlineAt": "2026-10-21T23:59:59+05:30",
    "accommodations": true,
    "rights": true,
    "tagsHi": [
      "NAPS",
      "अप्रेंटिसशिप",
      "तकनीकी"
    ],
    "documentsHi": [
      "शिक्षा प्रमाणपत्र",
      "पहचान की जानकारी",
      "आधिकारिक प्रक्रिया में ज़रूरी हो तो बैंक की जानकारी"
    ],
    "rules": [
      "age14",
      "class",
      "provider"
    ]
  },
  "pratham-learning-programme": {
    "nameHi": "सामुदायिक सीखने का कार्यक्रम (डेमो)",
    "providerHi": "प्रथम एजुकेशन फ़ाउंडेशन",
    "distanceKm": 5,
    "deadlineAt": "2026-11-12T23:59:59+05:30",
    "accommodations": true,
    "rights": false,
    "tagsHi": [
      "NGO",
      "सीखना",
      "समुदाय"
    ],
    "documentsHi": [
      "इस डेमो में दस्तावेज़ तय नहीं; प्रदाता से पूछें"
    ],
    "rules": [
      "class",
      "provider"
    ]
  },
  "ncs-career-mentor": {
    "nameHi": "करियर मार्गदर्शन मुलाकात खोज (डेमो)",
    "providerHi": "राष्ट्रीय करियर सेवा",
    "distanceKm": 0,
    "deadlineAt": null,
    "accommodations": true,
    "rights": true,
    "tagsHi": [
      "मार्गदर्शक",
      "करियर मार्गदर्शन",
      "मुफ़्त सेवा की जांच"
    ],
    "documentsHi": [
      "फोन नंबर",
      "शिक्षा और रुचियों की जानकारी"
    ],
    "rules": [
      "provider"
    ]
  },
  "ncs-entry-task-search": {
    "nameHi": "छोटे कामों की नौकरी खोज (डेमो)",
    "providerHi": "राष्ट्रीय करियर सेवा",
    "distanceKm": 6,
    "deadlineAt": "2026-10-20T23:59:59+05:30",
    "accommodations": false,
    "rights": true,
    "tagsHi": [
      "छोटा काम",
      "कमाई",
      "नियोक्ता जांचें"
    ],
    "documentsHi": [
      "बायोडाटा या सामान्य प्रोफ़ाइल",
      "केवल सत्यापित नियोक्ता प्रक्रिया में पहचान या बैंक की जानकारी"
    ],
    "rules": [
      "age18",
      "provider"
    ]
  },
  "women-skill-support": {
    "nameHi": "महिलाओं और लड़कियों का कौशल सहयोग (डेमो)",
    "providerHi": "राजस्थान महिला एवं बाल विकास विभाग",
    "distanceKm": 14,
    "deadlineAt": "2026-10-25T23:59:59+05:30",
    "accommodations": true,
    "rights": true,
    "tagsHi": [
      "महिलाएं",
      "कौशल",
      "राजस्थान"
    ],
    "documentsHi": [
      "पहचान प्रमाण",
      "निवास प्रमाण",
      "कार्यक्रम में ज़रूरी हो तो शिक्षा की जानकारी"
    ],
    "rules": [
      "women",
      "state",
      "provider"
    ]
  },
  "inspire-manik": {
    "nameHi": "छात्र विचार पुरस्कार पात्रता जांच (डेमो)",
    "providerHi": "इंस्पायर अवार्ड्स मानक, विज्ञान एवं प्रौद्योगिकी विभाग",
    "distanceKm": 0,
    "deadlineAt": "2026-11-01T23:59:59+05:30",
    "accommodations": false,
    "rights": false,
    "tagsHi": [
      "प्रतिभा सहयोग",
      "स्कूल",
      "विचार"
    ],
    "documentsHi": [
      "स्कूल का नामांकन",
      "छात्र के विचार का विवरण",
      "आधिकारिक पोर्टल की मांगी गई जानकारी"
    ],
    "rules": [
      "class",
      "provider"
    ]
  },
  "pm-vishwakarma-training": {
    "nameHi": "पारंपरिक कौशल प्रशिक्षण जानकारी (डेमो)",
    "providerHi": "पीएम विश्वकर्मा योजना पोर्टल",
    "distanceKm": 38,
    "deadlineAt": "2026-11-30T23:59:59+05:30",
    "accommodations": false,
    "rights": true,
    "tagsHi": [
      "हस्तकला",
      "प्रशिक्षण",
      "सरकारी योजना"
    ],
    "documentsHi": [
      "पहचान की जानकारी",
      "योजना के अनुसार पेशे और परिवार की जानकारी"
    ],
    "rules": [
      "age18",
      "provider"
    ]
  },
  "kvk-agriculture-demo": {
    "nameHi": "खेती के कौशल का प्रशिक्षण (डेमो)",
    "providerHi": "कृषि विज्ञान केंद्र नेटवर्क, ICAR",
    "distanceKm": 32,
    "deadlineAt": "2026-10-23T23:59:59+05:30",
    "accommodations": true,
    "rights": false,
    "tagsHi": [
      "कृषि",
      "सिंचाई",
      "प्रशिक्षण"
    ],
    "documentsHi": [
      "संपर्क की जानकारी",
      "ज़रूरी हो तो खेती या सीखने की रुचि की जानकारी"
    ],
    "rules": [
      "provider"
    ]
  },
  "rajasthan-iti-guidance": {
    "nameHi": "सरकारी प्रशिक्षण और प्रवेश सूचना खोज (डेमो)",
    "providerHi": "राजस्थान उच्च एवं तकनीकी शिक्षा पोर्टल",
    "distanceKm": 40,
    "deadlineAt": "2026-10-17T23:59:59+05:30",
    "accommodations": true,
    "rights": true,
    "tagsHi": [
      "करियर मार्गदर्शन",
      "ITI",
      "राजस्थान"
    ],
    "documentsHi": [
      "कक्षा प्रमाणपत्र",
      "पहचान और निवास प्रमाण",
      "सूचना में मांगी गई आवेदन जानकारी"
    ],
    "rules": [
      "class",
      "provider"
    ]
  }
};
export const opportunityCatalog: OpportunityListing[] = opportunities.map((item) => ({ ...item, ...details[item.id] }));
