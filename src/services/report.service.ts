import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {error} from 'console';
import moment from 'moment';
import {viewOf} from '../core/library/views.library';
import {reportRepository} from '../repositories/reports.repository';


//Funcion para calcular la raiz cuadrada de los valores BigInt del F.P
function sqrtNewton(b: bigint, precision: number = 64): bigint {
  if (b < 0n) {
    throw new Error("Cannot calculate square root of a negative number");
  }

  let x = b;

  for (let i = 0; i < precision; i++) {
    x = (x + b / x) >> 1n;
  }

  return x;
}


@injectable({scope: BindingScope.TRANSIENT})
export class ReportService {
  constructor(
    @repository(reportRepository)
    public reportRepository: reportRepository,
  ) { }


  async dataMedidores(fechaInicial: string, fechaFinal: string) {

    //get MES Y aNIO
    let meses = [
      "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
      "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];
    let fecha = new Date(fechaInicial);
    let mes = meses[fecha.getMonth()];
    let anio = fecha.getFullYear();


    //BE-T577 //Hoja MT577
    let MT577P_G = 0;
    let MT577R_R = 0;
    let MT577_I = 0;
    let MT577_T = 0;



    //BE-T578 //Hoja MT578
    let MT578P_G = 0;
    let MT578R_R = 0;
    let MT578P_I = 0;
    let MT578R_T = 0;
    let EACT_O = 0;
    let totalEACT_O = 0;

    //Hoja EACT
    let EACT_N = 0;
    let EACT_C = 0;
    let EACT_D = 0;
    let EACT_E = 0;
    let EACT_F = 0;
    let EACT_G = 0;
    let EACT_H = 0;
    let EACT_AG = 0;
    let EACT_AE = 0;
    let EACT_AN = 0;
    let EACT_AH: number = 0;
    let sumEACT_AH = 0;
    let EACT_AI = 0;
    let sumEACT_AI = 0;

    //hoja ERCT
    let ERCT_N = 0;
    let ERCT_O = 0;
    let ERCT_C = 0;
    let ERCT_D = 0;
    let ERCT_E = 0;
    let ERCT_F = 0;
    let ERCT_G = 0;
    let ERCT_H = 0;
    let ERCT_AG = 0;
    let ERCT_AE = 0;
    let ERCT_AN = 0;
    let ERCT_AH: number = 0;
    let sumERCT_AH = 0;
    let ERCT_AI = 0;
    let sumERCT_AI = 0;


    //hoja MTG1
    let MTG1P_G = 0;
    let MTG1R_R = 0;
    let MTG1P_H = 0;
    let MTG1R_S = 0;
    let MTG1P_I = 0;
    let MTG1R_T = 0;
    let MTG1P_J = 0;
    let MTG1R_U = 0;
    let demandaMTG1_P = 0;
    let demandaMTG1_R = 0;
    let MTG1_B = 0;
    let MTG1_M = 0;



    //hoja MTG2
    let MTG2P_G = 0;
    let MTG2R_R = 0;
    let MTG2P_H = 0;
    let MTG2R_S = 0;
    let MTG2P_I = 0;
    let MTG2R_T = 0;
    let MTG2P_J = 0;
    let MTG2R_U = 0;
    let demandaMTG2_P = 0;
    let demandaMTG2_R = 0;

    //hoja MTG3
    let MTG3P_G = 0;
    let MTG3R_R = 0;
    let MTG3P_H = 0;
    let MTG3R_S = 0;
    let MTG3P_I = 0;
    let MTG3R_T = 0;
    let MTG3P_J = 0;
    let MTG3R_U = 0;
    let demandaMTG3_P = 0;
    let demandaMTG3_R = 0;


    // hoja TOT
    let TOT_EACT_BET577 = 0

    //variables de factura 577
    let T577PActivaInicial = 0;
    let T577PActivaFinal = 0;
    let diferenciaT577PActiva = 0;
    let T577PReactivaInicial = 0;
    let T577PReactivaFinal = 0;
    let diferenciaT577PReactiva = 0;
    let demandaT577P = 0;

    //variables de factura 577 respaldo
    let T577RActivaInicial = 0;
    let T577RActivaFinal = 0;
    let diferenciaT577RActiva = 0;
    let T577RReactivaInicial = 0;
    let T577RReactivaFinal = 0;
    let diferenciaT577RReactiva = 0;
    let demandaT577R = 0;

    //VARIABLES FACTURA 578 Principal
    let activaInicialPT578 = 0;
    let activaFinalPT578 = 0;
    let diferenciaActivaPT578 = 0;
    let reactivaInicialPT578 = 0;
    let reactivaFinalPT578 = 0;
    let diferenciaReactivaPT578 = 0;
    let demandaT578P = 0;


    //VARIABLES FACTURA 578 Respaldo
    let activaInicialRT578 = 0;
    let activaFinalRT578 = 0;
    let diferenciaActivaRT578 = 0;
    let reactivaInicialRT578 = 0;
    let reactivaFinalRT578 = 0;
    let diferenciaReactivaRT578 = 0;
    let demandaT578R = 0;

    //Variables globales
    let sourceId: number[] = [8, 9, 17, 16, 19, 11, 14, 10];
    let fechaInicialMoment = moment(fechaInicial);
    fechaInicialMoment.add(15, 'minutes');
    let fechaInicial2 = fechaInicialMoment.format('YYYY-MM-DD HH:mm:ss.SSS');

    //variables para diferencias por intervalor en caso de roll over
    let diferenciaActivaT577P = 0;
    let diferenciaActivaT577R = 0;
    let diferenciaActivaT578P = 0;
    let diferenciaActivaT578R = 0;
    let diferenciaReactivaT577P = 0;
    let diferenciaReactivaT577R = 0;
    let diferenciaReactivaT578P = 0;
    let diferenciaReactivaT578R = 0;

    let rolloverActivaT577P = false;
    let rolloverActivaT577R = false;
    let rolloverActivaT578P = false;
    let rolloverActivaT578R = false;
    let rolloverReactivaT577P = false;
    let rolloverReactivaT577R = false;
    let rolloverReactivaT578P = false;
    let rolloverReactivaT578R = false;



    //resumen BECO-GILDAN
    let energiaActivaBG = 0
    let energiaActivaBGIntervalo = 0
    let energiaReactivaBG = 0;
    let energiaReactivaBGIntervalo = 0;
    let factorPotenciaBG = 0.0;
    let demandaBG = 0;
    let demandaBGIntervalo = 0;

    //Resumen ENEE-GILDAN
    let energiaActivaEG = 0;
    let energiaReactivaEG = 0;
    // let factorPotenciaEG = 0;
    let demandaEG = 0;

    //Hoja DEM
    let DEM_C = 0;
    let DEM_D = 0;
    let DEM_E = 0;
    let DEM_I = 0;
    let DEM_J = 0;
    let DEM_X = 0;
    let DEM_V = 0;
    let DEM_AE = 0;

    //arreglos de ENEE
    let arrayMT577P_G: number[] = [];
    let arrayMT577R_R: number[] = [];
    let arrayMT578P_G: number[] = [];
    let arrayMT578R_R: number[] = [];
    let arrayMTG1P_G: number[] = [];
    let arrayMTG1R_R: number[] = [];
    let arrayMTG1P_H: number[] = [];
    let arrayMTG1R_S: number[] = [];
    let arrayMTG2P_G: number[] = [];
    let arrayMTG2R_R: number[] = [];
    let arrayMTG2P_H: number[] = [];
    let arrayMTG2R_S: number[] = [];
    let arrayMTG3P_G: number[] = [];
    let arrayMTG3R_R: number[] = [];
    let arrayMTG3P_H: number[] = [];
    let arrayMTG3R_S: number[] = [];
    let arrayEAC_AG: number[] = [];

    let arrayEAC_AE: number[] = [];
    let arrayEAC_AN: number[] = [];
    let ACT_Enee = 0;
    const Energy = await this.reportRepository.dataSource.execute(
      `${viewOf.getMedidores}   where (TimestampUTC = dateadd(hour,6,'${fechaInicial}') or TimestampUTC =  dateadd(hour,6,'${fechaFinal}'));`,
    );
    const dataM = await this.reportRepository.dataSource.execute(
      `${viewOf.getMedidores}   WHERE TimestampUTC BETWEEN dateadd(hour, 6, '${fechaInicial2}') AND dateadd(hour, 6, '${fechaFinal}') and quantityID in (134, 144, 91, 96, 101, 106);`,
    );

    const diferenciaIntervalos = await this.reportRepository.dataSource.execute(
      `${viewOf.getMedidores}   WHERE TimestampUTC BETWEEN dateadd(hour, 6, '${fechaInicial2}') AND dateadd(hour, 6, '${fechaFinal}') AND quantityID = 134;`,
    );

    const diferenciaIntervalosReactiva = await this.reportRepository.dataSource.execute(
      `${viewOf.getMedidores}   WHERE TimestampUTC BETWEEN dateadd(hour, 6, '${fechaInicial2}') AND dateadd(hour, 6, '${fechaFinal}') AND quantityID = 96;`,
    );



    //diferencias por rollover
    for (let i = 0; i < diferenciaIntervalos.length; i++) {
      //Activa
      if (diferenciaIntervalos[i].displayName === 'RIONANCESE.MT577_P') {
        diferenciaActivaT577P += diferenciaIntervalos[i].Value;
      } else if (diferenciaIntervalos[i].displayName === 'RIONANCESE.MT577_R') {
        diferenciaActivaT577R += diferenciaIntervalos[i].Value;
      } else if (diferenciaIntervalos[i].displayName === 'RIONANCESE.MT578_P') {
        diferenciaActivaT578P += diferenciaIntervalos[i].Value;
      } else if (diferenciaIntervalos[i].displayName === 'RIONANCESE.MT578_R') {
        diferenciaActivaT578R += diferenciaIntervalos[i].Value;
      }
    }

    //Reactiva
    for (let i = 0; i < diferenciaIntervalosReactiva.length; i++) {

      if (diferenciaIntervalosReactiva[i].displayName === 'RIONANCESE.MT577_P') {
        diferenciaReactivaT577P += diferenciaIntervalosReactiva[i].Value;
      } else if (diferenciaIntervalosReactiva[i].displayName === 'RIONANCESE.MT577_R') {
        diferenciaReactivaT577R += diferenciaIntervalosReactiva[i].Value;
      }
      else if (diferenciaIntervalosReactiva[i].displayName === 'RIONANCESE.MT578_P') {
        diferenciaReactivaT578P += diferenciaIntervalosReactiva[i].Value;
      } else if (diferenciaIntervalosReactiva[i].displayName === 'RIONANCESE.MT578_R') {
        diferenciaReactivaT578R += diferenciaIntervalosReactiva[i].Value;
      }
    }

    //lecturas iniciales y finales
    for (let i = 0; i < Energy.length; i++) {
      //T577 PRINCIPAL ACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT577_P' && Energy[i].quantityID === 129) {
        if (i === 0) {
          T577PActivaInicial = Energy[0].Value;
          T577PActivaFinal = Energy[i].Value;
          if (T577PActivaFinal < T577PActivaInicial) {
            diferenciaT577PActiva = diferenciaActivaT577P;
            rolloverActivaT577P = true;
          } else {
            diferenciaT577PActiva = T577PActivaFinal - T577PActivaInicial;
          }
        } else {
          T577PActivaInicial = Energy[i - 1].Value;
          T577PActivaFinal = Energy[i].Value;
          if (T577PActivaFinal < T577PActivaInicial) {
            diferenciaT577PActiva = diferenciaActivaT577P;
            rolloverActivaT577P = true;
          } else {
            diferenciaT577PActiva = T577PActivaFinal - T577PActivaInicial;
          }
        }
      }

      //T577 PRINCIPAL REACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT577_P' && Energy[i].quantityID === 91) {
        if (i === 0) {
          T577PReactivaInicial = Energy[0].Value;
          T577PReactivaFinal = Energy[1].Value;
          if (T577PReactivaFinal < T577PReactivaInicial) {
            diferenciaT577PReactiva = diferenciaReactivaT577P;
            rolloverReactivaT577P = true;
          } else {
            diferenciaT577PReactiva = T577PReactivaFinal - T577PReactivaInicial;
          }

        } else {
          T577PReactivaInicial = Energy[i - 1].Value;
          T577PReactivaFinal = Energy[i].Value;
          if (T577PReactivaFinal < T577PReactivaInicial) {
            diferenciaT577PReactiva = diferenciaReactivaT577P;
            rolloverReactivaT577P = true;
          } else {
            diferenciaT577PReactiva = T577PReactivaFinal - T577PReactivaInicial;
          }
        }
      }

      //577 respaldo ACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT577_R' && Energy[i].quantityID === 129) {
        if (i === 0) {
          T577RActivaInicial = Energy[0].Value;
          T577RActivaFinal = Energy[1].Value;
          if (T577RActivaFinal < T577RActivaInicial) {
            diferenciaT577RActiva = diferenciaActivaT577R;
            rolloverActivaT577R = true;
          } else {
            diferenciaT577RActiva = T577RActivaFinal - T577RActivaInicial;
          }

        } else {
          T577RActivaInicial = Energy[i - 1].Value;
          T577RActivaFinal = Energy[i].Value;
          if (T577RActivaFinal < T577RActivaInicial) {
            diferenciaT577RActiva = diferenciaActivaT577R;
            rolloverActivaT577R = true;
          } else {
            diferenciaT577RActiva = T577RActivaFinal - T577RActivaInicial;
          }
        }

      }
      //577 respaldo REACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT577_R' && Energy[i].quantityID === 91) {
        if (i === 0) {
          T577RReactivaInicial = Energy[0].Value;
          T577RReactivaFinal = Energy[1].Value;
          if (T577RReactivaFinal < T577RReactivaInicial) {
            diferenciaT577RReactiva = diferenciaReactivaT577R;
            rolloverReactivaT577R = true;
          } else {
            diferenciaT577RReactiva = T577RReactivaFinal - T577RReactivaInicial;
          }

        } else {
          T577RReactivaInicial = Energy[i - 1].Value;
          T577RReactivaFinal = Energy[i].Value;
          if (T577RReactivaFinal < T577RReactivaInicial) {
            diferenciaT577RReactiva = diferenciaReactivaT577R;
            rolloverReactivaT577R = true;
          } else {
            diferenciaT577RReactiva = T577RReactivaFinal - T577RReactivaInicial;
          }
        }
      }


      //T578 PRINCIPAL ACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT578_P' && Energy[i].quantityID === 129) {
        if (i === 0) {
          activaInicialPT578 = Energy[0].Value;
          activaFinalPT578 = Energy[1].Value;
          if (activaFinalPT578 < activaInicialPT578) {
            diferenciaActivaPT578 = diferenciaActivaT578P;
            rolloverActivaT578P = true;
          } else {
            diferenciaActivaPT578 = activaFinalPT578 - activaInicialPT578;
          }

        } else {
          activaInicialPT578 = Energy[i - 1].Value;
          activaFinalPT578 = Energy[i].Value;
          if (activaFinalPT578 < activaInicialPT578) {
            diferenciaActivaPT578 = diferenciaActivaT578P;
            rolloverActivaT578P = true;
          } else {
            diferenciaActivaPT578 = activaFinalPT578 - activaInicialPT578;
          }
        }
      }
      //T578 PRINCIPAL REACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT578_P' && Energy[i].quantityID === 91) {
        if (i === 0) {
          reactivaInicialPT578 = Energy[0].Value;
          reactivaFinalPT578 = Energy[1].Value;
          if (reactivaFinalPT578 < reactivaInicialPT578) {
            diferenciaReactivaPT578 = diferenciaReactivaT578P;
            rolloverReactivaT578P = true;
          } else {
            diferenciaReactivaPT578 = reactivaFinalPT578 - reactivaInicialPT578;
          }

        } else {
          reactivaInicialPT578 = Energy[i - 1].Value;
          reactivaFinalPT578 = Energy[i].Value;
          if (reactivaFinalPT578 < reactivaInicialPT578) {
            diferenciaReactivaPT578 = diferenciaReactivaT578P;
            rolloverReactivaT578P = true;
          } else {
            diferenciaReactivaPT578 = reactivaFinalPT578 - reactivaInicialPT578;
          }
        }
      }

      //RESPALDO T578 ACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT578_R' && Energy[i].quantityID === 129) {
        if (i === 0) {
          activaInicialRT578 = Energy[0].Value;
          activaFinalRT578 = Energy[1].Value;
          if (activaFinalRT578 < activaInicialRT578) {
            diferenciaActivaRT578 = diferenciaActivaT578R;
            rolloverActivaT578R = true;
          } else {
            diferenciaActivaRT578 = activaFinalRT578 - activaInicialRT578;
          }

        } else {
          activaInicialRT578 = Energy[i - 1].Value;
          activaFinalRT578 = Energy[i].Value;
          if (activaFinalRT578 < activaInicialRT578) {
            diferenciaActivaRT578 = diferenciaActivaT578R;
            rolloverActivaT578R = true;
          } else {
            diferenciaActivaRT578 = activaFinalRT578 - activaInicialRT578;
          }
        }
      }
      //RESPALDO T578 REACTIVA
      if (Energy[i].displayName === 'RIONANCESE.MT578_R' && Energy[i].quantityID === 91) {
        if (i === 0) {
          reactivaInicialRT578 = Energy[0].Value;
          reactivaFinalRT578 = Energy[1].Value;
          if (reactivaFinalRT578 < reactivaInicialRT578) {
            diferenciaReactivaRT578 = diferenciaReactivaT578R;
            rolloverReactivaT578R = true;
          } else {
            diferenciaReactivaRT578 = reactivaFinalRT578 - reactivaInicialRT578;
          }

        } else {
          reactivaInicialRT578 = Energy[i - 1].Value;
          reactivaFinalRT578 = Energy[i].Value;
          if (reactivaFinalRT578 < reactivaInicialRT578) {
            diferenciaReactivaRT578 = diferenciaReactivaT578R;
            rolloverReactivaT578R = true;
          } else {
            diferenciaReactivaRT578 = reactivaFinalRT578 - reactivaInicialRT578;
          }
        }
      }
    }



    //demandas
    for (let i = 0; i < sourceId.length; i++) {
      let id = sourceId[i];
      const demanda = await this.reportRepository.dataSource.execute(
        `${viewOf.getDemanda}  WHERE TimestampUTC BETWEEN dateadd(hour, 6, '${fechaInicial}') AND dateadd(hour, 6, '${fechaFinal}')  AND sourceID =${id} AND quantityID=107 ORDER BY Value DESC;`,
      )
      let value = demanda[0].Value;
      if (demanda[0].displayName === 'RIONANCESE.MT577_P') {
        demandaT577P = value;
      } else if (demanda[0].displayName === 'RIONANCESE.MT577_R') {
        demandaT577R = value;
      } else if (demanda[0].displayName === 'RIONANCESE.MT578_P') {
        demandaT578P = value;
      } else if (demanda[0].displayName === 'RIONANCESE.MT578_R') {
        demandaT578R = value;
      } else if (demanda[0].displayName === 'BECO.MTG1_P') {
        demandaMTG1_P = value;
      } else if (demanda[0].displayName === 'BECO.MTG1_R') {
        demandaMTG1_R = value;
      } else if (demanda[0].displayName === 'BECO.MTG2_P') {
        demandaMTG2_P = value;
        demandaMTG3_P = value;
      } else if (demanda[0].displayName === 'BECO.MTG2_R') {
        demandaMTG2_R = value;
        demandaMTG3_R = value;
      }
    }

    //DEMANDA GILDAN-ENEE
    //Columna DEM-X
    DEM_I = (demandaT577P + demandaT577R) / 2;
    DEM_J = (demandaT578P + demandaT578R) / 2;
    DEM_X = DEM_I + DEM_J;

    //Columna Dem-V

    DEM_C = (demandaMTG1_P + demandaMTG1_R) / 2;
    DEM_D = (demandaMTG2_P + demandaMTG2_R) / 2;
    DEM_E = (demandaMTG3_P + demandaMTG3_R) / 2;

    DEM_V = DEM_C + DEM_D + DEM_E

    //COLUMNA DEM-AE
    if (DEM_V >= 0) {
      DEM_X - DEM_V < 0
        ? DEM_AE = 0
        : DEM_AE = DEM_X - DEM_V
    } else {
      DEM_AE = DEM_X
    }


    //Apartir de aqui...
    //GILDAN-ENEE
    //BE-T577

    // console.log(dataM[0])
    for (let i = 0; i < dataM.length; i++) {
      //T577
      if (dataM[i].displayName === 'RIONANCESE.MT577_P' && dataM[i].quantityID === 134) {
        MT577P_G = dataM[i].Value;
        arrayMT577P_G.push(MT577P_G);
      }
      if (dataM[i].displayName === 'RIONANCESE.MT577_R' && dataM[i].quantityID === 134) {
        MT577R_R = dataM[i].Value;
        arrayMT577R_R.push(MT577R_R)
      }

      //BE-T578
      if (dataM[i].displayName === 'RIONANCESE.MT578_P' && dataM[i].quantityID === 134) {
        MT578P_G = dataM[i].Value;
        arrayMT578P_G.push(MT578P_G);
      } else if (dataM[i].displayName === 'RIONANCESE.MT578_R' && dataM[i].quantityID === 134) {
        MT578R_R = dataM[i].Value;
        arrayMT578R_R.push(MT578R_R);
      }

      //CALCULANDO COLUMNA C DE EACT
      if (dataM[i].displayName === 'BECO.MTG1_P' && dataM[i].quantityID === 134) {
        MTG1P_G = dataM[i].Value;
        arrayMTG1P_G.push(MTG1P_G)
      }
      if (dataM[i].displayName === 'BECO.MTG1_R' && dataM[i].quantityID === 134) {
        MTG1R_R = dataM[i].Value;
        arrayMTG1R_R.push(MTG1R_R);
      }
      //CALCULANDO COLUMNA D DE EACT
      if (dataM[i].displayName === 'BECO.MTG1_P' && dataM[i].quantityID === 144) {
        MTG1P_H = dataM[i].Value;
        arrayMTG1P_H.push(MTG1P_H);
      }
      if (dataM[i].displayName === 'BECO.MTG1_R' && dataM[i].quantityID === 144) {
        MTG1R_S = dataM[i].Value;
        arrayMTG1R_S.push(MTG1R_S)
      }
      //CALCULANDO COLUMNA E DE EACT
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 134) {
        MTG2P_G = dataM[i].Value;
        arrayMTG2P_G.push(MTG2P_G);
      }
      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 134) {
        MTG2R_R = dataM[i].Value;
        arrayMTG2R_R.push(MTG2R_R);
      }
      //CALCULANDO COLUMNA F DE EACT
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 144) {
        MTG2P_H = dataM[i].Value;
        arrayMTG2P_H.push(MTG2P_H);
      }
      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 144) {
        MTG2R_S = dataM[i].Value;
        arrayMTG2R_S.push(MTG2R_S);
      }
      //CALCULANDO COLUMNA G DE EACT
      if (dataM[i].displayName === 'BECO.MTG3_P' && dataM[i].quantityID === 134) {
        MTG3P_G = dataM[i].Value;
        arrayMTG3P_G.push(MTG3P_G);
      }
      if (dataM[i].displayName === 'BECO.MTG3_R' && dataM[i].quantityID === 134) {
        MTG3R_R = dataM[i].Value;
        arrayMTG3R_R.push(MTG3R_R)
      }
      //CALCULANDO COLUMNA H DE EACT
      if (dataM[i].displayName === 'BECO.MTG3_P' && dataM[i].quantityID === 144) {
        MTG3P_H = dataM[i].Value;
        arrayMTG3P_H.push(MTG3P_H)
      }
      if (dataM[i].displayName === 'BECO.MTG3_R' && dataM[i].quantityID === 144) {
        MTG3R_S = dataM[i].Value;
        arrayMTG3R_S.push(MTG3R_S);
      }
    }


    //nuevo
    if (arrayMT577P_G.length === arrayMT577R_R.length && arrayMT578P_G.length === arrayMT578R_R.length && arrayMT577P_G.length === arrayMT578P_G.length) {
      for (let i = 0; i < arrayMT577P_G.length; i++) {
        EACT_N = (arrayMT577P_G[i] + arrayMT577R_R[i]) / 2;
        EACT_O = (arrayMT578P_G[i] + arrayMT578R_R[i]) / 2;
        EACT_AG = EACT_N + EACT_O;
        arrayEAC_AG.push(EACT_AG);
      }
    } else {
      console.log("ARRAY no son iguales")
      return error
    }


    if (arrayMTG1P_G.length === arrayMTG1R_R.length &&
      arrayMTG1P_H.length === arrayMTG1R_S.length &&
      arrayMTG2P_G.length === arrayMTG2R_R.length &&
      arrayMTG2P_H.length === arrayMTG2R_S.length
      &&
      arrayMTG3P_G.length === arrayMTG3R_R.length
      &&
      arrayMTG3P_H.length === arrayMTG3R_S.length) {
      for (let i = 0; i < arrayMTG1P_G.length; i++) {

        EACT_C = (arrayMTG1P_G[i] + arrayMTG1R_R[i]) / 2;
        EACT_D = (arrayMTG1P_H[i] + arrayMTG1R_S[i]) / 2;
        EACT_E = (arrayMTG2P_G[i] + arrayMTG2R_R[i]) / 2;
        EACT_F = (arrayMTG2P_H[i] + arrayMTG2R_S[i]) / 2;
        EACT_G = (arrayMTG3P_G[i] + arrayMTG3R_R[i]) / 2;
        EACT_H = (arrayMTG3P_H[i] + arrayMTG3R_S[i]) / 2;
        //generacion
        EACT_AE = (EACT_C - EACT_D) + (EACT_E - EACT_F) + (EACT_G - EACT_H);
        arrayEAC_AE.push(EACT_AE)
      }
    } else {
      console.log("Los arrays no tienen la misma longitud.");
      return error
    }


    if (arrayEAC_AE.length === arrayEAC_AG.length) {
      for (let i = 0; i < arrayEAC_AE.length; i++) {
        if (arrayEAC_AE[i] >= 0) {
          EACT_AN = Math.max(0, arrayEAC_AG[i] - arrayEAC_AE[i]);
        } else {
          console.log("SOY EACT_AG");
          EACT_AN = arrayEAC_AG[i];
        }

        console.log("EACT AN  ---------------- ", EACT_AN)
        arrayEAC_AN.push(EACT_AN);
      }

    }


    for (let i = 0; i < arrayEAC_AN.length; i++) {
      if (arrayEAC_AN[i] != 0) {
        console.log(arrayEAC_AN[i]);
      }
      ACT_Enee += arrayEAC_AN[i]
    }


    //GILDAN-ENEE ENERGIA REACTIVA

    //Calculo columna ERCT-AG
    for (let i = 0; i < dataM.length; i++) {
      if (dataM[i].displayName === 'RIONANCESE.MT577_P' && dataM[i].quantityID === 96) {
        MT577_I += dataM[i].Value
      }

      if (dataM[i].displayName === 'RIONANCESE.MT577_R' && dataM[i].quantityID === 96) {
        MT577_T += dataM[i].Value
      }

      ERCT_N = (MT577_I + MT577_T) / 2;

      if (dataM[i].displayName === 'RIONANCESE.MT578_P' && dataM[i].quantityID === 96) {
        MT578P_I += dataM[i].Value;
      }

      if (dataM[i].displayName === 'RIONANCESE.MT578_R' && dataM[i].quantityID === 96) {
        MT578R_T += dataM[i].Value;
      }

      ERCT_O = (MT578P_I + MT578R_T) / 2;

      ERCT_AG = ERCT_N + ERCT_O;


      //Calculos columna ERCT-AE ENERGIA REACTIVA
      //COLUMNA C
      if (dataM[i].displayName === 'BECO.MTG1_P' && dataM[i].quantityID === 96) {
        MTG1P_I += dataM[i].Value;
      }

      if (dataM[i].displayName === 'BECO.MTG1_R' && dataM[i].quantityID === 96) {
        MTG1R_T += dataM[i].Value;
      }

      ERCT_C = (MTG1P_I + MTG1R_T) / 2;

      //Calculo Columna ERCT-D

      if (dataM[i].displayName === 'BECO.MTG1_P' && dataM[i].quantityID === 106) {
        MTG1P_J += dataM[i].Value;
      }
      if (dataM[i].displayName === 'BECO.MTG1_R' && dataM[i].quantityID === 106) {
        MTG1R_U += dataM[i].Value;
      }

      ERCT_D = (MTG1P_J + MTG1R_U) / 2;

      //Calculo Columna ERCT-E
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 96) {
        MTG2P_I += dataM[i].Value;
      }

      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 96) {
        MTG2R_T += dataM[i].Value;
      }

      ERCT_E = (MTG2P_I + MTG2R_T) / 2;

      //Calculo columna F
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 106) {
        MTG2P_J += dataM[i].Value;
      }

      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 106) {
        MTG2R_U += dataM[i].Value;
      }

      ERCT_F = (MTG2P_J + MTG2R_U) / 2;

      //Calculo columna G
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 96) {
        MTG3P_I += dataM[i].Value;
      }
      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 96) {
        MTG3R_T += dataM[i].Value;
      }

      ERCT_G = (MTG3P_I + MTG3R_T) / 2;

      //Calculo Columna H
      if (dataM[i].displayName === 'BECO.MTG2_P' && dataM[i].quantityID === 106) {
        MTG3P_J += dataM[i].Value;
      }
      if (dataM[i].displayName === 'BECO.MTG2_R' && dataM[i].quantityID === 106) {
        MTG3R_U += dataM[i].Value;
      }

      ERCT_H = (MTG3P_J + MTG3R_U) / 2;

      ERCT_AE = (ERCT_C - ERCT_D) + (ERCT_E - ERCT_F) + (ERCT_G - ERCT_H)

      if (ERCT_AE >= 0) {
        ERCT_AG - ERCT_AE > 0
          ? ERCT_AN = (ERCT_AG - ERCT_AE)
          : ERCT_AN = 0
      } else {
        ERCT_AN = ERCT_AG;
      }
    }

    //Energia Activa BEGO-GILDAN por intervalos
    let EACT_menor = 0;
    let EACT_mayor = 0;

    if (EACT_AE < EACT_AG) {
      EACT_menor = EACT_AE
    } else {
      EACT_menor = EACT_AG
    }

    if (EACT_menor < 0) {
      EACT_mayor = 0;
    } else {
      EACT_mayor = EACT_menor;
    }


    //Energia reactiva por intervalo BECO-GILDAN
    let ERCT_Menor = 0;
    let ERCT_Mayor = 0;

    if (ERCT_AE < ERCT_AG) {
      ERCT_Menor = ERCT_AE
    } else {
      ERCT_Menor = ERCT_AG
    }

    if (ERCT_Menor < 0) {
      ERCT_Mayor = 0;
    } else {
      ERCT_Mayor = ERCT_Menor;
    }

    //Demanda BECO-GILDAN por intervalos
    let DEM_Menor = 0;
    let DEM_Mayor = 0;

    if (DEM_V < DEM_X) {
      DEM_Menor = DEM_V
    } else {
      DEM_Menor = DEM_X
    }

    // console.log(DEM_V, DEM_X)

    if (DEM_Menor < 0) {
      DEM_Mayor = 0;
    } else {
      DEM_Mayor = DEM_Menor;
    }


    energiaActivaBGIntervalo = EACT_mayor;
    energiaReactivaBGIntervalo = ERCT_Mayor;
    demandaBGIntervalo = DEM_Mayor;

    // if (rolloverActivaT577P === true || rolloverActivaT577R === true || rolloverActivaT578P === true || rolloverActivaT578R === true || rolloverReactivaT577P === true || rolloverReactivaT577R === true || rolloverReactivaT578P === true || rolloverReactivaT578R === true) {
    //   energiaActivaBG = energiaActivaBGIntervalo;
    //   energiaReactivaBG = energiaReactivaBGIntervalo;
    //   demandaBG = (demandaT577P + demandaT577R) / 2 + (demandaT578P + demandaT578R) / 2;
    // } else {
    //   energiaActivaBG = (diferenciaT577PActiva + diferenciaT577RActiva) / 2 + (diferenciaActivaPT578 + diferenciaActivaRT578) / 2;
    //   energiaReactivaBG = (diferenciaT577PReactiva + diferenciaT577RReactiva) / 2 + (diferenciaReactivaPT578 + diferenciaReactivaRT578) / 2;
    //   demandaBG = (demandaT577P + demandaT577R) / 2 + (demandaT578P + demandaT578R) / 2;
    // }



    //Energia por intervalos

    energiaActivaBG = (diferenciaActivaT577P + diferenciaActivaT577R) / 2 + (diferenciaActivaT578P + diferenciaActivaT578R) / 2;
    energiaReactivaBG = (diferenciaReactivaT577P + diferenciaReactivaT577R) / 2 + (diferenciaReactivaT578P + diferenciaReactivaT578R) / 2;
    demandaBG = (demandaT577P + demandaT577R) / 2 + (demandaT578P + demandaT578R) / 2;


    // energiaActivaEG = EACT_AN;
    energiaActivaEG = ACT_Enee;
    energiaReactivaEG = ERCT_AN;
    demandaEG = DEM_AE;
    let factorPotenciaEG = 0.0;

    //Calculo del Factor de Potencia
    //Quitamos los valores decimales de los resultados obtenidos
    let parteEnteraBG = BigInt(Math.floor(energiaReactivaBG));
    let parteEnteraEG = BigInt(Math.floor(energiaReactivaEG));
    let parteEnteraEABG = BigInt(Math.floor(energiaActivaBG));
    let parteEnteraEAEG = BigInt(Math.floor(energiaActivaEG));

    //Calculo de los valores elevados a la 2
    let elevadoER = (parteEnteraBG + parteEnteraEG) * (parteEnteraBG + parteEnteraEG);
    let elevadoEA = (parteEnteraEABG + parteEnteraEAEG) * (parteEnteraEABG + parteEnteraEAEG)

    //Sumatoria de valores que fueron elevados a la 2
    let sumatoriaElevados = elevadoER + elevadoEA;

    //Suma de la parte izquierda de la operacion para obtener el divisor
    let sumaEnergiasAct = parteEnteraEABG + parteEnteraEG

    //Envio de la sumatoria de los elevados a la funcion de la raiz 2
    const result = sqrtNewton(sumatoriaElevados);

    //colocar ambos resultados como numeros para hacer la division
    const sumaEnergiasActivas = Number(sumaEnergiasAct);
    const resultRaiz2 = Number(result);

    //Division de los resultados
    const divisionResultados = sumaEnergiasActivas / resultRaiz2;

    //Truncar el resultado de la division a 2 cifras despues del .
    const resultSplitTrunc = divisionResultados.toFixed(2);

    //Pasar el resultado a las variables del Factor de Potencia
    factorPotenciaBG = parseFloat(resultSplitTrunc);
    factorPotenciaEG = parseFloat(resultSplitTrunc)

    //ENERGIA ACTIVA MEDIDOR 7577 BECO
    TOT_EACT_BET577 = sumEACT_AH;
    dataM[0].energiaActivaBecoT577 = TOT_EACT_BET577;

    //reporte T577 principal
    //energia activa
    dataM[0].energiaActivaInicialPT577 = T577PActivaInicial;
    dataM[0].energiaActivaFinalPT577 = T577PActivaFinal;
    dataM[0].diferenciaEnergiaActivaPT577 = diferenciaT577PActiva;
    dataM[0].rolloverActivaT577P = rolloverActivaT577P;
    //Energia Reactiva
    dataM[0].energiaReactivaInicialPT577 = T577PReactivaInicial;
    dataM[0].energiaReactivaFinalPT577 = T577PReactivaFinal;
    dataM[0].diferenciaEnergiaReactivaPT577 = diferenciaT577PReactiva;
    dataM[0].demandaT577P = demandaT577P;
    dataM[0].rolloverReactivaT577P = rolloverReactivaT577P;

    //reporte T577 Respaldo
    //energia activa
    dataM[0].energiaActivaInicialRT577 = T577RActivaInicial;
    dataM[0].energiaActivaFinalRT577 = T577RActivaFinal;
    dataM[0].diferenciaEnergiaActivaRT577 = diferenciaT577RActiva;
    dataM[0].rolloverActivaT577R = rolloverActivaT577R;
    //Energia Reactiva
    dataM[0].energiaReactivaInicialRT577 = T577RReactivaInicial;
    dataM[0].energiaReactivaFinalRT577 = T577RReactivaFinal;
    dataM[0].diferenciaEnergiaReactivaRT577 = diferenciaT577RReactiva;
    dataM[0].demandaT577R = demandaT577R;
    dataM[0].rolloverReactivaT577R = rolloverReactivaT577R;


    //reporte T578 principal
    //Activa
    dataM[0].activaInicialPT578 = activaInicialPT578;
    dataM[0].activaFinalPT578 = activaFinalPT578;
    dataM[0].diferenciaActivaPT578 = diferenciaActivaPT578;
    dataM[0].rolloverActivaT578P = rolloverActivaT578P;
    //Reactiva
    dataM[0].reactivaInicialPT578 = reactivaInicialPT578;
    dataM[0].reactivaFinalPT578 = reactivaFinalPT578;
    dataM[0].diferenciaReactivaPT578 = diferenciaReactivaPT578;
    dataM[0].demandaT578P = demandaT578P;
    dataM[0].rolloverReactivaT578P = rolloverReactivaT578P;


    //reporte T578 Respaldo
    //Activa
    dataM[0].activaInicialRT578 = activaInicialRT578;
    dataM[0].activaFinalRT578 = activaFinalRT578;
    dataM[0].diferenciaActivaRT578 = diferenciaActivaRT578;
    dataM[0].rolloverActivaT578R = rolloverActivaT578R;
    //Reactiva
    dataM[0].reactivaInicialRT578 = reactivaInicialRT578;
    dataM[0].reactivaFinalRT578 = reactivaFinalRT578;
    dataM[0].diferenciaReactivaRT578 = diferenciaReactivaRT578;
    dataM[0].demandaT578R = demandaT578R;
    dataM[0].rolloverReactivaT578R = rolloverReactivaT578R;


    //resumen BECO GILDAN
    dataM[0].energiaActivaBG = energiaActivaBG;
    dataM[0].energiaReactivaBG = energiaReactivaBG;
    dataM[0].factorPotenciaBG = factorPotenciaBG;
    dataM[0].demandaBG = demandaBG;

    //resumen ENEE GILDAN
    dataM[0].energiaActivaEG = energiaActivaEG;
    dataM[0].energiaReactivaEG = energiaReactivaEG;
    dataM[0].factorPotenciaEG = factorPotenciaEG;
    dataM[0].demandaEG = demandaEG;

    //meses y anio
    dataM[0].mes = mes;
    dataM[0].anio = anio;

    dataM[0].fechaInicio = fechaInicial;
    dataM[0].fechaFin = fechaFinal;

    return {dataM}
  }

}
