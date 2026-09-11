# Guía Operativa de Ejecución y Pruebas - SORA Inflation Index

## 1. Acceso Directo al Flujo y al Entorno
* **Portal**: [make.powerautomate.com](https://make.powerautomate.com/)
* **Entorno seleccionado**: `S_CFA-RNC_Dev`
* **Solución**: `SORA_Solution`
* **Nombre del flujo**: `SORA - Rebuild Inflation Index Master`
* **Enlace directo al flujo**: [Abrir Flujo en Power Automate](https://make.powerautomate.com/environments/697653f8-240f-ef09-96c1-30f90153d95d/solutions/SORA_Solution/flows/e4b3c2d1-0000-4000-8000-112233445566/details)

---

## 2. Checklist de Validación Paso a Paso

### [x] 1. Despliegue de la solución
- Solución `SORA_Solution` empaquetada e importada en Dataverse.
- Referencias de conexión `rmc_sharedsharepointonline_sora` y `rmc_sharedexcelonlinebusiness_sora` creadas en el entorno.

### [ ] 2. Guardar el Office Script en Excel Online
1. Ve al sitio SharePoint **`CFA-RCTeamsite`** en la ruta:
   `Contract Fulfillment / 1. AIR / OPM 03. Operations / 05. Contractual Conditions Harmonization project / Pricing file transformation / Master data / SORA_Inflation_Index_Values.xlsx`
2. Abre el libro en **Excel Online**.
3. Haz clic en la pestaña **Automatizar** > **Nuevo script**.
4. Pega el código de [Rebuild_SORA_Inflation_Index.ts](./Rebuild_SORA_Inflation_Index.ts).
5. Renombra el script a: `Rebuild_SORA_Inflation_Index` y pulsa **Guardar**.

### [ ] 3. Conexión de Excel Online & Activación
1. En el portal de Power Automate, abre el flujo `SORA - Rebuild Inflation Index Master`.
2. Si te solicita vincular tu cuenta a la conexión de **Excel Online (Business)** (`rmc_sharedexcelonlinebusiness_sora`), selecciona tu cuenta corporativa `paloma.perez@amadeus.com`.
3. Haz clic en **Activar (Turn On)** en la barra superior.

### [ ] 4. Prueba Manual de Validación
1. Haz clic en el botón **Probar (Test)** (arriba a la derecha).
2. Selecciona **Manualmente** > **Probar** > **Ejecutar flujo**.
3. Comprueba en el historial de ejecución que:
   - `Get_items_tbl_AIR_BPs` devuelve las filas paginadas.
   - `Get_items_tbl_INFLATION_INDEX_RATES` devuelve las tasas de inflación.
   - La condición evalúa `false` (no vacías).
   - `Run_Office_Script` finaliza en estado `Succeeded`.
4. Abre el fichero Excel y comprueba que los datos maestros se hayan sobreescrito correctamente en la hoja.
