import axios from 'axios';
import {
  setLoading,
  setFetching,
  setAPIReady,
  setPages,
  setPosts,
  setUser,
  setPagination,
  setNotification
} from '../../actions/actions';
import Helpers from './helpers';
import store, { history } from '../../store';
import * as CONSTANTS from '../../constants/constants';

module.exports = {

  getToken() {
    return axios.defaults.headers.common.Authorization;
  },

  login(username, password) {
    store.dispatch(setAPIReady(false));
    store.dispatch(setFetching(true));
    axios.post(`${CONSTANTS.GHOST_PATH}authentication/token`, {
      grant_type: 'password',
      username,
      password,
      client_id: CONSTANTS.GHOST_CLIENT_ID,
      client_secret: CONSTANTS.GHOST_SECRET
    }).then((response) => {
      axios.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;

      axios.get(`${CONSTANTS.GHOST_PATH}users/me/?include=roles`).then((usersResponse) => {
        store.dispatch(setUser(usersResponse.data.users[0]));
        store.dispatch(setAPIReady(true));
        store.dispatch(setFetching(false));
      }).catch((error) => {
        store.dispatch(setNotification({ message: String(error), type: 'error' }));
      });
    }).catch((error) => {
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  },

  logout() {
    const token = this.getToken();
    axios.post(`${CONSTANTS.GHOST_PATH}authentication/revoke`, {
      token_type_hint: 'access_token',
      token: token.substring(7, token.length),
      client_id: CONSTANTS.GHOST_CLIENT_ID,
      client_secret: CONSTANTS.GHOST_SECRET
    }).then(() => {
      axios.defaults.headers.common.Authorization = '';
      store.dispatch(setPosts([]));
      store.dispatch(setUser(null));
      history.push('/');
    }).catch((error) => {
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  },

  loadData(location, isAdmin) {
    const pathname = location.pathname.charAt(0) === '/' ? location.pathname.substring(1) : location.pathname;
    let endpoint = `posts/slug/${pathname}`; // Post detail page by default
    const page = location.query.page || 1;
    const limit = 5;
    let requiresAdmin = false;
    store.dispatch(setLoading(true));

    if (pathname === '') {
      endpoint = `posts?limit=${limit}&page=${page}`; // All published posts
    } else if (pathname === 'admin') {
      requiresAdmin = true;
      endpoint = 'posts/?fields=author%2Cstatus%2Cpage%2Cid%2Ccreated_at%2Cslug%2Ctitle%2Cpage&limit=all&status=all&staticPages=all'; // All posts
    } else if (pathname.includes('authors/')) {
      endpoint = `posts/?limit=${limit}&page=${page}&filter=author%3A${pathname.substring(8, pathname.length)}`; // All posts
    } else if (pathname === 'admin/new') {
      requiresAdmin = true;
      endpoint = ''; // Don't load anything
      store.dispatch(setLoading(false));
    }

    if (pathname.match(/admin\/[^new].*/)) {
      requiresAdmin = true;
      endpoint = `posts/${pathname.replace('admin/', '')}/?status=all`; // Admin post
    }

    if (requiresAdmin && !isAdmin) {
      endpoint = '';
      history.push('/');
      store.dispatch(setNotification({ message: 'Not authorized', type: 'error' }));
    }

    if (pathname !== 'admin/new') {
      store.dispatch(setFetching(true));
    }

    if (endpoint) {
      const req = axios.get(`${CONSTANTS.GHOST_PATH}${endpoint}`, {
        params: {
          include: 'author',
          client_id: CONSTANTS.GHOST_CLIENT_ID,
          client_secret: CONSTANTS.GHOST_SECRET
        }
      });

      req.then((response) => {
        store.dispatch(setLoading(false));
        store.dispatch(setFetching(false));
        store.dispatch(setPosts(response.data.posts));
        if (response.data.meta && response.data.meta.pagination) {
          store.dispatch(setPagination(response.data.meta.pagination));
        }
      }).catch((error) => {
        store.dispatch(setLoading(false));
        store.dispatch(setFetching(false));
        store.dispatch(setNotification({ message: String(error), type: 'error' }));
      });

      return req;
    }
    return null;
  },

  loadPages() {
    axios.get(`${CONSTANTS.GHOST_PATH}posts/?filter=page:true&fields=id%2Cslug%2Ctitle&limit=all&status=published&staticPages=all`, {
      params: {
        client_id: CONSTANTS.GHOST_CLIENT_ID,
        client_secret: CONSTANTS.GHOST_SECRET
      }
    }).then((response) => {
      store.dispatch(setPages(response.data.posts));
    }).catch((error) => {
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  },

  uploadFile(file) {
    const formData = new FormData();
    formData.append('uploadimage', file);
    return axios.post(`${CONSTANTS.GHOST_PATH}uploads`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updatePost(id, author, title, content, featuredImage, page, status, published_at) {
    store.dispatch(setFetching(true));
    const postContent = {
      version: '0.3.1',
      markups: [],
      atoms: [],
      cards: [
        ['card-markdown', {
          cardName: 'card-markdown',
          markdown: content
        }]
      ],
      sections: [[10, 0]]
    };

    const data = {
      posts: [{
        author,
        status,
        title: title || 'Untitled',
        feature_image: featuredImage,
        page,
        mobiledoc: JSON.stringify(postContent)
      }]
    };

    if (id) { data.posts[0].slug = Helpers.slugify(title); }
    if (published_at) { data.posts[0].published_at = published_at; }

    const req = axios({
      method: id ? 'put' : 'post',
      url: `${CONSTANTS.GHOST_PATH}posts/${id}`,
      data
    });

    req.then(() => {
      store.dispatch(setFetching(false));
      if (status === 'published') {
        const message = CONSTANTS.POST_PUBLISHED;
        store.dispatch(setNotification({ message, type: 'success' }));
      }

      if (page) {
        this.loadPages();
      }
    }).catch((error) => {
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });

    return req;
  },

  deletePost(id) {
    store.dispatch(setFetching(true));
    axios.delete(`${CONSTANTS.GHOST_PATH}posts/${id}`)
    .then(() => {
      this.loadPages();
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: CONSTANTS.POST_DELETED, type: 'success' }));
      history.push('/admin');
    }).catch((error) => {
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  },

  search() {
    store.dispatch(setFetching(true));
    const req = axios.get(`${CONSTANTS.GHOST_PATH}posts?fields=id%2Cslug%2Ctitle%2Cpage%2Cfeature_image%2Cauthor%2Cpublished_at&limit=all&status=published`, {
      params: {
        include: 'author',
        client_id: CONSTANTS.GHOST_CLIENT_ID,
        client_secret: CONSTANTS.GHOST_SECRET
      }
    });

    req.then(() => {
      store.dispatch(setFetching(false));
    }).catch((error) => {
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });

    return req;
  }
};
