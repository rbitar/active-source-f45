import type { Metadata } from 'next';
import Cover from '@/components/cover';
import CollectionCarousel from '@/components/collection-carousel';

export const metadata: Metadata = {
  title: 'F45 Training Merch',
  description:
    'F45 has partnered with Active Source Lab, an on-demand platform for all your merchandising needs.',
  icons: {
    icon: 'https://sb.frontend.co/storage/v1/object/public/app/projects/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/images/f45-logo.ico',
  },
};

export default function Page() {
  return (
    <>
      {/* Hero */}
      <Cover
        imageUrl="https://sb.frontend.co/storage/v1/object/public/app/projects/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/images/HERO_1.jpg"
        title="Customize your merch for your F45 community"
        description="Explore our full collection of products, ranging from essentials to premium offerings, all in one place."
        buttons={[
          {
            label: "Shop Men's",
            href: '/shop/collections/f45-mens',
            variant: 'outline',
          },
          {
            label: "Shop Women's",
            href: '/shop/collections/f45-womens',
            variant: 'outline',
          },
        ]}
      />

      {/* Featured Products */}
      <CollectionCarousel
        collectionHandle="featured-products"
        title="Featured Products"
        showViewAll={true}
        itemsPerPage={20}
      />

      {/* New Collection Banner */}
      <Cover
        imageUrl="https://sb.frontend.co/storage/v1/object/public/app/projects/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/images/HERO_2.jpg"
        label="Discover"
        title="The Exclusive F45 x HYROX Collection"
        description=""
        buttons={[
          {
            label: 'Shop Now',
            href: '/shop/collections/hyrox',
            variant: 'outline',
          },
        ]}
      />

      {/* Hyrox */}
      <CollectionCarousel
        collectionHandle="hyrox"
        title="Hyrox"
        label="New Arrivals"
        showViewAll={true}
        itemsPerPage={20}
      />

      {/* F45 Logo Stamp Banner */}
      <Cover
        imageUrl="https://sb.frontend.co/storage/v1/object/public/app/projects/14dcacdd-5e00-4ff0-ae0f-56db1ae58bd6/images/HERO_3.jpg"
        label="Explore Collection"
        title="The F45 Logo Stamp"
        description="Core. Classic. Designed for every rep, every run and all movement in between."
        buttons={[
          {
            label: 'Shop Now',
            href: '/shop/collections/logo-stamp',
            variant: 'outline',
          },
        ]}
      />

      {/* Men — F45 Logo Stamp */}
      <CollectionCarousel
        collectionHandle="f45-mens"
        title="F45 Logo Stamp"
        label="Men"
        showViewAll={true}
        itemsPerPage={20}
      />

      {/* Women — F45 Logo Stamp */}
      <CollectionCarousel
        collectionHandle="f45-womens"
        title="F45 Logo Stamp"
        label="Women"
        showViewAll={true}
        itemsPerPage={20}
      />

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
          Can&apos;t Find What You&apos;re Looking For?
        </h2>
        <p className="text-lg text-[#2e2e2e] max-w-2xl mx-auto leading-relaxed">
          We&apos;re here to help. For any questions, email us at{' '}
          <a
            href="mailto:F45@activesourcelab.com"
            className="underline hover:text-black transition-colors"
          >
            F45@activesourcelab.com
          </a>{' '}
          and our team will get back to you as soon as possible.
        </p>
      </section>
    </>
  );
}
