import React, { ChangeEvent, MouseEvent, PureComponent } from 'react';
import { e2e } from '@grafana/e2e';

import { dispatch } from '../../../store/store';
import {
  changeVariableHide,
  changeVariableLabel,
  changeVariableName,
  changeVariableType,
  toVariablePayload,
  variableEditorMounted,
  variableEditorUnMounted,
} from '../state/actions';
import { variableAdapters } from '../adapters';
import { VariableState } from '../state/types';
import { VariableHide, VariableType } from '../variable';
import { FormLabel } from '@grafana/ui';

export class VariableEditor extends PureComponent<VariableState> {
  componentDidMount(): void {
    dispatch(variableEditorMounted(toVariablePayload(this.props.variable)));
  }

  componentWillUnmount(): void {
    dispatch(variableEditorUnMounted(toVariablePayload(this.props.variable)));
  }

  onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatch(changeVariableName(this.props.variable, event.target.value));
  };

  onTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    dispatch(changeVariableType(this.props.variable, event.target.value as VariableType));
  };

  onLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    dispatch(changeVariableLabel(toVariablePayload(this.props.variable, event.target.value)));
  };

  onHideChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    dispatch(
      changeVariableHide(toVariablePayload(this.props.variable, parseInt(event.target.value, 10) as VariableHide))
    );
  };

  onUpdateClicked = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.props.editor.valid) {
      return;
    }
    await variableAdapters.get(this.props.variable.type).onEditorUpdate(this.props.variable);
  };

  onAddClicked = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('onAddClicked');
  };

  render() {
    const EditorToRender = variableAdapters.get(this.props.variable.type).editor;
    if (!EditorToRender) {
      return null;
    }

    return (
      <div>
        <form aria-label="Variable editor Form">
          <h5 className="section-heading">General</h5>
          <div className="gf-form-group">
            <div className="gf-form-inline">
              <div className="gf-form max-width-19">
                <span className="gf-form-label width-6">Name</span>
                <input
                  type="text"
                  className="gf-form-input"
                  name="name"
                  placeholder="name"
                  // ng-model="current.name"
                  required
                  value={this.props.editor.name}
                  onChange={this.onNameChange}
                  // ng-pattern="namePattern"
                  aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.generalNameInput}
                />
              </div>
              <div className="gf-form max-width-19">
                <FormLabel width={6} tooltip={variableAdapters.get(this.props.variable.type).description}>
                  Type
                </FormLabel>
                <div className="gf-form-select-wrapper max-width-17">
                  <select
                    className="gf-form-input"
                    value={this.props.editor.type}
                    onChange={this.onTypeChange}
                    aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.generalTypeSelect}
                  >
                    <option label="Interval" value="interval">
                      Interval
                    </option>
                    <option label="Query" value="query">
                      Query
                    </option>
                    <option label="Datasource" value="datasource">
                      Datasource
                    </option>
                    <option label="Custom" value="custom">
                      Custom
                    </option>
                    <option label="Constant" value="constant">
                      Constant
                    </option>
                    <option label="Ad hoc filters" value="adhoc">
                      Ad hoc filters
                    </option>
                    <option label="Text box" value="textbox">
                      Text box
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {this.props.editor.errors.name && (
              <div className="gf-form">
                <span className="gf-form-label gf-form-label--error">{this.props.editor.errors.name}</span>
              </div>
            )}

            <div className="gf-form-inline">
              <div className="gf-form max-width-19">
                <span className="gf-form-label width-6">Label</span>
                <input
                  type="text"
                  className="gf-form-input"
                  value={this.props.variable.label}
                  onChange={this.onLabelChange}
                  placeholder="optional display name"
                  aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.generalLabelInput}
                />
              </div>
              <div className="gf-form max-width-19">
                <span className="gf-form-label width-6">Hide</span>
                <div className="gf-form-select-wrapper max-width-15">
                  <select
                    className="gf-form-input"
                    value={this.props.variable.hide}
                    onChange={this.onHideChange}
                    aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.generalHideSelect}
                  >
                    <option label="" value={VariableHide.dontHide}>
                      {''}
                    </option>
                    <option label="" value={VariableHide.hideLabel}>
                      Label
                    </option>
                    <option label="" value={VariableHide.hideVariable}>
                      Variable
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {EditorToRender && <EditorToRender {...this.props} />}

          <div className="gf-form-button-row p-y-0">
            {this.props.variable.uuid && (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.onUpdateClicked}
                aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.updateButton}
              >
                Update
              </button>
            )}
            {!this.props.variable.uuid && (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.onAddClicked}
                aria-label={e2e.pages.Dashboard.Settings.Variables.Edit.General.selectors.addButton}
              >
                Add
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}