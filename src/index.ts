import {
  PluginOptions,
  Callback,
  PackageAccess,
  IPluginAuth,
  RemoteUser,
  Logger,
  Config
} from '@verdaccio/types';
import {
  getConflict,
  getForbidden,
  getNotFound,
  getUnauthorized,
  API_ERROR,
} from '@verdaccio/commons-api';
import { DynamoDBClient,  PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb"

import { authenticator } from 'otplib';
import { PluginConfig } from './types';


export default class Memory implements IPluginAuth<PluginConfig> {
  public _logger: Logger;
  public _config: {};
  public _app_config: PluginConfig;
  private client: DynamoDBClient;


  public constructor(
    config: PluginConfig,
    appOptions: PluginOptions<PluginConfig>
  ) {
    this._config = config;
    this._logger = appOptions.logger;
    this._app_config = appOptions.config;
    this._logger.debug(this._app_config)
    this.client = new DynamoDBClient({ 
      region: this._app_config.region, 
      credentials:{
        accessKeyId:this._app_config.accessKeyId,
        secretAccessKey:this._app_config.secretAccessKey,
        sessionToken:this._app_config.sessionToken
      }
    })
  }

  public authenticate(user: string, password: string, done: Callback): void {
    const command = new GetItemCommand({
      TableName: this._app_config.LoginTableName,
      Key: {
        username: {
          S: user
        }
      }
    })

    this.client.send(command)
      .then(results => {
        if (!results.Item)
          return done(null, false)
        const userCredentials = results.Item.password.S as string;
        const [asciiPassword, key] = password.split(' ');
        const [expectedPassword, secret] = userCredentials.split(' ');

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
        return done(null, [user]);
      })



    // authentication succeeded!
    // return all usergroups this user has access to;
  }

  public adduser(user: string, password: string, done: Callback): void {
    const command = new PutItemCommand({
      TableName: this._app_config.LoginTableName,
      Item: {
        username: {
          S: user
        },
        password: {
          S: password
        }
      }
    })
    this.client.send(command)
      .then(() => done(null, user))
  }

  // public changePassword(
  //   username: string,
  //   password: string,
  //   newPassword: string,
  //   cb: Callback
  // ): void {
  //   const user: UserMemory = this._users[username];

  //   if (user && user.password === password) {
  //     user.password = newPassword;
  //     this._users[username] = user;
  //     cb(null, user);
  //   } else {
  //     const err = getNotFound('user not found');
  //     this._logger.debug({ user: username }, 'change password user  @{user} not found');
  //     return cb(err);
  //   }
  // }

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
