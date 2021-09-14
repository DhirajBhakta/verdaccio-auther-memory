import { Config } from '@verdaccio/types';

export interface PluginConfig extends Config {
  endpoint:string,
  region:string,
  LoginTableName:string
}
