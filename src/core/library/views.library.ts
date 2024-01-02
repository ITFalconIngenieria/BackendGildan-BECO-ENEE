
export namespace viewOf {


  //jk
  export const Get_CPI = `SELECT * FROM dbo.CPI`;
  export const Get_ipc = `SELECT * FROM dbo.IPC`;
  export const getConsumoMedidores = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha from dbo.getConsumoMedidores`
  export const getCogeneracion = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha from dbo.getCogeneracion`
  export const getEuroData = `SELECT * from dbo.AccesoEuro`;
  export const getHorasPunta = `SELECT * from dbo.HorasPunta`;
  export const getDollarData = `SELECT * from dbo.AccesoDollar`;
  // export const getCombustibles = `SELECT * from dbo.Combustible`;
  export const getCombustibles = `SELECT * from dbo.indiceCombustible`;
  export const getLecurasEnee = `SELECT * from dbo.GetlecturasENEE`
  export const getFeriadosHn = `SELECT * from dbo.feriadosHn`;
  export const getVariablesContratos = `SELECT * from dbo.variablesContrato`;
  export const getCorrelativos = `SELECT * from dbo.Correlativos`



  export const getMedidores = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha from dbo.getMedidores`;
  export const getDemanda = `SELECT TOP 1 Value, sourceID, displayName, TimestampUTC, sourceName, quantityID, dateadd(hour, -6, TimestampUTC) AS Fecha
  FROM dbo.getMedidores`;
}
