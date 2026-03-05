import { DealState, DealType, ParticipantSummary, EntityRole } from '../types/deal';
import { getFailedParameterNames } from './evaluationAlgorithm';

const ROLE_LABELS: Record<EntityRole, string> = {
  lessee: 'Лизингополучатель',
  guarantor: 'Поручитель',
  supplier: 'Поставщик',
  end_user: 'Конечный пользователь',
};

export function getRoleLabel(role: EntityRole): string {
  return ROLE_LABELS[role];
}

/**
 * Рассчёт сводки «Итоги проверок участников» (#11: с параметрами несоответствия)
 */
export function calculateParticipantSummary(deal: DealState): ParticipantSummary[] {
  const summaries: ParticipantSummary[] = [];

  // Предмет лизинга
  summaries.push({
    entityId: 'lease_subject',
    entityName: deal.leaseSubject.name,
    role: 'lease_subject',
    result: deal.leaseSubject.verificationResult,
    failedParams: getFailedParameterNames(deal.leaseSubject.parameters),
  });

  // Все участники
  for (const entity of deal.entities) {
    summaries.push({
      entityId: entity.id,
      entityName: entity.name,
      role: entity.role,
      result: entity.verificationResult,
      failedParams: getFailedParameterNames(entity.parameters),
    });
  }

  // Спец. программа
  if (deal.specialProgram) {
    summaries.push({
      entityId: 'special_program',
      entityName: 'Спец. программа «Повторный клиент»',
      role: 'special_program',
      result: deal.specialProgram.verificationResult,
      failedParams: getFailedParameterNames(deal.specialProgram.parameters),
    });
  }

  return summaries;
}

export function getSparkLink(inn: string): string {
  return `https://spark-interfax.ru/#/search?query=${inn}`;
}

export function getDealTypeLabel(dealType: DealType): string {
  switch (dealType) {
    case 'type0': return 'Тип 0';
    case 'type1': return 'Тип 1';
    case 'type1_guarantor': return 'Тип 1 с поручителем';
    case 'type2': return 'Тип 2';
    case 'type2_guarantor': return 'Тип 2 с поручителем';
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU');
}

export function isNegativeResult(result: string | null): boolean {
  if (!result) return false;
  return result.includes('Не соответствует') || result.includes('Не аккредитован');
}
