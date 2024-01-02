import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    mssql: {schema: 'dbo', table: 'getConsumoMedidores'},
  },
})
export class report extends Entity {
  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: 1,
    mssql: {
      columnName: 'sourceID',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  sourceID: number;


  @property({
    type: 'string',
    mssql: {
      columnName: 'displayName',
      dataType: 'varchar',
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  displayName?: string;


  @property({
    type: 'string',
    length: 50,
    mssql: {
      columnName: 'TimestampUTC',
      dataType: 'datetime',
      dataLength: 20,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  TimestampUTC?: Date;

  @property({
    type: 'string',
    mssql: {
      columnName: 'sourceName',
      dataType: 'varchar',
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  sourceName?: string;



  @property({
    type: 'number',
    required: false,
    precision: 10,
    scale: 0,
    id: 1,
    mssql: {
      columnName: 'quantityID',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  quantityID: number;

  @property({
    type: 'string',
    mssql: {
      columnName: 'quantityName',
      dataType: 'varchar',
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  quantityName?: string;

  @property({
    type: 'number',
    mssql: {
      columnName: 'Value',
      dataType: 'float',
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
  })
  Value?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<report>) {
    super(data);
  }
}

export interface reportRelations {
  // describe navigational properties here
}

export type reportWithRelations = report & reportRelations;
