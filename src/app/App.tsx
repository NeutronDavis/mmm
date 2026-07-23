import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  ArrowRight, Check, ChevronDown,
  Eye, PhoneCall, Award,
  Video, Mic, Film, Zap,
  Shield, Star, TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import mmmLogo from "@/imports/mmmassembly_copy.png";

const CALENDLY = "#apply";
const SHEETS_WEBHOOK = "https://script.google.com/macros/s/AKfycbxaSaFeLBtLPepgNkBt1mGWUOcJG7Hh3T0WDWklU-Ay7rKbWgjdZpTJdOWKZrdcJMvueA/exec";

/* ─── ANIMATION VARIANTS ──────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── REUSABLE COMPONENTS ─────────────────────────────────────────────── */

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={delay}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PulseButton({ href, children, large = false, outline = false }: {
  href: string; children: React.ReactNode; large?: boolean; outline?: boolean;
}) {
  return (
    <motion.a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex items-center justify-center gap-2 font-black uppercase tracking-wider overflow-hidden rounded-sm ${large ? "text-sm sm:text-base md:text-xl px-6 py-4 sm:px-10 sm:py-5 md:px-14 md:py-6" : "text-xs sm:text-sm md:text-base px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4"} ${outline ? "border border-primary text-primary" : "bg-primary text-white shadow-lg shadow-primary/30"}`}
      style={{ fontFamily: "'Anton', sans-serif" }}
    >
      {!outline && (
        <motion.span
          className="absolute inset-0 bg-white/10"
          initial={{ x: "-100%", skewX: "-20deg" }}
          whileHover={{ x: "200%", skewX: "-20deg" }}
          transition={{ duration: 0.5 }}
        />
      )}
      {children}
    </motion.a>
  );
}

function useCountUp(target: number, inView: boolean, duration = 1.8) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return count;
}

/* ─── DATA ────────────────────────────────────────────────────────────── */

const faqs = [
  { q: "Who is MMM Agency for?", a: "We work specifically with high-ticket coaches, business, finance, mindset, and relationship coaches who sell programs or services at $2,000 and above. If your offer is premium, your content needs to match." },
  { q: "How long does delivery take?", a: "All packages are delivered within 7 days of receiving your raw footage or brief. We move fast without cutting corners." },
  { q: "What do I need to provide?", a: "Depending on your setup, either raw footage you've recorded yourself or a detailed brief. We'll walk you through exactly what we need on the strategy call." },
  { q: "Do you write the scripts for the ads?", a: "Yes. Our team handles scripting, editing, and production. You review and approve. We handle the rest." },
  { q: "How many revisions do I get?", a: "Multiple revisions are included in every package. We work until the content is right." },
  { q: "Is music and stock footage included?", a: "Yes. All licensing for music and stock footage is covered in your package. You never have to worry about copyright issues." },
  { q: "How are my files delivered?", a: "Through a private Google Drive folder set up specifically for your account. Files are organised professionally and labelled clearly so you always know what's what." },
  { q: "What if I'm not ready for a full retainer?", a: "We offer a one-time starter pack, 3 ads for $500. It's designed for coaches who want to experience our quality before committing monthly. Book a call and we'll get you started." },
  { q: "Do you work with clients outside the US?", a: "Yes. We work with coaches globally. Everything is handled remotely and delivered digitally." },
  { q: "What other services do you offer?", a: "Beyond ads we produce reels, VSLs, podcast trailers, and short clips. Book a call and we'll build a custom package around what you need." },
];

const packages = [
  { name: "Starter", price: "$2,499", period: "/month", volume: "15 high-converting video ads", tag: null, desc: "Best for coaches ready to start running consistent ad content." },
  { name: "Growth", price: "$4,899", period: "/month", volume: "30 high-converting video ads", tag: "Most Popular", desc: "Best for coaches ready to scale their ad volume and dominate their niche." },
  { name: "Authority", price: "$7,499", period: "/month", volume: "50 high-converting video ads", tag: null, desc: "Best for coaches who want to own their market completely." },
];

const retainerBenefits = [
  "Full delivery within 7 days",
  "Private Google Drive for all your files",
  "Music and stock footage licensing covered",
  "Professional file organisation and delivery",
  "Multiple revisions included",
];

const otherServices = [
  { icon: Film, label: "VSLs" },
  { icon: Zap, label: "Reels" },
  { icon: Mic, label: "Podcast Trailers" },
  { icon: Video, label: "Short Clips" },
];

const marqueeItems = ["MMM AGENCY", "·", "ADS THAT PRINT MONEY", "·", "HIGH-TICKET COACHES", "·", "BOOK MORE CALLS", "·", "STOP THE SCROLL", "·", "CONVERT THE VIEWER", "·"];

/* ─── CLIENT INTAKE FORM ─────────────────────────────────────────────── */
function ClientIntakeForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "", email: "", whatsapp: "",
    services: [] as string[], monthlyRevenue: "", budget: "", readyToStart: "",
  });

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setValidationErrors(e => ({ ...e, [k]: "" }));
  };
  const toggleService = (s: string) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter(x => x !== s) : [...f.services, s],
    }));
    setValidationErrors(e => ({ ...e, services: "" }));
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim()) errors.fullName = "Full name is required.";
      if (!form.email.trim()) {
        errors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
      if (!form.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required.";
      if (form.services.length === 0) errors.services = "Please select at least one service.";
    } else {
      if (!form.monthlyRevenue) errors.monthlyRevenue = "Please select your monthly revenue.";
      if (!form.budget) errors.budget = "Please select your budget.";
      if (!form.readyToStart) errors.readyToStart = "Please select an option.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (submitting || submitted) return;

    setSubmitting(true);
    setSubmitError("");

    // Exact keys as required — timestamp is handled server-side by Apps Script
    const payload = {
      fullName:       form.fullName.trim(),
      whatsapp:       form.whatsapp.trim(),
      email:          form.email.trim(),
      services:       form.services.join(", "),
      monthlyRevenue: form.monthlyRevenue,
      budget:         form.budget,
      readyToStart:   form.readyToStart,
    };

    try {
      // Single no-cors request — Apps Script blocks CORS response reads,
      // so a readable fetch always throws and causes a second send. One send only.
      await fetch(SHEETS_WEBHOOK, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
      console.log("[MMM Form] Submission sent:", payload);
      setSubmitted(true);
    } catch (err) {
      console.error("[MMM Form] Submission failed:", err);
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const ic = "w-full bg-background border border-border rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";
  const ba = "border-primary bg-primary/10 text-foreground";
  const bi = "border-border bg-background text-muted-foreground hover:border-primary/50";

  const steps = [
    {
      label: "Your Details",
      fields: (
        <div className="space-y-5">
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">1. Full Name *</label>
            <input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="John Smith"
              className={`${ic} ${validationErrors.fullName ? "border-primary" : ""}`} />
            {validationErrors.fullName && <p className="text-primary text-xs mt-1">{validationErrors.fullName}</p>}
          </div>
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">2. Email Address *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@yourbrand.com"
              className={`${ic} ${validationErrors.email ? "border-primary" : ""}`} />
            {validationErrors.email && <p className="text-primary text-xs mt-1">{validationErrors.email}</p>}
          </div>
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">3. WhatsApp Number (with country code) *</label>
            <input type="tel" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="e.g. +1 234 567 8900"
              className={`${ic} ${validationErrors.whatsapp ? "border-primary" : ""}`} />
            {validationErrors.whatsapp && <p className="text-primary text-xs mt-1">{validationErrors.whatsapp}</p>}
          </div>
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">4. What services are you interested in? *</label>
            <div className="flex flex-col gap-3">
              {["Video Ads", "Short-Form Video Content", "Long-Form Video Content"].map(s => (
                <button key={s} type="button" onClick={() => toggleService(s)}
                  className={`px-4 py-3 rounded-sm border text-sm font-bold text-left transition-all flex items-center gap-3 ${form.services.includes(s) ? ba : bi}`}>
                  <span className={`w-4 h-4 rounded-sm border-2 flex-shrink-0 flex items-center justify-center transition-all ${form.services.includes(s) ? "bg-primary border-primary" : "border-current"}`}>
                    {form.services.includes(s) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </span>
                  {s}
                </button>
              ))}
            </div>
            {validationErrors.services && <p className="text-primary text-xs mt-2">{validationErrors.services}</p>}
          </div>
        </div>
      ),
    },
    {
      label: "Revenue & Budget",
      fields: (
        <div className="space-y-6">
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">5. What is your current monthly revenue? *</label>
            <div className="grid grid-cols-2 gap-3">
              {["Below $10k", "$10k – $50k", "$50k – $100k", "$100k+"].map(v => (
                <button key={v} type="button" onClick={() => set("monthlyRevenue", v)}
                  className={`px-4 py-3 rounded-sm border text-sm font-bold text-left transition-all ${form.monthlyRevenue === v ? ba : bi}`}>
                  {v}
                </button>
              ))}
            </div>
            {validationErrors.monthlyRevenue && <p className="text-primary text-xs mt-2">{validationErrors.monthlyRevenue}</p>}
          </div>
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">6. What is your budget for video marketing services? *</label>
            <div className="grid grid-cols-3 gap-3">
              {["$3k – $5k", "$5k – $10k", "Over $10k"].map(v => (
                <button key={v} type="button" onClick={() => set("budget", v)}
                  className={`px-4 py-3 rounded-sm border text-sm font-bold text-left transition-all ${form.budget === v ? ba : bi}`}>
                  {v}
                </button>
              ))}
            </div>
            {validationErrors.budget && <p className="text-primary text-xs mt-2">{validationErrors.budget}</p>}
          </div>
          <div>
            <label className="block text-foreground text-xs font-bold uppercase tracking-widest mb-2">7. Are you ready to start working with us right away? *</label>
            <div className="flex flex-col gap-3">
              {["Yes, I'm ready to start now!", "Not yet, but I'm interested in learning more."].map(v => (
                <button key={v} type="button" onClick={() => set("readyToStart", v)}
                  className={`px-4 py-3 rounded-sm border text-sm font-bold text-left transition-all flex items-center gap-3 ${form.readyToStart === v ? ba : bi}`}>
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${form.readyToStart === v ? "bg-primary border-primary" : "border-current"}`} />
                  {v}
                </button>
              ))}
            </div>
            {validationErrors.readyToStart && <p className="text-primary text-xs mt-2">{validationErrors.readyToStart}</p>}
          </div>
        </div>
      ),
    },
  ];

  const canAdvance = () => {
    if (step === 0) return !!(form.fullName.trim() && form.email.trim() && form.whatsapp.trim() && form.services.length > 0);
    return !!(form.monthlyRevenue && form.budget && form.readyToStart);
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  if (submitted) {
    return (
      <section className="border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}>
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>APPLICATION RECEIVED</h3>
            <p className="text-muted-foreground mb-2">Your application has been submitted successfully.</p>
            <p className="text-muted-foreground mb-8">You're one step away. Choose a time below to book your free strategy call.</p>
            <PulseButton href="https://calendly.com/anyaegbunamanthony99/content-creation">Book Your Call Now <ArrowRight className="w-4 h-4" /></PulseButton>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="border-t border-border">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <FadeUp className="text-center mb-12">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Apply Now</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
            WORK WITH US
          </h2>
          <p className="text-foreground font-bold text-xl mb-2">Client Qualification & Information Form</p>
          <p className="text-muted-foreground text-base">
            Fill in your details below and we'll reach out to book your free strategy call.
          </p>
        </FadeUp>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black flex-shrink-0 transition-all duration-300 ${i < step ? "bg-primary text-white" : i === step ? "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-background" : "bg-card border border-border text-muted-foreground"}`}>
                {i < step ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px transition-all duration-500 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <div className="bg-card border border-border rounded-sm p-8 mb-6">
              <p className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Step {step + 1} of {steps.length}, {steps[step].label}</p>
              {steps[step].fields}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-muted-foreground text-sm font-bold uppercase tracking-widest hover:text-foreground transition-colors">
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>
          ) : <div />}
          {step < steps.length - 1 ? (
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-sm font-black uppercase tracking-widest text-sm cursor-pointer"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Next <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {submitError && (
                <p className="text-primary text-xs font-bold">{submitError}</p>
              )}
              <motion.button
                onClick={handleSubmit}
                disabled={submitting || submitted}
                whileHover={submitting || submitted ? {} : { scale: 1.03 }}
                whileTap={submitting || submitted ? {} : { scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-sm font-black uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" strokeOpacity={0.25}/><path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/></svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit Application <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────── */

export default function App() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // headline words for stagger
  const line1 = ["YOUR", "OFFER", "IS", "WORTH", "MORE"];
  const line2 = ["THAN", "YOUR", "CONTENT"];
  const line3 = ["SUGGESTS."];

  // proof counter
  const proofRef = useRef(null);
  const proofInView = useInView(proofRef, { once: true, margin: "-60px" });
  const subCount = useCountUp(1000, proofInView);
  const topCount = useCountUp(9000, proofInView);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── MARQUEE TOP BAR ── */}
      <div className="w-full bg-primary text-white py-2.5 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ width: "200%" }}
        >
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-10 flex-1">
              {marqueeItems.map((item, i) => (
                <span
                  key={i}
                  className={`text-xs font-black tracking-widest uppercase ${item === "·" ? "text-white/50" : ""}`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between py-4">
          <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400 }}>
            <ImageWithFallback src={mmmLogo} alt="MMM Agency" className="h-20 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-muted-foreground">
            {[["#what-we-do", "Services"], ["#pricing", "Pricing"], ["#proof", "Results"], ["#faq", "FAQ"]].map(([href, label]) => (
              <motion.a key={href} href={href} whileHover={{ y: -2, color: "#ffffff" }} transition={{ duration: 0.15 }} className="transition-colors">
                {label}
              </motion.a>
            ))}
          </div>
          <PulseButton href={CALENDLY}>Book a Call</PulseButton>
        </div>
      </motion.nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center overflow-hidden">
        {/* Floating orbs */}
        <motion.div
          className="absolute w-[520px] h-[520px] rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10"
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 50, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "-10%", left: "-15%" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] pointer-events-none -z-10"
          animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0], scale: [0.9, 1.1, 1, 0.9] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ bottom: "-5%", right: "-10%" }}
        />

        {/* Headline — word stagger */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-7xl font-black leading-tight mb-5"
          style={{ fontFamily: "'Anton', sans-serif" }}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        >
          <span className="block">
            {line1.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.22em]"
                variants={{ hidden: { opacity: 0, y: 50, rotateX: -90 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.22em]"
                variants={{ hidden: { opacity: 0, y: 50, rotateX: -90 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block text-primary">
            {line3.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{ hidden: { opacity: 0, y: 50, rotateX: -90 }, show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          We produce high-converting video ads for high-ticket coaches, built to stop the scroll and fill your calendar with qualified calls.
        </motion.p>

        {/* VSL embed */}
        <motion.div
          className="relative w-full max-w-3xl mx-auto mb-10 rounded-sm overflow-hidden bg-card border border-border"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/qDucna-pEMc?rel=0&modestbranding=1&color=white&iv_load_policy=3"
              title="MMM Agency, See How We Build Ads That Book Calls"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col items-center gap-4"
        >
          {/* pulsing ring */}
          <div className="relative inline-block">
            <motion.span
              className="absolute inset-0 rounded-sm border-2 border-primary"
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <PulseButton href={CALENDLY} large>
              Book a Free Strategy Call <ArrowRight className="w-6 h-6" />
            </PulseButton>
          </div>
          <p className="text-xs text-muted-foreground tracking-wide">No obligation. No credit card. Just a conversation.</p>
        </motion.div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ── */}
      <section className="bg-card border-y border-border overflow-hidden">
        <FadeUp className="max-w-4xl mx-auto px-6 py-20 text-center">
          <motion.p
            className="text-primary text-xs font-bold tracking-widest uppercase mb-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            The Problem
          </motion.p>
          <h2 className="text-xl sm:text-2xl md:text-5xl font-black text-foreground leading-tight mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
            "GREAT COACHES LOSE CLIENTS<br />TO WORSE COACHES EVERY DAY,<br />
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              BECAUSE OF HOW THEY LOOK ONLINE."
            </motion.span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Your content is the first thing a potential client sees before they ever hear your pitch. If it doesn't match the quality of your offer, they won't believe the price. We fix that. Every ad we make is designed to position you as the obvious choice before the sales call even starts.
          </p>
        </FadeUp>
      </section>

      {/* ── SECTION 3: WHAT WE DO ── */}
      <section id="what-we-do" className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp className="text-center mb-14">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">What We Do</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            PSYCHOLOGICAL VIDEO ADS<br />THAT SELL FOR YOU.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            We don't make pretty videos. We make ads that work. Every piece of content we produce is built around your specific offer, your target client, and the psychology of what makes them stop scrolling and take action.
          </p>
        </FadeUp>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Eye, title: "Stop the Scroll", desc: "Hooks engineered to interrupt and capture attention in the first 3 seconds." },
            { icon: PhoneCall, title: "Convert the Viewer", desc: "Every ad is structured to move your ideal client from curiosity to booked call." },
            { icon: Award, title: "Look the Part", desc: "Premium production that makes your offer look as valuable as it is." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(224,16,16,0.15)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center p-8 bg-card border border-border rounded-sm cursor-default"
              >
                <motion.div
                  className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center mb-6"
                  whileHover={{ rotate: 360, backgroundColor: "rgba(224,16,16,0.2)" }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-primary" />
                </motion.div>
                <p className="text-foreground font-black text-lg mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>{item.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </StaggerGrid>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <FadeUp className="text-center mb-14">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">The Process</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Anton', sans-serif" }}>
              THREE STEPS.<br />ZERO HASSLE.
            </h2>
          </FadeUp>
          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Book a Strategy Call", desc: "We learn your offer, your audience, and the exact client you want to attract." },
              { step: "02", title: "We Produce and Deliver", desc: "Your ads are scripted, edited, and delivered to your private Google Drive within 7 days." },
              { step: "03", title: "You Close More Clients", desc: "Your content does the selling. You spend your time on delivery, not convincing strangers." },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={staggerItem}
                whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.5)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative p-8 bg-background border border-border rounded-sm cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.p
                  className="font-black text-7xl leading-none mb-4 select-none"
                  style={{ fontFamily: "'Anton', sans-serif", color: "rgba(224,16,16,0.12)" }}
                  whileHover={{ color: "rgba(224,16,16,0.25)" }}
                  transition={{ duration: 0.3 }}
                >
                  {item.step}
                </motion.p>
                <p className="text-foreground font-black text-lg mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>{item.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── SECTION 5: PRICING ── */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20">
        <FadeUp className="text-center mb-14">
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-3" style={{ fontFamily: "'Anton', sans-serif" }}>
            SIMPLE, TRANSPARENT PRICING.
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            All packages are monthly retainers. Every tier includes the full MMM production experience.
          </p>
        </FadeUp>

        {/* Benefits */}
        <FadeUp delay={0.1}>
          <div className="bg-card border border-border rounded-sm px-6 py-5 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {retainerBenefits.map((b, i) => (
                <motion.div
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.3 }}
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </motion.div>
                  <span className="text-foreground text-sm">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Package cards */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.name}
              variants={staggerItem}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{
                boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", type: "tween" },
                default: { type: "spring", stiffness: 280, damping: 22 },
              }}
              animate={pkg.tag ? {
                boxShadow: [
                  "0 0 20px rgba(224,16,16,0.2)",
                  "0 0 45px rgba(224,16,16,0.45)",
                  "0 0 20px rgba(224,16,16,0.2)",
                ],
              } : {}}
              style={{}}
              className={`relative flex flex-col p-6 sm:p-8 rounded-sm border ${pkg.tag ? "border-primary bg-primary/5" : "border-border bg-card"}`}
            >
              {pkg.tag && (
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="bg-primary text-white text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full whitespace-nowrap">
                    {pkg.tag}
                  </span>
                </motion.div>
              )}
              <p className="text-foreground font-black text-xl mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>{pkg.name}</p>
              <div className="flex items-end gap-1 mb-2 flex-wrap">
                <span className="text-primary font-black text-4xl sm:text-5xl leading-none" style={{ fontFamily: "'Anton', sans-serif" }}>{pkg.price}</span>
                <span className="text-muted-foreground text-sm mb-1">{pkg.period}</span>
              </div>
              <p className="text-foreground font-bold text-sm mb-2">{pkg.volume}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{pkg.desc}</p>
              <motion.a
                href={CALENDLY}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-center gap-2 font-black text-sm py-3.5 rounded-sm uppercase tracking-wider overflow-hidden relative ${pkg.tag ? "bg-primary text-white" : "border border-border text-foreground hover:border-primary/50"}`}
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {pkg.tag && (
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%", skewX: "-20deg" }}
                    whileHover={{ x: "200%", skewX: "-20deg" }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          ))}
        </StaggerGrid>

        {/* Trial */}
        <FadeUp delay={0.2}>
          <div className="bg-card border border-border rounded-sm p-6 text-center">
            <p className="text-foreground font-bold mb-1">Not ready for a retainer?</p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We offer a one-time starter pack, <strong className="text-foreground">3 ads for $500</strong>, so you can experience the quality before signing a retainer.
            </p>
            <motion.a
              href={CALENDLY}
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              Book a call to get started <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>
        </FadeUp>

        <FadeUp delay={0.3} className="mt-8 text-center">
          <div className="relative inline-block">
            <motion.span
              className="absolute inset-0 rounded-sm border-2 border-primary"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <PulseButton href={CALENDLY} large>
              Book a Free Strategy Call <ArrowRight className="w-5 h-5" />
            </PulseButton>
          </div>
        </FadeUp>
      </section>

      {/* ── SECTION 6: SOCIAL PROOF ── */}
      <section id="proof" className="bg-card border-y border-border" ref={proofRef}>
        <div className="max-w-5xl mx-auto px-6 py-20">
          <FadeUp className="text-center mb-14">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Social Proof</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-8" style={{ fontFamily: "'Anton', sans-serif" }}>
              RESULTS SPEAK LOUDER.
            </h2>

          </FadeUp>

          {/* Testimonial videos */}
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* YouTube Shorts testimonial — su2Bh98vVpY */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col group col-span-1"
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
            >
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/su2Bh98vVpY?rel=0&modestbranding=1&color=white&iv_load_policy=3"
                  title="Liam Christopher, Client Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-xs font-bold">Liam Christopher</p>
                  <p className="text-muted-foreground text-[11px]">High-Ticket E-Commerce Coach</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/su2Bh98vVpY?feature=share"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch on YouTube
                </motion.a>
              </div>
            </motion.div>

            {/* YouTube Shorts testimonial */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col group"
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
            >
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/GK-dFhYTOec?rel=0&modestbranding=1&color=white&iv_load_policy=3"
                  title="Christian Jamal, Client Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-xs font-bold">Christian Jamal</p>
                  <p className="text-muted-foreground text-[11px]">Founder, Jamal Marketing & Gentech</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/GK-dFhYTOec"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch on YouTube
                </motion.a>
              </div>
            </motion.div>

            {/* YouTube Shorts testimonial — xCigaj8TAyM */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.5)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col group"
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
            >
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/xCigaj8TAyM?rel=0&modestbranding=1&color=white&iv_load_policy=3"
                  title="Kyle Witherspoon, Client Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-xs font-bold">Kyle Witherspoon</p>
                  <p className="text-muted-foreground text-[11px]">MMM Agency Client</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/xCigaj8TAyM"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Watch on YouTube
                </motion.a>
              </div>
            </motion.div>

          </StaggerGrid>

          {/* Stars */}
          <FadeUp delay={0.3} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 400 }}
                >
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Trusted by high-ticket coaches generating <strong className="text-foreground">$2K–$25K offers</strong> across business, fitness, mindset, and finance.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── OUR WORK SAMPLES ── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <FadeUp className="mb-14">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">Portfolio</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
              OUR WORK SAMPLES
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A look at what we produce, scroll-stopping ads, reels, and content built to convert.
            </p>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col"
            >
              <a
                href="https://youtube.com/shorts/_gjV1bObC6o?feature=share"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-full group/thumb"
                style={{ paddingBottom: "177.78%" }}
              >
                <img
                  src="https://i.ytimg.com/vi/_gjV1bObC6o/hqdefault.jpg"
                  alt="Justin P."
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/50 transition-colors flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40"
                  >
                    <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </motion.div>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                  YouTube Shorts
                </div>
              </a>
              <div className="p-3 flex items-center justify-between gap-2 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-[11px] font-bold">Justin P.</p>
                  <p className="text-muted-foreground text-[10px]">High Ticket E-commerce Coach</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/_gjV1bObC6o?feature=share"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Watch
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col"
            >
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/fP8jQ-OmtjI?rel=0&modestbranding=1&color=white&iv_load_policy=3"
                  title="MMM Agency, Ad Sample"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3 flex items-center justify-between gap-2 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-[11px] font-bold">Liam Christopher</p>
                  <p className="text-muted-foreground text-[10px]">E-commerce Ad</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/fP8jQ-OmtjI?feature=share"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Watch
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.6)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ borderColor: "rgba(224,16,16,0.4)" }}
              className="relative rounded-sm overflow-hidden border border-primary/40 bg-background flex flex-col col-span-2 md:col-span-1"
            >
              <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/LoUhkpi1gWw?rel=0&modestbranding=1&color=white&iv_load_policy=3"
                  title="MMM Agency, Ad Sample 2"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3 flex items-center justify-between gap-2 border-t border-border bg-card">
                <div>
                  <p className="text-foreground text-[11px] font-bold">Tyler Bains</p>
                  <p className="text-muted-foreground text-[10px]">Paintlaunch Ad for Tyler Bains</p>
                </div>
                <motion.a
                  href="https://youtube.com/shorts/LoUhkpi1gWw"
                  target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex-shrink-0"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Watch
                </motion.a>
              </div>
            </motion.div>
          </StaggerGrid>
        </div>
      </section>

      {/* ── SECTION 7: OTHER SERVICES ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <FadeUp>
          <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">More Than Ads</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>
            NEED MORE THAN ADS?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-10">
            We also produce reels, VSLs, podcast trailers, and clips. If you need a full content system built around your brand, book a call and we'll put together a custom package for you.
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
          {otherServices.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={staggerItem}
                whileHover={{ y: -6, borderColor: "rgba(224,16,16,0.5)", scale: 1.03 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-sm cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <motion.div
                  className="w-11 h-11 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center"
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </motion.div>
                <p className="text-foreground text-sm font-bold">{s.label}</p>
              </motion.div>
            );
          })}
        </StaggerGrid>

        <FadeUp delay={0.2}>
          <PulseButton href={CALENDLY} outline>
            Book a Call <ArrowRight className="w-4 h-4" />
          </PulseButton>
        </FadeUp>
      </section>

      {/* ── CLIENT INTAKE FORM ── */}
      <ClientIntakeForm />

      {/* ── SECTION 8: FAQ ── */}
      <section id="faq" className="bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <FadeUp className="text-center mb-12">
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground" style={{ fontFamily: "'Anton', sans-serif" }}>
              COMMON QUESTIONS.
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <FadeUp key={i} delay={i * 0.04}>
                  <motion.div
                    whileHover={{ borderColor: open ? "rgba(224,16,16,0.5)" : "rgba(224,16,16,0.3)" }}
                    className="border border-border rounded-sm bg-background overflow-hidden"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    >
                      <span className="text-foreground font-bold text-sm">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0 border-t border-border">
                            <p className="text-muted-foreground text-sm leading-relaxed pt-4">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ── */}
      <section className="border-t border-border relative overflow-hidden">
        {/* Background orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center relative z-10">
          <FadeUp>
            <motion.div
              className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="w-6 h-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-black text-foreground leading-tight mb-5" style={{ fontFamily: "'Anton', sans-serif" }}>
              READY TO LOOK LIKE<br />
              <motion.span
                className="text-primary inline-block"
                animate={{ textShadow: ["0 0 0px rgba(224,16,16,0)", "0 0 30px rgba(224,16,16,0.6)", "0 0 0px rgba(224,16,16,0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                THE COACH
              </motion.span><br />
              YOU ACTUALLY ARE?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-lg mx-auto">
              Spots are limited. We only take a small number of new clients each month to protect delivery quality.
            </p>
            <div className="relative inline-block">
              <motion.span
                className="absolute inset-0 rounded-sm border-2 border-primary"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span
                className="absolute inset-0 rounded-sm border-2 border-primary"
                animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
              <PulseButton href={CALENDLY} large>
                Book Your Free Strategy Call <ArrowRight className="w-6 h-6" />
              </PulseButton>
            </div>
            <p className="text-xs text-muted-foreground mt-5">No obligation. No credit card. Spots are limited.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Top row */}
          <div className="flex flex-col items-center gap-6 mb-8 md:flex-row md:justify-between">
            <motion.div whileHover={{ scale: 1.03 }} className="flex-shrink-0">
              <ImageWithFallback src={mmmLogo} alt="MMM Agency" className="h-20 w-auto object-contain" style={{ mixBlendMode: "screen" }} />
            </motion.div>
            {/* Nav links — wraps on mobile */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {[["#what-we-do", "Services"], ["#pricing", "Pricing"], ["#proof", "Results"], ["#faq", "FAQ"]].map(([href, label]) => (
                <motion.a key={href} href={href} whileHover={{ y: -2, color: "#ffffff" }} transition={{ duration: 0.15 }} className="transition-colors">
                  {label}
                </motion.a>
              ))}
              <motion.a href={CALENDLY} whileHover={{ y: -2 }} className="text-primary">
                Book a Call
              </motion.a>
            </div>
          </div>
          {/* Bottom row */}
          <div className="border-t border-border pt-6 flex flex-col items-center gap-4 text-xs text-muted-foreground md:flex-row md:justify-between">
            <p className="text-center md:text-left">©{new Date().getFullYear()} MMM Agency. All rights reserved.</p>
            <p className="text-center max-w-sm leading-relaxed order-last md:order-none">
              This website is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. FACEBOOK is a trademark of Meta Platforms, Inc.
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <motion.a href="#" whileHover={{ color: "#ffffff" }} className="transition-colors">Privacy Policy</motion.a>
              <motion.a href="#" whileHover={{ color: "#ffffff" }} className="transition-colors">Terms</motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
