// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeploymentNew } from './deploymentNew';
import {
  getCreateDeploymentError,
  getCreateDeploymentPendingStatus,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';
import { epics as packagesEpics,
  getPackages } from 'store/reducers/packagesReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  packages: getPackages(state),
  isPending: getCreateDeploymentPendingStatus(state),
  createError: getCreateDeploymentError(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  createDeployment: deploymentModel => dispatch(deploymentsEpics.actions.createDeployment(deploymentModel)),
  fetchPackages: () => dispatch(packagesEpics.actions.fetchPackages()),
});

export const DeploymentNewContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeploymentNew));
