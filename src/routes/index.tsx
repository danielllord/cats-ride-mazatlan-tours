import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Anchor, Camera, Check, ChevronRight, Facebook, GlassWater, Landmark, Mail, MapPin, Menu, Palmtree, Phone, ShipWheel, Sparkles, Users, UtensilsCrossed, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/mazatlan-hero.jpg";
import lighthouseImage from "@/assets/lighthouse.jpg";
import diversImage from "@/assets/cliff-divers.jpg";
import triptychImage from "@/assets/mazatlan-stops-triptych.jpg";
import drinksImage from "@/assets/mazatlan-drinks.jpg";
import logoAsset from "@/assets/cats-ride-logo.png.asset.json";
import martinAsset from "@/assets/martin-guide.png.asset.json";
import liverpoolAsset from "@/assets/liverpool-alley.jpeg.asset.json";

const facebookUrl = "https://www.facebook.com/share/1GJbJEeeTo/?mibextid=wwXIfr";
const navItems = [["Home", "home"], ["Tours", "tours"], ["About Martin", "martin"], ["Tour Stops", "stops"], ["FAQ", "faq"], ["Contact", "booking"]];
const features = [
  [Camera, "Sightseeing"], [Landmark, "Culture"], [Waves, "Beaches"], [UtensilsCrossed, "Food & Drinks"],
  [MapPin, "Photo Stops"], [Users, "Private Tours"], [ShipWheel, "Custom Itineraries"],
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cat’s Ride Mazatlan | Private Mazatlán Tours with Martin" },
      { name: "description", content: "Explore Mazatlán with Martin and Cat’s Ride Mazatlan. Enjoy private, customizable sightseeing tours featuring local landmarks, beaches, culture, food and unforgettable experiences." },
      { property: "og:title", content: "Cat’s Ride Mazatlan | Private Mazatlán Tours with Martin" },
      { property: "og:description", content: "Private, personalized Mazatlán sightseeing tours with local guide Martin." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bree+Serif&family=Caveat:wght@500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "TouristInformationCenter", name: "Cat’s Ride Mazatlan", description: "Private personalized tours in Mazatlán, Sinaloa, Mexico", telephone: "+01 6691647788", email: "bookings@catsridemazatlan.com", address: { "@type": "PostalAddress", addressLocality: "Mazatlán", addressRegion: "Sinaloa", addressCountry: "MX" }, sameAs: [facebookUrl] }) }],
  }),
  component: Index,
});

function scrollToBooking() { document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); }

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6">
      <a href="#home" aria-label="Cat’s Ride Mazatlan home" className="shrink-0"><img src={logoAsset.url} alt="Cat’s Ride Mazatlan" className="h-14 w-auto" width="240" height="150" /></a>
      <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="text-sm font-bold text-primary transition-colors hover:text-ocean">{label}</a>)}</nav>
      <Button variant="sunshine" className="ml-auto h-11 rounded-full px-4 font-extrabold lg:ml-2" onClick={scrollToBooking}>Book / Info</Button>
      <Button variant="ghost" size="icon" className="h-11 w-11 lg:hidden" onClick={() => setOpen(!open)} aria-label="Open navigation">{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="border-t bg-background px-4 py-3 lg:hidden" aria-label="Mobile navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block border-b border-border py-3 font-bold text-primary last:border-0">{label}</a>)}</nav>}
  </header>;
}

function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("sending"); setMessage("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/public/tour-inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to send your request.");
      setStatus("success"); form.reset();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Unable to send your request."); }
  }
  if (status === "success") return <div className="flex min-h-80 flex-col items-center justify-center rounded-lg bg-background p-8 text-center" role="status"><div className="mb-5 rounded-full bg-ocean p-4 text-ocean-foreground"><Check className="h-8 w-8" /></div><h3 className="text-2xl text-primary">Thanks! Your request has been sent to Martin.</h3><p className="mt-3 max-w-md text-muted-foreground">We’ll be in touch soon to help plan your Mazatlán adventure.</p><Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>Send another request</Button></div>;
  return <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
    <div><Label htmlFor="name">Name *</Label><Input id="name" name="name" required minLength={2} maxLength={100} className="mt-2 h-12 bg-background" /></div>
    <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required maxLength={255} className="mt-2 h-12 bg-background" /></div>
    <div><Label htmlFor="phone">Phone Number *</Label><Input id="phone" name="phone" type="tel" required minLength={7} maxLength={40} className="mt-2 h-12 bg-background" /></div>
    <div><Label htmlFor="requestedDate">Requested Tour Date *</Label><Input id="requestedDate" name="requestedDate" type="date" required min={new Date().toISOString().split("T")[0]} className="mt-2 h-12 bg-background" /></div>
    <div><Label htmlFor="partySize">Number in Party *</Label><Input id="partySize" name="partySize" type="number" required min={1} max={40} inputMode="numeric" className="mt-2 h-12 bg-background" /></div>
    <div><Label htmlFor="shipName">Ship Name (if applicable)</Label><Input id="shipName" name="shipName" maxLength={120} className="mt-2 h-12 bg-background" /></div>
    <div className="hidden" aria-hidden="true"><Label htmlFor="website">Website</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="sm:col-span-2"><Label htmlFor="questions">Questions / Special Requests</Label><Textarea id="questions" name="questions" maxLength={2000} className="mt-2 min-h-32 bg-background" /></div>
    {status === "error" && <p className="sm:col-span-2 rounded-md bg-destructive/10 p-3 text-sm font-bold text-destructive" role="alert">{message}</p>}
    <Button type="submit" variant="sunshine" size="lg" disabled={status === "sending"} className="h-13 rounded-full font-extrabold sm:col-span-2">{status === "sending" ? "SENDING…" : "REQUEST TOUR INFO"}<ChevronRight /></Button>
  </form>;
}

function Index() {
  const stops = [
    { title: "Lighthouse", note: "Optional", src: lighthouseImage, position: "center" },
    { title: "Liverpool Alley", note: "Colorful Beatles-inspired stop", src: liverpoolAsset.url, position: "center" },
    { title: "Cliff Divers Show", src: diversImage, position: "center" },
    { title: "Historic Center & Beautiful Cathedral", src: triptychImage, position: "third-left" },
    { title: "Municipal Market", src: triptychImage, position: "third-center" },
    { title: "Relax at a Stunning Beach", note: "Pool & resort access where available", src: triptychImage, position: "third-right" },
  ];
  return <main id="home"><Header />
    <section className="relative min-h-[680px] overflow-hidden md:min-h-[720px]">
      <img src={heroImage} alt="Open-air Mazatlán tour vehicle overlooking the coast at sunset" width="1920" height="1088" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="hero-shade absolute inset-0" />
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-5 py-16 sm:px-8 md:min-h-[720px]">
        <div className="max-w-2xl text-primary-foreground">
          <p className="font-script text-5xl font-bold md:text-7xl">Explore</p><h1 className="text-7xl leading-[.82] md:text-9xl">Mazatlán</h1>
          <p className="mt-5 text-sm font-extrabold uppercase tracking-[.2em] md:text-lg">With Cat’s Ride Mazatlan</p>
          <p className="mt-4 max-w-lg border-y border-primary-foreground/40 py-3 text-xs font-bold uppercase tracking-[.14em] md:text-sm">Local People • Real Experiences • Unforgettable Memories</p>
          <Button variant="sunshine" size="lg" className="mt-7 h-14 rounded-full px-8 font-extrabold" onClick={scrollToBooking}>Book Your Tour <ChevronRight /></Button>
          <p className="mt-8 max-w-sm font-script text-3xl leading-none md:text-4xl">More Than a Tour...<br />It’s a Mazatlán Experience!</p>
        </div>
      </div>
    </section>

    <section aria-label="Tour features" className="bg-background shadow-md"><div className="mx-auto grid max-w-7xl grid-cols-4 gap-2 px-3 py-5 md:grid-cols-7">{features.map(([Icon, label]) => <div key={label} className="flex flex-col items-center gap-2 text-center text-primary"><Icon className="h-7 w-7 md:h-9 md:w-9" /><span className="text-[10px] font-extrabold uppercase md:text-xs">{label}</span></div>)}</div></section>

    <section id="martin" className="py-16 md:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[.9fr_1.05fr_1fr] md:px-8">
      <div><p className="font-script text-6xl font-bold text-ocean">Welcome!</p><h2 className="text-4xl text-primary">I’m Martin.</h2><p className="mt-6 leading-7 text-muted-foreground">Hi! I’m Martin, your local guide and driver in Mazatlán. I’m passionate about sharing the beauty, culture, and hidden gems of my hometown. Whether it’s your first visit or you’re coming back, I’ll make sure you experience the real Mazatlán with great service, stunning spots, and a lot of fun!</p><p className="mt-6 font-script text-4xl text-primary">Martin</p><p className="text-xs font-extrabold tracking-[.2em] text-ocean">YOUR LOCAL GUIDE</p></div>
      <div className="relative"><img src={martinAsset.url} alt="Martin, local Cat’s Ride Mazatlan guide" width="768" height="768" loading="lazy" className="aspect-square w-full rounded-lg object-cover shadow-xl" /><div className="absolute -bottom-5 -left-3 rotate-[-5deg] rounded-md bg-sunshine px-5 py-3 text-center font-script text-2xl font-bold leading-5 text-sunshine-foreground shadow-lg">Good People<br />Great Tours<br />Mazatlán!</div></div>
      <div id="tours" className="ocean-wash rounded-lg p-7 text-primary-foreground shadow-xl md:p-9"><h2 className="text-3xl leading-tight">Why Choose<br />Cat’s Ride Mazatlan?</h2><ul className="mt-6 space-y-3">{["Fully private tours", "Itinerary can be customized to your interests", "The right vehicle for your group", "No deposit required", "Pay only at the end of the tour", "Flexible tour lengths", "Capacity: 1–4 people per car"].map(x => <li key={x} className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sunshine text-sunshine-foreground"><Check className="h-3.5 w-3.5" /></span><span>{x}</span></li>)}</ul><p className="mt-7 text-right font-script text-3xl text-sunshine">Personal Tours.<br />Real Connections.</p></div>
    </div></section>

    <section id="stops" className="bg-secondary py-16 md:py-20"><div className="mx-auto max-w-7xl px-5 md:px-8"><div className="text-center"><h2 className="text-4xl text-primary md:text-5xl">Popular Stops on Our Tour</h2><p className="mt-2 text-xs font-extrabold uppercase tracking-[.2em] text-ocean">A flexible itinerary designed around you</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{stops.map((stop) => <article key={stop.title} className="overflow-hidden rounded-lg bg-card shadow-lg"><div className="relative aspect-[4/3] overflow-hidden">{stop.position.startsWith("third") ? <img src={stop.src} alt={`${stop.title} in Mazatlán`} width="1920" height="768" loading="lazy" className={`absolute top-0 h-full max-w-none object-cover ${stop.position === "third-left" ? "left-0 w-[300%]" : stop.position === "third-center" ? "-left-full w-[300%]" : "-left-[200%] w-[300%]"}`} /> : <img src={stop.src} alt={`${stop.title} in Mazatlán`} width="1024" height="768" loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105" />}</div><div className="min-h-24 p-5 text-center"><h3 className="text-xl text-primary">{stop.title}</h3>{stop.note && <p className="mt-1 text-sm text-muted-foreground">{stop.note}</p>}</div></article>)}</div></div></section>

    <section className="grid md:grid-cols-2"><div className="ocean-wash flex min-h-96 items-center px-6 py-16 text-primary-foreground md:px-[10vw]"><div><Sparkles className="mb-5 h-10 w-10 text-sunshine" /><h2 className="text-4xl md:text-5xl">Custom Tours for<br />Your Interests</h2><p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/85">Enjoy time for lunch, optional tequila tasting, colorful Mazatlán stops, beaches, sightseeing, shopping, and plenty of opportunities for photos. Your itinerary can be customized around your interests and available time.</p></div></div><div className="sunset-wash grid min-h-96 lg:grid-cols-[.82fr_1.18fr]"><div className="flex items-center px-6 py-12 lg:pl-10 lg:pr-7"><div><GlassWater className="mb-5 h-10 w-10 text-primary" /><h2 className="text-4xl text-primary md:text-5xl">Sip, Relax & Enjoy</h2><p className="mt-6 max-w-xl text-lg leading-8 text-primary/80">We also offer drinks including water, sodas, Pacifico beer and local tequila.</p></div></div><img src={drinksImage} alt="Cooler filled with iced Coca-Cola, Pacifico beer, and local tequila on a Mazatlán beach" width="1536" height="1024" loading="lazy" className="h-full min-h-72 w-full object-cover" /></div></section>

    <section id="booking" className="bg-background py-16 md:py-24"><div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-[.75fr_1.25fr] md:px-8"><div><p className="font-script text-4xl font-bold text-ocean">Let’s plan your day</p><h2 className="mt-1 text-5xl leading-tight text-primary">Plan Your Mazatlán Adventure</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">Tell us about your visit and Martin will get back to you with tour information and a quote.</p><div className="mt-10 space-y-5"><a href="tel:+016691647788" className="flex items-center gap-4 font-bold text-primary"><span className="rounded-full bg-sunshine p-3"><Phone /></span><span><small className="block text-muted-foreground">PHONE</small>+01 6691647788</span></a><a href="mailto:bookings@catsridemazatlan.com" className="flex items-center gap-4 break-all font-bold text-primary"><span className="rounded-full bg-ocean p-3 text-ocean-foreground"><Mail /></span><span><small className="block text-muted-foreground">EMAIL</small>bookings@catsridemazatlan.com</span></a><a href={facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 font-bold text-primary"><span className="rounded-full bg-primary p-3 text-primary-foreground"><Facebook /></span><span><small className="block text-muted-foreground">FACEBOOK</small>Cat’s Ride Mazatlan</span></a></div></div><div className="rounded-lg border border-border bg-secondary p-5 shadow-xl sm:p-8"><BookingForm /></div></div></section>

    <section id="faq" className="bg-secondary py-16"><div className="mx-auto max-w-4xl px-5 text-center"><h2 className="text-4xl text-primary">Good to Know</h2><div className="mt-8 grid gap-4 text-left md:grid-cols-3">{[["Is the tour private?", "Yes. Every tour is private for your group."], ["Can we customize it?", "Absolutely. Martin adapts the itinerary to your interests and available time."], ["Do I need a deposit?", "No deposit is required. Pay only at the end of the tour."]].map(([q,a]) => <div className="rounded-lg bg-card p-6 shadow-sm" key={q}><h3 className="text-lg text-primary">{q}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{a}</p></div>)}</div></div></section>

    <section className="relative overflow-hidden bg-primary px-5 py-14 text-center text-primary-foreground"><div className="absolute inset-x-0 bottom-0 h-1 bg-ocean" /><h2 className="text-4xl md:text-5xl">Ready to Explore Mazatlán?</h2><p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Send Martin a message and let’s plan your Mazatlán adventure!</p><Button variant="sunshine" size="lg" className="mt-7 h-14 rounded-full px-8 font-extrabold" onClick={scrollToBooking}>Book Your Tour Now <ChevronRight /></Button></section>

    <footer className="bg-background py-12"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 text-center md:grid-cols-3 md:px-8"><img src={logoAsset.url} alt="Cat’s Ride Mazatlan logo" width="260" height="170" loading="lazy" className="mx-auto h-24 w-auto" /><div className="space-y-2 text-sm"><p className="flex items-center justify-center gap-2"><MapPin className="h-4 w-4 text-ocean" />Mazatlán, Sinaloa, Mexico</p><a className="block font-bold text-primary" href="tel:+016691647788">+01 6691647788</a><a className="block font-bold text-primary" href="mailto:bookings@catsridemazatlan.com">bookings@catsridemazatlan.com</a><a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Cat’s Ride Mazatlan on Facebook" className="mx-auto mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><Facebook /></a></div><div><p className="font-script text-4xl text-primary">Mazatlán<br />Always a Good Idea</p></div></div><div className="mx-auto mt-8 max-w-7xl border-t border-border px-5 pt-6 text-center text-[10px] font-extrabold uppercase tracking-[.3em] text-muted-foreground">People • Places • Good Times</div></footer>
    <Button variant="sunshine" className="fixed bottom-4 right-4 z-40 h-12 rounded-full px-5 font-extrabold shadow-xl md:hidden" onClick={scrollToBooking}><Anchor /> Book Tour</Button>
  </main>;
}
