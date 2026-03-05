// Типы сделок
export type DealType = 'type0' | 'type1' | 'type1_guarantor' | 'type2' | 'type2_guarantor';

// Этапы проверки
export type VerificationStage = 'full' | 'pre_disbursement' | 'special_program';

// Оценка параметра
export type Assessment = 'Да' | 'Нет' | null;

// Уровень параметра
export type ParameterLevel = 'stop' | 'ul' | 'regular';

// Проверка одного параметра
export interface ParameterCheck {
  id: string;
  name: string;
  level: ParameterLevel;
  assessment: Assessment;        // Автооценка
  correction: Assessment;        // Корректировка андеррайтером
  comment: string;
  autoComment: string;           // Автокомментарий из системы
}

// Результат проверки сущности
export type VerificationResult =
  | 'Соответствует требованиям'
  | 'Не соответствует требованиям'
  | 'Не соответствует требованиям. Требуется решение УЛ'
  | 'Не аккредитован'
  | 'Соответствует требованиям спец. программы. Необходима проверка финансовых ковенант'
  | 'Не соответствует требованиям спец. программы'
  | 'Не соответствует требованиям спец. программы, необходима проверка финансовых ковенант и решение УЛ'
  | null;

// Отлагательное условие
export interface SuspensiveCondition {
  id: string;
  referenceValue: string;  // Справочное значение
  text: string;            // Текст (ручная коррекция)
  entityId: string;        // К какой сущности относится
  verificationResult: string; // #12: Результат проверки (editable dropdown)
}

// Акционер/участник
export interface Shareholder {
  name: string;
  share: string;
  inn?: string;
  status?: 'Учредитель' | 'Акционер'; // #16
}

// Руководитель
export interface Director {
  name: string;
  position: string;
  inn?: string;
  birthDate?: string; // #15
}

// Договор лизинга (Федресурс)
export interface FedresursContract {
  leasingCompany: string;
  contractNumber: string;
  contractDate: string;
  contractEndDate: string;   // #13: Дата окончания
  leaseSubject: string;      // #13: Предмет лизинга
  dataSource: string;        // #13: Источник данных (НБКИ/ОКБ/Контур.Фокус/КК)
  amount: number;
  status: string;
}

// Кредитное обязательство в Банке
export interface BankObligation {
  contractNumber: string;
  contractDate: string;
  plannedCloseDate: string;  // #14: Дата планового закрытия
  currentDebt: number;       // #14: Текущая задолженность
  financingAmount: number;   // #14: Сумма финансирования
  status: string;            // #14: Статус
  lesseeInn: string;         // #14: ИНН ЛП
  leaseSubjects: string;     // #14: Предметы лизинга
  arrears: string;
  arrearsDays?: number;
}

// Юридическое лицо (любой участник сделки)
export interface LegalEntity {
  id: string;
  role: EntityRole;
  name: string;
  inn: string;
  kpp?: string;
  ogrn?: string;
  registrationDate: string;
  legalAddress: string;
  actualAddress?: string;
  okved: string;
  okvedName: string;
  clientType?: 'Новый' | 'Повторный';
  supplierType?: 'Белый список' | 'Новый' | 'Повторный' | 'Система';
  balanceCurrency?: number;
  majorDeal?: 'Является крупной сделкой' | 'Не является крупной сделкой' | null; // #19: точные значения
  relatedGroup?: string;
  shareholders: Shareholder[];
  directors: Director[];
  fedresursContracts: FedresursContract[];
  bankObligations: BankObligation[];
  parameters: ParameterCheck[];
  verificationResult: VerificationResult;
}

export type EntityRole = 'lessee' | 'guarantor' | 'supplier' | 'end_user';

// Предмет лизинга
export interface LeaseSubject {
  name: string;
  type: string;              // #9: Тип предмета лизинга
  serialNumber: string;      // #9: Серийный/заводской номер
  quantity: number;          // #10: Количество ед. к приобретению
  unitPrice: number;         // #10: Цена за 1 ед.
  cost: number;
  supplier: string;
  parameters: ParameterCheck[];
  verificationResult: VerificationResult;
}

// Спец. программа
export interface SpecialProgram {
  parameters: ParameterCheck[];
  verificationResult: VerificationResult;
}

// Тип заключения — базовые шаблоны (суффикс <Тип сделки> добавляется динамически)
export type ConclusionTypeTemplate =
  | 'Доработка'
  | 'Лизингополучатель соответствует всем требованиям, сделка рекомендована к реализации'
  | 'Лизингополучатель соответствует не всем требованиям, сделка рекомендована к реализации'
  | 'Лизингополучатель не соответствует всем требованиям, сделка не рекомендована к реализации'
  | 'Лизингополучатель не соответствует, при этом Поручитель соответствуют всем требованиям, сделка рекомендована к реализации'
  | 'Лизингополучатель и Поручитель соответствуют не всем требованиям, сделка рекомендована к реализации'
  | 'Лизингополучатель и Поручитель не соответствуют всем требованиям, сделка не рекомендована к реализации';

// Итоги проверок участников
export interface ParticipantSummary {
  entityId: string;
  entityName: string;
  role: EntityRole | 'lease_subject' | 'special_program';
  result: VerificationResult;
  failedParams: string[]; // #11: Параметры с несоответствием
}

// ПОС
export interface PosInfo {
  isPos: boolean;
  posName: string;              // #4: Наименование ПОС
  qualityCategory: string;      // #4: Категория качества
  reservePercent: number | null; // #4: Размер резерва (%)
  comment: string;              // #4: Комментарий
}

// Полное состояние сделки
export interface DealState {
  // Мета
  dealNumber: string;
  dealDate: string;
  dealType: DealType;
  verificationStage: VerificationStage;
  isRepeatedReview: boolean;
  hasSpecialProgram: boolean;           // #9: Спец. программа (чекбокс)
  specProgramResult: string;            // #9: Результат проверки спец. программы
  dealTypeKK: string;                   // #9: Тип сделки по данным КК
  dealTypeSPR: string;                  // #9: Тип сделки по данным СПР
  projectDescription: string;           // #9: Краткое описание проекта

  // Общие сведения
  leaseCost: number;
  advancePaymentPercent: number;        // #10: Аванс (%)
  advancePaymentRub: number;            // #10: Аванс (руб.)
  financingPercent: number;             // #10: Сумма финансирования (%)
  financingRub: number;                 // #10: Сумма финансирования (руб.)
  leaseTerm: number;
  monthlyPayment: number;
  interestRate: number;

  // Предмет лизинга
  leaseSubject: LeaseSubject;

  // Участники
  entities: LegalEntity[];

  // Спец. программа
  specialProgram: SpecialProgram | null;

  // Отлагательные условия
  suspensiveConditions: SuspensiveCondition[];

  // ПОС (#4: все поля read-only)
  pos: PosInfo;

  // Заключение
  conclusionType: ConclusionTypeTemplate | null;
  conclusionComment: string;
  executor: string;                     // #5: Исполнитель (read-only, системное)

  // Активная вкладка
  activeTab: string;
}
