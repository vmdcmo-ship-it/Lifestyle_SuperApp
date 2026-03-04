import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AnCuLeadNotifier {
  constructor(private readonly config: ConfigService) {}

  async notifyNewLead(lead: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    note: string | null;
    source: string;
    createdAt: Date;
  }): Promise<void> {
    const payload = {
      id: lead.id,
      fullName: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      note: lead.note,
      source: lead.source,
      createdAt: lead.createdAt.toISOString(),
    };

    await Promise.allSettled([
      this.sendWebhook(payload),
      this.sendEmail(payload),
    ]);
  }

  private async sendWebhook(payload: object): Promise<void> {
    const url = this.config.get<string>('ANCU_CRM_WEBHOOK_URL');
    if (!url?.trim()) return;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.warn('[AnCuLead] Webhook failed:', res.status, await res.text());
      }
    } catch (e) {
      console.error('[AnCuLead] Webhook error:', e);
    }
  }

  private async sendEmail(payload: {
    fullName: string;
    phone: string;
    email: string;
    note: string | null;
    createdAt: string;
  }): Promise<void> {
    const notifyUrl = this.config.get<string>('ANCU_LEAD_EMAIL_WEBHOOK_URL');
    const notifyTo = this.config.get<string>('ANCU_LEAD_EMAIL_TO');

    if (!notifyUrl?.trim() && !notifyTo) return;

    if (notifyUrl?.trim()) {
      try {
        const res = await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: notifyTo || undefined,
            subject: `[An Cư Lạc Nghiệp] Lead mới: ${payload.fullName}`,
            body: `Họ tên: ${payload.fullName}\nSĐT: ${payload.phone}\nEmail: ${payload.email}\nGhi chú: ${payload.note || '—'}\nThời gian: ${payload.createdAt}`,
            lead: payload,
          }),
        });
        if (!res.ok) {
          console.warn('[AnCuLead] Email webhook failed:', res.status);
        }
      } catch (e) {
        console.error('[AnCuLead] Email webhook error:', e);
      }
      return;
    }

    const resendKey = this.config.get<string>('RESEND_API_KEY');
    if (resendKey?.trim() && notifyTo) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: this.config.get('RESEND_FROM') || 'An Cư Lạc Nghiệp <onboarding@resend.dev>',
            to: [notifyTo],
            subject: `[An Cư Lạc Nghiệp] Lead mới: ${payload.fullName}`,
            html: `<p><strong>Họ tên:</strong> ${payload.fullName}</p><p><strong>SĐT:</strong> ${payload.phone}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Ghi chú:</strong> ${payload.note || '—'}</p><p><em>${payload.createdAt}</em></p>`,
          }),
        });
        if (!res.ok) {
          console.warn('[AnCuLead] Resend failed:', res.status, await res.text());
        }
      } catch (e) {
        console.error('[AnCuLead] Resend error:', e);
      }
    }
  }
}
