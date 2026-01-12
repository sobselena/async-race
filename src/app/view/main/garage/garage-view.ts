import { Button } from '../../../components/button/button-creator';
import { Form } from '../../../components/form/form-creator';
import { InputField } from '../../../components/input-field/input-field-creator';
import { Component } from '../../../utils/Component';
import { PaginationView } from '../pagination/pagination-view';
import './garage.scss';

export class GarageView extends Component {
  constructor() {
    super({ tag: 'div', classes: ['garage'] });

    this.configureView();
  }

  configureView() {
    super.appendChildren([this.createInfoWrapper(), this.createFormWrapper()]);
  }

  createInfoWrapper(): Component {
    const garageInfoWrapper = new Component({ tag: 'div', classes: ['garage__info-wrapper'] });
    const garageTitle = new Component({
      tag: 'h2',
      classes: ['garage__title'],
      text: 'Garage (0)',
    });
    const paginationEl = new PaginationView();
    garageInfoWrapper.appendChildren([garageTitle, this.createButtonsWrapper(), paginationEl]);

    return garageInfoWrapper;
  }

  createButtonsWrapper(): Component {
    const buttonsWrapper = new Component({ tag: 'div', classes: ['garage__buttons-wrapper'] });
    const generateButton = new Button({
      classes: ['garage__button', 'garage__button_generate'],
      text: 'Generate 100 Cars',
    });

    const startRaceButton = new Button({
      classes: ['garage__button', 'garage__button_start-race'],
      text: 'Start Race',
    });

    const resetButton = new Button({
      classes: ['garage__button', 'garage__button_reset'],
      text: 'Reset Race',
    });
    buttonsWrapper.appendChildren([generateButton, startRaceButton, resetButton]);
    return buttonsWrapper;
  }

  createFormWrapper(): Form {
    const formEl = new Form({ classes: ['garage__form', 'garage__form_creator'] });
    const textInput = new InputField({ classes: ['garage__text-input'], type: 'text' });
    const colorInput = new InputField({ classes: ['garage__color-input'], type: 'color' });
    const submitButton = new Button({ classes: ['garage__submit-button'], text: 'Create' });
    formEl.appendChildren([textInput, colorInput, submitButton]);

    return formEl;
  }
}
