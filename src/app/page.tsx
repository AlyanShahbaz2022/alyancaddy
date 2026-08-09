import { getContent } from "@/lib/getContent";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Navbar
        logo={content.nav.logo}
        links={content.nav.links}
        hire={content.nav.hire}
      />
      <main className="min-h-screen" />
      <Footer
        footer={content.footer}
        nav={content.nav}
        socials={content.socials}
        brandDisplay={content.site.brandDisplay}
      />
    </>
  );
}
