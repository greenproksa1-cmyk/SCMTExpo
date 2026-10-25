import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { isLocale } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Introduction } from '@/components/Introduction';
import { ImportanceSection } from '@/components/ImportanceSection';
import { TimingSection } from '@/components/TimingSection';
import { Objectives } from '@/components/Objectives';
import { ExhibitorEcosystem } from '@/components/ExhibitorEcosystem';
import { TargetVisitors } from '@/components/TargetVisitors';
import { WhyExhibit } from '@/components/WhyExhibit';
import { BusinessValue } from '@/components/BusinessValue';
import { EventExperience } from '@/components/EventExperience';
import { PartnersSection } from '@/components/PartnersSection';
import { LocationSection } from '@/components/LocationSection';
import { RegistrationSection } from '@/components/RegistrationSection';
import { Footer } from '@/components/Footer';
import { FloatingActions } from '@/components/FloatingActions';
import { ChapterRail } from '@/components/ChapterRail';
import { PageLoader } from '@/components/PageLoader';
/**
 * The whole landing page for one locale. Rendered by the `/ar` and `/en`
 * routes so each can be statically generated with its own `<html lang dir>`.
 */
export function LandingPage({ locale: raw }: { locale: string }) {
  if (!isLocale(raw)) notFound();

  const dict = getDictionary(raw);

  return (
    <>
      <PageLoader dict={dict} locale={raw} />
      <Header locale={raw} dict={dict} />
      <ChapterRail dict={dict} />

      <main id="main">
        <Hero locale={raw} dict={dict} />

        <ImportanceSection locale={raw} dict={dict} />
        <TimingSection locale={raw} dict={dict} />

        <Objectives locale={raw} dict={dict} />

        <ExhibitorEcosystem locale={raw} dict={dict} />
        <TargetVisitors locale={raw} dict={dict} />
        <WhyExhibit locale={raw} dict={dict} />
        <BusinessValue locale={raw} dict={dict} />
        <EventExperience locale={raw} dict={dict} />
        <PartnersSection locale={raw} dict={dict} />
        <RegistrationSection locale={raw} dict={dict} />
      </main>

      <Footer locale={raw} dict={dict} />
      <FloatingActions locale={raw} dict={dict} phoneRaw={dict.organizer.phoneRaw} />
    </>
  );
}