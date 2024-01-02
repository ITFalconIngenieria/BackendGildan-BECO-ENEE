import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {report, reportRelations} from '../models/reports.model';
export class reportRepository extends DefaultCrudRepository<
  report,
  typeof report.prototype.id,
  reportRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(report, dataSource);
  }
}
