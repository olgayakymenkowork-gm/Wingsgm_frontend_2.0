"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HomeSections.module.css";

type SliderImage = { url: string; alt: string };

type SliderItem = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  link?: string | null;
  isNew?: boolean;
  image: SliderImage | null;
};

type Machine = {
  id: number;
  slug: string;
  title: string;
  brand?: string;
  year?: string | number;
  machine_status?: string;
  cardImage?: SliderImage;
  images: SliderImage[];
};

type HeroSliderProps = {
  items: SliderItem[];
  machines?: Machine[];
  lang?: string;
};

export default function HeroSlider({
  items,
  machines = [],
  lang = "en",
}: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const machineSlides: SliderItem[] = machines
    .slice(0, 3)
    .map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: [m.brand, m.year, m.machine_status]
        .filter(Boolean)
        .join(" · "),
      link: `/${lang}/machine/${m.slug}`,
      isNew: true,
      image: m.cardImage || m.images?.[0] || null,
    }));

  const slides: SliderItem[] = [
    ...(items || []),
    ...machineSlides,
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goTo = (index: number) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setActiveIndex(index);
  };

  if (!slides || slides.length === 0) {
    return (
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          <div className={styles.heroPlaceholder} />
        </div>
      </section>
    );
  }

  const active = slides[activeIndex];

  const sliderContent = (
    <div className={styles.heroSlider}>
      {active.image ? (
        <img
          src={active.image.url}
          alt={active.image.alt}
          className={styles.heroImage}
        />
      ) : (
        <div className={styles.heroPlaceholder} />
      )}

      {(active.title || active.subtitle) && (
        <div className={styles.heroTextOverlay}>
          <div className={styles.heroTextInner}>
{active.subtitle && (() => {
              const parts = (active.subtitle || '').split(' · ');
              const status = parts.find(p =>
                ['available', 'reserved', 'sold'].includes(p.toLowerCase())
              );
              const badgeClass = status?.toLowerCase() === 'available'
                ? styles.heroOverlayBadgeAvailable
                : status?.toLowerCase() === 'reserved'
                ? styles.heroOverlayBadgeReserved
                : status?.toLowerCase() === 'sold'
                ? styles.heroOverlayBadgeSold
                : null;
              return badgeClass && status ? (
                <div className={`${styles.heroOverlayBadge} ${badgeClass}`}>
                  {status}
                </div>
              ) : null;
            })()}
            {active.title && (
              <h2 className={styles.heroOverlayTitle}>
                {active.title}
              </h2>
            )}
            {active.subtitle && (
              <p className={styles.heroOverlaySubtitle}>
                {(active.subtitle || '')
                  .split(' · ')
                  .filter(p => !['available', 'reserved', 'sold'].includes(p.toLowerCase()))
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={styles.heroArrowLeft}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(activeIndex - 1);
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.heroArrowRight}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(activeIndex + 1);
            }}
            aria-label="Next"
          >
            ›
          </button>
          <div className={styles.heroDots}>
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={
                  index === activeIndex
                    ? `${styles.heroDot} ${styles.heroDotActive}`
                    : styles.heroDot
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <section className={styles.hero}>
      <div className="container">
        {active.link ? (
          <Link href={active.link} className={styles.heroLinkWrapper}>
            {sliderContent}
          </Link>
        ) : (
          sliderContent
        )}
      </div>
    </section>
  );
}
