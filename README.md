# sails-rest-adapter

Provides easy access to `sails-rest-adapter` from Sails.js & Waterline.

This module is a Sails/Waterline community adapter.  Its goal is to provide a set of declarative interfaces, conventions, and best-practices for integrating with the sails-rest-adapter database/service.

Strict adherence to an adapter specification enables the (re)use of built-in generic test suites, standardized documentation, reasonable expectations around the API for your users, and overall, a more pleasant development experience for everyone.


## Installation

To install this adapter, run:

```sh
$ npm install sails-rest-adapter
```

Then [connect the adapter](https://sailsjs.com/documentation/reference/configuration/sails-config-datastores) to one or more of your app's datastores.

## Usage

Visit [Models & ORM](https://sailsjs.com/docs/concepts/models-and-orm) in the docs for more information about using models, datastores, and adapters in your app/microservice.

## Compatibility

This adapter implements the following methods:

| Method               | Status            | Category      |
|:---------------------|:------------------|:--------------|
| registerDatastore    | Done              | LIFECYCLE     |
| teardown             | Done              | LIFECYCLE     |
| create               | Done              | DML           |
| createEach           | Done              | DML           |
| update               | Done              | DML           |
| destroy              | Done              | DML           |
| find                 | Done              | DQL           |
| count                | Planned           | DQL           |

## License

This sails-rest-adapter adapter is available under the **MIT license**.
