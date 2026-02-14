/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURNSTILE_SECRET_KEY: string;
  readonly RESEND_API_KEY: string;
  readonly SENDGRID_API_KEY: string;
  readonly EMAIL_FROM: string;
  readonly CONTACT_RECIPIENT_EMAIL: string;
  readonly LOG_LEVEL?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
