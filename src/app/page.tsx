import { getContent } from "@/lib/getContent";
import About from "@/components/sections/About";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Navbar from "@/components/layout/Navbar";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Navbar
        logo={content.nav.logo}
        links={content.nav.links}
        hire={content.nav.hire}
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