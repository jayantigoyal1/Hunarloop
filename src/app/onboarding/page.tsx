"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, Mic, MicOff } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { t } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";

type Answer = string | string[];
type AnswerKey = "name" | "village" | "district" | "interests" | "enjoys" | "goals" | "budget" | "transport" | "device" | "connectivity";
type OnboardingAnswers = Record<AnswerKey, Answer>;
type QuestionOption = { value: string; en: string; hi: string };
type Question = { key: AnswerKey; promptKey: string; multiple?: boolean; options?: QuestionOption[] };

type SpeechAlternativeLike = { transcript: string };
type SpeechResultLike = { readonly isFinal: boolean; readonly 0: SpeechAlternativeLike };
type SpeechEventLike = { readonly resultIndex: number; readonly results: ArrayLike<SpeechResultLike> };
type SpeechErrorLike = { readonly error: string };
type SpeechRecognitionLike = {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onresult: ((event: SpeechEventLike) => void) | null;
	onerror: ((event: SpeechErrorLike) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechWindow = Window & {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const questions: Question[] = [
	{ key: "name", promptKey: "onboarding.q.name" },
	{ key: "village", promptKey: "onboarding.q.village" },
	{ key: "district", promptKey: "onboarding.q.district" },
	{ key: "interests", promptKey: "onboarding.q.interests", multiple: true, options: [
		{ value: "making things", en: "Making things", hi: "चीज़ें बनाना" }, { value: "helping people", en: "Helping people", hi: "लोगों की मदद" },
		{ value: "nature and animals", en: "Nature and animals", hi: "प्रकृति और जानवर" }, { value: "numbers", en: "Numbers", hi: "गिनती और हिसाब" },
		{ value: "art and stories", en: "Art and stories", hi: "कला और कहानियां" }, { value: "technology", en: "Technology", hi: "तकनीक" },
	] },
	{ key: "enjoys", promptKey: "onboarding.q.enjoys", multiple: true, options: [
		{ value: "repairing things", en: "Repairing things", hi: "चीज़ों की मरम्मत" }, { value: "drawing or making art", en: "Drawing or art", hi: "चित्रकारी या कला" },
		{ value: "caring for animals", en: "Caring for animals", hi: "जानवरों की देखभाल" }, { value: "helping at home", en: "Helping at home", hi: "घर के काम में मदद" },
		{ value: "organising things", en: "Organising things", hi: "चीज़ें व्यवस्थित करना" },
	] },
	{ key: "goals", promptKey: "onboarding.q.goals", multiple: true, options: [
		{ value: "finish school", en: "Finish school", hi: "स्कूल पूरा करना" }, { value: "learn a trade", en: "Learn a trade", hi: "कोई हुनर सीखना" },
		{ value: "explore career choices", en: "Explore career choices", hi: "करियर के विकल्प जानना" }, { value: "earn when ready", en: "Earn when I am ready", hi: "तैयार होने पर कमाना" },
	] },
	{ key: "budget", promptKey: "onboarding.q.budget", options: [
		{ value: "low", en: "Free or very low cost", hi: "मुफ़्त या बहुत कम खर्च" }, { value: "medium", en: "Some cost is possible", hi: "थोड़ा खर्च कर सकते हैं" },
		{ value: "high", en: "I can compare paid options", hi: "सशुल्क विकल्प देख सकते हैं" },
	] },
	{ key: "transport", promptKey: "onboarding.q.transport", options: [
		{ value: "bus", en: "Bus", hi: "बस" }, { value: "bicycle", en: "Bicycle", hi: "साइकिल" },
		{ value: "walking", en: "Walking", hi: "पैदल" }, { value: "shared transport", en: "Shared transport", hi: "साझा सवारी" },
	] },
	{ key: "device", promptKey: "onboarding.q.device", options: [
		{ value: "low-end Android phone", en: "Android phone", hi: "एंड्रॉइड फोन" }, { value: "shared smartphone", en: "Shared phone", hi: "साझा फोन" },
		{ value: "feature phone", en: "Basic phone", hi: "साधारण फोन" }, { value: "no regular device access", en: "No regular device", hi: "नियमित उपकरण नहीं" },
	] },
	{ key: "connectivity", promptKey: "onboarding.q.connectivity", options: [
		{ value: "patchy mobile data", en: "Patchy", hi: "कभी-कभी" }, { value: "usually available", en: "Usually available", hi: "अक्सर उपलब्ध" },
		{ value: "rarely available", en: "Rarely available", hi: "बहुत कम उपलब्ध" },
	] },
];

const emptyAnswers: OnboardingAnswers = {
	name: "", village: "", district: "", interests: [], enjoys: [], goals: [], budget: "", transport: "", device: "", connectivity: "",
};

function emptyAnswer(question: Question): Answer {
	return question.multiple ? [] : "";
}

export default function OnboardingPage() {
	const router = useRouter();
	const language = useAppStore((state) => state.language);
	const consent = useAppStore((state) => state.onboardingConsent);
	const setConsent = useAppStore((state) => state.setOnboardingConsent);
	const [stage, setStage] = useState<"consent" | "questions" | "building">("consent");
	const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [currentAnswer, setCurrentAnswer] = useState<Answer>("");
	const [speechSupported, setSpeechSupported] = useState(false);
	const [speechChecked, setSpeechChecked] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [voiceError, setVoiceError] = useState(false);
	const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
	const question = questions[questionIndex];

	useEffect(() => {
		const speechWindow = window as SpeechWindow;
		setSpeechSupported(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));
		setSpeechChecked(true);
	}, []);

	useEffect(() => {
		if (stage !== "questions" || typeof window === "undefined" || !("speechSynthesis" in window)) return;
		if (typeof SpeechSynthesisUtterance === "undefined") return;
		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(t(question.promptKey, language));
		utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
		window.speechSynthesis.speak(utterance);
		return () => window.speechSynthesis.cancel();
	}, [language, question.promptKey, questionIndex, stage]);

	useEffect(() => {
		if (stage !== "building") return;
		const timeout = window.setTimeout(() => {
			useAppStore.getState().updateProfile({
				name: String(answers.name).trim(),
				village: String(answers.village).trim(),
				district: String(answers.district).trim(),
				preferredLanguage: language === "hi" ? "Hindi" : "English",
				interests: Array.isArray(answers.interests) ? answers.interests : [],
				enjoys: Array.isArray(answers.enjoys) ? answers.enjoys : [],
				goals: Array.isArray(answers.goals) ? answers.goals : [],
				constraints: {
					  location: [String(answers.village).trim(), String(answers.district).trim()].filter(Boolean).join(", "),
					budget: String(answers.budget),
					transport: String(answers.transport),
					device: String(answers.device),
					connectivity: String(answers.connectivity),
				},
			});
			useAppStore.getState().setOnboardingDone(true);
			router.replace("/passport");
		}, 2000);
		return () => window.clearTimeout(timeout);
	}, [answers, language, router, stage]);

	const updateAnswer = (value: Answer) => {
		setCurrentAnswer(value);
		setVoiceError(false);
	};

	const toggleOption = (value: string) => {
		if (!question.multiple) {
			updateAnswer(value);
			return;
		}
		const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
		updateAnswer(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
	};

	const startListening = () => {
		const speechWindow = window as SpeechWindow;
		const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
		if (!Recognition) return;
		window.speechSynthesis?.cancel();
		const recognition = new Recognition();
		recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.onresult = (event) => {
			const transcript = Array.from({ length: event.results.length - event.resultIndex }, (_, index) =>
				event.results[event.resultIndex + index].isFinal ? event.results[event.resultIndex + index][0].transcript : "",
			).join(" ").trim();
			if (!transcript) return;
			const normalizedTranscript = transcript.toLocaleLowerCase(language === "hi" ? "hi-IN" : "en-IN");
			const matchedOption = question.options?.find((option) => {
				const label = language === "hi" ? option.hi : option.en;
				return normalizedTranscript.includes(label.toLocaleLowerCase(language === "hi" ? "hi-IN" : "en-IN"))
					|| normalizedTranscript.includes(option.value.toLocaleLowerCase());
			});
			updateAnswer(question.multiple ? [matchedOption?.value ?? transcript] : matchedOption?.value ?? transcript);
		};
		recognition.onerror = () => { setIsListening(false); setVoiceError(true); };
		recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
		recognitionRef.current = recognition;
		setVoiceError(false);
		setIsListening(true);
		try {
			recognition.start();
		} catch {
			setIsListening(false);
			setVoiceError(true);
		}
	};

	const stopListening = () => recognitionRef.current?.stop();

	const goBack = () => {
		recognitionRef.current?.stop();
		if (questionIndex === 0) {
			setStage("consent");
			return;
		}
		const previousIndex = questionIndex - 1;
		setQuestionIndex(previousIndex);
		setCurrentAnswer(answers[questions[previousIndex].key] ?? emptyAnswer(questions[previousIndex]));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const value = Array.isArray(currentAnswer)
			? currentAnswer
			: question.multiple
				? currentAnswer.split(",").map((item) => item.trim()).filter(Boolean)
				: currentAnswer.trim();
		if (Array.isArray(value) ? value.length === 0 : !value) return;
		const updatedAnswers = { ...answers, [question.key]: value };
		setAnswers(updatedAnswers);
		recognitionRef.current?.stop();
		if (questionIndex === questions.length - 1) {
			setStage("building");
			return;
		}
		const nextIndex = questionIndex + 1;
		setQuestionIndex(nextIndex);
		setCurrentAnswer(updatedAnswers[questions[nextIndex].key] ?? emptyAnswer(questions[nextIndex]));
	};

	const currentText = Array.isArray(currentAnswer) ? currentAnswer.join(", ") : currentAnswer;
	const canContinue = Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer.trim().length > 0;
	const tForLanguage = (key: string) => t(key, language);

	if (stage === "building") {
		return <div className="mx-auto flex min-h-[55vh] max-w-sm flex-col items-center justify-center gap-4 text-center" aria-live="polite">
			<LoaderCircle className="animate-spin text-teal-700" size={40} aria-hidden="true" />
			<h1 className="text-xl font-black text-ink">{tForLanguage("onboarding.building")}</h1>
			<p className="text-sm text-ink/70">{tForLanguage("onboarding.buildingNote")}</p>
		</div>;
	}

	if (stage === "consent") {
		return <div className="mx-auto max-w-sm space-y-3 pb-3">
			<button type="button" onClick={() => router.push("/")} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-teal-700"><ArrowLeft size={18} aria-hidden="true" />{tForLanguage("common.back")}</button>
			<div className="space-y-1"><Badge>{tForLanguage("common.demo")}</Badge><h1 className="text-2xl font-black text-ink">{tForLanguage("onboarding.consentTitle")}</h1><p className="text-sm leading-5 text-ink/75">{tForLanguage("onboarding.consentIntro")}</p></div>
			<Card className="space-y-3 p-4">
				<label className="flex min-h-12 cursor-pointer items-start gap-3 text-sm font-semibold leading-5 text-ink"><input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700" checked={consent.profile} onChange={(event) => setConsent({ profile: event.target.checked })} /><span>{tForLanguage("onboarding.profileConsent")}</span></label>
				<label className="flex min-h-12 cursor-pointer items-start gap-3 border-t border-teal-100 pt-3 text-sm font-semibold leading-5 text-ink"><input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-teal-700" checked={consent.games} onChange={(event) => setConsent({ games: event.target.checked })} /><span>{tForLanguage("onboarding.gameConsent")}</span></label>
			</Card>
			<Card className="space-y-3 border-clay/30 bg-clay/5 p-4">
				<p className="text-sm leading-5 text-ink/85">{tForLanguage("onboarding.guardianNotice")}</p>
				<label className="flex min-h-11 cursor-pointer items-center gap-3 border-t border-clay/15 pt-2 text-sm font-bold text-ink"><input type="checkbox" className="h-5 w-5 shrink-0 accent-teal-700" checked={consent.guardianNoticeRead} onChange={(event) => setConsent({ guardianNoticeRead: event.target.checked })} /><span>{tForLanguage("onboarding.guardianRead")}</span></label>
			</Card>
			<button type="button" disabled={!consent.profile || !consent.guardianNoticeRead} onClick={() => { setCurrentAnswer(emptyAnswer(questions[0])); setStage("questions"); }} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45">{tForLanguage("onboarding.continue")}<ArrowRight size={17} aria-hidden="true" /></button>
		</div>;
	}

	return <div className="mx-auto max-w-sm space-y-3 pb-3">
		<div className="flex items-center justify-between gap-2">
			<button type="button" onClick={goBack} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-teal-700"><ArrowLeft size={18} aria-hidden="true" />{tForLanguage("onboarding.back")}</button>
			<span className="text-xs font-bold text-ink/65">{tForLanguage("onboarding.step")} {questionIndex + 1} / {questions.length}</span>
		</div>
		<div className="h-1.5 overflow-hidden rounded-full bg-teal-100" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1} aria-label={tForLanguage("onboarding.step")}>
			<div className="h-full rounded-full bg-teal-600 transition-[width]" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
		</div>
		<form onSubmit={handleSubmit} className="space-y-3">
			<Card className="space-y-3 p-4">
				<h1 className="text-xl font-black leading-tight text-ink">{tForLanguage(question.promptKey)}</h1>
				{question.multiple ? <p className="text-xs leading-4 text-ink/65">{tForLanguage("onboarding.multipleHint")}</p> : null}
				{speechChecked && !speechSupported ? <p className="rounded-lg bg-sun/25 px-3 py-2 text-xs leading-4 text-ink/80" role="note">{tForLanguage("onboarding.voiceUnsupported")}</p> : null}
				{question.options ? <div className="flex flex-wrap gap-2">
					{question.options.map((option) => {
						const selected = Array.isArray(currentAnswer) ? currentAnswer.includes(option.value) : currentAnswer === option.value;
						return <button key={option.value} type="button" aria-pressed={selected} onClick={() => toggleOption(option.value)} className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold ${selected ? "border-teal-700 bg-teal-100 text-teal-700" : "border-teal-100 bg-white text-ink hover:bg-teal-50"}`}>{language === "hi" ? option.hi : option.en}</button>;
					})}
				</div> : null}
				<label className="block">
					<span className="sr-only">{tForLanguage(question.promptKey)}</span>
					<input value={currentText} onChange={(event) => updateAnswer(question.multiple ? event.target.value.split(",").map((item) => item.trim()).filter(Boolean) : event.target.value)} placeholder={tForLanguage("onboarding.inputPlaceholder")} className="min-h-12 w-full rounded-lg border border-teal-200 bg-paper px-3 py-3 text-base text-ink placeholder:text-ink/45" autoComplete="off" />
				</label>
				{speechSupported ? <div className="flex items-center gap-3">
					<button type="button" onClick={isListening ? stopListening : startListening} className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-white ${isListening ? "bg-clay" : "bg-teal-700 hover:bg-teal-600"}`} aria-label={tForLanguage(isListening ? "onboarding.micStop" : "onboarding.micStart")}>
						{isListening ? <MicOff size={23} aria-hidden="true" /> : <Mic size={23} aria-hidden="true" />}
					</button>
					<div className="min-h-10 flex-1" aria-live="polite">
						{isListening ? <div className="flex items-center gap-2 text-sm font-bold text-teal-700"><span className="listening-wave" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</span>{tForLanguage("onboarding.listening")}</div> : null}
						{voiceError ? <p className="text-xs leading-4 text-clay" role="alert">{tForLanguage("onboarding.voiceError")}</p> : null}
					</div>
				</div> : null}
			</Card>
			<button type="submit" disabled={!canContinue} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45">
				{questionIndex === questions.length - 1 ? tForLanguage("onboarding.finish") : tForLanguage("onboarding.next")}<ArrowRight size={17} aria-hidden="true" />
			</button>
		</form>
	</div>;
}