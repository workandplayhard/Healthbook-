import create from 'zustand';

export const useFormStateStore = create<{
  formState: unknown;
  files: any[];
  body_sites: string[];
  setFormState: (state: any) => void;
  setFiles: (files: any) => void;
  setBodySites: (body_sites: string[]) => void;
}>(set => ({
  formState: {},
  files: [],
  body_sites: [],
  setFormState: state => set({ formState: state }),
  setFiles: files => set({ files }),
  setBodySites: body_sites => set({ body_sites }),
}));
