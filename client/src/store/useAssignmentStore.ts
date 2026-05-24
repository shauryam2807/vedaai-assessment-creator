import { create } from 'zustand';
import { IGeneratedPaper, AssignmentFormData, IAssignment } from '../types';
import { api } from '../lib/api';

interface AssignmentState {
  currentAssignmentId: string | null;
  generationStatus: 'idle' | 'submitting' | 'processing' | 'completed' | 'failed';
  generationProgress: number;
  progressMessage: string;
  generatedPaper: IGeneratedPaper | null;
  error: string | null;
  assignments: IAssignment[];
  isLoadingAssignments: boolean;

  setAssignmentId: (id: string | null) => void;
  setStatus: (status: 'idle' | 'submitting' | 'processing' | 'completed' | 'failed') => void;
  setProgress: (progress: number, message?: string) => void;
  setPaper: (paper: IGeneratedPaper | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  submitAssignment: (data: AssignmentFormData) => Promise<string>;
  fetchPaper: (id: string) => Promise<void>;
  regenerate: (id: string) => Promise<void>;
  fetchAssignments: (search?: string) => Promise<void>;
  removeAssignment: (id: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  currentAssignmentId: null,
  generationStatus: 'idle',
  generationProgress: 0,
  progressMessage: '',
  generatedPaper: null,
  error: null,
  assignments: [],
  isLoadingAssignments: false,

  setAssignmentId: (id) => set({ currentAssignmentId: id }),
  setStatus: (status) => set({ generationStatus: status }),
  setProgress: (progress, message) => set((state) => ({ 
    generationProgress: progress,
    progressMessage: message || state.progressMessage
  })),
  setPaper: (paper) => set({ generatedPaper: paper }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    currentAssignmentId: null,
    generationStatus: 'idle',
    generationProgress: 0,
    progressMessage: '',
    generatedPaper: null,
    error: null
  }),

  submitAssignment: async (data) => {
    set({ generationStatus: 'submitting', error: null });
    try {
      const response = await api.createAssignment(data);
      set({ 
        currentAssignmentId: response.id,
        generationStatus: 'processing',
        generationProgress: 10,
        progressMessage: 'Assignment created. Preparing generation...'
      });
      return response.id;
    } catch (err: any) {
      set({ generationStatus: 'failed', error: err.message });
      throw err;
    }
  },

  fetchPaper: async (id) => {
    try {
      const paper = await api.getGeneratedPaper(id);
      set({ generatedPaper: paper, generationStatus: 'completed' });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  regenerate: async (id) => {
    set({ 
      generationStatus: 'processing', 
      generationProgress: 0,
      progressMessage: 'Restarting generation process...',
      error: null
    });
    try {
      await api.regenerateAssignment(id);
    } catch (err: any) {
      set({ generationStatus: 'failed', error: err.message });
      throw err;
    }
  },

  fetchAssignments: async (search?: string) => {
    set({ isLoadingAssignments: true, error: null });
    try {
      const assignments = await api.listAssignments(search);
      set({ assignments, isLoadingAssignments: false });
    } catch (err: any) {
      set({ error: err.message, isLoadingAssignments: false });
    }
  },

  removeAssignment: async (id: string) => {
    try {
      await api.deleteAssignment(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id)
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
