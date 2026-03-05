import { DealState, DealType, LegalEntity, VerificationStage } from '../types/deal';
import {
  LESSEE_PARAMS_TYPE0,
  LESSEE_PARAMS_TYPE12,
  GUARANTOR_PARAMS,
  SUPPLIER_PARAMS,
  END_USER_PARAMS,
  SPECIAL_PROGRAM_PARAMS,
  LEASE_SUBJECT_CHECK_PARAMS,
  createParameterChecks,
} from './parameterDefinitions';

function makeLessee(dealType: DealType): LegalEntity {
  const paramDefs = dealType === 'type0' ? LESSEE_PARAMS_TYPE0 : LESSEE_PARAMS_TYPE12;
  return {
    id: 'lessee_1',
    role: 'lessee',
    name: 'ООО «МедТехСервис»',
    inn: '7710123456',
    kpp: '771001001',
    ogrn: '1027700123456',
    registrationDate: '2018-03-15',
    legalAddress: 'г. Москва, ул. Профсоюзная, д. 15, оф. 301',
    actualAddress: 'г. Москва, ул. Профсоюзная, д. 15, оф. 301',
    okved: '46.46.1',
    okvedName: 'Торговля оптовая фармацевтической продукцией',
    clientType: 'Повторный',
    balanceCurrency: 125000,
    majorDeal: 'Не является крупной сделкой',
    relatedGroup: 'Группа «МедТех»',
    shareholders: [
      { name: 'Иванов Иван Иванович', share: '60%', inn: '771012345678', status: 'Учредитель' },
      { name: 'Петрова Анна Сергеевна', share: '40%', inn: '771098765432', status: 'Учредитель' },
    ],
    directors: [
      { name: 'Иванов Иван Иванович', position: 'Генеральный директор', inn: '771012345678', birthDate: '1975-04-12' },
    ],
    fedresursContracts: [
      {
        leasingCompany: 'АО «Лизинг-Финанс»',
        contractNumber: 'ДЛ-2023/456',
        contractDate: '2023-06-01',
        contractEndDate: '2026-06-01',
        leaseSubject: 'Аппарат УЗИ',
        dataSource: 'НБКИ',
        amount: 3500000,
        status: 'Действующий',
      },
    ],
    bankObligations: [
      {
        contractNumber: 'КД-2024/001',
        contractDate: '2024-01-15',
        plannedCloseDate: '2027-01-15',
        currentDebt: 3200000,
        financingAmount: 5000000,
        status: 'Действующий',
        lesseeInn: '7710123456',
        leaseSubjects: 'Аппарат УЗИ GE Vivid',
        arrears: 'Просрочка отсутствует',
      },
    ],
    parameters: createParameterChecks(paramDefs, true),
    verificationResult: 'Соответствует требованиям',
  };
}

function makeGuarantor(): LegalEntity {
  return {
    id: 'guarantor_1',
    role: 'guarantor',
    name: 'ООО «МедХолдинг»',
    inn: '7720654321',
    kpp: '772001001',
    ogrn: '1027700654321',
    registrationDate: '2015-09-20',
    legalAddress: 'г. Москва, ул. Тверская, д. 22, стр. 1',
    actualAddress: 'г. Москва, ул. Тверская, д. 22, стр. 1',
    okved: '86.10',
    okvedName: 'Деятельность больничных организаций',
    clientType: 'Повторный',
    balanceCurrency: 850000,
    majorDeal: 'Не является крупной сделкой',
    relatedGroup: 'Группа «МедХолдинг»',
    shareholders: [
      { name: 'Сидоров Пётр Алексеевич', share: '100%', inn: '772012345678', status: 'Учредитель' },
    ],
    directors: [
      { name: 'Сидоров Пётр Алексеевич', position: 'Генеральный директор', inn: '772012345678', birthDate: '1970-08-25' },
    ],
    fedresursContracts: [],
    bankObligations: [
      {
        contractNumber: 'КД-2023/055',
        contractDate: '2023-03-10',
        plannedCloseDate: '2026-03-10',
        currentDebt: 7500000,
        financingAmount: 10000000,
        status: 'Действующий',
        lesseeInn: '7720654321',
        leaseSubjects: '',
        arrears: 'Просрочка отсутствует',
      },
    ],
    parameters: createParameterChecks(GUARANTOR_PARAMS, true),
    verificationResult: 'Соответствует требованиям',
  };
}

function makeSupplier(): LegalEntity {
  return {
    id: 'supplier_1',
    role: 'supplier',
    name: 'ООО «МедОборудование Плюс»',
    inn: '7730987654',
    kpp: '773001001',
    ogrn: '1027700987654',
    registrationDate: '2012-05-10',
    legalAddress: 'г. Москва, ул. Бутлерова, д. 17',
    okved: '32.50',
    okvedName: 'Производство медицинских инструментов и оборудования',
    supplierType: 'Повторный',
    shareholders: [
      { name: 'АО «ГлобалМед»', share: '100%', status: 'Учредитель' },
    ],
    directors: [
      { name: 'Козлов Андрей Владимирович', position: 'Генеральный директор', birthDate: '1968-11-03' },
    ],
    fedresursContracts: [],
    bankObligations: [],
    parameters: createParameterChecks(SUPPLIER_PARAMS, true),
    verificationResult: 'Соответствует требованиям',
  };
}

function makeEndUser(): LegalEntity {
  return {
    id: 'end_user_1',
    role: 'end_user',
    name: 'ГБУЗ «Городская клиническая больница №7»',
    inn: '7740111222',
    kpp: '774001001',
    ogrn: '1027700111222',
    registrationDate: '2005-01-20',
    legalAddress: 'г. Москва, ул. Каширское шоссе, д. 24',
    actualAddress: 'г. Москва, ул. Каширское шоссе, д. 24',
    okved: '86.10',
    okvedName: 'Деятельность больничных организаций',
    clientType: 'Новый',
    balanceCurrency: 2500000,
    relatedGroup: '',
    shareholders: [],
    directors: [
      { name: 'Новикова Елена Петровна', position: 'Главный врач', birthDate: '1972-06-18' },
    ],
    fedresursContracts: [],
    bankObligations: [],
    parameters: createParameterChecks(END_USER_PARAMS, true),
    verificationResult: 'Соответствует требованиям',
  };
}

export interface MockScenario {
  label: string;
  dealType: DealType;
  stage: VerificationStage;
  description: string;
}

export const MOCK_SCENARIOS: MockScenario[] = [
  {
    label: 'Тип 1 с поручителем + Полная проверка',
    dealType: 'type1_guarantor',
    stage: 'full',
    description: 'Показывает все вкладки и блоки',
  },
  {
    label: 'Тип 0 + Полная проверка',
    dealType: 'type0',
    stage: 'full',
    description: 'Упрощённый: без поручителя',
  },
  {
    label: 'Проверка перед выдачей',
    dealType: 'type1',
    stage: 'pre_disbursement',
    description: 'Только ОИ + ЛП + Поставщик',
  },
  {
    label: 'Проверка спец. программы',
    dealType: 'type0',
    stage: 'special_program',
    description: 'Только ОИ + Спец. программа',
  },
];

export function createMockDeal(dealType: DealType, stage: VerificationStage): DealState {
  const hasGuarantor = dealType === 'type1_guarantor' || dealType === 'type2_guarantor';
  const entities: LegalEntity[] = [makeLessee(dealType)];

  if (hasGuarantor && stage === 'full') {
    entities.push(makeGuarantor());
  }
  if (stage === 'full' || stage === 'pre_disbursement') {
    entities.push(makeSupplier());
  }
  if (stage === 'full') {
    entities.push(makeEndUser());
  }

  const dealTypeKKLabel = dealType === 'type0' ? 'Тип 0' :
    dealType === 'type1' ? 'Тип 1' :
    dealType === 'type1_guarantor' ? 'Тип 1 с поручителем' :
    dealType === 'type2' ? 'Тип 2' : 'Тип 2 с поручителем';

  return {
    dealNumber: 'ЛМ-2026/00142',
    dealDate: '2026-02-20',
    dealType,
    verificationStage: stage,
    isRepeatedReview: false,
    hasSpecialProgram: stage === 'special_program',
    specProgramResult: stage === 'special_program' ? 'Соответствует требованиям спец. программы' : '',
    dealTypeKK: dealTypeKKLabel,
    dealTypeSPR: dealTypeKKLabel,
    projectDescription: 'Приобретение аппарата МРТ для ГБУЗ «ГКБ №7» в рамках программы модернизации диагностического оборудования',

    leaseCost: 12500000,
    advancePaymentPercent: 20,
    advancePaymentRub: 2500000,
    financingPercent: 80,
    financingRub: 10000000,
    leaseTerm: 36,
    monthlyPayment: 340000,
    interestRate: 18.5,

    leaseSubject: {
      name: 'Аппарат МРТ Siemens MAGNETOM Sola 1.5T',
      type: 'Медицинское оборудование',
      serialNumber: 'SN-2025-MAGNETOM-00142',
      quantity: 1,
      unitPrice: 12500000,
      cost: 12500000,
      supplier: 'ООО «МедОборудование Плюс»',
      parameters: createParameterChecks(LEASE_SUBJECT_CHECK_PARAMS, true),
      verificationResult: 'Соответствует требованиям',
    },

    entities,

    specialProgram: stage === 'special_program'
      ? {
          parameters: createParameterChecks(SPECIAL_PROGRAM_PARAMS, true),
          verificationResult: 'Соответствует требованиям спец. программы. Необходима проверка финансовых ковенант',
        }
      : null,

    suspensiveConditions: [
      {
        id: 'sc_1',
        referenceValue: 'Предоставить заверенные копии учредительных документов',
        text: 'Предоставить заверенные копии учредительных документов',
        entityId: 'lessee_1',
        verificationResult: '',
      },
    ],

    pos: {
      isPos: false,
      posName: '',
      qualityCategory: '',
      reservePercent: null,
      comment: '',
    },

    conclusionType: null,
    conclusionComment: '',
    executor: 'Смирнов А.В.',

    activeTab: 'main',
  };
}
