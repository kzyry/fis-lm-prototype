import { ParameterCheck, VerificationResult, EntityRole, DealType } from '../types/deal';

/**
 * Общий 3-шаговый алгоритм проверки:
 * Шаг 1: СТОП-параметры → любой «Нет» → СТОП
 * Шаг 2: УЛ-параметры → любой «Нет» → Требуется решение УЛ
 * Шаг 3: Count(«Да») == ожидаемое → «Соответствует», иначе → УЛ
 */

function getEffectiveAssessment(p: ParameterCheck): 'Да' | 'Нет' {
  if (p.correction !== null) return p.correction;
  return p.assessment ?? 'Нет';
}

/**
 * Фиксированные ожидаемые кол-ва параметров «Да» для Шага 3.
 * Согласно документации (разделы 24-27).
 */
function getExpectedCount(role: EntityRole, dealType: DealType): number {
  switch (role) {
    case 'lessee': return 25;      // Документация: 25 для всех типов сделок
    case 'guarantor': return 11;   // Документация: 11 (только УЛ-параметры в count)
    case 'supplier': return 11;    // Документация: 11
    case 'end_user': return 18;    // Документация: 18
  }
}

export function evaluateParameters(
  params: ParameterCheck[],
  role: EntityRole,
  dealType: DealType
): VerificationResult {
  const stopParams = params.filter(p => p.level === 'stop');
  const ulParams = params.filter(p => p.level === 'ul');

  // Шаг 1: СТОП-параметры
  const hasStopFail = stopParams.some(p => getEffectiveAssessment(p) === 'Нет');
  if (hasStopFail) {
    if (role === 'supplier') return 'Не аккредитован';
    return 'Не соответствует требованиям';
  }

  // Шаг 2: УЛ-параметры
  const hasUlFail = ulParams.some(p => getEffectiveAssessment(p) === 'Нет');
  if (hasUlFail) {
    return 'Не соответствует требованиям. Требуется решение УЛ';
  }

  // Шаг 3: Подсчёт «Да» среди ВСЕХ параметров vs фиксированное ожидаемое число
  const yesCount = params.filter(p => getEffectiveAssessment(p) === 'Да').length;
  const expectedCount = getExpectedCount(role, dealType);

  if (yesCount >= expectedCount) {
    return 'Соответствует требованиям';
  }

  return 'Не соответствует требованиям. Требуется решение УЛ';
}

/**
 * Алгоритм для спец. программы «Повторный клиент»
 */
export function evaluateSpecialProgram(params: ParameterCheck[]): VerificationResult {
  if (params.length === 0) return null;

  const p1 = params.find(p => p.id === 'sp_1');
  const p10 = params.find(p => p.id === 'sp_10');

  if (!p1) return null;

  const p1Value = getEffectiveAssessment(p1);

  if (p1Value === 'Нет') {
    return 'Не соответствует требованиям спец. программы';
  }

  // p1 = "Да"
  const allYes = params.every(p => getEffectiveAssessment(p) === 'Да');

  if (allYes || (p10 && getEffectiveAssessment(p10) === 'Да')) {
    return 'Соответствует требованиям спец. программы. Необходима проверка финансовых ковенант';
  }

  return 'Не соответствует требованиям спец. программы, необходима проверка финансовых ковенант и решение УЛ';
}

/**
 * Алгоритм для предмета лизинга
 */
export function evaluateLeaseSubject(params: ParameterCheck[]): VerificationResult {
  const allYes = params.every(p => getEffectiveAssessment(p) === 'Да');
  if (allYes) return 'Соответствует требованиям';
  return 'Не соответствует требованиям. Требуется решение УЛ';
}

/**
 * Проверка: нужен ли обязательный комментарий
 */
export function isCommentRequired(p: ParameterCheck): boolean {
  if (p.correction === null) return false;
  return p.correction !== p.assessment;
}

/**
 * Подсветка строки красным
 */
export function isParameterFailed(p: ParameterCheck): boolean {
  return getEffectiveAssessment(p) === 'Нет';
}

/**
 * Получить список несоответствующих параметров (для итогов проверок)
 */
export function getFailedParameterNames(params: ParameterCheck[]): string[] {
  return params
    .filter(p => getEffectiveAssessment(p) === 'Нет')
    .map(p => p.name);
}
