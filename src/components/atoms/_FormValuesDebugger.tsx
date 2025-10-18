'use client';
import { DISABLE_DEBUG_COMPONENTS } from '@/config/flags';
import { isDev } from '@/utils/envs';

interface FormValuesDebuggerProps {
  watchedValues: Record<string, unknown>;
}

export default function FormValuesDebugger({
  watchedValues,
}: FormValuesDebuggerProps) {
  if (!isDev || DISABLE_DEBUG_COMPONENTS) {
    return null;
  }

  return (
    <>
      {Object.keys(watchedValues).length > 0 &&
        Object.values(watchedValues).some((value) => value) && (
          <div className="mt-6 w-full">
            <h2 className="text-md mb-3 font-medium text-gray-700 dark:text-gray-300">
              Valores Atuais do Formulário:
            </h2>
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
              <span className="block font-mono text-sm whitespace-pre-wrap text-blue-800 dark:text-blue-200">
                {JSON.stringify(
                  Object.fromEntries(
                    Object.entries(watchedValues).filter(([, value]) => value)
                  ),
                  null,
                  2
                )}
              </span>
            </div>
          </div>
        )}
    </>
  );
}
