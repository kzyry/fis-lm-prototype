import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DealState,
  DealType,
  VerificationStage,
  Assessment,
  ConclusionTypeTemplate,
  SuspensiveCondition,
  ParameterCheck,
} from '../types/deal';
import { createMockDeal } from '../data/mockDeal';
import { evaluateParameters, evaluateSpecialProgram, evaluateLeaseSubject } from '../logic/evaluationAlgorithm';

interface DealStore extends DealState {
  loadScenario: (dealType: DealType, stage: VerificationStage) => void;
  setActiveTab: (tabId: string) => void;
  updateEntityParameter: (entityId: string, paramId: string, correction: Assessment, comment: string) => void;
  updateLeaseSubjectParameter: (paramId: string, correction: Assessment, comment: string) => void;
  updateSpecialProgramParameter: (paramId: string, correction: Assessment, comment: string) => void;
  addSuspensiveCondition: (entityId: string) => void;
  removeSuspensiveCondition: (conditionId: string) => void;
  updateSuspensiveCondition: (conditionId: string, field: 'referenceValue' | 'text' | 'verificationResult', value: string) => void;
  setConclusionType: (value: ConclusionTypeTemplate | null) => void;
  setConclusionComment: (value: string) => void;
  setMajorDeal: (entityId: string, value: 'Является крупной сделкой' | 'Не является крупной сделкой') => void;
  setClientType: (entityId: string, value: 'Новый' | 'Повторный') => void;
}

const initialDeal = createMockDeal('type1_guarantor', 'full');

const isEmbedMode = new URLSearchParams(window.location.search).get('embed') === '1';

const storeCreator: StateCreator<DealStore> = (set, get) => ({
  ...initialDeal,

  loadScenario: (dealType, stage) => {
    const deal = createMockDeal(dealType, stage);
    set({ ...deal });
  },

  setActiveTab: (tabId) => set({ activeTab: tabId }),

  updateEntityParameter: (entityId, paramId, correction, comment) => {
    const state = get();
    const entities = state.entities.map(entity => {
      if (entity.id !== entityId) return entity;
      const parameters = entity.parameters.map(p =>
        p.id === paramId ? { ...p, correction, comment } : p
      );
      const verificationResult = evaluateParameters(parameters, entity.role, state.dealType);
      return { ...entity, parameters, verificationResult };
    });
    set({ entities });
  },

  updateLeaseSubjectParameter: (paramId, correction, comment) => {
    const state = get();
    const parameters = state.leaseSubject.parameters.map(p =>
      p.id === paramId ? { ...p, correction, comment } : p
    );
    const verificationResult = evaluateLeaseSubject(parameters);
    set({ leaseSubject: { ...state.leaseSubject, parameters, verificationResult } });
  },

  updateSpecialProgramParameter: (paramId, correction, comment) => {
    const state = get();
    if (!state.specialProgram) return;
    const parameters = state.specialProgram.parameters.map(p =>
      p.id === paramId ? { ...p, correction, comment } : p
    );
    const verificationResult = evaluateSpecialProgram(parameters);
    set({ specialProgram: { ...state.specialProgram, parameters, verificationResult } });
  },

  addSuspensiveCondition: (entityId) => {
    const state = get();
    const newCond: SuspensiveCondition = {
      id: `sc_${Date.now()}`,
      referenceValue: '',
      text: '',
      entityId,
      verificationResult: '',
    };
    set({ suspensiveConditions: [...state.suspensiveConditions, newCond] });
  },

  removeSuspensiveCondition: (conditionId) => {
    const state = get();
    set({ suspensiveConditions: state.suspensiveConditions.filter(c => c.id !== conditionId) });
  },

  updateSuspensiveCondition: (conditionId, field, value) => {
    const state = get();
    set({
      suspensiveConditions: state.suspensiveConditions.map(c =>
        c.id === conditionId ? { ...c, [field]: value } : c
      ),
    });
  },

  setConclusionType: (value) => set({ conclusionType: value }),
  setConclusionComment: (value) => set({ conclusionComment: value }),

  setMajorDeal: (entityId, value) => {
    const state = get();
    set({
      entities: state.entities.map(e =>
        e.id === entityId ? { ...e, majorDeal: value } : e
      ),
    });
  },

  setClientType: (entityId, value) => {
    const state = get();
    set({
      entities: state.entities.map(e =>
        e.id === entityId ? { ...e, clientType: value } : e
      ),
    });
  },
});

export const useDealStore = isEmbedMode
  ? create<DealStore>()(storeCreator)
  : create<DealStore>()(persist(storeCreator, { name: 'lm-spr-deal-store' }));
