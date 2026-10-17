"use client";

import { useAppStore, type Language } from "@/lib/store";

const messages = {
  en: {
    "brand.name": "HunarLoop", "header.online": "Online", "header.offline": "Offline", "header.calm": "Calm mode",
    "nav.home": "Home", "nav.passport": "Passport", "nav.careers": "Careers", "nav.opportunities": "Opportunities", "nav.rewards": "Rewards",
    "home.eyebrow": "YOUR SKILLS. YOUR FUTURE.", "home.title": "Every strength has a next step.",
    "home.description": "Explore what you are good at and find a path that feels right for you.", "home.start": "Start my journey",
    "home.passport": "My Hunar Passport", "home.progress": "Your journey", "home.progressValue": "1 of 6 steps",
    "home.tip": "You can go at your own pace. Your choices are always yours.",
    "route.onboarding.title": "Let’s get to know you", "route.onboarding.description": "Share a little about what you enjoy. You can speak or type, and skip anything you do not want to answer.", "route.onboarding.action": "Create my passport",
    "route.passport.title": "Your Hunar Passport", "route.passport.description": "A confidence-labelled snapshot of your skills, interests, and learning-support signals. You can accept or reject suggestions.", "route.passport.action": "Try a talent game",
    "route.games.title": "Try a talent game", "route.games.description": "Short, friendly activities help you notice the things you do well. There are no wrong answers.", "route.games.action": "See my comfort profile",
    "route.comfort.title": "Your learning comfort", "route.comfort.description": "Tell us what helps you feel comfortable while learning. Your preferences guide the suggestions you see.", "route.comfort.action": "Explore career paths",
    "route.careers.title": "Paths that fit you", "route.careers.description": "Explore a few possibilities based on your interests. Every suggestion is confidence-labelled, and you decide what feels right.", "route.careers.action": "Build my weekly plan",
    "route.roadmap.title": "Your weekly plan", "route.roadmap.description": "A small, flexible plan can help you take the next step. Change it whenever you need.", "route.roadmap.action": "Find opportunities",
    "route.opportunities.title": "Verified opportunities", "route.opportunities.description": "Explore demo listings for programs and opportunities. Always check the official source for current details.", "route.opportunities.action": "See my rewards",
    "route.rewards.title": "Your progress rewards", "route.rewards.description": "Every small step counts. Celebrate what you have explored and keep going when you are ready.", "route.rewards.action": "Visit a learning circle",
    "route.circles.title": "Learning circles", "route.circles.description": "Learn alongside people in your community, share ideas, and help one another practice new skills.", "route.circles.action": "Share a parent summary",
    "route.parent.title": "A summary for your family", "route.parent.description": "A simple audio-friendly summary of your journey that you can share with a parent or trusted adult.", "route.parent.action": "Open teacher view",
    "route.teacher.title": "Teacher dashboard", "route.teacher.description": "A demo view for educators to support student goals and see confidence-labelled progress at a glance.", "route.teacher.action": "Back to home",
    "common.demo": "Demo data", "common.next": "Next", "common.back": "Back home", "common.step": "Your next step", "common.support": "You are in control", "common.footer": "Made for learning, at your pace.",
  },
  hi: {
    "brand.name": "हुनरLoop", "header.online": "ऑनलाइन", "header.offline": "ऑफ़लाइन", "header.calm": "शांत मोड",
    "nav.home": "होम", "nav.passport": "पासपोर्ट", "nav.careers": "करियर", "nav.opportunities": "अवसर", "nav.rewards": "इनाम",
    "home.eyebrow": "आपका हुनर। आपका भविष्य।", "home.title": "हर खूबी का अगला कदम है।",
    "home.description": "जानें कि आप किसमें अच्छे हैं और अपने लिए सही रास्ता खोजें।", "home.start": "मेरी यात्रा शुरू करें",
    "home.passport": "मेरा हुनर पासपोर्ट", "home.progress": "आपकी यात्रा", "home.progressValue": "6 में से 1 कदम",
    "home.tip": "आप अपनी गति से आगे बढ़ सकते हैं। आपकी पसंद हमेशा आपकी है।",
    "route.onboarding.title": "आइए, आपको जानें", "route.onboarding.description": "अपनी पसंद की कुछ बातें बताएं। आप बोल सकते हैं या लिख सकते हैं, और किसी भी सवाल को छोड़ सकते हैं।", "route.onboarding.action": "मेरा पासपोर्ट बनाएं",
    "route.passport.title": "आपका हुनर पासपोर्ट", "route.passport.description": "आपके कौशल, रुचियों और सीखने में सहायता के संकेतों की एक आत्मविश्वास-लेबल वाली झलक। आप सुझाव स्वीकार या अस्वीकार कर सकते हैं।", "route.passport.action": "हुनर खेल आज़माएं",
    "route.games.title": "हुनर का खेल खेलें", "route.games.description": "छोटी और सरल गतिविधियां आपको अपनी खूबियां पहचानने में मदद करती हैं। कोई गलत जवाब नहीं है।", "route.games.action": "सीखने की सहजता देखें",
    "route.comfort.title": "सीखने में आपकी सहजता", "route.comfort.description": "बताएं कि सीखते समय आपको किससे सहज महसूस होता है। आपकी पसंद सुझावों में मदद करेगी।", "route.comfort.action": "करियर के रास्ते देखें",
    "route.careers.title": "आपके लिए रास्ते", "route.careers.description": "अपनी रुचियों के आधार पर कुछ विकल्प देखें। हर सुझाव पर आत्मविश्वास का स्तर है, और फैसला आपका है।", "route.careers.action": "साप्ताहिक योजना बनाएं",
    "route.roadmap.title": "आपकी साप्ताहिक योजना", "route.roadmap.description": "एक छोटी और लचीली योजना अगला कदम लेने में मदद कर सकती है। इसे कभी भी बदलें।", "route.roadmap.action": "अवसर खोजें",
    "route.opportunities.title": "सत्यापित अवसर", "route.opportunities.description": "कार्यक्रमों और अवसरों की डेमो सूची देखें। नई जानकारी के लिए आधिकारिक स्रोत जांचें।", "route.opportunities.action": "इनाम देखें",
    "route.rewards.title": "आपकी प्रगति के इनाम", "route.rewards.description": "हर छोटा कदम मायने रखता है। अपनी प्रगति का जश्न मनाएं और तैयार होने पर आगे बढ़ें।", "route.rewards.action": "सीखने के समूह में जाएं",
    "route.circles.title": "सीखने के समूह", "route.circles.description": "अपने समुदाय के साथ सीखें, विचार साझा करें और नए कौशल का अभ्यास करें।", "route.circles.action": "परिवार के लिए सारांश",
    "route.parent.title": "परिवार के लिए सारांश", "route.parent.description": "अपनी यात्रा का सरल ऑडियो-अनुकूल सारांश माता-पिता या भरोसेमंद बड़े के साथ साझा करें।", "route.parent.action": "शिक्षक दृश्य खोलें",
    "route.teacher.title": "शिक्षक डैशबोर्ड", "route.teacher.description": "शिक्षकों के लिए डेमो दृश्य: छात्र के लक्ष्यों और आत्मविश्वास-लेबल वाली प्रगति को एक नज़र में देखें।", "route.teacher.action": "होम पर लौटें",
    "common.demo": "डेमो डेटा", "common.next": "आगे", "common.back": "होम पर लौटें", "common.step": "आपका अगला कदम", "common.support": "फैसला आपका है", "common.footer": "सीखें, अपनी गति से।",
  },
} as const;

export type TranslationKey = keyof typeof messages.en;

export function t(key: string, language: Language = useAppStore.getState().language): string {
  const dictionary = messages[language] as Record<string, string>;
  return dictionary[key] ?? messages.en[key as TranslationKey] ?? key;
}

export function useT() {
  useAppStore((state) => state.language);
  return (key: string) => t(key);
}