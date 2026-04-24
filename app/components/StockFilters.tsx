"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FilterOptions = {
  categories: string[];
  brands: string[];
  formats: string[];
  locations: string[];
  statuses: string[];
};

type Selected = {
  category: string[];
  brand: string[];
  format: string[];
  status: string[];
  location: string[];
};

type Labels = {
  all: string;
  reset: string;
  category: string;
  brand: string;
  location: string;
  status: string;
};

type Props = {
  options: FilterOptions;
  selected: Selected;
  labels: Labels;
  lang: string;
};

export default function StockFilters({
  options, selected, labels, lang,
}: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    location: true,
    status: true,
  });

  function toggleSection(key: string) {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function toggleFilterValue(
    key: string,
    value: string,
    current: string[]
  ) {
    const params = new URLSearchParams();
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (selected.category.length && key !== "category")
      selected.category.forEach((v) => params.append("category", v));
    if (selected.brand.length && key !== "brand")
      selected.brand.forEach((v) => params.append("brand", v));
    if (selected.location.length && key !== "location")
      selected.location.forEach((v) => params.append("location", v));
    if (selected.status.length && key !== "status")
      selected.status.forEach((v) => params.append("status", v));

    next.forEach((v) => params.append(key, v));
    router.push(`/${lang}/stock-list?${params.toString()}`);
  }

  function resetAll() {
    router.push(`/${lang}/stock-list`);
  }

  const hasActive =
    selected.category.length > 0 ||
    selected.brand.length > 0 ||
    selected.location.length > 0 ||
    selected.status.length > 0;

  function renderSection(
    key: "category" | "brand" | "location" | "status",
    label: string,
    items: string[],
    current: string[]
  ) {
    if (items.length === 0) return null;
    const isOpen = openSections[key];

    return (
      <div className="filter-section" key={key}>
        <button
          className="filter-section-header"
          onClick={() => toggleSection(key)}
        >
          <span className="filter-section-label">{label}</span>
          <span className={`filter-section-arrow${isOpen ? " filter-section-arrow--open" : ""}`}>
            ›
          </span>
        </button>
        {isOpen && (
          <div className="filter-section-body">
            <button
              className={`pill ${current.length === 0 ? "pill--all-active" : ""}`}
              onClick={() => {
                const params = new URLSearchParams();
                if (key !== "category")
                  selected.category.forEach((v) => params.append("category", v));
                if (key !== "brand")
                  selected.brand.forEach((v) => params.append("brand", v));
                if (key !== "location")
                  selected.location.forEach((v) => params.append("location", v));
                if (key !== "status")
                  selected.status.forEach((v) => params.append("status", v));
                router.push(`/${lang}/stock-list?${params.toString()}`);
              }}
            >
              {labels.all}
            </button>
            {items.map((item) => (
              <button
                key={item}
                className={`pill ${current.includes(item) ? "pill--active" : ""}`}
                onClick={() => toggleFilterValue(key, item, current)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const filterContent = (
    <>
      {renderSection("category", labels.category, options.categories, selected.category)}
      {renderSection("brand", labels.brand, options.brands, selected.brand)}
      {renderSection("location", labels.location, options.locations, selected.location)}
      {renderSection("status", labels.status, options.statuses, selected.status)}
      <button className="filters-reset-btn" onClick={resetAll}>
        {labels.reset}
      </button>
    </>
  );

  return (
    <>
      {/* Мобильная кнопка */}
      <button
        className={`filters-mobile-toggle${hasActive ? " filters-mobile-toggle--active" : ""}`}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span>Filters{hasActive ? " •" : ""}</span>
        <span>{mobileOpen ? "✕" : "▼"}</span>
      </button>

      {/* Десктоп панель */}
      <div className="filters-panel filters-panel--desktop">
        {filterContent}
      </div>

      {/* Мобильная панель */}
      {mobileOpen && (
        <div className="filters-panel filters-panel--mobile">
          {filterContent}
        </div>
      )}
    </>
  );
}
