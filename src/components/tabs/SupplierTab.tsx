import React from 'react';
import { LegalEntity } from '../../types/deal';
import { useDealStore } from '../../store/dealStore';
import { BlockSection } from '../shared/BlockSection';
import { FormField } from '../shared/FormField';
import { ParameterCheckTable } from '../shared/ParameterCheckTable';
import { SuspensiveConditions } from '../shared/SuspensiveConditions';
import { getSparkLink, isNegativeResult } from '../../logic/fieldCalculations';

interface SupplierTabProps {
  entity: LegalEntity;
}

export const SupplierTab: React.FC<SupplierTabProps> = ({ entity }) => {
  const deal = useDealStore();

  return (
    <div className="tab-content">
      {/* Блок 1: Информация о поставщике */}
      <BlockSection title="1. Информация о поставщике">
        <div className="form-grid">
          <FormField label="1.1 Наименование" value={entity.name} />
          <FormField
            label="1.2 Тип поставщика"
            value={entity.supplierType}
            editable
            type="dropdown"
            options={['Белый список', 'Новый', 'Повторный', 'Система']}
            onChange={() => {/* мок */}}
          />
          <FormField label="1.3 Роль в сделке" value="Поставщик" />
          <FormField label="1.4 ИНН" value={entity.inn} />
          <FormField label="1.5 КПП" value={entity.kpp} />
          <FormField label="1.6 ОГРН" value={entity.ogrn} />
          <FormField label="1.7 Юридический адрес" value={entity.legalAddress} />
          <FormField label="1.8 ОКВЭД" value={`${entity.okved} — ${entity.okvedName}`} />
          <FormField label="1.9 СПАРК" value="Открыть в СПАРК" type="link" linkHref={getSparkLink(entity.inn)} />
        </div>
      </BlockSection>

      {/* Блок 2: Проверка */}
      <BlockSection title="2. Проверка поставщика на соответствие требованиям паспорта продукта">
        <ParameterCheckTable
          parameters={entity.parameters}
          onUpdate={(paramId, correction, comment) =>
            deal.updateEntityParameter(entity.id, paramId, correction, comment)
          }
        />
      </BlockSection>

      {/* Блок 2.1: Результаты */}
      <BlockSection title="2.1. Результаты проверки на соответствие требованиям паспорта продукта">
        <div className={`verification-result ${isNegativeResult(entity.verificationResult) ? 'negative' : 'positive'}`}>
          Вывод: {entity.verificationResult || '—'}
        </div>
      </BlockSection>

      {/* Блок 3: Отлагательные условия — #6: ранее отсутствовал */}
      <BlockSection title="3. Отлагательные условия">
        <SuspensiveConditions
          conditions={deal.suspensiveConditions}
          entityId={entity.id}
          onAdd={deal.addSuspensiveCondition}
          onRemove={deal.removeSuspensiveCondition}
          onUpdate={deal.updateSuspensiveCondition}
        />
      </BlockSection>
    </div>
  );
};
