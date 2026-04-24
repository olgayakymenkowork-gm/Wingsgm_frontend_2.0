import styles from "./HomeSections.module.css";

type GalleryImage = {
  url: string;
  alt: string;
};

type GalleryItem = {
  id: number;
  title: string;
  image: GalleryImage;
};

type GalleryStripProps = {
  items: GalleryItem[];
};

export default function GalleryStrip({ items }: GalleryStripProps) {
  if (!items || items.length === 0) return null;

  const five = items.slice(0, 5);

  return (
    <section className={styles.gallerySection}>
      <div className="container">
        <div className={styles.galleryGrid}>
          {five.map((item, index) => {
            let tileClass = styles.galleryTile;

            if (index === 0) tileClass += ` ${styles.galleryTileA}`;
            if (index === 1) tileClass += ` ${styles.galleryTileB}`;
            if (index === 2) tileClass += ` ${styles.galleryTileC}`;
            if (index === 3) tileClass += ` ${styles.galleryTileD}`;
            if (index === 4) tileClass += ` ${styles.galleryTileE}`;

            return (
              <div key={item.id} className={tileClass}>
                <img src={item.image.url} alt={item.image.alt} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
