/**
 * Script de Office para reconstruir la hoja maestra SORA_Inflation_Index_Values
 * Realiza el cruce (join) en memoria y actualiza la hoja en una sola operación en bloque.
 */

interface AirBPItem {
  Id: number;
  PVC_Business_Partner?: string;
  BP_Desc?: string;
}

interface InflationRateItem {
  Business_Partner_ID: number;
  Index_Code?: string;
  Inflation_Index_ID?: number;
  Applicable_Year?: number;
  Rate?: number;
}

function main(
  workbook: ExcelScript.Workbook,
  airBps: AirBPItem[],
  inflationRates: InflationRateItem[]
): { status: string; totalRowsWritten: number } {
  
  if (!airBps || airBps.length === 0 || !inflationRates || inflationRates.length === 0) {
    throw new Error("Datos de entrada vacíos. Operación abortada para proteger el fichero maestro.");
  }

  // 1. Obtener la primera hoja de trabajo
  const sheet = workbook.getFirstWorksheet();

  // 2. Indexar tbl_AIR_BPs en un Map para acceso O(1)
  const bpMap = new Map<number, { pvc: string; desc: string }>();
  for (const bp of airBps) {
    if (bp.Id !== undefined && bp.Id !== null) {
      bpMap.set(bp.Id, {
        pvc: bp.PVC_Business_Partner ?? "",
        desc: bp.BP_Desc ?? ""
      });
    }
  }

  // 3. Generar la matriz de datos con las columnas en el orden exacto:
  // [PVC_Business_Partner, BP_Desc, Index_Code, Inflation_Index_ID, Applicable_Year, Rate]
  const rowsToWrite: (string | number)[][] = [];

  for (const rate of inflationRates) {
    const bpInfo = bpMap.get(rate.Business_Partner_ID);
    const pvc = bpInfo ? bpInfo.pvc : "";
    const desc = bpInfo ? bpInfo.desc : "";

    rowsToWrite.push([
      pvc,
      desc,
      rate.Index_Code ?? "",
      rate.Inflation_Index_ID ?? "",
      rate.Applicable_Year ?? "",
      rate.Rate !== undefined && rate.Rate !== null ? rate.Rate : ""
    ]);
  }

  // 4. Limpieza y reemplazo atómico del rango
  const usedRange = sheet.getUsedRange();
  if (usedRange) {
    const totalExistingRows = usedRange.getRowCount();
    // Si hay datos por debajo de la cabecera (fila 1 / índice 0), limpiar ese rango
    if (totalExistingRows > 1) {
      const dataRangeToClear = sheet.getRangeByIndexes(
        1,
        0,
        totalExistingRows - 1,
        usedRange.getColumnCount()
      );
      dataRangeToClear.clear(ExcelScript.ClearApplyTo.all);
    }
  }

  // 5. Escritura en un solo bloque (Bulk write)
  if (rowsToWrite.length > 0) {
    const targetRange = sheet.getRangeByIndexes(1, 0, rowsToWrite.length, 6);
    targetRange.setValues(rowsToWrite);
  }

  return {
    status: "Success",
    totalRowsWritten: rowsToWrite.length
  };
}
