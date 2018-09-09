// Copyright (c) Microsoft. All rights reserved.

import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Deployments } from './deployments';
import {
  getCreateDeploymentError,
  getCreateDeploymentPendingStatus,
  getDeployments,
  getDeploymentsLastUpdated,
  epics as deploymentsEpics
} from 'store/reducers/deploymentsReducer';

// Pass the global info needed
const mapStateToProps = state => ({
  isPending: getCreateDeploymentPendingStatus(state),
  error: getCreateDeploymentError(state),
  deployments: getDeployments(state),
  lastUpdated: getDeploymentsLastUpdated(state)
});

// Wrap the dispatch methods
const mapDispatchToProps = dispatch => ({
  fetchDeployments: () => dispatch(deploymentsEpics.actions.fetchdeployments())
});

export const DeploymentsContainer = translate()(connect(mapStateToProps, mapDispatchToProps)(Deployments));
