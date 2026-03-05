import { ConclusionTypeTemplate, DealType, VerificationStage } from '../types/deal';

// Справочник «Типы заключений» — базовые шаблоны
export const CONCLUSION_TYPE_TEMPLATES: ConclusionTypeTemplate[] = [
  'Доработка',
  'Лизингополучатель соответствует всем требованиям, сделка рекомендована к реализации',
  'Лизингополучатель соответствует не всем требованиям, сделка рекомендована к реализации',
  'Лизингополучатель не соответствует всем требованиям, сделка не рекомендована к реализации',
  'Лизингополучатель не соответствует, при этом Поручитель соответствуют всем требованиям, сделка рекомендована к реализации',
  'Лизингополучатель и Поручитель соответствуют не всем требованиям, сделка рекомендована к реализации',
  'Лизингополучатель и Поручитель не соответствуют всем требованиям, сделка не рекомендована к реализации',
];

// Форматирование заключения с типом сделки: «Шаблон (Тип сделки)»
export function formatConclusionType(template: ConclusionTypeTemplate, dealType: DealType): string {
  if (template === 'Доработка') return 'Доработка';
  return `${template} (${DEAL_TYPE_LABELS[dealType]})`;
}

// Фильтрация заключений: без поручителя — только первые 4
export function getAvailableConclusionTypes(dealType: DealType): ConclusionTypeTemplate[] {
  const hasGuarantor = dealType === 'type1_guarantor' || dealType === 'type2_guarantor';
  if (hasGuarantor) return CONCLUSION_TYPE_TEMPLATES;
  return CONCLUSION_TYPE_TEMPLATES.slice(0, 4);
}

// Справочник «Наличие просрочки»
export const ARREARS_STATUS = [
  'Данные отсутствуют',
  'Просрочка отсутствует',
  'Срок просрочки не более 30 к.д.',
  'Срок просрочки более 30 к.д.',
] as const;

// Справочник «Параметры для проверки предмета лизинга»
export const LEASE_SUBJECT_PARAMS = [
  'Предмет лизинга не находится в залоге',
  'Отсутствуют обременения',
] as const;

// Справочник «Типы поставщиков»
export const SUPPLIER_TYPES = [
  'Белый список',
  'Новый',
  'Повторный',
  'Система',
] as const;

// Справочник «Типы клиентов»
export const CLIENT_TYPES = ['Новый', 'Повторный'] as const;

// Справочник «Крупная сделка» (#19: точные значения)
export const MAJOR_DEAL_OPTIONS = [
  'Является крупной сделкой',
  'Не является крупной сделкой',
] as const;

// Справочник «Отлагательные условия» (примерные значения)
export const SUSPENSIVE_CONDITIONS_DICT = [
  'Предоставить заверенные копии учредительных документов',
  'Предоставить справку об отсутствии задолженности по налогам',
  'Предоставить оригинал договора лизинга',
  'Предоставить документы на предмет лизинга',
  'Предоставить поручительство',
  'Оформить залог на предмет лизинга',
  'Предоставить финансовую отчётность за последний период',
  'Иное',
] as const;

// Результаты проверки (для dropdown)
export const VERIFICATION_RESULTS = [
  'Соответствует требованиям',
  'Не соответствует требованиям',
  'Не соответствует требованиям. Требуется решение УЛ',
  'Не аккредитован',
] as const;

// Типы сделок для UI
export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  type0: 'Тип 0',
  type1: 'Тип 1',
  type1_guarantor: 'Тип 1 с поручителем',
  type2: 'Тип 2',
  type2_guarantor: 'Тип 2 с поручителем',
};

// Этапы проверки для UI
export const VERIFICATION_STAGE_LABELS: Record<VerificationStage, string> = {
  full: 'Полная проверка',
  pre_disbursement: 'Проверка перед выдачей',
  special_program: 'Проверка спец. программы',
};

// Оценка Да/Нет для dropdown
export const ASSESSMENT_OPTIONS = ['Да', 'Нет'] as const;

// Источники данных Федресурс
export const FEDRESURS_DATA_SOURCES = ['НБКИ', 'ОКБ', 'Контур.Фокус', 'Кредитный конвейер'] as const;
