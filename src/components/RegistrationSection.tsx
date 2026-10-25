'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/types';
import { cn } from '@/lib/cn';
import { Section, SectionTitle } from './ui/Section';
import { Reveal } from './ui/Motion';

type FormMode = 'exhibit' | 'visitor';
type Status = 'idle' | 'sending' | 'success' | 'error';

type Values = Record<string, string>;
type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

function Field({
  id,
  label,
  error,
  children,
  hint,
  required,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-sm font-semibold text-body">
        {label}
        {required && (
          <span className="ms-1 text-orange-300" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && <p className="text-label-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-label-sm font-medium text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3 text-body-md text-strong outline-none transition-all duration-300 placeholder:text-muted focus:ring-4 focus:ring-orange-500/15';

function inputClass(hasError: boolean) {
  return cn(
    inputBase,
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-navy-100 focus:border-orange-500',
  );
}

/**
 * Native select with a custom chevron. The arrow is positioned with logical
 * utilities so it flips automatically when the document direction is RTL.
 */
const SELECT_CHEVRON = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231B4F8A' stroke-width='2.4' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
} as const;

function selectClass(hasError: boolean) {
  return cn(
    inputClass(hasError),
    'appearance-none bg-[length:1.1rem] pe-9',
    '[background-position:left_0.9rem_center]',
    'rtl:[background-position:right_0.9rem_center]',
  );
}

export function RegistrationSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [mode, setMode] = useState<FormMode>('exhibit');
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const reduce = useReducedMotion();

  const isAr = locale === 'ar';
  const v = dict.register.validation;

  const exhibitFields = useMemo(
    () => dict.register.exhibit.fields,
    [dict.register.exhibit.fields],
  );
  const visitorFields = useMemo(
    () => dict.register.visitor.fields,
    [dict.register.visitor.fields],
  );
  const placeholdersEx = dict.register.exhibit.placeholders;
  const placeholdersVisitor = dict.register.visitor.placeholders;
  const placeholders = mode === 'exhibit' ? placeholdersEx : placeholdersVisitor;

  const sectorOptions = dict.sectors.items;
  const categoryOptions = dict.visitors.subCategories.items;

  function setValue(name: string, next: string) {
    setValues((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const clone = { ...prev };
      delete clone[name];
      return clone;
    });
  }

  function validate(): Errors {
    const next: Errors = {};
    const require = (name: string, label: string, min = 2) => {
      const raw = (values[name] ?? '').trim();
      if (!raw) next[name] = `${label} — ${v.required}`;
      else if (raw.length < min) next[name] = v.minLength.replace('{n}', String(min));
    };

    if (mode === 'exhibit') {
      const f = exhibitFields;
      require('company', f.company);
      require('contact', f.contact);
      require('jobTitle', f.jobTitle);
      require('email', f.email);
      require('phone', f.phone);
      require('sector', f.sector);
      require('boothSize', f.boothSize);
    } else {
      const f = visitorFields;
      require('name', f.name);
      require('company', f.company);
      require('email', f.email);
      require('phone', f.phone);
      require('category', f.category);
    }

    const emailLabel = mode === 'exhibit' ? exhibitFields.email : visitorFields.email;
    const phoneLabel = mode === 'exhibit' ? exhibitFields.phone : visitorFields.phone;

    const email = (values.email ?? '').trim();
    if (email && !EMAIL_RE.test(email)) next.email = `${emailLabel} — ${v.email}`;

    const phone = (values.phone ?? '').trim();
    if (phone && !PHONE_RE.test(phone)) next.phone = `${phoneLabel} — ${v.phone}`;

    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          locale,
          submittedAt: new Date().toISOString(),
          data: values,
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setStatus('success');
      setValues({});
    } catch {
      setStatus('error');
    }
  }

  function switchMode(next: FormMode) {
    setMode(next);
    setValues({});
    setErrors({});
    setStatus('idle');
  }

  const success = status === 'success';

  return (
    <Section
      id="register"
      tone="dark"
      labelledBy="register-title"
      containerClassName="shell"
      className="overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-25">
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-navy-900/70 to-navy-900"
      />

      <SectionTitle
        eyebrow={dict.register.eyebrow}
        eyebrowEn={dict.register.eyebrowEn}
        title={dict.register.title}
        lead={dict.register.lead}
        tone="dark"
        titleId="register-title"
        align="center"
        className="mx-auto max-w-3xl"
      />

      {/* Mode tabs */}
      <Reveal className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label={dict.register.title}
          className="inline-flex rounded-full border border-white/12 bg-white/[0.05] p-1 backdrop-blur-sm"
        >
          {(['exhibit', 'visitor'] as FormMode[]).map((tab) => {
            const selected = mode === tab;
            const label = isAr ? dict.register.tabs[tab] : dict.register.tabs[`${tab}En` as 'exhibitEn' | 'visitorEn'];
            return (
              <button
                key={tab}
                role="tab"
                type="button"
                id={`tab-${tab}`}
                aria-selected={selected}
                aria-controls="registration-panel"
                onClick={() => switchMode(tab)}
                className={cn(
                  'relative rounded-full px-6 py-2.5 text-body-xs font-semibold transition-colors duration-300',
                  selected ? 'text-white' : 'text-muted hover:text-white',
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="register-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-orange-500"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Panel */}
      <Reveal delay={0.06} className="mx-auto mt-8 max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 px-6 py-5 sm:px-8">
            <div>
              <h3 className="font-display text-body-lg font-bold text-white">
                {mode === 'exhibit' ? dict.register.exhibit.title : dict.register.visitor.title}
              </h3>
              <p className="mt-0.5 text-body-xs text-muted">
                {mode === 'exhibit' ? dict.register.exhibit.subtitle : dict.register.visitor.subtitle}
              </p>
            </div>
            <span className="text-label-2xs font-semibold uppercase tracking-[0.16em] text-orange-400">
              {dict.organizer.nameEn}
            </span>
          </div>

          <div
            id="registration-panel"
            role="tabpanel"
            aria-labelledby={`tab-${mode}`}
            className="px-6 py-7 sm:px-8"
          >
            {/* Both the confirmation and the tab switch render immediately: neither is
                allowed to wait on an exit animation to finish. */}
              {success ? (
                <motion.div
                  key="success"
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-green-brand/20 text-green-brand"
                    aria-hidden="true"
                  >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m4 12.5 5.5 5.5L20 6" />
                    </svg>
                  </span>
                  <h4 className="font-display text-display-sm font-bold text-white">
                    {dict.register.status.successTitle}
                  </h4>
                  <p className="max-w-md text-body-sm text-body">
                    {dict.register.status.success}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="btn-ghost-light mt-2"
                  >
                    {isAr ? 'إرسال طلب آخر' : 'Submit another request'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key={mode}
                  onSubmit={onSubmit}
                  noValidate
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  {Object.keys(errors).length > 0 && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-body-xs font-medium text-red-300"
                    >
                      {v.summary}
                    </p>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {mode === 'exhibit' ? (
                      <>
                        <Field id="company" label={exhibitFields.company} error={errors.company} required>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={values.company ?? ''}
                            onChange={(e) => setValue('company', e.target.value)}
                            placeholder={placeholdersEx.company}
                            aria-invalid={Boolean(errors.company)}
                            aria-describedby={errors.company ? 'company-error' : undefined}
                            className={inputClass(Boolean(errors.company))}
                          />
                        </Field>

                        <Field id="contact" label={exhibitFields.contact} error={errors.contact} required>
                          <input
                            id="contact"
                            name="contact"
                            type="text"
                            value={values.contact ?? ''}
                            onChange={(e) => setValue('contact', e.target.value)}
                            placeholder={placeholdersEx.contact}
                            aria-invalid={Boolean(errors.contact)}
                            aria-describedby={errors.contact ? 'contact-error' : undefined}
                            className={inputClass(Boolean(errors.contact))}
                          />
                        </Field>

                        <Field id="jobTitle" label={exhibitFields.jobTitle} error={errors.jobTitle} required>
                          <input
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            value={values.jobTitle ?? ''}
                            onChange={(e) => setValue('jobTitle', e.target.value)}
                            placeholder={placeholders.jobTitle}
                            aria-invalid={Boolean(errors.jobTitle)}
                            aria-describedby={errors.jobTitle ? 'jobTitle-error' : undefined}
                            className={inputClass(Boolean(errors.jobTitle))}
                          />
                        </Field>

                        <Field id="email" label={exhibitFields.email} error={errors.email} required>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            dir="ltr"
                            inputMode="email"
                            autoComplete="email"
                            value={values.email ?? ''}
                            onChange={(e) => setValue('email', e.target.value)}
                            placeholder="name@company.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={cn(inputClass(Boolean(errors.email)), 'force-ltr text-start')}
                          />
                        </Field>

                        <Field id="phone" label={exhibitFields.phone} error={errors.phone} required>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            dir="ltr"
                            inputMode="tel"
                            autoComplete="tel"
                            value={values.phone ?? ''}
                            onChange={(e) => setValue('phone', e.target.value)}
                            placeholder={placeholders.phone}
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'phone-error' : undefined}
                            className={cn(inputClass(Boolean(errors.phone)), 'force-ltr text-start')}
                          />
                        </Field>

                        <Field id="sector" label={exhibitFields.sector} error={errors.sector} required>
                          <select
                            id="sector"
                            name="sector"
                            value={values.sector ?? ''}
                            onChange={(e) => setValue('sector', e.target.value)}
                            aria-invalid={Boolean(errors.sector)}
                            aria-describedby={errors.sector ? 'sector-error' : undefined}
                            className={selectClass(Boolean(errors.sector))}
                            style={SELECT_CHEVRON}
                          >
                            <option value="">{placeholders.select}</option>
                            {sectorOptions.map((sector) => (
                              <option key={sector.id} value={sector.id}>
                                {isAr ? sector.title : sector.en}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field
                          id="boothSize"
                          label={exhibitFields.boothSize}
                          error={errors.boothSize}
                          required
                          hint={dict.register.exhibit.note}
                        >
                          <select
                            id="boothSize"
                            name="boothSize"
                            value={values.boothSize ?? ''}
                            onChange={(e) => setValue('boothSize', e.target.value)}
                            aria-invalid={Boolean(errors.boothSize)}
                            aria-describedby={errors.boothSize ? 'boothSize-error' : undefined}
                            className={selectClass(Boolean(errors.boothSize))}
                            style={SELECT_CHEVRON}
                          >
                            <option value="">{placeholders.select}</option>
                            {dict.register.boothSizes.map((size) => (
                              <option key={size.value} value={size.value}>
                                {isAr ? size.labelAr : size.labelEn}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <div className="sm:col-span-2">
                          <Field id="message" label={exhibitFields.message}>
                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              value={values.message ?? ''}
                              onChange={(e) => setValue('message', e.target.value)}
                              placeholder={placeholdersEx.message}
                              className={cn(inputClass(false), 'resize-y')}
                            />
                          </Field>
                        </div>
                      </>
                    ) : (
                      <>
                        <Field id="name" label={visitorFields.name} error={errors.name} required>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={values.name ?? ''}
                            onChange={(e) => setValue('name', e.target.value)}
                            placeholder={placeholdersVisitor.name}
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            className={inputClass(Boolean(errors.name))}
                          />
                        </Field>

                        <Field id="company" label={visitorFields.company} error={errors.company} required>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            value={values.company ?? ''}
                            onChange={(e) => setValue('company', e.target.value)}
                            placeholder={placeholdersEx.company}
                            aria-invalid={Boolean(errors.company)}
                            aria-describedby={errors.company ? 'company-error' : undefined}
                            className={inputClass(Boolean(errors.company))}
                          />
                        </Field>

                        <Field id="jobTitle" label={visitorFields.jobTitle}>
                          <input
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            autoComplete="organization-title"
                            value={values.jobTitle ?? ''}
                            onChange={(e) => setValue('jobTitle', e.target.value)}
                            placeholder={placeholders.jobTitle}
                            className={inputClass(false)}
                          />
                        </Field>

                        <Field id="email" label={visitorFields.email} error={errors.email} required>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            dir="ltr"
                            inputMode="email"
                            autoComplete="email"
                            value={values.email ?? ''}
                            onChange={(e) => setValue('email', e.target.value)}
                            placeholder="name@company.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'email-error' : undefined}
                            className={cn(inputClass(Boolean(errors.email)), 'force-ltr text-start')}
                          />
                        </Field>

                        <Field id="phone" label={visitorFields.phone} error={errors.phone} required>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            dir="ltr"
                            inputMode="tel"
                            autoComplete="tel"
                            value={values.phone ?? ''}
                            onChange={(e) => setValue('phone', e.target.value)}
                            placeholder={placeholders.phone}
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'phone-error' : undefined}
                            className={cn(inputClass(Boolean(errors.phone)), 'force-ltr text-start')}
                          />
                        </Field>

                        <Field id="category" label={visitorFields.category} error={errors.category} required>
                          <select
                            id="category"
                            name="category"
                            value={values.category ?? ''}
                            onChange={(e) => setValue('category', e.target.value)}
                            aria-invalid={Boolean(errors.category)}
                            aria-describedby={errors.category ? 'category-error' : undefined}
                            className={selectClass(Boolean(errors.category))}
                            style={SELECT_CHEVRON}
                          >
                            <option value="">{placeholders.select}</option>
                            {categoryOptions.map((category) => (
                              <option key={category.id} value={category.id}>
                                {isAr ? category.title : category.en}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </>
                    )}
                  </div>

                  <p className="text-label-sm text-muted">{dict.register.consent}</p>

                  {status === 'error' && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-body-xs font-medium text-red-300"
                    >
                      <span className="font-bold">{dict.register.status.errorTitle}: </span>
                      {dict.register.status.error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full py-3.5 text-body-md"
                  >
                    {status === 'sending' ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        />
                        {dict.register.status.sending}
                      </>
                    ) : (
                      <>
                        {mode === 'exhibit' ? dict.register.exhibit.submit : dict.register.visitor.submit}
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="rtl:rotate-180"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-label-sm text-muted">
                    {mode === 'exhibit' ? dict.register.exhibit.note : dict.register.visitor.note}
                  </p>
                </motion.form>
              )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}