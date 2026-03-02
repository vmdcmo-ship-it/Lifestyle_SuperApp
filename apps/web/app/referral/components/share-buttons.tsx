'use client';

import { useState } from 'react';
import { ShareChannel } from '@lifestyle/types';

interface ShareButtonsProps {
  referralCode: string;
}

export function ShareButtons({ referralCode }: ShareButtonsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://lifestyle.vn/invite/${referralCode}`;
  const shareMessage = `Mời bạn tham gia Lifestyle với mã ${referralCode} để nhận ưu đãi 500K! ${referralUrl}`;

  const handleShare = (channel: ShareChannel) => {
    let shareUrl = '';

    switch (channel) {
      case ShareChannel.FACEBOOK:
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          referralUrl
        )}`;
        break;
      case ShareChannel.MESSENGER:
        shareUrl = `fb-messenger://share?link=${encodeURIComponent(referralUrl)}`;
        break;
      case ShareChannel.ZALO:
        shareUrl = `https://zalo.me/share?url=${encodeURIComponent(referralUrl)}`;
        break;
      case ShareChannel.TELEGRAM:
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          referralUrl
        )}&text=${encodeURIComponent(shareMessage)}`;
        break;
      case ShareChannel.WHATSAPP:
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
        break;
      case ShareChannel.SMS:
        shareUrl = `sms:?body=${encodeURIComponent(shareMessage)}`;
        break;
      case ShareChannel.EMAIL:
        shareUrl = `mailto:?subject=Mời bạn tham gia Lifestyle&body=${encodeURIComponent(
          shareMessage
        )}`;
        break;
      case ShareChannel.COPY_LINK:
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const shareOptions = [
    { channel: ShareChannel.FACEBOOK, icon: '📘', label: 'Facebook', color: 'bg-blue-600' },
    { channel: ShareChannel.MESSENGER, icon: '💬', label: 'Messenger', color: 'bg-blue-500' },
    { channel: ShareChannel.ZALO, icon: '🔵', label: 'Zalo', color: 'bg-blue-400' },
    { channel: ShareChannel.TELEGRAM, icon: '✈️', label: 'Telegram', color: 'bg-sky-500' },
    { channel: ShareChannel.WHATSAPP, icon: '💚', label: 'WhatsApp', color: 'bg-green-500' },
    { channel: ShareChannel.SMS, icon: '💬', label: 'SMS', color: 'bg-gray-600' },
    { channel: ShareChannel.EMAIL, icon: '📧', label: 'Email', color: 'bg-red-500' },
    { channel: ShareChannel.COPY_LINK, icon: '🔗', label: 'Copy Link', color: 'bg-purple-600' },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      {/* Primary Share Button */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="mb-4 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
      >
        Chia sẻ ngay
      </button>

      {/* Share Options */}
      {showShareMenu && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shareOptions.map((option) => (
            <button
              key={option.channel}
              onClick={() => handleShare(option.channel)}
              className={`flex flex-col items-center gap-2 rounded-lg ${option.color} p-4 text-white transition-all hover:scale-105 hover:shadow-lg`}
            >
              <span className="text-3xl">{option.icon}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Copied Notification */}
      {copied && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
          ✓ Đã sao chép link vào clipboard!
        </div>
      )}

      {/* Or share via */}
      {!showShareMenu && (
        <div className="mt-4">
          <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
            Hoặc chia sẻ qua:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {shareOptions.slice(0, 4).map((option) => (
              <button
                key={option.channel}
                onClick={() => handleShare(option.channel)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl transition-all hover:scale-110 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                title={option.label}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
