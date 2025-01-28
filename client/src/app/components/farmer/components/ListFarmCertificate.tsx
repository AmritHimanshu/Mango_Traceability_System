import React from "react";
import { ListFarmApplicationsDataProps } from "@/utils/Types/interfaces";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { styles } from "@/app/farmer/certificate/style";
import { Text } from "@react-pdf/renderer";

function ListFarmCertificate({ data, columns }: ListFarmApplicationsDataProps) {
  return (
    <div>
      <Table style={styles.table}>
        <TR style={styles.textBold}>
          {columns.map((column, index) => (
            <TD
              key={index}
              style={{ border: "1px solid #ccc", padding: 5 }}
            >
              <Text>{column.header}</Text>
            </TD>
          ))}
        </TR>

        {data.map((item, rowIndex) => (
          <TR
            key={rowIndex}
            className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
          >
            {columns.map((column, colIndex) => (
              <TD key={colIndex} style={{ border: "1px solid #ccc", padding: 5 }}>
                {column.key === "date"
                  ? item[column.key] &&
                    new Date(item[column.key]).toISOString().split("T")[0]
                  : item[column.key]}
              </TD>
            ))}
          </TR>
        ))}
      </Table>
    </div>
  );
}

export default ListFarmCertificate;
