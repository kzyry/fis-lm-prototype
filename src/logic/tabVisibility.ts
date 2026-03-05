import { DealType, VerificationStage, LegalEntity } from '../types/deal';

export interface TabDef {
  id: string;
  label: string;
  visible: boolean;
}

export function getVisibleTabs(
  dealType: DealType,
  stage: VerificationStage,
  entities: LegalEntity[],
  hasSpecialProgram = false
): TabDef[] {
  const hasGuarantor = dealType === 'type1_guarantor' || dealType === 'type2_guarantor';
  const guarantors = entities.filter(e => e.role === 'guarantor');
  const suppliers = entities.filter(e => e.role === 'supplier');
  const endUsers = entities.filter(e => e.role === 'end_user');
  const lessees = entities.filter(e => e.role === 'lessee');

  const tabs: TabDef[] = [];

  // Основная информация — всегда видна
  tabs.push({ id: 'main', label: 'Основная информация', visible: true });

  if (stage === 'special_program') {
    // Только ОИ + Спец. программа
    tabs.push({ id: 'special_program', label: 'Спец. программа', visible: true });
    return tabs;
  }

  if (stage === 'pre_disbursement') {
    // ОИ + ЛП + Поставщик
    for (const l of lessees) {
      tabs.push({ id: `lessee_${l.id}`, label: `ЛП: ${l.name}`, visible: true });
    }
    for (const s of suppliers) {
      tabs.push({ id: `supplier_${s.id}`, label: `Поставщик: ${s.name}`, visible: true });
    }
    return tabs;
  }

  // Полная проверка — все вкладки
  // #8: Спец. программа — если была проведена ранее
  if (hasSpecialProgram) {
    tabs.push({ id: 'special_program', label: 'Спец. программа', visible: true });
  }

  for (const l of lessees) {
    tabs.push({ id: `lessee_${l.id}`, label: `ЛП: ${l.name}`, visible: true });
  }

  if (hasGuarantor) {
    for (const g of guarantors) {
      tabs.push({ id: `guarantor_${g.id}`, label: `Поручитель: ${g.name}`, visible: true });
    }
  }

  for (const s of suppliers) {
    tabs.push({ id: `supplier_${s.id}`, label: `Поставщик: ${s.name}`, visible: true });
  }

  for (const eu of endUsers) {
    tabs.push({ id: `end_user_${eu.id}`, label: `КП: ${eu.name}`, visible: true });
  }

  return tabs;
}

export function isFinancialConclusionVisible(dealType: DealType): boolean {
  return dealType !== 'type0';
}

export function isGeneralConclusionVisible(dealType: DealType): boolean {
  return dealType === 'type0';
}
