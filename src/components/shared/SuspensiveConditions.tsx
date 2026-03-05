import React from 'react';
import { SuspensiveCondition } from '../../types/deal';
import { SUSPENSIVE_CONDITIONS_DICT, VERIFICATION_RESULTS } from '../../data/dictionaries';

interface SuspensiveConditionsProps {
  conditions: SuspensiveCondition[];
  entityId: string;
  onAdd: (entityId: string) => void;
  onRemove: (conditionId: string) => void;
  onUpdate: (conditionId: string, field: 'referenceValue' | 'text' | 'verificationResult', value: string) => void;
}

export const SuspensiveConditions: React.FC<SuspensiveConditionsProps> = ({
  conditions,
  entityId,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const filtered = conditions.filter(c => c.entityId === entityId);

  return (
    <div>
      {filtered.map((cond, idx) => (
        <div key={cond.id} className="suspensive-item">
          <div className="sc-number">{idx + 1}.</div>
          <div className="sc-fields">
            <select
              value={cond.referenceValue}
              onChange={e => onUpdate(cond.id, 'referenceValue', e.target.value)}
            >
              <option value="">— Выберите из справочника —</option>
              {SUSPENSIVE_CONDITIONS_DICT.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Текст отлагательного условия (ручная коррекция)"
              value={cond.text}
              onChange={e => onUpdate(cond.id, 'text', e.target.value)}
            />
            {/* #12: Результат проверки — editable dropdown */}
            <select
              value={cond.verificationResult}
              onChange={e => onUpdate(cond.id, 'verificationResult', e.target.value)}
            >
              <option value="">— Результат проверки —</option>
              {VERIFICATION_RESULTS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            className="sc-delete"
            title="Удалить"
            onClick={() => {
              if (window.confirm('Удалить отлагательное условие?')) {
                onRemove(cond.id);
              }
            }}
          >
            &#x1f5d1;
          </button>
        </div>
      ))}
      {filtered.length === 0 && (
        <div style={{ padding: '8px 0', color: '#64748b', fontStyle: 'italic', fontSize: 12 }}>
          Отлагательные условия не добавлены
        </div>
      )}
      <button className="sc-add-btn" onClick={() => onAdd(entityId)}>
        + Добавить условие
      </button>
    </div>
  );
};
