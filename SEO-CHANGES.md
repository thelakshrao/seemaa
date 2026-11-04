# SEO changes

## Verify locally
    npm install
    npm run build        # builds site, builds server renderer, prerenders 25 pages
    npm run preview      # open http://localhost:4173/services/business-setbacks
    # In a second terminal, confirm crawlers get real content:
    curl -s http://localhost:4173/services/business-setbacks | grep -i "<h1"

If the curl output shows the <h1> text and a unique <title>, the fix works.

## Old URL -> new URL (301 redirects are in vercel.json)
/servicebrief?name=business-setbacks -> /services/business-setbacks
/horoscopebrief                      -> /horoscope  (and /horoscope/aries ... /horoscope/pisces)
/cunsultation                        -> /consultation

## Where to edit SEO text
src/seo/seoData.js  (titles, descriptions, structured data, and the sitemap all come from here)
