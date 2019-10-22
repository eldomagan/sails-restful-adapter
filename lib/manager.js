const rp = require('request-promise');
const pluralizeName = require('pluralize');

const METHODS_MAP = {
  find: 'GET',
  count: 'GET',
  destroy: 'DELETE'
};

module.exports = function createManager (config) {
  const {
    pluralize = false,
    headers = {},
    json = true,
    normalizeCriteria = (criteria, count) => count ? Object.assign(criteria, { count }) : criteria,
    transformResponse = response => response
  } = config;

  const httpClient = rp.defaults({
    json,
    headers,
    baseUrl: config.url,
    transform: transformResponse
  });

  function wrapError (e) {
    const error = new Error();

    Object.keys(e).forEach(k => {
      error[k] = e[k];
    });

    return error;
  }

  function getResourcePrimaryKey (resource) {
    let model = sails.models[resource];

    if (!model) {
      const modelIdentity = Object.keys(sails.models)
        .find(model => sails.models[model].tableName === resource);

      if (modelIdentity) {
        model = sails.models[modelIdentity];
      }
    }

    return model ? model.primaryKey : null;
  }

  const manager = {
    request (query, count = false) {
      let { using: resource, criteria, method } = query;
      const pk = getResourcePrimaryKey(resource);

      if (pluralize) {
        resource = pluralizeName(resource);
      }

      let url = resource;

      criteria = normalizeCriteria(criteria, count);

      if (pk && criteria.where && criteria.where[pk]) {
        url += '/' + criteria.where[pk];
        criteria = null;
      }

      return httpClient({
        url,
        qs: criteria,
        method: METHODS_MAP[method]
      })
        .catch(error => {
          throw wrapError(error);
        });
    },

    find (query, count = false) {
      return manager.request(query, count)
        .then(response => Array.isArray(response) ? response : [response]);
    },

    count (query) {
      return manager.find(query, true);
    },

    create (query) {
      let { using: resource, newRecord, meta } = query;
      const pk = getResourcePrimaryKey(resource);

      if (pluralize) {
        resource = pluralizeName(resource);
      }

      const options = {
        url: resource,
        method: 'POST'
      };

      if (newRecord[pk]) {
        delete newRecord[pk];
      }

      if (json) {
        options.body = newRecord;
      } else {
        options.form = newRecord;
      }

      return httpClient(options)
        .then(response => meta && meta.fetch ? response : null)
        .catch(error => { throw wrapError(error); });
    },

    update (query) {
      let { using: resource, criteria, valuesToSet, meta } = query;
      const pk = getResourcePrimaryKey(resource);

      if (pluralize) {
        resource = pluralizeName(resource);
      }

      let url = resource;

      criteria = normalizeCriteria(criteria);

      if (pk && criteria.where && criteria.where[pk]) {
        url += '/' + criteria.where[pk];
        criteria = null;
      }

      const options = {
        method: 'PUT',
        criteria,
        url
      };

      if (json) {
        options.json = valuesToSet;
      } else {
        options.form = valuesToSet;
      }

      return httpClient(options)
        .then(response => response && !Array.isArray(response) ? [response] : response)
        .then(response => meta && meta.fetch ? response : null)
        .catch(error => { throw wrapError(error); });
    },

    destroy (query) {
      const { meta } = query;
      return manager.request(query)
        .then(response => meta && meta.fetch ? response : null);
    }
  };

  return manager;
};
