export class FormStore {
  createInputText: string = '';

  updateInputText: string = '';

  createInputColor: string = '#000000';

  updateInputColor: string = '#000000';

  editId?: number;
}

export const formStore = new FormStore();
