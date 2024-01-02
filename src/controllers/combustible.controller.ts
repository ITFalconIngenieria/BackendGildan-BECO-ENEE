import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {viewOf} from '../core/library/views.library';
import {combustible} from '../models/combustible.model';
import {combustibleRepository} from '../repositories/combustible.repository';

@authenticate('admin', 'owner')
export class combustibleController {
  constructor(
    @repository(combustibleRepository)
    public combustibleRepository: combustibleRepository,
  ) { }

  @post('/combustible')
  @response(200, {
    description: 'combustible model instance',
    content: {'application/json': {schema: getModelSchemaRef(combustible)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(combustible, {
            title: 'Newcombustible',
            exclude: ['id'],
          }),
        },
      },
    })
    combustible: Omit<combustible, 'id'>,
  ): Promise<combustible> {
    return this.combustibleRepository.create(combustible);
  }

  @get('/combustible/count')
  @response(200, {
    description: 'combustible model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(combustible) where?: Where<combustible>): Promise<Count> {
    return this.combustibleRepository.count(where);
  }

  @get('/combustible')
  @response(200, {
    description: 'Array of combustible model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(combustible, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(combustible) filter?: Filter<combustible>): Promise<combustible[]> {
    return this.combustibleRepository.find(filter);
  }

  @patch('/combustible')
  @response(200, {
    description: 'combustible PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(combustible, {partial: true}),
        },
      },
    })
    combustible: combustible,
    @param.where(combustible) where?: Where<combustible>,
  ): Promise<Count> {
    return this.combustibleRepository.updateAll(combustible, where);
  }

  @get('/combustible/{id}')
  @response(200, {
    description: 'combustible model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(combustible, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(combustible, {exclude: 'where'}) filter?: FilterExcludingWhere<combustible>,
  ): Promise<combustible> {
    return this.combustibleRepository.findById(id, filter);
  }

  @patch('/combustible/{id}')
  @response(204, {
    description: 'combustible PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(combustible, {partial: true}),
        },
      },
    })
    combustible: combustible,
  ): Promise<void> {
    await this.combustibleRepository.updateById(id, combustible);
  }

  @put('/combustible/{id}')
  @response(204, {
    description: 'combustible PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() combustible: combustible,
  ): Promise<void> {
    await this.combustibleRepository.replaceById(id, combustible);
  }

  @del('/combustible/{id}')
  @response(204, {
    description: 'combustible DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.combustibleRepository.deleteById(id);
  }

  @get('/get-combustible/{id}')
  async Getcombustible(@param.path.number('id') id: number): Promise<any> {
    let datos = await this.dataCombustible(id);
    return datos;
  }

  async dataCombustible(id: number) {
    return await this.combustibleRepository.dataSource.execute(
      `${viewOf.getCombustibles} Where estado = ${id}`,
    );
  }
}
