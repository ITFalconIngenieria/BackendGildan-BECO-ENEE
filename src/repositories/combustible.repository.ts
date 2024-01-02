import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {combustible, combustibleRelations} from '../models/combustible.model';
export class combustibleRepository extends DefaultCrudRepository<
  combustible,
  typeof combustible.prototype.id,
  combustibleRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(combustible, dataSource);
  }
}
