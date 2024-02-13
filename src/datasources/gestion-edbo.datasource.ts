import {inject, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'GestionEDBO',
  connector: 'mssql',
  url: 'mssql://sa:admin1@JOKSAN-IT/gildan/GildanConstancias',
  host: 'JOKSAN-IT\\GILDAN',
  port: 1433,
  user: 'sa',
  password: 'admin1',
  database: 'GildanConstancias',
  requestTimeout: 300000,
  options: {
    enableArithAbort: true,
  },
};


@lifeCycleObserver('datasource')
export class GestionEdboDataSource extends juggler.DataSource {
  static dataSourceName = 'GestionEDBO';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.GestionEDBO', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
