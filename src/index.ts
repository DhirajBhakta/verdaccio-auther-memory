import {
  PluginOptions,
  Callback,
  PackageAccess,
  IPluginAuth,
  RemoteUser,
  Logger,
} from '@verdaccio/types';
import {
  getConflict,
  getForbidden,
  getNotFound,
  getUnauthorized,
  API_ERROR,
} from '@verdaccio/commons-api';

import { authenticator } from 'otplib';
import { VerdaccioMemoryConfig, Users, UserMemory } from './types';


export default class Memory implements IPluginAuth<VerdaccioMemoryConfig> {
  public _logger: Logger;
  public _users: Users;
  public _config: {};
  public _app_config: VerdaccioMemoryConfig;

  public constructor(
    config: VerdaccioMemoryConfig,
    appOptions: PluginOptions<VerdaccioMemoryConfig>
  ) {
    this._users = config.users || {};
    this._config = config;
    this._logger = appOptions.logger;
    this._app_config = appOptions.config;
  }

  public authenticate(user: string, password: string, done: Callback): void {
    const userCredentials = this._users[user];

    if (!userCredentials) {
      return done(null, false);
    }
    const [asciiPassword, key] = password.split(' ');
    const [expectedPassword, secret] = userCredentials.password.split(' ');

    if (asciiPassword !== expectedPassword) {
      const err = getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD);
      return done(err);
    }
    const token = authenticator.generate(secret);
    console.log('\n\n\n', token, key, secret);

    if (token !== key) {
      const err = getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD);
      return done(err);
    }

    // authentication succeeded!
    // return all usergroups this user has access to;
    return done(null, [user]);
  }

  public adduser(user: string, password: string, done: Callback): void {
    if (this._users[user]) {
      return done(null, true);
    }

    if (this._app_config.max_users) {
      if (Object.keys(this._users).length >= this._app_config.max_users) {
        const err = getConflict(API_ERROR.MAX_USERS_REACHED);
        return done(err);
      }
    }

    this._users[user] = { name: user, password: password };

    done(null, user);
  }

  public changePassword(
    username: string,
    password: string,
    newPassword: string,
    cb: Callback
  ): void {
    const user: UserMemory = this._users[username];

    if (user && user.password === password) {
      user.password = newPassword;
      this._users[username] = user;
      cb(null, user);
    } else {
      const err = getNotFound('user not found');
      this._logger.debug({ user: username }, 'change password user  @{user} not found');
      return cb(err);
    }
  }

  public allow_access(user: RemoteUser, pkg: PackageAccess, cb: Callback): void {
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

  public allow_publish(user: RemoteUser, pkg: PackageAccess, cb: Callback): void {
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
