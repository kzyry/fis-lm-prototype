// Типы полей формы
export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'textarea'
  | 'link'
  | 'readonly';

// Источник данных поля
export type DataSource = 'КК' | 'Контур.Фокус' | 'ЦФТ' | 'Система' | 'Ручной ввод';

// Определение поля формы
export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  source: DataSource;
  editable: boolean;
  required?: boolean;
  options?: string[];        // Для dropdown
  formula?: string;          // Для вычисляемых полей
  conditionalRequired?: string; // Условная обязательность
}

// Определение блока формы
export interface BlockDef {
  id: string;
  title: string;
  fields: FieldDef[];
  visible?: boolean;
  collapsible?: boolean;
}
