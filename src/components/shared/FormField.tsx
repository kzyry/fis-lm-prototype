import React from 'react';

interface FormFieldProps {
  label: string;
  value: string | number | null | undefined;
  editable?: boolean;
  type?: 'string' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea' | 'link';
  options?: string[];
  onChange?: (value: string) => void;
  linkHref?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  editable = false,
  type = 'string',
  options,
  onChange,
  linkHref,
}) => {
  const displayValue = value == null ? '—' : String(value);

  const renderValue = () => {
    if (!editable) {
      if (type === 'link' && linkHref) {
        return (
          <a className="spark-link" href={linkHref} target="_blank" rel="noopener noreferrer">
            {displayValue}
          </a>
        );
      }
      return <span>{displayValue}</span>;
    }

    if (type === 'dropdown' && options) {
      return (
        <select value={displayValue} onChange={e => onChange?.(e.target.value)}>
          <option value="">— Выберите —</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          value={displayValue === '—' ? '' : displayValue}
          onChange={e => onChange?.(e.target.value)}
        />
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="checkbox-field">
          <input
            type="checkbox"
            checked={displayValue === 'true' || displayValue === 'Да'}
            onChange={e => onChange?.(e.target.checked ? 'Да' : 'Нет')}
          />
          <span>{displayValue === 'true' || displayValue === 'Да' ? 'Да' : 'Нет'}</span>
        </div>
      );
    }

    return (
      <input
        type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
        value={displayValue === '—' ? '' : displayValue}
        onChange={e => onChange?.(e.target.value)}
      />
    );
  };

  return (
    <>
      <div className="field-label">{label}</div>
      <div className={`field-value${editable ? ' editable' : ''}`}>
        {renderValue()}
      </div>
    </>
  );
};
