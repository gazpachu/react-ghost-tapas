import { omit } from 'lodash';
import * as CONSTANTS from '../constants/constants';

// State is not the application state, only the state this reducer is respondible for
export default function main(state = {
  start: null,
  user: null,
  posts: [],
  pages: [],
  isAdmin: true,
  isLoading: true,
  apiReady: true,
  isFetching: false,
  isDesktop: true,
  loginOpened: false,
  pagination: {},
  notification: { message: '', type: '' },
  historyLocation: null
}, action) {
  switch (action.type) {
    case CONSTANTS.RESET_RESOURCE: return omit(state, action.payload);
    case CONSTANTS.SET_LOGIN_OPENED: return { ...state, loginOpened: action.payload };
    case CONSTANTS.SET_POSTS: return { ...state, posts: action.payload };
    case CONSTANTS.SET_PAGES: return { ...state, pages: action.payload };
    case CONSTANTS.SET_PAGINATION: return { ...state, pagination: action.payload };
    case CONSTANTS.SET_USER: return { ...state, user: action.payload };
    case CONSTANTS.SET_LOADING: return { ...state, isLoading: action.payload };
    case CONSTANTS.SET_FETCHING: return { ...state, isFetching: action.payload };
    case CONSTANTS.SET_DESKTOP: return { ...state, isDesktop: action.payload };
    case CONSTANTS.SET_NOTIFICATION: return { ...state, notification: action.payload };
    case CONSTANTS.SET_API_READY: return { ...state, apiReady: action.payload };
    case CONSTANTS.LOCATION_UPDATE: return { ...state, historyLocation: action.payload };
    default: return state;
  }
}
