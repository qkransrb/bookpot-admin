import { create } from "zustand";

interface AddBookFormStepStore {
  step: number;
  ebookId: number | null;
  onNext: (ebookId: number) => void;
  onReset: () => void;
}

const useAddBookFormStep = create<AddBookFormStepStore>((set) => ({
  step: 1,
  ebookId: null,
  onNext: (ebookId: number) => set({ step: 2, ebookId }),
  onReset: () => set({ step: 1, ebookId: null }),
}));

export default useAddBookFormStep;
