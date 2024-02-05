import {authenticate} from '@loopback/authentication';

import {service} from '@loopback/core';
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
import {report} from '../models/reports.model';
import {reportRepository} from '../repositories/reports.repository';
import {ReportService} from '../services/report.service';

@authenticate('admin', 'owner')
export class reportController {
  constructor(
    @repository(reportRepository)
    public reportRepository: reportRepository,
    @service(ReportService)
    private ReportService: ReportService,
  ) { }

  @post('/report')
  @response(200, {
    description: 'report model instance',
    content: {'application/json': {schema: getModelSchemaRef(report)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(report, {
            title: 'Newreport',
            exclude: ['id'],
          }),
        },
      },
    })
    report: Omit<report, 'id'>,
  ): Promise<report> {
    return this.reportRepository.create(report);
  }

  @get('/report/count')
  @response(200, {
    description: 'report model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(report) where?: Where<report>): Promise<Count> {
    return this.reportRepository.count(where);
  }

  @get('/report')
  @response(200, {
    description: 'Array of report model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(report, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(report) filter?: Filter<report>): Promise<report[]> {
    return this.reportRepository.find(filter);
  }

  @patch('/report')
  @response(200, {
    description: 'report PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(report, {partial: true}),
        },
      },
    })
    report: report,
    @param.where(report) where?: Where<report>,
  ): Promise<Count> {
    return this.reportRepository.updateAll(report, where);
  }

  @get('/report/{id}')
  @response(200, {
    description: 'report model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(report, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(report, {exclude: 'where'})
    filter?: FilterExcludingWhere<report>,
  ): Promise<report> {
    return this.reportRepository.findById(id, filter);
  }

  @patch('/report/{id}')
  @response(204, {
    description: 'report PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(report, {partial: true}),
        },
      },
    })
    report: report,
  ): Promise<void> {
    await this.reportRepository.updateById(id, report);
  }

  @put('/report/{id}')
  @response(204, {
    description: 'report PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() report: report,
  ): Promise<void> {
    await this.reportRepository.replaceById(id, report);
  }

  @del('/report/{id}')
  @response(204, {
    description: 'report DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.reportRepository.deleteById(id);
  }


  @get('/get-dataMedidores/{fi}/{ff}/{rp}')
  async dataMedidores(
    @param.path.string('fi') fi: string,
    @param.path.string('ff') ff: string,
    @param.path.string('rp') rp: string,
  ): Promise<any> {
    return this.ReportService.dataMedidores(fi, ff, rp);
  }

}
