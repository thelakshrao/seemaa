#!/usr/bin/env python3
"""
Applies the SEO fixes to YOUR current Footer.jsx and Booking.jsx
without touching anything else in them (all your recent edits stay).

Run from the project root (the folder that contains package.json):
    python3 patch_seo.py
Safe to run twice.
"""
import re
from pathlib import Path

base = Path("src/components")
footer_p, booking_p = base / "Footer.jsx", base / "Booking.jsx"
for p in (footer_p, booking_p):
    if not p.exists():
        raise SystemExit(f"Cannot find {p}. Run this from the project root.")

# ---------------- Footer ----------------
f = footer_p.read_text(encoding="utf-8")
orig = f

# 1) service links: /servicebrief?name=x  ->  /services/x
f = f.replace("/servicebrief?name=", "/services/")

# 2) internal plain <a href> links -> router <Link> (opening + closing tag)
links = [("/about", "About Us"), ("/cunsultation", "Appointment"),
         ("/horoscopebrief", "Horoscope"), ("/contact", "Contact us")]
for href, label in links:
    pat = re.compile(r"<a href=\"" + re.escape(href) + r"\"(\s+className=\"[^\"]*\">\s*" +
                     re.escape(label) + r"\s*)</a>")
    f = pat.sub(lambda m: f"<Link to=\"{href}\"" + m.group(1) + "</Link>", f)

# 3) renamed URLs
f = f.replace("\"/cunsultation\"", "\"/consultation\"")
f = f.replace("\"/horoscopebrief\"", "\"/horoscope\"")

for bad in ("servicebrief", "cunsultation", "horoscopebrief"):
    if bad in f:
        raise SystemExit(f"Footer.jsx still contains {bad!r}. Nothing was written. Send me the file.")
if "import { Link } from \"react-router-dom\"" not in f:
    raise SystemExit("Footer.jsx does not import Link. Nothing was written.")
footer_p.write_text(f, encoding="utf-8")
print("Footer.jsx :", "updated" if f != orig else "already up to date")

# ---------------- Booking ----------------
b = booking_p.read_text(encoding="utf-8")
old = "useState(window.innerWidth < 768)"
new = "useState(typeof window !== \"undefined\" && window.innerWidth < 768)"
if old in b:
    booking_p.write_text(b.replace(old, new), encoding="utf-8")
    print("Booking.jsx: updated (1 line)")
elif new in b:
    print("Booking.jsx: already up to date")
else:
    raise SystemExit("Booking.jsx: expected line not found. Send me the file.")
