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

const packageOptions = (packages) => {
  packages.map(({ id, name }) => ({
    label: id,
    value: name
  }))
}

export class DeploymentNew extends LinkedComponent {
  constructor(props) {
    super(props);

    this.state = {
      packageType: undefined,
      deviceGroupId: undefined,
      name: undefined,
      priority: undefined,
      packageId: undefined,
      changesApplied: undefined,
      packageOptions: undefined
    };
  }

  apply = (event) => {
    event.preventDefault();
    const { createDeployment } = this.props;
    const { packageType, deviceGroupId, name, priority, packageId } = this.state;
    if (this.formIsValid()) {
      createDeployment({ packageType, deviceGroupId, name, priority, packageId });
      this.setState({ changesApplied: true });
    }
  }

  formIsValid = () => {
    return [
      this.packageTypeLink,
      this.nameLink,
      this.deviceGroupIdTypeLink,
      this.priorityLink,
      this.packageIdLink
    ].every(link => !link.error);
  }

  onPackageSelected = () => {
    const { t } = this.props;
    switch (this.state.packageType) {
      // case Edge manifest
      case t(`deployments.typeOptions.${packageTypeOptions[0]}`):
        const { packages, fetchPackages } = this.props;
        fetchPackages();
        this.setState({
          packageOptions: packageOptions(packages)
        });
        break;
      // other cases to be impletmented in Edge walk iteration
      default:
        break;
    }
  }

  render() {
    const { t, onClose, isPending, createError } = this.props;
    const { type, changesApplied, packageOptions } = this.state;

    const summaryCount = 1;
    const typeOptions = packageTypeOptions.map(value => ({
      label: t(`deployments.typeOptions.${value.toLowerCase()}`),
      value
    }));

    const completedSuccessfully = changesApplied && !createError && !isPending;
    // Validators
    const requiredValidator = (new Validator()).check(Validator.notEmpty, t('deployments.flyouts.new.validation.required'));

    // Links
    this.packageTypeLink = this.linkTo('type').map(({ value }) => value).withValidator(requiredValidator);
    this.nameLink = this.linkTo('name').map(({ value }) => value).withValidator(requiredValidator);
    this.deviceGroupIdTypeLink = this.linkTo('deviceGroupId').map(({ value }) => value).withValidator(requiredValidator);
    this.priorityLink = this.linkTo('priority').map(({ value }) => value).withValidator(requiredValidator);
    this.packageIdLink = this.linkTo('packageId').map(({ value }) => value).withValidator(requiredValidator);
    const isPackageTypeSelected = type === undefined;

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
                onChange={this.onPackageSelected}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.typePlaceHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.deviceGroup')}</FormLabel>
              <FormControl
                type="select"
                disabled={isPackageTypeSelected}
                className="long"
                link={this.deviceGroupIdTypeLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.deviceGroupPlaceHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.name')}</FormLabel>
              <FormControl
                type="text"
                className="long"
                link={this.nameLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.namePlaceHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.priority')}</FormLabel>
              <FormControl
                type="text"
                className="long"
                link={this.priorityLink}
                options={typeOptions}
                placeholder={t('deployments.flyouts.new.priorityPlaceHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <FormGroup>
              <FormLabel isRequired="true">{t('deployments.flyouts.new.package')}</FormLabel>
              <FormControl
                type="select"
                className="long"
                disabled={isPackageTypeSelected}
                link={this.packageIdLink}
                options={packageOptions}
                placeholder={t('deployments.flyouts.new.packagePlaceHolder')}
                clearable={false}
                searchable={false} />
            </FormGroup>
            <SummarySection className="new-deployment-summary">
              <SummaryBody>
                {<SummaryCount>{summaryCount}</SummaryCount>}
                {<SectionDesc>{t('deployments.flyouts.new.deployment')}</SectionDesc>}
                {isPending && <Indicator />}
                {completedSuccessfully && <Svg className="summary-icon" path={svgs.apply} />}
              </SummaryBody>
              {
                completedSuccessfully &&
                <div className="new-deployment-deployment-text">
                  {t('deployments.flyouts.new.deploymentText')}
                </div>
              }
              {/** Displays an error message if one occurs while applying changes. */
                createError && <AjaxError className="new-deployment-flyout-error" t={t} error={createError} />
              }
              {
                /** If deployment is selected, show the buttons for uploading and closing the flyout. */
                (!completedSuccessfully) &&
                <BtnToolbar>
                  <Btn svg={svgs.upload} primary={true} disabled={isPending || !this.formIsValid()} type="submit">{t('deployments.flyouts.new.upload')}</Btn>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
              }
              {
                /** If deployment is not selected, show only the cancel button.

                <BtnToolbar>
                  <Btn svg={svgs.cancelX} onClick={onClose}>{t('deployments.flyouts.new.cancel')}</Btn>
                </BtnToolbar>
                */
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
