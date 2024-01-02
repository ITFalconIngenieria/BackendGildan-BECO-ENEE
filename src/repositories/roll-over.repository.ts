import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {GestionEdboDataSource} from '../datasources';
import {RollOver, RollOverRelations} from '../models/roll-over.model';

export class RollOverRepository extends DefaultCrudRepository<
  RollOver,
  typeof RollOver.prototype.id,
  RollOverRelations
> {
  constructor(
    @inject('datasources.GestionEDBO') dataSource: GestionEdboDataSource,
  ) {
    super(RollOver, dataSource);
  }
}
