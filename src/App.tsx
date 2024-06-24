/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
} from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const [rowData, setRowData] = useState<IOlympicData[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      rowDrag: true,
      pinned: "left",
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "country",
      filter: "agSetColumnFilter",
      floatingFilter: true,
      floatingFilterComponent: () => {
        const countries = [
          "United States",
          "Russia",
          "Australia",
          "Canada",
          "Norway",
          "China",
          "Zimbabwe",
          "Netherlands",
          "South Korea",
          "Croatia",
          "France",
          "Japan",
        ];
        return (
          <select
            onChange={(event) => {
              gridRef
                .current!.api.setColumnFilterModel("country", {
                  values: [event.target.value],
                })
                .then(() => {
                  gridRef.current!.api.onFilterChanged();
                });
            }}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        );
      },
    },
    { field: "year", width: 100, floatingFilter: true },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {},
      floatingFilter: true,
    },
    { field: "sport", filter: "agTextColumnFilter", floatingFilter: true },
    { field: "gold", filter: "agNumberColumnFilter", floatingFilter: true },
    { field: "silver", filter: "agNumberColumnFilter", floatingFilter: true },
    { field: "bronze", filter: "agNumberColumnFilter", floatingFilter: true },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 170,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => setRowData(data));
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Athlete",
      field: "athlete",
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
        },
      ],
      position: "left",
      defaultToolPanel: "",
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz-dark"}>
        <AgGridReact<IOlympicData>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          autoGroupColumnDef={autoGroupColumnDef as ColDef<IOlympicData, any>}
          sideBar={
            sideBar as
              | string
              | boolean
              | SideBarDef
              | string[]
              | null
              | undefined
          }
          rowGroupPanelShow={"always"}
          pivotPanelShow={"always"}
          onGridReady={onGridReady}
          rowDragManaged={true}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div
        className="ag-theme-quartz"
        style={{ height: 500, width: "80%", margin: "auto" }}
      >
        <GridExample />
      </div>
    </>
  );
}

export default App;
