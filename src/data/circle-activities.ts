import { circles } from "@/data/circles";
export const circleDetails: Record<string, { keywords: string[]; project: { en: string; hi: string }; steps: { en: string[]; hi: string[] }; meeting: { en: string; hi: string }; showcase: { id: string; name: { en: string; hi: string }; text: { en: string; hi: string } } }> = {
  "solar-makers": {
    "keywords": [
      "solar",
      "repair",
      "tools",
      "hands-on",
      "सोलर",
      "मरम्मत",
      "औज़ार"
    ],
    "project": {
      "en": "Paper solar village",
      "hi": "कागज़ का सोलर गांव"
    },
    "steps": {
      "en": [
        "Draw three places that could use daylight.",
        "Add paper panels without wiring or real tools.",
        "Explain the design with the facilitator."
      ],
      "hi": [
        "तीन जगहें बनाएं जहां दिन की रोशनी काम आए।",
        "बिना तार या असली औज़ार के कागज़ी पैनल जोड़ें।",
        "संचालक के साथ डिज़ाइन समझाएं।"
      ]
    },
    "meeting": {
      "en": "Weekly · school or community centre",
      "hi": "हर सप्ताह · स्कूल या सामुदायिक केंद्र"
    },
    "showcase": {
      "id": "solar-makers-showcase",
      "name": {
        "en": "Meera K.",
        "hi": "मीरा क."
      },
      "text": {
        "en": "A paper model with a shaded study corner.",
        "hi": "छांव वाले पढ़ाई के कोने का कागज़ी नमूना।"
      }
    }
  },
  "creative-corners": {
    "keywords": [
      "creative",
      "drawing",
      "story",
      "photo",
      "रचनात्मक",
      "चित्र",
      "कहानी"
    ],
    "project": {
      "en": "Three-picture local story",
      "hi": "तीन चित्रों की स्थानीय कहानी"
    },
    "steps": {
      "en": [
        "Choose an everyday village activity.",
        "Draw three moments without personal details.",
        "Share the story in the supervised group."
      ],
      "hi": [
        "गांव की रोज़ की गतिविधि चुनें।",
        "बिना निजी जानकारी के तीन पल बनाएं।",
        "निगरानी वाले समूह में कहानी सुनाएं।"
      ]
    },
    "meeting": {
      "en": "Weekly · drawing and phone-friendly practice",
      "hi": "हर सप्ताह · चित्र और फोन पर अभ्यास"
    },
    "showcase": {
      "id": "creative-corners-showcase",
      "name": {
        "en": "Salim A.",
        "hi": "सलीम अ."
      },
      "text": {
        "en": "Three sketches of a rainy market day.",
        "hi": "बारिश वाले बाज़ार के दिन के तीन चित्र।"
      }
    }
  },
  "kheti-club": {
    "keywords": [
      "farm",
      "crop",
      "water",
      "agriculture",
      "खेती",
      "फसल",
      "पानी"
    ],
    "project": {
      "en": "Water-wise garden sketch",
      "hi": "पानी बचाने वाला बगीचा"
    },
    "steps": {
      "en": [
        "Draw a small garden on paper.",
        "Mark paths for watering with a pencil.",
        "Ask the facilitator to review the plan."
      ],
      "hi": [
        "कागज़ पर छोटा बगीचा बनाएं।",
        "पेंसिल से पानी पहुंचने के रास्ते दिखाएं।",
        "संचालक से योजना की राय लें।"
      ]
    },
    "meeting": {
      "en": "Every two weeks · guided community activity",
      "hi": "हर दो सप्ताह · निगरानी वाली सामुदायिक गतिविधि"
    },
    "showcase": {
      "id": "kheti-club-showcase",
      "name": {
        "en": "Kavita S.",
        "hi": "कविता स."
      },
      "text": {
        "en": "A garden sketch with a simple watering plan.",
        "hi": "पानी देने की सरल योजना वाला बगीचे का चित्र।"
      }
    }
  },
  "digital-saathi": {
    "keywords": [
      "computer",
      "phone",
      "digital",
      "typing",
      "कंप्यूटर",
      "फोन",
      "डिजिटल",
      "टाइप"
    ],
    "project": {
      "en": "A pretend shop inventory",
      "hi": "काल्पनिक दुकान का स्टॉक"
    },
    "steps": {
      "en": [
        "Make a list of five imaginary products.",
        "Check quantities on paper or a shared device.",
        "Compare totals with a facilitator."
      ],
      "hi": [
        "पांच काल्पनिक सामान की सूची बनाएं।",
        "कागज़ या साझा उपकरण पर मात्रा जांचें।",
        "संचालक के साथ जोड़ मिलाएं।"
      ]
    },
    "meeting": {
      "en": "Weekly · school lab or offline worksheets",
      "hi": "हर सप्ताह · स्कूल लैब या ऑफलाइन अभ्यास पत्र"
    },
    "showcase": {
      "id": "digital-saathi-showcase",
      "name": {
        "en": "Rohan P.",
        "hi": "रोहन प."
      },
      "text": {
        "en": "A checked stock list using only fictional products.",
        "hi": "केवल काल्पनिक सामान की जांची हुई स्टॉक सूची।"
      }
    }
  }
};
export function matchedCircles(interests: string[]) {
  return circles.map((circle) => {
    const matches = interests.filter((interest) => circleDetails[circle.id].keywords.some((key) => interest.toLowerCase().includes(key)));
    return { circle, matches };
  }).sort((a, b) => b.matches.length - a.matches.length);
}
