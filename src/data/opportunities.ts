export type OpportunityType =
  | "scholarship"
  | "iti"
  | "apprenticeship"
  | "ngo-programme"
  | "mentor"
  | "paid-micro-task"
  | "women-only-scheme"
  | "talent-funding"
  | "training"
  | "career-guidance";

export type Opportunity = {
  id: string;
  type: OpportunityType;
  name: string;
  provider: string;
  eligibility: string[];
  documents: string[];
  deadline: string;
  officialUrl: string;
  lastVerified: string;
  womenOnly: boolean;
  distanceKm: number;
  city: string;
  tags: string[];
  isDemoData: true;
};

const demoDate = "2026-10-18 (demo date; not live-verified)";
const demoDeadline = "Demo listing: check the official portal for current dates";

export const opportunities: Opportunity[] = [
  { id: "nsp-school-scholarship", type: "scholarship", name: "Demo school scholarship search", provider: "National Scholarship Portal", eligibility: ["School students; scheme-specific criteria apply", "Check current class, income, and state rules on the portal"], documents: ["Student identity proof", "School enrolment details", "Bank details if required by the scheme"], deadline: demoDeadline, officialUrl: "https://scholarships.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 0, city: "Online", tags: ["scholarship", "class 10", "national"], isDemoData: true },
  { id: "rajasthan-social-scholarship", type: "scholarship", name: "Demo Rajasthan student scholarship enquiry", provider: "Rajasthan Social Justice and Empowerment Department", eligibility: ["Rajasthan resident; specific scheme eligibility varies", "Confirm category and income rules on the official portal"], documents: ["Residence proof", "School certificate", "Income or category certificate if applicable"], deadline: demoDeadline, officialUrl: "https://sje.rajasthan.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur", tags: ["scholarship", "Rajasthan", "school"], isDemoData: true },
  { id: "jaipur-iti-courses", type: "iti", name: "Demo ITI course enquiry", provider: "Rajasthan Technical Education Department", eligibility: ["Age and class requirements depend on the trade", "Confirm admission notice and seat availability"], documents: ["Class marksheet", "Identity and residence proof", "Recent photo"], deadline: demoDeadline, officialUrl: "https://hte.rajasthan.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur", tags: ["ITI", "technical trade", "training"], isDemoData: true },
  { id: "skill-india-course", type: "training", name: "Demo digital and vocational course search", provider: "Skill India Digital Hub", eligibility: ["Course-specific age and entry requirements apply", "Confirm course delivery mode and costs before joining"], documents: ["Phone number", "Identity details if required by the course"], deadline: demoDeadline, officialUrl: "https://www.skillindiadigital.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 0, city: "Online", tags: ["digital", "vocational", "training"], isDemoData: true },
  { id: "naps-apprenticeship", type: "apprenticeship", name: "Demo apprenticeship vacancy search", provider: "National Apprenticeship Promotion Scheme portal", eligibility: ["Trade, age, and education requirements depend on each vacancy", "Apply only to a verified employer listing"], documents: ["Education certificates", "Identity details", "Bank details if requested through the official process"], deadline: demoDeadline, officialUrl: "https://www.apprenticeshipindia.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur", tags: ["NAPS", "apprenticeship", "technical"], isDemoData: true },
  { id: "pratham-learning-programme", type: "ngo-programme", name: "Demo community learning programme enquiry", provider: "Pratham Education Foundation", eligibility: ["Local programme availability and age range vary", "Ask the organisation for current enrolment details"], documents: ["No documents stated in this demo listing; ask the provider"], deadline: demoDeadline, officialUrl: "https://www.pratham.org/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur district", tags: ["NGO", "learning", "community"], isDemoData: true },
  { id: "ncs-career-mentor", type: "mentor", name: "Demo career guidance appointment search", provider: "National Career Service", eligibility: ["Registration and service availability depend on the official portal", "A parent or trusted adult may help with online steps"], documents: ["Phone number", "Basic education and interest details"], deadline: demoDeadline, officialUrl: "https://www.ncs.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 0, city: "Online", tags: ["mentor", "career guidance", "free service check"], isDemoData: true },
  { id: "ncs-entry-task-search", type: "paid-micro-task", name: "Demo verified short-task job search", provider: "National Career Service", eligibility: ["Age and role requirements depend on each employer", "Never pay a fee to apply; verify the employer and terms"], documents: ["Resume or basic profile", "Identity or bank details only through a verified employer process"], deadline: demoDeadline, officialUrl: "https://www.ncs.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur", tags: ["short task", "paid work", "verify employer"], isDemoData: true },
  { id: "women-skill-support", type: "women-only-scheme", name: "Demo women and girls skill-support enquiry", provider: "Rajasthan Women and Child Development Department", eligibility: ["Intended for women and girls; programme-specific conditions apply", "Confirm whether a current programme is open"], documents: ["Identity proof", "Residence proof", "Education details if requested by the programme"], deadline: demoDeadline, officialUrl: "https://wcd.rajasthan.gov.in/", lastVerified: demoDate, womenOnly: true, distanceKm: 35, city: "Jaipur", tags: ["women", "skills", "Rajasthan"], isDemoData: true },
  { id: "inspire-manik", type: "talent-funding", name: "Demo student idea-award eligibility check", provider: "INSPIRE Awards - MANAK, Department of Science and Technology", eligibility: ["School and class eligibility is set by the current official call", "Check school nomination requirements and dates"], documents: ["School nomination", "Student idea description", "Details requested by the official portal"], deadline: demoDeadline, officialUrl: "https://www.inspireawards-dst.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 0, city: "Online", tags: ["talent funding", "school", "ideas"], isDemoData: true },
  { id: "pm-vishwakarma-training", type: "training", name: "Demo traditional-skills training enquiry", provider: "PM Vishwakarma scheme portal", eligibility: ["Scheme is for eligible traditional artisans and craftspeople", "Check age, trade, registration, and household conditions officially"], documents: ["Identity details", "Trade and household information as required by the scheme"], deadline: demoDeadline, officialUrl: "https://pmvishwakarma.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur district", tags: ["craft", "training", "government scheme"], isDemoData: true },
  { id: "kvk-agriculture-demo", type: "training", name: "Demo farm-skills training enquiry", provider: "Krishi Vigyan Kendra network, ICAR", eligibility: ["Local training dates and participant criteria vary", "Contact the nearest KVK before travelling"], documents: ["Contact details", "Farm or learning interest details if requested"], deadline: demoDeadline, officialUrl: "https://icar.org.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 40, city: "Jaipur district", tags: ["agriculture", "irrigation", "training"], isDemoData: true },
  { id: "rajasthan-iti-guidance", type: "career-guidance", name: "Demo government training and admission notice search", provider: "Rajasthan Higher and Technical Education portals", eligibility: ["Admission rules vary by institute and course", "Use the current official notice for eligibility and dates"], documents: ["Class certificate", "Identity and residence proof", "Application details requested in the notice"], deadline: demoDeadline, officialUrl: "https://hte.rajasthan.gov.in/", lastVerified: demoDate, womenOnly: false, distanceKm: 35, city: "Jaipur", tags: ["career guidance", "ITI", "Rajasthan"], isDemoData: true },
];

export const isDemoData = true;