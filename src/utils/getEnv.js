import 'dotenv/config';

/**
 * Получает переменную окружения по имени.
 * Если переменная не найдена, возвращает значение по умолчанию (если указано).
 * @param {string} envVarName - Имя переменной окружения.
 * @param {string} [defaultValue] - Значение по умолчанию (необязательно).
 * @returns {string} Значение переменной окружения.
 * @throws {Error} Если переменная отсутствует и значение по умолчанию не указано.
 */
export const getEnvVar = (envVarName, defaultValue = null) => {
  const envVar = process.env[envVarName];

  if (envVar !== undefined) {
    return envVar;
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  throw new Error(`Environment variable "${envVarName}" is not set and no default value provided!`);
};

// Также экспортируем `getEnv` для других частей кода, если нужно
export { getEnvVar as getEnv };
