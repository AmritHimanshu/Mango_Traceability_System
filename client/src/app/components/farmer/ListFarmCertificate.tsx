import React from "react";
import { ListFarmApplicationsDataProps } from "@/utils/Types/interfaces";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { styles } from "@/app/certificate/style";

function ListFarmCertificate({ data, columns }: ListFarmApplicationsDataProps) {
  return (
    <Table style={styles.table}>
      <TR style={styles.tableHeader}>
        {columns.map((column, index) => (
          <TD key={index} style={styles.tableHeaderData}>
            {column.header}
          </TD>
        ))}
      </TR>

      {data.map((item, rowIndex) => (
        <TR key={rowIndex}>
          {columns.map((column, colIndex) => (
            <TD key={colIndex} style={styles.tableBodyData}>
              {column.key === "date"
                ? item[column.key] &&
                  new Date(item[column.key]).toISOString().split("T")[0]
                : item[column.key]}
            </TD>
          ))}
        </TR>
      ))}
    </Table>
  );
}

export default ListFarmCertificate;
