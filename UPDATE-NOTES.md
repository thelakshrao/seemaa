# SEO update 2: what is in this zip

Unzip over your project folder (it only contains changed/new files, with the same folder paths).
Footer.jsx and Booking.jsx are NOT in here, so your versions stay untouched.

## New files
- src/components/ContentPage.jsx   shared layout for the new pages
- src/components/ManglikDosha.jsx  /services/manglik-dosha
- src/components/TarotReading.jsx  /services/tarot-reading
- src/components/Books.jsx         /books
- src/components/Press.jsx         /press
- src/seo/pageContent.js           all the text for the new pages + FAQs (edit wording here)
- src/seo/pressClips.js            add her TV/YouTube/news links here (starts empty)

## Changed files
- src/seo/seoData.js     titles/descriptions for 4 new pages; Seema + Seemaa spellings in home/about
- src/App.jsx            4 new routes
- src/components/Navbar.jsx   Manglik Dosha + Tarot Reading in Services menu; Books + Press links
- src/components/Service.jsx  2 new service cards on the home page
- src/components/Book.jsx     "See all books" link
- src/components/Awards.jsx   real captions instead of "Achievement One / lorem ipsum"; link to /press
- src/components/Home.jsx     only ONE <h1> now (the other banner titles became <h2>)
- vercel.json            more redirects from old WordPress URLs

## After copying
    npm run build      # should print "prerendered" 29 times and "sitemap.xml written (29 URLs)"
    git diff --stat    # should list ONLY the files above

## Please confirm with the client before going live
1. Manglik Dosha text (src/seo/pageContent.js) is written from standard Vedic astrology teaching.
   Seemaa should read it and change anything she would not say herself.
2. "She also teaches tarot to newcomers" (tarot page) came from you. Confirm it is still true.
3. Awards captions (Awards.jsx) describe only what the photos visibly show. Replace with real event names.
4. Books: only Tarot for Beginners has publisher + ISBN (checked against the publisher listing).
   Add details for the other two if you have them.
5. Press page lists the channel logos already on the site. Add real clip links in src/seo/pressClips.js.
