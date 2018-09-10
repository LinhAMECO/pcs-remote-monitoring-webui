// Copyright (c) Microsoft. All rights reserved.

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { DeploymentNew } from './deploymentNew';
import {
  getCreateDeploymentError,
  getCreateDeploymentPendingStatus,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getCreateDeploymentPendingStatus(state),
  error: getCreateDeploymentError(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  createDeployment: deploymentModel => dispatch(deploymentsEpics.actions.createDeployment(deploymentModel))
});

export const DeploymentNewContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(DeploymentNew));
