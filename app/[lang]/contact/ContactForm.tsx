'use client';

import { useState } from 'react';
import styles from './ContactPage.module.css';

type FormState = {
  name: string;
  company: string;
  country: string;
  phone: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  company: '',
  country: '',
  phone: '',
  email: '',
  message: '',
};

type Props = {
  dict: any;
};

export default function ContactForm({ dict }: Props) {
  const [values, setValues] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | 'ok' | 'error'>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const payload = {
        contact_name: values.name,
        company_name: values.company,
        country: values.country,
        phone: values.phone,
        email: values.email,
        message: values.message,
      };

      const res = await fetch('/api/leads/contact-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('[ContactForm] API error', res.status, text);
        throw new Error('Request failed');
      }

      setStatus('ok');
      setValues(initialState);
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>{dict.formTitle}</h2>
      <p className={styles.formSubtitle}>{dict.formSubtitle}</p>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="name">
            {dict.fieldName}
          </label>
          <input
            id="name"
            name="name"
            className={styles.formInput}
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="company">
            {dict.fieldCompany}
          </label>
          <input
            id="company"
            name="company"
            className={styles.formInput}
            value={values.company}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="country">
            {dict.fieldCountry}
          </label>
          <input
            id="country"
            name="country"
            className={styles.formInput}
            value={values.country}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="phone">
            {dict.fieldPhone}
          </label>
          <input
            id="phone"
            name="phone"
            className={styles.formInput}
            value={values.phone}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formLabel} htmlFor="email">
            {dict.fieldEmail}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className={styles.formInput}
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel} htmlFor="message">
          {dict.fieldMessage}
        </label>
        <textarea
          id="message"
          name="message"
          className={styles.formTextarea}
          rows={5}
          value={values.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.formButton}
          disabled={submitting}
        >
          {submitting ? dict.buttonSending : dict.buttonSend}
        </button>

        {status === 'ok' && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '8px',
            background: '#f0faf4',
            border: '1px solid #bbf7d0',
            marginTop: '4px',
            flex: 1,
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#fff',
              flexShrink: 0,
            }}>✓</div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#15803d',
                margin: '0 0 3px',
              }}>{dict.statusOk}</p>
              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {dict.statusSub || 'We will get back to you shortly.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: '16px',
                padding: '0',
                lineHeight: 1,
                flexShrink: 0,
              }}
              aria-label="Close"
            >✕</button>
          </div>
        )}
        {status === 'error' && (
          <p className={styles.formStatusError}>{dict.statusError}</p>
        )}
      </div>
    </form>
  );
}
