import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import bookingpic2 from "../img/bookingpic2.png";

const COUNTRY_CONFIG = {
  India: {
    tz: "Asia/Kolkata",
    code: "+91",
    currency: "₹",
    label: "India (+91)",
  },
  USA: { tz: "America/New_York", code: "+1", currency: "$", label: "USA (+1)" },
  Canada: {
    tz: "America/Toronto",
    code: "+1",
    currency: "$",
    label: "Canada (+1)",
  },
};

const BOOKED_KEY = "booked_slots_seemaa";
const COUPON_CODE2 = "DIVIYAVEDIC";
const COUPON_DISCOUNT2 = 0.1;

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
    hour: parseInt(get("hour")),
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
  const [duration, setDuration] = useState("30");
  const [step, setStep] = useState("price");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSending, setIsSending] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [country, setCountry] = useState("India");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");

  const tz = COUNTRY_CONFIG[country].tz;
  const basePriceMap = { 30: 5100, 60: 7000, 90: 11000 };
  const durationMinutes = duration === "30" ? 30 : duration === "60" ? 60 : 90;
  const basePrice = basePriceMap[duration];
  const appliedDiscount =
    appliedCouponCode === COUPON_CODE2 ? COUPON_DISCOUNT2 : 0;
  const finalPrice = couponApplied
    ? Math.round(basePrice * (1 - appliedDiscount))
    : basePrice;
  const discount = basePrice - finalPrice;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const getBookingTimeStr = () => selectedSlot?.label || "";

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
      amount: finalPrice * 100,
      currency: "INR",
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
        contact: form.current.user_phone.value,
      },
      notes: {
        address: "Consultation Booking",
        date: getBookingDateStr(),
        time: getBookingTimeStr(),
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
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`font-semibold ${isMobile ? "text-sm" : "text-lg"}`}
                  >
                    ₹{basePrice}/-
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
                  <div className="text-right">
                    {couponApplied ? (
                      <div>
                        <span className="line-through text-gray-400 text-sm">
                          ₹{basePrice}
                        </span>
                        <span
                          className={`font-semibold text-[#7A1E1E] ml-1 ${isMobile ? "text-sm" : "text-lg"}`}
                        >
                          ₹{finalPrice}/-
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`font-semibold text-[#7A1E1E] ${isMobile ? "text-sm" : "text-lg"}`}
                      >
                        ₹{basePrice}/-
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
                    value={finalPrice}
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
                  <input
                    type="hidden"
                    name="country_code"
                    value={COUNTRY_CONFIG[country].code}
                  />
                  <input type="hidden" name="client_country" value={country} />
                  <input
                    type="hidden"
                    name="client_timezone"
                    value={COUNTRY_CONFIG[country].tz}
                  />
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
                          {COUNTRY_CONFIG[country].code}
                        </div>
                        <input
                          type="tel"
                          name="user_phone"
                          placeholder="Number"
                          required
                          className="flex-1 bg-[#7A1E1E] text-white border-none outline-none px-3 py-3 text-[0.9rem] placeholder-white/70"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7A1E1E] mb-1.5 uppercase tracking-wide">
                      Appointment Slot · {durationMinutes} Min Online Session
                    </p>
                    <button
                      type="button"
                      className="w-full px-4 py-3 rounded-[10px] border-[1.5px] border-[#7A1E1E] bg-white text-[#7A1E1E] font-semibold text-[0.9rem] cursor-pointer flex items-center justify-between hover:bg-[#fff6ee] transition-all"
                      onClick={() => setShowSlotPicker(true)}
                    >
                      <span>{slotButtonLabel}</span>
                      <span>🗓</span>
                    </button>
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
                            −₹{discount} ({Math.round(appliedDiscount * 100)}%
                            off)
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
                  <div className="flex items-center justify-between pt-1">
                    {couponApplied && (
                      <div className="text-sm text-gray-600">
                        <span>Total: </span>
                        <span className="line-through text-gray-400">
                          ₹{basePrice}
                        </span>
                        <span className="text-[#7A1E1E] font-bold ml-1">
                          ₹{finalPrice}
                        </span>
                        <span className="text-green-600 text-xs ml-1">
                          (saved ₹{discount})
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
                📅 Select Your Slot ({country} Time · {durationMinutes} Min)
              </h4>
              <button
                className="bg-transparent border-none text-[1.4rem] text-[#7A1E1E] cursor-pointer leading-none"
                onClick={() => setShowSlotPicker(false)}
              >
                ✕
              </button>
            </div>
            <SlotPicker
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