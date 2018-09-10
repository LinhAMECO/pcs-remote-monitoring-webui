// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import { packageTypeOptions } from 'services/models';
import { svgs, LinkedComponent, Validator } from 'utilities';
import {
  AjaxError,
  Btn,
  BtnToolbar,
  Flyout,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutCloseBtn,
  FlyoutContent,
  Indicator,
  FormControl,
  FormGroup,
  FormLabel,
  SummaryBody,
  SectionDesc,
  SummaryCount,
  SummarySection,
  Svg
} from 'components/shared';

import './deploymentNew.css';

export class DeploymentNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      packageType: undefined,
      deploymentFile: undefined,
      changesApplied: undefined
    };
  }

  apply = (event) => {
    event.preventDefault();
    const { createDeployment } = this.props;
    const { packageType, deploymentFile } = this.state;
    if (this.formIsValid()) {
      createDeployment({ packageType: packageType, deploymentFile: deploymentFile });
      this.setState({ changesApplied: true });
    }
  }

  onFileSelected = (e) => {
    let file = e.target.files[0];
    this.setState({ deploymentFile: file });
  }

  formIsValid = () => {
    return [
      this.packageTypeLink,
    ].every(link => !link.error);
  }

  render() {
    const { t, onClose, isPending, error } = this.props;
    const { deploymentFile, changesApplied } = this.state;

    const summaryCount = 1;
    const typeOptions = packageTypeOptions.map(value => ({
      label: t(`deployments.typeOptions.${value.toLowerCase()}`),
      value
    }));

    const completedSuccessfully = changesApplied && !error && !isPending;
    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('deployments.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('type').map(({ value }) => value).withValidator(requiredValidator);

    return (
      <Flyout>
        <FlyoutHeader>
          <FlyoutTitle>{t('deployments.flyouts.new.title')}</FlyoutTitle>
          <FlyoutCloseBtn onClick={onClose} />
        </FlyoutHeader>
        <FlyoutContent className="new-deployment-content">
          <form className="new-deployment-form" onSubmit={this.apply}>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.type')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.deviceGroup')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.name')}</FormLabel>
              <FormControl
                type="text"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.priority')}</FormLabel>
              <FormControl
                type="text"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.Package')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                link={this.packageTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.placeHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <SummarySection className="new-deployment-summary">
              <SummaryBody>
                {deploymentFile && <SummaryCount>{summaryCount}</SummaryCount>}
                {deploymentFile && <SectionDesc>{t('deployments.flyouts.new.deployment')}</SectionDesc>}
                {isPending && <Indicator />}
                {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
              </SummaryBody>
              {deploymentFile && <div className="new-deployment-file-name">{deploymentFile.name}</div>}
              {
                completedSuccessfully &&
                <div className="new-deployment-deployment-text">
                  {t('deployments.flyouts.new.deploymentText')}
                </div>
              }
              {/** Displays an error message if one occurs while applying changes. */
                error && <AjaxError className="new-deployment-flyout-error" t={t} error={error} />
              }
              {
                /** If deployment is selected, show the buttons for uploading and closing the flyout. */
                (deploymentFile && !completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.upload} primary={true} disabled={isPending || !this.formIsValid()} type="submit">{t('deployments.flyouts.new.upload')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** If deployment is not selected, show only the cancel button. */
                (!deploymentFile) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** After successful upload, show close button. */
                (completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.close')}</Btn>
                </BtnToolbar>
              }
            </SummarySection>
          </form>
        </FlyoutContent>
      </Flyout>
    );
  }
}
