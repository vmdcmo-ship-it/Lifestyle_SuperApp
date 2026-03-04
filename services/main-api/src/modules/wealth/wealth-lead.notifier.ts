import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WealthLeadNotifier {
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
      this.sendToHubSpot(payload),
      this.sendEmail(payload),
    ]);
  }

  private async sendToHubSpot(payload: {
    fullName: string;
    email: string;
    phone: string;
    note: string | null;
    source: string;
  }): Promise<void> {
    const token = this.config.get<string>('WEALTH_CRM_HUBSPOT_ACCESS_TOKEN');
    if (!token?.trim()) return;

    const parts = payload.fullName.trim().split(/\s+/);
    const firstname = parts[0] ?? '';
    const lastname = parts.slice(1).join(' ') ?? '';

    try {
      const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          properties: {
            firstname,
            lastname,
            email: payload.email,
            phone: payload.phone,
            hs_lead_status: 'NEW',
            lifecyclestage: 'lead',
            ...(payload.note && { message: payload.note }),
          },
          associations: [],
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.warn('[WealthLead] HubSpot failed:', res.status, txt);
      }
    } catch (e) {
      console.error('[WealthLead] HubSpot error:', e);
    }
  }

  private async sendWebhook(payload: object): Promise<void> {
    const url = this.config.get<string>('WEALTH_CRM_WEBHOOK_URL');
    if (!url?.trim()) return;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.warn('[WealthLead] Webhook failed:', res.status, await res.text());
      }
    } catch (e) {
      console.error('[WealthLead] Webhook error:', e);
    }
  }

  private async sendEmail(payload: {
    fullName: string;
    phone: string;
    email: string;
    note: string | null;
    createdAt: string;
  }): Promise<void> {
    const notifyUrl = this.config.get<string>('WEALTH_LEAD_EMAIL_WEBHOOK_URL');
    const notifyTo = this.config.get<string>('WEALTH_LEAD_EMAIL_TO');

    if (!notifyUrl?.trim() && !notifyTo) return;

    if (notifyUrl?.trim()) {
      try {
        const res = await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: notifyTo || undefined,
            subject: `[KODO Wealth] Lead mới: ${payload.fullName}`,
            body: `Họ tên: ${payload.fullName}\nSĐT: ${payload.phone}\nEmail: ${payload.email}\nGhi chú: ${payload.note || '—'}\nThời gian: ${payload.createdAt}`,
            lead: payload,
          }),
        });
        if (!res.ok) {
          console.warn('[WealthLead] Email webhook failed:', res.status);
        }
      } catch (e) {
        console.error('[WealthLead] Email webhook error:', e);
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
            from: this.config.get('RESEND_FROM') || 'KODO Wealth <onboarding@resend.dev>',
            to: [notifyTo],
            subject: `[KODO Wealth] Lead mới: ${payload.fullName}`,
            html: `<p><strong>Họ tên:</strong> ${payload.fullName}</p><p><strong>SĐT:</strong> ${payload.phone}</p><p><strong>Email:</strong> ${payload.email}</p><p><strong>Ghi chú:</strong> ${payload.note || '—'}</p><p><em>${payload.createdAt}</em></p>`,
          }),
        });
        if (!res.ok) {
          console.warn('[WealthLead] Resend failed:', res.status, await res.text());
        }
      } catch (e) {
        console.error('[WealthLead] Resend error:', e);
      }
    }
  }
}
