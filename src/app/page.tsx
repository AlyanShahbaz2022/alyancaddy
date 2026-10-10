import { getContent } from "@/lib/getContent";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Cta from "@/components/sections/Cta";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MarqueeBand from "@/components/sections/MarqueeBand";
import Navbar from "@/components/layout/Navbar";
import Portfolio from "@/components/sections/Portfolio";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";

// Always render on each request so admin edits (stored in the DB) appear
// immediately without waiting on static-cache revalidation.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Navbar
        logo={content.nav.logo}
        logoImage={content.nav.logoImage}
        links={content.nav.links}
        hire={content.nav.hire}
        documents={content.documents}
      />
      <main>
        <Hero
          hero={content.hero}
          socials={content.socials}
          name={content.site.name}
        />
        <Stats stats={content.stats} />
        <About about={content.about} />
        <Services services={content.services} />
        <Portfolio portfolio={content.portfolio} />
        <MarqueeBand items={content.marquee.items} />
        <Faq faqs={content.faqs} />
        <Cta cta={content.cta} />
        <Contact
          contact={content.contact}
          socials={content.socials}
        />
      </main>
      <Footer
        footer={content.footer}
        nav={content.nav}
        socials={content.socials}
        brandDisplay={content.site.brandDisplay}
      />
    </>
  );
}