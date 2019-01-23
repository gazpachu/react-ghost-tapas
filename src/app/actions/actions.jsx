import * as CONSTANTS from '../constants/constants';

export function locationDidUpdate(state) {
  return {
    type: CONSTANTS.LOCATION_UPDATE,
    payload: state
  };
}

export function setLoginOpened(state) {
  return {
    type: CONSTANTS.SET_LOGIN_OPENED,
    payload: state
  };
}

export function setUser(state) {
  return {
    type: CONSTANTS.SET_USER,
    payload: state
  };
}

export function setPages(state) {
  return {
    type: CONSTANTS.SET_PAGES,
    payload: state
  };
}

export function setPagination(state) {
  return {
    type: CONSTANTS.SET_PAGINATION,
    payload: state
  };
}

export function setPosts(state) {
  return {
    type: CONSTANTS.SET_POSTS,
    payload: state
  };
}

export function resetResource(resource) {
  return {
    type: CONSTANTS.RESET_RESOURCE,
    payload: resource
  };
}

export function setLoading(state) {
  return {
    type: CONSTANTS.SET_LOADING,
    payload: state
  };
}

export function setAPIReady(state) {
  return {
    type: CONSTANTS.SET_API_READY,
    payload: state
  };
}

export function setFetching(state) {
  return {
    type: CONSTANTS.SET_FETCHING,
    payload: state
  };
}

export function changeViewport(state) {
  return {
    type: CONSTANTS.SET_DESKTOP,
    payload: state
  };
}

export function setNotification(state) {
  return {
    type: CONSTANTS.SET_NOTIFICATION,
    payload: state
  };
}
