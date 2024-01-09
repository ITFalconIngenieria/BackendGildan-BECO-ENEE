
export namespace viewOf {

  export const getMedidores = `SELECT *, dateadd(hour,-6,TimestampUTC) Fecha from dbo.getMedidores`;
  export const getDemanda = `SELECT TOP 1 Value, sourceID, displayName, TimestampUTC, sourceName, quantityID, dateadd(hour, -6, TimestampUTC) AS Fecha
  FROM dbo.getMedidores`;
}

