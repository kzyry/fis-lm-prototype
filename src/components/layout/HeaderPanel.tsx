import React from 'react';
import { useDealStore } from '../../store/dealStore';
import { DEAL_TYPE_LABELS, VERIFICATION_STAGE_LABELS } from '../../data/dictionaries';
import { formatCurrency, formatDate } from '../../logic/fieldCalculations';

export const HeaderPanel: React.FC = () => {
  const deal = useDealStore();

  return (
    <div className="header-panel">
      <div className="inner-container">
      <div className="deal-title">
        СПР — {deal.dealNumber}
      </div>
      <div className="deal-meta">
        <div className="meta-item">
          <span className="meta-label">Дата сделки</span>
          <span className="meta-value">{formatDate(deal.dealDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Тип сделки</span>
          <span className="meta-value">{DEAL_TYPE_LABELS[deal.dealType]}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Этап проверки</span>
          <span className="meta-value">{VERIFICATION_STAGE_LABELS[deal.verificationStage]}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Стоимость ПЛ</span>
          <span className="meta-value">{formatCurrency(deal.leaseCost)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Предмет лизинга</span>
          <span className="meta-value">{deal.leaseSubject.name}</span>
        </div>
      </div>
      </div>
    </div>
  );
};
