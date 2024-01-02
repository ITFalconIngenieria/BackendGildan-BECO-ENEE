import {inject, lifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'conn',
  connector: 'mssql',
  // url: 'mssql://sa:control1*@LAPTOPIT/1433/GildanConstancias',
  host: 'LAPTOPIT',
  port: 1433,
  user: 'sa',
  password: 'control1*',
  database: 'GildanConstancias',
  options: {
    enableArithAbort: true,
  },
};

// const config = {
//   name: 'GestionEDBO',
//   connector: 'mssql',
//   url: 'mssql://sa:admin1@localhost/GestionEnergetica',
//   host: 'localhost',
//   port: 1433,
//   user: 'sa',
//   password: 'admin1',
//   database: 'GestionEnergetica',
//   options: {
//     enableArithAbort: true,
//   },
// };

// const config = {
//   name: 'GestionEDBO',
//   connector: 'mssql',
//   url: '',
//   host: 'SVR-MONITOREO\\ION',
//   port: 1433,
//   user: 'facturacion',
//   password: 'falcon1',
//   database: 'GestionEnergetica',
//   options: {
//     enableArithAbort: true,
//   },
// };

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
