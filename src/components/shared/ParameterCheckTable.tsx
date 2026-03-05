import React from 'react';
import { ParameterCheck, Assessment } from '../../types/deal';
import { isParameterFailed, isCommentRequired } from '../../logic/evaluationAlgorithm';

interface ParameterCheckTableProps {
  parameters: ParameterCheck[];
  onUpdate: (paramId: string, correction: Assessment, comment: string) => void;
  readOnly?: boolean;
}

export const ParameterCheckTable: React.FC<ParameterCheckTableProps> = ({
  parameters,
  onUpdate,
  readOnly = false,
}) => {
  return (
    <table className="param-table">
      <thead>
        <tr>
          <th style={{ width: '30px' }}>#</th>
          <th>Параметр</th>
          <th style={{ width: '50px' }}>Тип</th>
          <th style={{ width: '70px' }}>Оценка</th>
          {!readOnly && <th style={{ width: '100px' }}>Корректировка</th>}
          <th style={{ width: '200px' }}>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        {parameters.map((p, idx) => {
          const failed = isParameterFailed(p);
          const commentReq = isCommentRequired(p);
          const effectiveValue = p.correction !== null ? p.correction : p.assessment;

          return (
            <tr key={p.id} className={failed ? 'param-failed' : ''}>
              <td>{idx + 1}</td>
              <td className="param-name">
                {p.name}
              </td>
              <td>
                <span className={`param-level ${p.level}`}>
                  {p.level === 'stop' ? 'СТОП' : p.level === 'ul' ? 'УЛ' : '—'}
                </span>
              </td>
              <td>
                <span className={p.assessment === 'Да' ? 'assessment-yes' : 'assessment-no'}>
                  {p.assessment ?? '—'}
                </span>
              </td>
              {!readOnly && (
                <td>
                  <select
                    value={p.correction ?? ''}
                    onChange={e => {
                      const val = e.target.value === '' ? null : (e.target.value as Assessment);
                      onUpdate(p.id, val, p.comment);
                    }}
                  >
                    <option value="">—</option>
                    <option value="Да">Да</option>
                    <option value="Нет">Нет</option>
                  </select>
                </td>
              )}
              <td>
                {readOnly ? (
                  <span>{p.comment || p.autoComment || '—'}</span>
                ) : (
                  <input
                    type="text"
                    className={commentReq && !p.comment ? 'comment-required' : ''}
                    placeholder={commentReq ? 'Обязательный комментарий' : ''}
                    value={p.comment}
                    onChange={e => {
                      onUpdate(p.id, p.correction, e.target.value);
                    }}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
