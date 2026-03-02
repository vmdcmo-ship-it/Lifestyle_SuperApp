interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isNextDisabled?: boolean;
  isLoading?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveDraft,
  isNextDisabled = false,
  isLoading = false,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex gap-4">
        {/* Previous Button */}
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isLoading}
            className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            ← Quay lại
          </button>
        )}

        {/* Next/Submit Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          className={`${
            isFirstStep ? 'flex-1' : 'flex-1'
          } rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </span>
          ) : isLastStep ? (
            'Gửi hồ sơ đăng ký'
          ) : (
            'Tiếp theo →'
          )}
        </button>
      </div>

      {/* Save Draft Button */}
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isLoading}
        className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-2 text-sm font-medium text-gray-600 transition-all hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-purple-400"
      >
        💾 Lưu nháp
      </button>
    </div>
  );
}
