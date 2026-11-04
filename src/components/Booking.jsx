import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import bookingpic2 from "../img/bookingpic2.png";

const PAY_IN_LOCAL_CURRENCY = true;

const BASE_PRICES_INR = { 30: 5100, 60: 7000, 90: 11000 };
const BASE_PRICES_CAD = { 30: 150, 60: 200, 90: 250 };

const BOOKED_KEY = "booked_slots_seemaa";
const RATES_KEY = "inr_rates_seemaa";
const RATES_TTL_MS = 6 * 60 * 60 * 1000;
const COUPON_CODE2 = "DIVIYAVEDIC";
const COUPON_DISCOUNT2 = 0.1;

const COUNTRY_CONFIG = {
  India: { name: "India", tz: "Asia/Kolkata", code: "+91", currency: "INR", symbol: "₹", label: "India (+91)" },
  Canada: { name: "Canada", tz: "America/Toronto", code: "+1", currency: "CAD", symbol: "CA$", label: "Canada (+1)" },
  USA: { name: "USA", tz: "America/New_York", code: "+1", currency: "USD", symbol: "$", label: "USA (+1)" },
  UK: { name: "UK", tz: "Europe/London", code: "+44", currency: "GBP", symbol: "£", label: "United Kingdom (+44)" },
  UAE: { name: "UAE", tz: "Asia/Dubai", code: "+971", currency: "AED", symbol: "AED ", label: "UAE (+971)" },
  Australia: { name: "Australia", tz: "Australia/Sydney", code: "+61", currency: "AUD", symbol: "A$", label: "Australia (+61)" },
  Singapore: { name: "Singapore", tz: "Asia/Singapore", code: "+65", currency: "SGD", symbol: "S$", label: "Singapore (+65)" },
  NewZealand: { name: "New Zealand", tz: "Pacific/Auckland", code: "+64", currency: "NZD", symbol: "NZ$", label: "New Zealand (+64)" },
  Germany: { name: "Germany", tz: "Europe/Berlin", code: "+49", currency: "EUR", symbol: "€", label: "Germany (+49)" },
  France: { name: "France", tz: "Europe/Paris", code: "+33", currency: "EUR", symbol: "€", label: "France (+33)" },
  Italy: { name: "Italy", tz: "Europe/Rome", code: "+39", currency: "EUR", symbol: "€", label: "Italy (+39)" },
  Spain: { name: "Spain", tz: "Europe/Madrid", code: "+34", currency: "EUR", symbol: "€", label: "Spain (+34)" },
  Netherlands: { name: "Netherlands", tz: "Europe/Amsterdam", code: "+31", currency: "EUR", symbol: "€", label: "Netherlands (+31)" },
  Ireland: { name: "Ireland", tz: "Europe/Dublin", code: "+353", currency: "EUR", symbol: "€", label: "Ireland (+353)" },
  Other: { name: "Your local", tz: "UTC", code: "", currency: "USD", symbol: "$", label: "Other country (USD)" },
};

const ISO_TO_KEY = {
  IN: "India", CA: "Canada", US: "USA", GB: "UK", AE: "UAE", AU: "Australia",
  SG: "Singapore", NZ: "NewZealand", DE: "Germany", FR: "France", IT: "Italy",
  ES: "Spain", NL: "Netherlands", IE: "Ireland",
};

const FALLBACK_RATES = {
  INR: 1, CAD: 0.01473, USD: 0.01055, EUR: 0.00942, GBP: 0.0082,
  AED: 0.03875, AUD: 0.0161, SGD: 0.0137, NZD: 0.0182,
};

const ceilTo5 = (n) => Math.ceil(n / 5 - 1e-9) * 5;
const round2 = (n) => Math.round(n * 100) / 100;
const fmtAmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

function getLocalPrice(duration, currency, rates) {
  if (currency === "INR") return BASE_PRICES_INR[duration];
  if (currency === "CAD") return BASE_PRICES_CAD[duration];
  const perCad =
    (rates[currency] ?? FALLBACK_RATES[currency]) /
    (rates.CAD ?? FALLBACK_RATES.CAD);
  return ceilTo5(BASE_PRICES_CAD[duration] * perCad);
}

function readCachedRates(onlyFresh = false) {
  try {
    const c = JSON.parse(localStorage.getItem(RATES_KEY) || "null");
    if (!c || !c.rates) return null;
    if (onlyFresh && Date.now() - c.ts > RATES_TTL_MS) return null;
    return { ...FALLBACK_RATES, ...c.rates };
  } catch {
    return null;
  }
}

async function fetchLiveRates() {
  const cached = readCachedRates(true);
  if (cached) return cached;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = await res.json();
    if (data && data.result === "success" && data.rates) {
      const rates = { INR: 1 };
      Object.values(COUNTRY_CONFIG).forEach((c) => {
        if (data.rates[c.currency]) rates[c.currency] = data.rates[c.currency];
      });
      localStorage.setItem(
        RATES_KEY,
        JSON.stringify({ ts: Date.now(), rates }),
      );
      return { ...FALLBACK_RATES, ...rates };
    }
  } catch {
  }
  return null;
}

const CANADA_TZ = new Set([
  "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg",
  "America/Halifax", "America/St_Johns", "America/Regina", "America/Montreal",
  "America/Moncton", "America/Glace_Bay", "America/Goose_Bay", "America/Whitehorse",
  "America/Yellowknife", "America/Iqaluit", "America/Thunder_Bay", "America/Nipigon",
]);

const US_TZ = new Set([
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Phoenix", "America/Anchorage", "America/Detroit", "America/Boise",
  "America/Juneau", "America/Adak", "Pacific/Honolulu",
]);

const TZ_TO_KEY = {
  "Asia/Kolkata": "India", "Asia/Calcutta": "India",
  "Europe/London": "UK", "Asia/Dubai": "UAE", "Asia/Singapore": "Singapore",
  "Pacific/Auckland": "NewZealand", "Europe/Berlin": "Germany", "Europe/Paris": "France",
  "Europe/Rome": "Italy", "Europe/Madrid": "Spain", "Europe/Amsterdam": "Netherlands",
  "Europe/Dublin": "Ireland",
};

function tzToKey(tz) {
  if (!tz) return "Other";
  if (CANADA_TZ.has(tz)) return "Canada";
  if (
    US_TZ.has(tz) ||
    tz.startsWith("America/Indiana/") ||
    tz.startsWith("America/Kentucky/") ||
    tz.startsWith("America/North_Dakota/")
  )
    return "USA";
  if (tz.startsWith("Australia/")) return "Australia";
  return TZ_TO_KEY[tz] || "Other";
}

function safeTz(tz) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return tz;
  } catch {
    return null;
  }
}

async function detectLocation() {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d && d.country_code) {
        return {
          key: ISO_TO_KEY[d.country_code] || "Other",
          tz: d.timezone ? safeTz(d.timezone) : null,
        };
      }
    }
  } catch {
  }
  const tz = safeTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return { key: tzToKey(tz), tz };
}

function tzAbbr(tz) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || tz;
  } catch {
    return tz;
  }
}

function generateSlots(durationMinutes) {
  const slots = [];
  const dayStart = 10 * 60;
  const dayEnd = 16 * 60;
  for (let t = dayStart; t + durationMinutes <= dayEnd; t += durationMinutes) {
    const startH = Math.floor(t / 60);
    const startM = t % 60;
    const endT = t + durationMinutes;
    const endH = Math.floor(endT / 60);
    const endM = endT % 60;
    const fmt = (h, m) => {
      const suffix = h >= 12 ? "PM" : "AM";
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display}:${String(m).padStart(2, "0")} ${suffix}`;
    };
    slots.push({
      startH,
      startM,
      endH,
      endM,
      label: `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
      key: `${startH}:${String(startM).padStart(2, "0")}-${endH}:${String(endM).padStart(2, "0")}`,
    });
  }
  return slots;
}

function getNowInTZ(tz) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return {
    year: parseInt(get("year")),
    month: parseInt(get("month")) - 1,
    day: parseInt(get("day")),
    hour: parseInt(get("hour")) % 24,
    minute: parseInt(get("minute")),
  };
}

function getAvailableDates(tz) {
  const now = getNowInTZ(tz);
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.year, now.month, now.day + i);
    dates.push(d);
  }
  return dates;
}

function getFirstAllowedMinutes(nowHour, nowMinute, durationMinutes) {
  const nowTotal = nowHour * 60 + nowMinute;
  if (durationMinutes === 30) return Math.ceil((nowTotal + 60) / 30) * 30;
  if (durationMinutes === 60)
    return nowMinute < 30 ? (nowHour + 1) * 60 : (nowHour + 2) * 60;
  if (durationMinutes === 90) {
    const base = nowMinute < 30 ? (nowHour + 1) * 60 : (nowHour + 2) * 60;
    let s = 10 * 60;
    while (s < base) s += 90;
    return s;
  }
  return (nowHour + 1) * 60;
}

function loadBooked() {
  try {
    return JSON.parse(localStorage.getItem(BOOKED_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveBooked(data) {
  localStorage.setItem(BOOKED_KEY, JSON.stringify(data));
}

function getBookedRangesForDate(dateKey) {
  const booked = loadBooked();
  const ranges = [];
  Object.keys(booked).forEach((k) => {
    if (!k.startsWith(dateKey + "_")) return;
    const slotKey = k.replace(dateKey + "_", "");
    const match = slotKey.match(/^(\d+):(\d+)-(\d+):(\d+)$/);
    if (!match) return;
    const startMin = parseInt(match[1]) * 60 + parseInt(match[2]);
    const endMin = parseInt(match[3]) * 60 + parseInt(match[4]);
    if (!isNaN(startMin) && !isNaN(endMin) && endMin > startMin) {
      ranges.push({ start: startMin, end: endMin });
    }
  });
  return ranges;
}

function slotOverlapsBooked(slot, bookedRanges) {
  const s = slot.startH * 60 + slot.startM;
  const e = slot.endH * 60 + slot.endM;
  return bookedRanges.some((r) => s < r.end && e > r.start);
}

function isPastCutoff(slot, now, durationMinutes, isToday) {
  if (!isToday) return false;
  return (
    slot.startH * 60 + slot.startM <
    getFirstAllowedMinutes(now.hour, now.minute, durationMinutes)
  );
}

function formatDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getAvailableSlotsForDate(dateObj, tz, durationMinutes) {
  const now = getNowInTZ(tz);
  const isToday =
    dateObj.getFullYear() === now.year &&
    dateObj.getMonth() === now.month &&
    dateObj.getDate() === now.day;
  const dateKey = formatDateKey(dateObj);
  const bookedRanges = getBookedRangesForDate(dateKey);
  return generateSlots(durationMinutes).filter((slot) => {
    if (isPastCutoff(slot, now, durationMinutes, isToday)) return false;
    if (slotOverlapsBooked(slot, bookedRanges)) return false;
    return true;
  });
}

function SlotPicker({
  tz,
  onSelect,
  selectedDate,
  selectedSlot,
  durationMinutes,
}) {
  const dates = getAvailableDates(tz);
  const [activeDate, setActiveDate] = useState(selectedDate || dates[0]);
  const dateKey = formatDateKey(activeDate);
  const bookedRanges = getBookedRangesForDate(dateKey);
  const now = getNowInTZ(tz);
  const isToday =
    activeDate.getFullYear() === now.year &&
    activeDate.getMonth() === now.month &&
    activeDate.getDate() === now.day;
  const allSlots = generateSlots(durationMinutes);
  const availableSlots = getAvailableSlotsForDate(
    activeDate,
    tz,
    durationMinutes,
  );
  const visibleSlots = allSlots.filter(
    (slot) => !isPastCutoff(slot, now, durationMinutes, isToday),
  );

  const handleDateClick = (d) => {
    setActiveDate(d);
    onSelect(d, null);
  };

  const handleSlotClick = (slot) => {
    if (!slotOverlapsBooked(slot, bookedRanges)) onSelect(activeDate, slot);
  };

  return (
    <div className="w-full">
      <p className="text-[0.78rem] font-semibold text-[#7A1E1E] uppercase tracking-[0.05em] mb-2">
        Select Date
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
        {dates.map((d, i) => {
          const isSel = formatDateKey(activeDate) === formatDateKey(d);
          const hasSlots =
            getAvailableSlotsForDate(d, tz, durationMinutes).length > 0;
          return (
            <button
              key={i}
              onClick={() => handleDateClick(d)}
              disabled={!hasSlots}
              className={`shrink-0 flex flex-col items-center px-2.5 py-2 rounded-xl border-[1.5px] min-w-13 cursor-pointer transition-all
                ${isSel ? "bg-[#7A1E1E] border-[#7A1E1E]" : "bg-white border-[#e0c9a6] hover:border-[#7A1E1E] hover:bg-[#fff6ee]"}
                ${!hasSlots ? "opacity-35 cursor-not-allowed" : ""}`}
            >
              <span className={`date-chip__day ${isSel ? "text-white" : ""}`}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className={`date-chip__num ${isSel ? "text-white" : ""}`}>
                {d.getDate()}
              </span>
              <span className={`date-chip__mon ${isSel ? "text-white" : ""}`}>
                {d.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-[0.78rem] font-semibold text-[#7A1E1E] uppercase tracking-[0.05em] mb-2 mt-4">
        Select Time Slot
      </p>
      {visibleSlots.length === 0 ? (
        <p className="text-[0.82rem] text-gray-400 text-center py-3">
          No slots available for today. Please choose another date.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {visibleSlots.map((slot) => {
            const isOverlapping = slotOverlapsBooked(slot, bookedRanges);
            const isAvailable = availableSlots.some((s) => s.key === slot.key);
            const isSel =
              selectedSlot?.key === slot.key &&
              selectedDate &&
              formatDateKey(activeDate) === formatDateKey(selectedDate);
            return (
              <button
                key={slot.key}
                onClick={() => handleSlotClick(slot)}
                disabled={isOverlapping || !isAvailable}
                className={`relative py-2.5 px-2 rounded-[10px] border-[1.5px] text-[0.82rem] font-medium text-center transition-all
                  ${isSel ? "bg-[#7A1E1E] border-[#7A1E1E] text-white" : ""}
                  ${isOverlapping ? "bg-[#f0ebe4] text-[#bbb] cursor-not-allowed border-[#ddd]" : ""}
                  ${!isSel && !isOverlapping ? "bg-white border-[#e0c9a6] text-[#3a1a1a] cursor-pointer hover:border-[#7A1E1E] hover:bg-[#fff6ee]" : ""}`}
              >
                {slot.label}
                {isOverlapping && (
                  <span className="slot-booked-tag">Booked</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Booking = () => {
  const form = useRef();
  const userPickedCountry = useRef(false);
  const [duration, setDuration] = useState("30");
  const [step, setStep] = useState("price");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const [isSending, setIsSending] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [showLongNote, setShowLongNote] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [country, setCountry] = useState("India");
  const [detected, setDetected] = useState(null);
  const [rates, setRates] = useState(() => readCachedRates() || FALLBACK_RATES);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  const cfg = COUNTRY_CONFIG[country];
  const tz =
    detected && detected.key === country && detected.tz ? detected.tz : cfg.tz;
  const tzLabel = tzAbbr(tz);
  const timeName = `${cfg.name} time`;

  const durationMinutes = duration === "30" ? 30 : duration === "60" ? 60 : 90;
  const basePrice = getLocalPrice(duration, cfg.currency, rates);
  const basePriceInr =
    cfg.currency === "INR"
      ? BASE_PRICES_INR[duration]
      : Math.round(
          basePrice / (rates[cfg.currency] ?? FALLBACK_RATES[cfg.currency]),
        );
  const appliedDiscount =
    appliedCouponCode === COUPON_CODE2 ? COUPON_DISCOUNT2 : 0;

  const applyDiscount = (amount, currency) =>
    currency === "INR"
      ? Math.round(amount * (1 - appliedDiscount))
      : round2(amount * (1 - appliedDiscount));

  const finalPrice = couponApplied
    ? applyDiscount(basePrice, cfg.currency)
    : basePrice;
  const discount = round2(basePrice - finalPrice);
  const finalPriceInr = couponApplied
    ? applyDiscount(basePriceInr, "INR")
    : basePriceInr;

  const payLocal = PAY_IN_LOCAL_CURRENCY || cfg.currency === "INR";
  const chargeCurrency = payLocal ? cfg.currency : "INR";
  const chargeAmount = payLocal ? finalPrice : finalPriceInr;

  const money = (n, dash = true) =>
    cfg.currency === "INR"
      ? `₹${fmtAmt(n)}${dash ? "/-" : ""}`
      : `${cfg.symbol}${fmtAmt(n)}`;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    detectLocation().then((loc) => {
      if (cancelled || !loc) return;
      setDetected(loc);
      if (!userPickedCountry.current) setCountry(loc.key);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchLiveRates().then((r) => {
      if (!cancelled && r) setRates(r);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSlotSelect = (date, slot) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    if (slot !== null) setShowSlotPicker(false);
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === COUPON_CODE2) {
      setAppliedCouponCode(COUPON_CODE2);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code.");
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponInput("");
    setCouponError("");
    setAppliedCouponCode("");
  };

  const getBookingDateStr = () => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

  const getBookingTimeStr = () =>
    selectedSlot ? `${selectedSlot.label} (${cfg.name} time, ${tzLabel})` : "";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (isSending) return;
    if (!selectedDate || !selectedSlot) {
      alert("Please select a date and time slot before confirming.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_live_SlWNuGVbsl0XQU",
      amount: Math.round(chargeAmount * 100),
      currency: chargeCurrency,
      name: "Acharya Seemaa Singh",
      description: `${durationMinutes} Min Consultation`,
      image: bookingpic2,
      handler: function (response) {
        console.log("Payment Success:", response.razorpay_payment_id);
        finalizeBooking(response.razorpay_payment_id);
      },
      prefill: {
        name: form.current.user_name.value,
        email: form.current.user_email.value,
        contact: `${cfg.code}${form.current.user_phone.value}`,
      },
      notes: {
        address: "Consultation Booking",
        date: getBookingDateStr(),
        time: getBookingTimeStr(),
        country: cfg.name,
      },
      theme: {
        color: "#7A1E1E",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const finalizeBooking = (paymentId) => {
    setIsSending(true);

    const booked = loadBooked();
    const key = `${formatDateKey(selectedDate)}_${selectedSlot.key}`;
    booked[key] = true;
    saveBooked(booked);

    emailjs
      .sendForm(
        "service_astrology",
        "template_az2acka",
        form.current,
        "V_nIV9ssCU2IIcTBB",
      )
      .then(() => {
        alert(
          `Payment Successful! (Ref: ${paymentId}). Your booking is confirmed.`,
        );
        setStep("price");
        setSelectedDate(null);
        setSelectedSlot(null);
        setCouponApplied(false);
        setCouponInput("");
        setAppliedCouponCode("");
      })
      .catch((err) => {
        console.error(err);
        alert(
          "Payment was successful but email notification failed. Please contact support.",
        );
      })
      .finally(() => setIsSending(false));
  };

  const slotButtonLabel =
    selectedDate && selectedSlot
      ? `${selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${selectedSlot.label}`
      : "Pick a Slot";

  return (
    <div>
      <section
        id="booking"
        className="w-full bg-[#FAF9F6] py-14 px-4 flex justify-center"
      >
        <div className="max-w-7xl w-full">
          <h2 className="text-center font-serif text-3xl md:text-4xl mb-2">
            Choose Your <span className="text-[#7A1E1E]">Consultation</span>
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600 mb-10">
            Trusted astrologer with proven experience, ready to guide you with
            clarity and practical solutions
          </p>
          <div className="flex flex-col md:flex-row justify-center items-start gap-4 transition-all duration-500">
            {(step === "price" || (!isMobile && step === "form")) && (
              <div
                className={`bg-[#FFF6E8] rounded-2xl border-2 border-[#7A1E1E] p-4 shadow-xl flex flex-col transition-all duration-500
                ${isMobile ? "w-full max-w-sm mx-auto" : step === "form" ? "w-1/2" : "w-full max-w-md mx-auto"}`}
              >
                <img
                  src={bookingpic2}
                  alt="Astrologer Seemaa Ji"
                  loading="lazy"
                  className={`rounded-xl mx-auto object-cover ${isMobile ? "h-32 w-32" : "h-50 w-50"}`}
                />
                <h3
                  className={`text-center font-serif ${isMobile ? "text-base" : "text-lg"} mb-1`}
                >
                  Acharya Seemaa Singh
                </h3>
                <p
                  className={`text-center text-gray-600 mb-4 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  20+ Years Experience | 50,000+ Clients
                </p>
                <ul
                  className={`text-gray-700 space-y-1 mb-5 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  <li>✔ Clear, actionable guidance</li>
                  <li>✔ Simple & effective remedies</li>
                  <li>✔ Detailed predictions</li>
                  <li>✔ Career & relationship advice</li>
                  <li>✔ Personalized astrological insights</li>
                  <li>✔ Practical solutions for daily life</li>
                </ul>
                <div className="mb-5">
                  <p
                    className={`font-semibold mb-2 ${isMobile ? "text-xs" : "text-sm"}`}
                  >
                    Online Consultation Duration
                  </p>
                  <div className="flex gap-2">
                    {["30", "60", "90"].map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setDuration(t);
                          if (t === "90") setShowLongNote(true);
                          setSelectedDate(null);
                          setSelectedSlot(null);
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm border cursor-pointer ${duration === t ? "bg-[#7A1E1E] text-white" : "bg-white text-[#7A1E1E]"}`}
                      >
                        {t === "30"
                          ? "30 Min"
                          : t === "60"
                            ? "1 Hour"
                            : "1+ Hour"}
                      </button>
                    ))}
                  </div>
                  {duration === "90" && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      Note: the 1+ Hour session lasts between 1 hour and 1 hour
                      30 minutes, and never more than 90 minutes.
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`font-semibold ${isMobile ? "text-sm" : "text-lg"}`}
                  >
                    {money(basePrice)}
                  </span>
                  <button
                    className="bg-[#7A1E1E] text-white px-4 py-1.5 rounded-lg hover:bg-[#5e1515] cursor-pointer"
                    onClick={() => setStep("form")}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )}
            {(step === "form" || (isMobile && step === "form")) && (
              <div
                className={`bg-[#FAF9F6] rounded-2xl border border-[#E7C9A5] p-6 flex-1 transition-all duration-500
                ${isMobile ? "w-full max-w-sm mx-auto mt-6" : "w-1/2"}`}
              >
                {isMobile && (
                  <button
                    onClick={() => setStep("price")}
                    className="text-[#7A1E1E] font-semibold mb-4 flex items-center gap-2"
                  >
                    ← Back
                  </button>
                )}
                <div className="flex justify-between items-center mb-6">
                  <h3
                    className={`font-serif text-[#7A1E1E] text-center w-full ${isMobile ? "text-lg" : "text-2xl"}`}
                  >
                    Book Your Appointment
                  </h3>
                  <div className="text-right whitespace-nowrap">
                    {couponApplied ? (
                      <div>
                        <span className="line-through text-gray-400 text-sm">
                          {money(basePrice, false)}
                        </span>
                        <span
                          className={`font-semibold text-[#7A1E1E] ml-1 ${isMobile ? "text-sm" : "text-lg"}`}
                        >
                          {money(finalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`font-semibold text-[#7A1E1E] ${isMobile ? "text-sm" : "text-lg"}`}
                      >
                        {money(basePrice)}
                      </span>
                    )}
                  </div>
                </div>
                <form
                  ref={form}
                  onSubmit={handlePayment}
                  className="grid grid-cols-1 gap-4"
                >
                  <input
                    type="hidden"
                    name="booking_duration"
                    value={durationMinutes}
                  />
                  <input
                    type="hidden"
                    name="booking_price"
                    value={chargeAmount}
                  />
                  <input
                    type="hidden"
                    name="booking_currency"
                    value={chargeCurrency}
                  />
                  <input
                    type="hidden"
                    name="booking_date"
                    value={getBookingDateStr()}
                  />
                  <input
                    type="hidden"
                    name="booking_time"
                    value={getBookingTimeStr()}
                  />
                  <input type="hidden" name="country_code" value={cfg.code} />
                  <input type="hidden" name="client_country" value={cfg.name} />
                  <input type="hidden" name="client_timezone" value={tz} />
                  <input
                    type="hidden"
                    name="coupon_applied"
                    value={
                      couponApplied
                        ? `${appliedCouponCode} (-${Math.round(appliedDiscount * 100)}%)`
                        : "No coupon used"
                    }
                  />
                  <input
                    type="hidden"
                    name="coupon_code_entered"
                    value={
                      couponApplied ? appliedCouponCode : couponInput || "None"
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="user_name"
                      placeholder="Name"
                      required
                      className="bg-[#7A1E1E] text-white placeholder-white p-3 rounded-lg outline-none"
                    />
                    <input
                      type="email"
                      name="user_email"
                      placeholder="Email"
                      required
                      className="bg-[#7A1E1E] text-white placeholder-white p-3 rounded-lg outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide">
                        Your Country
                      </p>
                      <select
                        className="country-select"
                        value={country}
                        onChange={(e) => {
                          userPickedCountry.current = true;
                          setCountry(e.target.value);
                          setSelectedDate(null);
                          setSelectedSlot(null);
                        }}
                      >
                        {Object.entries(COUNTRY_CONFIG).map(([k, v]) => (
                          <option key={k} value={k}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide">
                        Phone Number
                      </p>
                      <div className="flex rounded-[10px] overflow-hidden">
                        <div className="bg-[#5e1515] text-white text-[0.88rem] font-semibold px-3 flex items-center whitespace-nowrap shrink-0 border-r border-white/20">
                          {cfg.code || "🌐"}
                        </div>
                        <input
                          type="tel"
                          name="user_phone"
                          placeholder={cfg.code ? "Number" : "With country code"}
                          required
                          className="flex-1 min-w-0 bg-[#7A1E1E] text-white border-none outline-none px-3 py-3 text-[0.9rem] placeholder-white/70"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide">
                      Appointment Slot · {cfg.name} Time · {durationMinutes} Min
                      Online Session
                    </p>
                    <button
                      type="button"
                      className="w-full px-4 py-3 rounded-[10px] border-[1.5px] border-[#7A1E1E] bg-white text-[#7A1E1E] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-between hover:bg-[#fff6ee] transition-all"
                      onClick={() => setShowSlotPicker(true)}
                    >
                      <span>{slotButtonLabel}</span>
                      <span>🗓</span>
                    </button>
                    <p className="text-[0.72rem] text-gray-500 mt-1">
                      All slot times are in {timeName} ({tzLabel}).
                    </p>
                    {duration === "90" && (
                      <p className="text-[0.72rem] font-semibold text-red-600 mt-1">
                        Note: the 1+ Hour session lasts between 1 hour and 1
                        hour 30 minutes, never more than 90 minutes.
                      </p>
                    )}
                  </div>
                  <textarea
                    name="user_message"
                    rows="3"
                    placeholder="Message (for specific question)"
                    className="bg-[#7A1E1E] text-white placeholder-white/70 p-3 rounded-lg outline-none"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide">
                      Coupon Code
                    </p>
                    {couponApplied ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg px-4 py-2.5">
                        <div>
                          <span className="text-green-700 font-semibold text-sm">
                            {appliedCouponCode} applied!
                          </span>
                          <span className="text-green-600 text-xs ml-2">
                            −{money(discount, false)} (
                            {Math.round(appliedDiscount * 100)}% off)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-red-400 text-xs underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          placeholder="Enter Coupon Code"
                          className="flex-1 bg-[#7A1E1E] text-white placeholder-white/60 p-3 rounded-lg outline-none uppercase tracking-widest text-sm"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="bg-[#cbb05f] text-[#3B1F1B] px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer hover:bg-[#e0ca7a] transition-all whitespace-nowrap"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-red-500 text-xs mt-1">{couponError}</p>
                    )}
                  </div>
                  {!payLocal && (
                    <p className="text-xs text-gray-500 -mt-2">
                      Your card will be charged ₹{fmtAmt(finalPriceInr)} (INR
                      equivalent of {money(finalPrice, false)}).
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    {couponApplied && (
                      <div className="text-sm text-gray-600">
                        <span>Total: </span>
                        <span className="line-through text-gray-400">
                          {money(basePrice, false)}
                        </span>
                        <span className="text-[#7A1E1E] font-bold ml-1">
                          {money(finalPrice, false)}
                        </span>
                        <span className="text-green-600 text-xs ml-1">
                          (saved {money(discount, false)})
                        </span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSending || !selectedDate || !selectedSlot}
                      className={`${couponApplied ? "" : "w-full"} bg-[#7A1E1E] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#5e1515] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isSending ? "Sending…" : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
      <hr className="bg-[#7A1E1E] w-full h-0.5" />
      {showLongNote && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLongNote(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl border border-[#E7C9A5]">
            <h4 className="font-serif text-lg text-[#7A1E1E] mb-2">
              About the 1+ Hour session
            </h4>
            <p className="text-sm text-red-600 font-semibold leading-relaxed">
              This session lasts between 1 hour and 1 hour 30 minutes. It will
              never be longer than 90 minutes.
            </p>
            <button
              onClick={() => setShowLongNote(false)}
              className="mt-5 bg-[#7A1E1E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#5e1515] cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {showSlotPicker && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSlotPicker(false);
          }}
        >
          <div className="slot-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#7A1E1E]">
                📅 Select Your Slot ({cfg.name} Time · {tzLabel} ·{" "}
                {durationMinutes} Min)
              </h4>
              <button
                className="bg-transparent border-none text-[1.4rem] text-[#7A1E1E] cursor-pointer leading-none"
                onClick={() => setShowSlotPicker(false)}
              >
                ✕
              </button>
            </div>
            <SlotPicker
              key={`${tz}-${durationMinutes}`}
              tz={tz}
              onSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              durationMinutes={durationMinutes}
            />
            {selectedDate && selectedSlot && (
              <button
                onClick={() => setShowSlotPicker(false)}
                className="w-full mt-4 bg-[#7A1E1E] text-white py-2.5 rounded-xl font-semibold hover:bg-[#5e1515] cursor-pointer"
              >
                Confirm Slot ✓
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;