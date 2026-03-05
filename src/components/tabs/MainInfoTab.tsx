import React from 'react';
import { useDealStore } from '../../store/dealStore';
import { BlockSection } from '../shared/BlockSection';
import { FormField } from '../shared/FormField';
import { ParameterCheckTable } from '../shared/ParameterCheckTable';
import { SuspensiveConditions } from '../shared/SuspensiveConditions';
import { getAvailableConclusionTypes, formatConclusionType, DEAL_TYPE_LABELS, VERIFICATION_RESULTS } from '../../data/dictionaries';
import { calculateParticipantSummary, formatCurrency, formatDate, isNegativeResult, getRoleLabel } from '../../logic/fieldCalculations';
import { ConclusionTypeTemplate } from '../../types/deal';

export const MainInfoTab: React.FC = () => {
  const deal = useDealStore();
  const summaries = calculateParticipantSummary(deal);
  const availableConclusions = getAvailableConclusionTypes(deal.dealType);

  // #5: Комментарий виден только при "Доработка"
  const isCommentVisible = deal.conclusionType === 'Доработка';

  return (
    <div className="tab-content">
      {/* Блок 1: Общие сведения — #9: все поля из документации */}
      <BlockSection title="1. Общие сведения о лизинговой сделке">
        <div className="form-grid">
          <FormField label="1.1 Спец. программа" value={deal.hasSpecialProgram ? 'Да' : 'Нет'} />
          <FormField label="1.2 Результат проверки спец. программы" value={deal.specProgramResult || '—'} />
          <FormField label="1.3 Тип сделки по данным КК" value={deal.dealTypeKK} />
          <FormField label="1.4 Тип сделки по данным СПР" value={deal.dealTypeSPR} />
          <FormField label="1.5 Наименование оборудования" value={deal.leaseSubject.name} />
          <FormField label="1.6 Тип предмета лизинга" value={deal.leaseSubject.type} />
          <FormField label="1.7 Серийный (заводской) номер" value={deal.leaseSubject.serialNumber} />
          <FormField label="1.8 Количество ед. к приобретению (шт.)" value={deal.leaseSubject.quantity} />
          <FormField label="1.9 Цена за 1 ед. (руб., в т.ч. НДС)" value={formatCurrency(deal.leaseSubject.unitPrice)} />
          <FormField label="1.10 Общая стоимость оборудования" value={formatCurrency(deal.leaseCost)} />
          <FormField label="1.11 Размер аванса (%)" value={deal.advancePaymentPercent} />
          <FormField label="1.12 Размер аванса (руб.)" value={formatCurrency(deal.advancePaymentRub)} />
          <FormField label="1.13 Срок договора лизинга (мес.)" value={deal.leaseTerm} />
          <FormField label="1.14 Сумма финансирования (%)" value={deal.financingPercent} />
          <FormField label="1.15 Сумма финансирования (руб.)" value={formatCurrency(deal.financingRub)} />
          <FormField label="1.16 Предполагаемый платеж по лизингу" value={formatCurrency(deal.monthlyPayment)} />
          <FormField label="1.17 Краткое описание проекта" value={deal.projectDescription} />
        </div>
      </BlockSection>

      {/* Блок 2: Проверка предмета лизинга */}
      <BlockSection title="2. Проверка предмета лизинга">
        <ParameterCheckTable
          parameters={deal.leaseSubject.parameters}
          onUpdate={(paramId, correction, comment) =>
            deal.updateLeaseSubjectParameter(paramId, correction, comment)
          }
        />
      </BlockSection>

      {/* Блок 3: Результаты проверки предмета лизинга */}
      <BlockSection title="3. Результаты проверки предмета лизинга">
        <div className={`verification-result ${isNegativeResult(deal.leaseSubject.verificationResult) ? 'negative' : 'positive'}`}>
          {deal.leaseSubject.verificationResult || '—'}
        </div>
      </BlockSection>

      {/* Блок 4: Итоги проверок участников — #11: с колонкой параметров несоответствия */}
      <BlockSection title="4. Итоги проверок участников">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Субъект</th>
              <th>Наименование организации</th>
              <th>Общий вывод по контрагенту</th>
              <th>Параметры несоответствия</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map(s => (
              <tr key={s.entityId}>
                <td>
                  {s.role === 'lease_subject' ? 'Предмет лизинга' :
                   s.role === 'special_program' ? 'Спец. программа' :
                   getRoleLabel(s.role)}
                </td>
                <td>{s.entityName}</td>
                <td className={isNegativeResult(s.result) ? 'result-negative' : 'result-positive'}>
                  {s.result || '—'}
                </td>
                <td>
                  {s.failedParams.length > 0
                    ? s.failedParams.join('; ')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BlockSection>

      {/* Блок 5: Отлагательные условия */}
      <BlockSection title="5. Отлагательные условия">
        <SuspensiveConditions
          conditions={deal.suspensiveConditions}
          entityId="deal"
          onAdd={() => deal.addSuspensiveCondition('deal')}
          onRemove={deal.removeSuspensiveCondition}
          onUpdate={deal.updateSuspensiveCondition}
        />
      </BlockSection>

      {/* Блок 6: ПОС — #4: все поля read-only */}
      <BlockSection title="6. ССУДА ОТНОСИТСЯ В ПОС">
        <div className="form-grid">
          <FormField label="Ссуда относится в ПОС" value={deal.pos.isPos ? 'Да' : 'Нет'} />
          <FormField label="6.1 Наименование ПОС" value={deal.pos.posName || '—'} />
          <FormField label="6.2 Категория качества ПОС" value={deal.pos.qualityCategory || '—'} />
          <FormField label="6.3 Размер резерва (%)" value={deal.pos.reservePercent != null ? `${deal.pos.reservePercent}%` : '—'} />
          <FormField label="6.4 Комментарий" value={deal.pos.comment || '—'} />
        </div>
      </BlockSection>

      {/* Блок 7: Заключение — #5: условная видимость комментария, поле исполнитель */}
      <BlockSection title="7. Заключение служб. Отдел рисков лизинговых проектов">
        <div className="conclusion-block">
          <div className="form-grid">
            <div className="field-label">7.1 Заключение</div>
            <div className="field-value editable">
              <select
                value={deal.conclusionType ?? ''}
                onChange={e => deal.setConclusionType((e.target.value || null) as ConclusionTypeTemplate | null)}
              >
                <option value="">— Выберите —</option>
                {availableConclusions.map(tpl => (
                  <option key={tpl} value={tpl}>
                    {formatConclusionType(tpl, deal.dealType)}
                  </option>
                ))}
              </select>
            </div>

            {isCommentVisible && (
              <>
                <div className="field-label">7.2 Комментарий</div>
                <div className="field-value editable">
                  <textarea
                    value={deal.conclusionComment}
                    onChange={e => deal.setConclusionComment(e.target.value)}
                    placeholder="Комментарий к заключению..."
                  />
                </div>
              </>
            )}

            <FormField label="7.3 Исполнитель" value={deal.executor} />
          </div>
        </div>
      </BlockSection>
    </div>
  );
};
