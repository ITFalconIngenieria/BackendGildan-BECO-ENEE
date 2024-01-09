import { /* inject, */ BindingScope, injectable} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
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
    let energiaActivaBECOGildan = 0;
    let energiaReactivaBecoGildan = 0;

    //Resumen ENEE-GILDAN
    let energiaActivaEneeGildan = 0;
    let energiaReactivaENEEGildan = 0;

    //demanda
    let demandaBecoGildan = 0;
    let demandaEneeGildan = 0;

    //factorPotencia
    let factorPotencia = 0;

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

    const EnergiaActiva = await this.reportRepository.dataSource.execute(`EXEC Energia 134, '${fechaInicial}', '${fechaFinal}'`);
    const EnergiaReactiva = await this.reportRepository.dataSource.execute(`EXEC Energia 96, '${fechaInicial}', '${fechaFinal}'`);
    const Demanda = await this.reportRepository.dataSource.execute(`EXEC Demanda '${fechaInicial}', '${fechaFinal}'`);

    energiaActivaBECOGildan = EnergiaActiva[0].be_gi_ep;
    energiaActivaEneeGildan = EnergiaActiva[0].en_gi_ep;

    energiaReactivaBecoGildan = EnergiaReactiva[0].be_gi_ep;
    energiaReactivaENEEGildan = EnergiaReactiva[0].en_gi_ep;

    demandaBecoGildan = Demanda[0].be_gi_ep;
    demandaEneeGildan = Demanda[0].en_gi_ep;
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
      }
    }


    //factor de potencia
    let sumaActivaProveedores = energiaActivaBECOGildan + energiaActivaEneeGildan;
    let denominador = Math.sqrt(Math.pow(energiaReactivaENEEGildan + energiaReactivaBecoGildan, 2) + Math.pow(energiaActivaBECOGildan + energiaActivaEneeGildan, 2));
    factorPotencia = sumaActivaProveedores / denominador;


    //reporte T577 principal
    //energia activa
    dataM[0].energiaActivaInicialPT577 = parseFloat(T577PActivaInicial.toFixed(2));
    dataM[0].energiaActivaFinalPT577 = parseFloat(T577PActivaFinal.toFixed(2));
    dataM[0].diferenciaEnergiaActivaPT577 = parseFloat(diferenciaT577PActiva.toFixed(2));
    dataM[0].rolloverActivaT577P = rolloverActivaT577P;
    //Energia Reactiva
    dataM[0].energiaReactivaInicialPT577 = parseFloat(T577PReactivaInicial.toFixed(2));
    dataM[0].energiaReactivaFinalPT577 = parseFloat(T577PReactivaFinal.toFixed(2));
    dataM[0].diferenciaEnergiaReactivaPT577 = parseFloat(diferenciaT577PReactiva.toFixed(2));
    dataM[0].rolloverReactivaT577P = rolloverReactivaT577P;
    //
    dataM[0].demandaT577P = demandaT577P;

    //reporte T577 Respaldo
    //energia activa
    dataM[0].energiaActivaInicialRT577 = parseFloat(T577RActivaInicial.toFixed(2));
    dataM[0].energiaActivaFinalRT577 = parseFloat(T577RActivaFinal.toFixed(2));
    dataM[0].diferenciaEnergiaActivaRT577 = parseFloat(diferenciaT577RActiva.toFixed(2));
    dataM[0].rolloverActivaT577R = rolloverActivaT577R;
    //Energia Reactiva
    dataM[0].energiaReactivaInicialRT577 = parseFloat(T577RReactivaInicial.toFixed(2));
    dataM[0].energiaReactivaFinalRT577 = parseFloat(T577RReactivaFinal.toFixed(2));
    dataM[0].diferenciaEnergiaReactivaRT577 = parseFloat(diferenciaT577RReactiva.toFixed(2));
    dataM[0].rolloverReactivaT577R = rolloverReactivaT577R;
    //
    dataM[0].demandaT577R = parseFloat(demandaT577R.toFixed(2));

    //reporte T578 principal
    //Activa
    dataM[0].activaInicialPT578 = parseFloat(activaInicialPT578.toFixed(2));
    dataM[0].activaFinalPT578 = parseFloat(activaFinalPT578.toFixed(2));
    dataM[0].diferenciaActivaPT578 = parseFloat(diferenciaActivaPT578.toFixed(2));
    dataM[0].rolloverActivaT578P = rolloverActivaT578P;
    //Reactiva
    dataM[0].reactivaInicialPT578 = parseFloat(reactivaInicialPT578.toFixed(2));
    dataM[0].reactivaFinalPT578 = parseFloat(reactivaFinalPT578.toFixed(2));
    dataM[0].diferenciaReactivaPT578 = parseFloat(diferenciaReactivaPT578.toFixed(2));
    dataM[0].rolloverReactivaT578P = rolloverReactivaT578P;
    //
    dataM[0].demandaT578P = parseFloat(demandaT578P.toFixed(2));

    //reporte T578 Respaldo
    //Activa
    dataM[0].activaInicialRT578 = parseFloat(activaInicialRT578.toFixed(2));
    dataM[0].activaFinalRT578 = parseFloat(activaFinalRT578.toFixed(2));
    dataM[0].diferenciaActivaRT578 = parseFloat(diferenciaActivaRT578.toFixed(2));
    dataM[0].rolloverActivaT578R = rolloverActivaT578R;

    //Reactiva
    dataM[0].reactivaInicialRT578 = parseFloat(reactivaInicialRT578.toFixed(2));
    dataM[0].reactivaFinalRT578 = parseFloat(reactivaFinalRT578.toFixed(2));
    dataM[0].diferenciaReactivaRT578 = parseFloat(diferenciaReactivaRT578.toFixed(2));
    dataM[0].rolloverReactivaT578R = rolloverReactivaT578R;
    //
    dataM[0].demandaT578R = parseFloat(demandaT578R.toFixed(2));

    //resumen BECO GILDAN
    dataM[0].energiaActivaBG = parseFloat(energiaActivaBECOGildan.toFixed(2));
    dataM[0].energiaReactivaBG = parseFloat(energiaReactivaBecoGildan.toFixed(2));
    dataM[0].factorPotenciaBG = parseFloat(factorPotencia.toFixed(2));
    dataM[0].demandaBG = parseFloat(demandaBecoGildan.toFixed(2));

    //resumen ENEE GILDAN
    dataM[0].energiaActivaEG = parseFloat(energiaActivaEneeGildan.toFixed(2));
    dataM[0].energiaReactivaEG = parseFloat(energiaReactivaENEEGildan.toFixed(2));;
    dataM[0].factorPotenciaEG = parseFloat(factorPotencia.toFixed(2));
    dataM[0].demandaEG = parseFloat(demandaEneeGildan.toFixed(2));

    //meses y anio
    dataM[0].mes = mes;
    dataM[0].anio = anio;

    dataM[0].fechaInicio = fechaInicial;
    dataM[0].fechaFin = fechaFinal;

    return {dataM}
  }

}
