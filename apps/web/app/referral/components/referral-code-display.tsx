'use client';

import { useState } from 'react';
import { ReferralCode } from '@lifestyle/types';

interface ReferralCodeDisplayProps {
  referralCode: ReferralCode;
}

export function ReferralCodeDisplay({ referralCode }: ReferralCodeDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customCode, setCustomCode] = useState(referralCode.code);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveCustomCode = () => {
    // TODO: API call to update custom code
    console.log('Saving custom code:', customCode);
    setIsEditing(false);
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Chia sẻ mã giới thiệu của bạn</h2>
        {referralCode.isCustom && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
          >
            <span>✏️</span>
            Chỉnh sửa
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Code Display */}
          <div className="flex-1">
            <div className="flex items-center gap-4 rounded-lg border-2 border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mã giới thiệu của bạn
                </div>
                <div className="text-3xl font-bold tracking-wider text-purple-600 dark:text-purple-400">
                  {referralCode.code}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                  isCopied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isCopied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 sm:flex-col sm:gap-2">
            <div className="flex-1 rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {referralCode.successfulInvites}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Đã thành công
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {referralCode.lifestyleXuEarned.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Xu đã nhận
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mã giới thiệu tùy chỉnh
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) =>
                setCustomCode(e.target.value.toUpperCase().slice(0, 20))
              }
              className="w-full rounded-lg border-2 border-purple-300 bg-white px-4 py-3 font-mono text-lg font-bold uppercase focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
              placeholder="Nhập mã của bạn"
              maxLength={20}
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500">
              6-20 ký tự, chỉ chữ và số, không dấu
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveCustomCode}
              disabled={customCode.length < 6}
              className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-bold text-white transition-all hover:bg-purple-700 disabled:opacity-50"
            >
              Lưu
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setCustomCode(referralCode.code);
              }}
              className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-bold transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
