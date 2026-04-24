"use client";

import { useState } from "react";
import styles from "./MachinePage.module.css";

type Props = {
  machineId: string;
  machineTitle: string;
  dict: any;
  lang: string;
};

export default function MachineRequestForm({ machineId, machineTitle, dict, lang }: Props) {
  const [form, setForm] = useState({
    contactName: "",
    companyName: "",
    country: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, machineId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || dict.errorMsg);
      }

      setStatus("success");
      setForm({ contactName: "", companyName: "", country: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || dict.errorMsg);
      setStatus("error");
    }
  }

  return (
    <div className={styles.formCard}>
      <h3 className={styles.sectionTitle}>{dict.formTitle}</h3>
      <p className={styles.formIntro}>
        {dict.formIntro} <strong>{machineTitle}</strong> {dict.formIntroEnd}
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>{dict.fieldContactName}</span>
          <input name="contactName" value={form.contactName} onChange={handleChange} required />
        </label>

        <label className={styles.field}>
          <span>{dict.fieldCompanyName}</span>
          <input name="companyName" value={form.companyName} onChange={handleChange} />
        </label>

        <label className={styles.field}>
          <span>{dict.fieldCountry}</span>
          <input name="country" value={form.country} onChange={handleChange} />
        </label>

        <label className={styles.field}>
          <span>{dict.fieldPhone}</span>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </label>

        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span>{dict.fieldEmail}</span>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className={`${styles.field} ${styles.fullWidth}`}>
          <span>{dict.fieldMessage}</span>
          <textarea name="message" rows={4} value={form.message} onChange={handleChange} />
        </label>

        <div className={`${styles.fullWidth} ${styles.statusRow}`}>
          {error && <p className={styles.formError}>{error}</p>}
        </div>

        {status === "success" && (
          <div className={styles.fullWidth} style={{
            padding: '20px',
            borderRadius: '8px',
            background: '#f0faf4',
            border: '1px solid #bbf7d0',
            textAlign: 'center',
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '20px',
              color: '#fff',
            }}>✓</div>
            <p style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#15803d',
              margin: '0 0 4px',
            }}>{dict.successMsg}</p>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              margin: 0,
            }}>
              {lang === 'de'
                ? 'Wir melden uns so schnell wie möglich.'
                : 'We will get back to you as soon as possible.'}
            </p>
          </div>
        )}

        <div className={`${styles.fullWidth} ${styles.buttonRow}`}>
          <button type="submit" className={styles.submitButton} disabled={status === "loading" || status === "success"}>
            {status === "loading" ? dict.buttonSending : dict.buttonSend}
          </button>
        </div>
      </form>
    </div>
  );
}
