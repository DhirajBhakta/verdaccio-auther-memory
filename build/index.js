"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commonsApi = require("@verdaccio/commons-api");

var _otplib = require("otplib");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Memory {
  constructor(config, appOptions) {
    _defineProperty(this, "_logger", void 0);

    _defineProperty(this, "_users", void 0);

    _defineProperty(this, "_config", void 0);

    _defineProperty(this, "_app_config", void 0);

    this._users = config.users || {};
    this._config = config;
    this._logger = appOptions.logger;
    this._app_config = appOptions.config;
  }

  authenticate(user, password, done) {
    const userCredentials = this._users[user];

    if (!userCredentials) {
      return done(null, false);
    }

    const [asciiPassword, key] = password.split(' ');
    const [expectedPassword, secret] = userCredentials.password.split(' ');

    if (asciiPassword !== expectedPassword) {
      const err = (0, _commonsApi.getUnauthorized)(_commonsApi.API_ERROR.BAD_USERNAME_PASSWORD);
      return done(err);
    }

    const token = _otplib.authenticator.generate(secret);

    console.log('\n\n\n', token, key, secret);

    if (token !== key) {
      const err = (0, _commonsApi.getUnauthorized)(_commonsApi.API_ERROR.BAD_USERNAME_PASSWORD);
      return done(err);
    } // authentication succeeded!
    // return all usergroups this user has access to;


    return done(null, [user]);
  }

  adduser(user, password, done) {
    if (this._users[user]) {
      return done(null, true);
    }

    if (this._app_config.max_users) {
      if (Object.keys(this._users).length >= this._app_config.max_users) {
        const err = (0, _commonsApi.getConflict)(_commonsApi.API_ERROR.MAX_USERS_REACHED);
        return done(err);
      }
    }

    this._users[user] = {
      name: user,
      password: password
    };
    done(null, user);
  }

  changePassword(username, password, newPassword, cb) {
    const user = this._users[username];

    if (user && user.password === password) {
      user.password = newPassword;
      this._users[username] = user;
      cb(null, user);
    } else {
      const err = (0, _commonsApi.getNotFound)('user not found');

      this._logger.debug({
        user: username
      }, 'change password user  @{user} not found');

      return cb(err);
    }
  }

  allow_access(user, pkg, cb) {
    // if (pkg?.access?.includes('$all') || pkg?.access?.includes('$anonymous')) {
    //   return cb(null, true);
    // }
    // if (!user?.name) {
    //   const err = getForbidden('not allowed to access package');
    //   this._logger.debug({ user: user.name }, 'user: @{user} not allowed to access package');
    //   return cb(err);
    // }
    // if (pkg?.access?.includes(user?.name) || pkg?.access?.includes('$authenticated')) {
    //   return cb(null, true);
    // }
    // const err = getForbidden('not allowed to access package');
    // return cb(err);
    return cb(null, true);
  }

  allow_publish(user, pkg, cb) {
    // if (pkg?.publish?.includes('$all') || pkg?.publish?.includes('$anonymous')) {
    //   return cb(null, true);
    // }
    // if (!user?.name) {
    //   const err = getForbidden('not allowed to publish package');
    //   return cb(err);
    // }
    // if (pkg?.publish?.includes(user.name) || pkg?.publish?.includes('$authenticated')) {
    //   return cb(null, true);
    // }
    // const err = getForbidden('not allowed to publish package');
    // return cb(err);
    return cb(null, true);
  }

}

exports.default = Memory;
//# sourceMappingURL=index.js.map