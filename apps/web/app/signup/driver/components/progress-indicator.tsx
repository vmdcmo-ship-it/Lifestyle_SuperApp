interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitles,
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Bước {currentStep}/{totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="hidden md:flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-all ${
                step < currentStep
                  ? 'border-green-500 bg-green-500 text-white'
                  : step === currentStep
                  ? 'border-purple-600 bg-purple-600 text-white scale-110'
                  : 'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            <span
              className={`text-xs text-center max-w-[80px] ${
                step === currentStep
                  ? 'font-semibold text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {stepTitles[step - 1]}
            </span>
          </div>
        ))}
      </div>

      {/* Current Step Title (Mobile) */}
      <div className="md:hidden mt-4 text-center">
        <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">
          {stepTitles[currentStep - 1]}
        </h3>
      </div>
    </div>
  );
}
