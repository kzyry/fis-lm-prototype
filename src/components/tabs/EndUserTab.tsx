import React from 'react';
import { LegalEntity } from '../../types/deal';
import { useDealStore } from '../../store/dealStore';
import { BlockSection } from '../shared/BlockSection';
import { FormField } from '../shared/FormField';
import { DataTable } from '../shared/DataTable';
import { ParameterCheckTable } from '../shared/ParameterCheckTable';
import { SuspensiveConditions } from '../shared/SuspensiveConditions';
import { formatCurrency, formatDate, getSparkLink, isNegativeResult } from '../../logic/fieldCalculations';

interface EndUserTabProps {
  entity: LegalEntity;
}

export const EndUserTab: React.FC<EndUserTabProps> = ({ entity }) => {
  const deal = useDealStore();

  return (
    <div className="tab-content">
      {/* Блок 1: Информация — #20: editable Тип клиента */}
      <BlockSection title="1. Информация о конечном пользователе предметом лизинга">
        <div className="form-grid">
          <FormField label="1.1 Наименование" value={entity.name} />
          <FormField
            label="1.2 Тип клиента"
            value={entity.clientType}
            editable
            type="dropdown"
            options={['Новый', 'Повторный']}
            onChange={v => deal.setClientType(entity.id, v as 'Новый' | 'Повторный')}
          />
          <FormField label="1.3 Роль в сделке" value="Конечный пользователь" />
          <FormField label="1.4 ИНН" value={entity.inn} />
          <FormField label="1.5 Дата гос. регистрации" value={formatDate(entity.registrationDate)} />
          <FormField label="1.6 Юридический адрес" value={entity.legalAddress} />
          <FormField label="1.7 Фактический адрес" value={entity.actualAddress} />
          <FormField label="1.8 ОКВЭД" value={`${entity.okved} — ${entity.okvedName}`} />
          <FormField label="1.11 Валюта баланса (тыс. руб.)" value={entity.balanceCurrency} />
          <FormField label="1.12 Группа связанных компаний" value={entity.relatedGroup} />
          <FormField label="1.13 СПАРК" value="Открыть в СПАРК" type="link" linkHref={getSparkLink(entity.inn)} />
        </div>

        <div style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 8, color: '#64748b' }}>1.9 Участники / акционеры</h4>
          <DataTable
            columns={[
              { key: 'name', header: 'ФИО / Наименование' },
              { key: 'share', header: 'Доля' },
              { key: 'inn', header: 'ИНН' },
              { key: 'status', header: 'Статус' },
            ]}
            data={entity.shareholders}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <h4 style={{ fontSize: 12, marginBottom: 8, color: '#64748b' }}>1.10 Руководители</h4>
          <DataTable
            columns={[
              { key: 'name', header: 'ФИО' },
              { key: 'position', header: 'Должность' },
              { key: 'birthDate', header: 'Дата рождения', render: v => formatDate(v) },
            ]}
            data={entity.directors}
          />
        </div>
      </BlockSection>

      {/* Блок 1.14: Федресурс */}
      <BlockSection title="1.14. Сведения о договорах лизинга (Федресурс)">
        <DataTable
          columns={[
            { key: 'contractNumber', header: '№ договора' },
            { key: 'contractDate', header: 'Дата заключения', render: v => formatDate(v) },
            { key: 'contractEndDate', header: 'Дата окончания', render: v => formatDate(v) },
            { key: 'leasingCompany', header: 'Лизингодатель' },
            { key: 'leaseSubject', header: 'Предмет лизинга' },
            { key: 'dataSource', header: 'Источник данных' },
          ]}
          data={entity.fedresursContracts}
          emptyMessage="Нет сведений"
        />
      </BlockSection>

      {/* Блок 2: Кредитные обязательства */}
      <BlockSection title="2. Информация по текущим кредитным обязательствам в Банке">
        <DataTable
          columns={[
            { key: 'contractNumber', header: '№ договора' },
            { key: 'contractDate', header: 'Дата открытия', render: v => formatDate(v) },
            { key: 'plannedCloseDate', header: 'Дата план. закрытия', render: v => formatDate(v) },
            { key: 'currentDebt', header: 'Текущая задолженность', render: v => formatCurrency(v) },
            { key: 'financingAmount', header: 'Сумма финансирования', render: v => formatCurrency(v) },
            { key: 'status', header: 'Статус' },
            { key: 'lesseeInn', header: 'ИНН ЛП' },
            { key: 'leaseSubjects', header: 'Предметы лизинга' },
          ]}
          data={entity.bankObligations}
          emptyMessage="Нет текущих обязательств"
        />
      </BlockSection>

      {/* Блок 3: Проверка */}
      <BlockSection title="3. Проверка конечного пользователя на соответствие требованиям паспорта продукта">
        <ParameterCheckTable
          parameters={entity.parameters}
          onUpdate={(paramId, correction, comment) =>
            deal.updateEntityParameter(entity.id, paramId, correction, comment)
          }
        />
      </BlockSection>

      {/* Блок 4: Результаты */}
      <BlockSection title="4. Результаты проверки на соответствие требованиям паспорта продукта">
        <div className={`verification-result ${isNegativeResult(entity.verificationResult) ? 'negative' : 'positive'}`}>
          Вывод: {entity.verificationResult || '—'}
        </div>
      </BlockSection>

      {/* Блок 5: Отлагательные условия */}
      <BlockSection title="5. Отлагательные условия">
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
