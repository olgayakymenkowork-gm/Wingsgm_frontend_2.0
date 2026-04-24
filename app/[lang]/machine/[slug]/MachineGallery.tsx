"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./MachinePage.module.css";

type MachineImage = { url: string };
type Props = { images: MachineImage[]; title: string };

export default function MachineGallery({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!images || images.length === 0) {
    return <div className={styles.noImage}>No images available</div>;
  }

  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const goPrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null ||
        touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div className={styles.gallery}>
        <div
          className={styles.mainImageWrapper}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[activeIndex].url}
            alt={`${title} ${activeIndex + 1}`}
            className={styles.mainImage}
            onClick={() => setLightbox(true)}
            style={{ cursor: "zoom-in" }}
          />

          {hasMultiple && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0, 0, 0, 0.55)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '20px',
              zIndex: 5,
              letterSpacing: '0.04em',
            }}>
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {hasMultiple && (
            <>
              <button
                type="button"
                className={`${styles.galleryNavButton} ${styles.galleryNavButtonLeft}`}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous"
              >‹</button>
              <button
                type="button"
                className={`${styles.galleryNavButton} ${styles.galleryNavButtonRight}`}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next"
              >›</button>

              <div className={styles.galleryDots}>
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={
                      idx === activeIndex
                        ? `${styles.galleryDot} ${styles.galleryDotActive}`
                        : styles.galleryDot
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    aria-label={`Image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(false)}
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >✕</button>

          {hasMultiple && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNavLeft}`}
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >‹</button>
          )}

          <img
            src={images[activeIndex].url}
            alt={`${title} ${activeIndex + 1}`}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />

          {hasMultiple && (
            <button
              className={`${styles.lightboxNav} ${styles.lightboxNavRight}`}
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >›</button>
          )}

          {hasMultiple && (
            <div className={styles.lightboxCounter}>
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
