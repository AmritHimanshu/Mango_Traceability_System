import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { styles } from "./style";
import { Farm } from "@/utils/Types/interfaces";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";

function Certificate({
  farmData,
  farm_id,
}: {
  farmData: Farm | undefined;
  farm_id: string | null;
}) {
  return (
    <div className="w-full h-[750px]">
      <PDFViewer
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <View style={styles.spaceY}>
                <Text style={[styles.title, styles.textBold]}>
                  Mango Traceability System
                </Text>
                <Text>Date</Text>
              </View>
              <View style={styles.spaceY}>
                <Text style={styles.textBold}>{farmData?.userId.name}</Text>
                <Text>{farmData?.userId.email}</Text>
              </View>
            </View>

            <View style={styles.header}>
              <View style={styles.spaceY}>
                <Text>
                  Farm Name: <Text>{farmData?.farm}</Text>
                </Text>
                <Text style={[styles.farmId, styles.spaceY, styles.textBold]}>
                  {farm_id}
                </Text>
              </View>
              <View>
                <Text>
                  Crop Name: <Text>{farmData?.crop}</Text>
                </Text>
              </View>
            </View>

            <View>
              <Text style={[styles.textBold, styles.info]}>
                Farm information:{" "}
              </Text>
            </View>

            <View style={styles.header}>
              <View style={styles.spaceY}>
                <Text>
                  Ploughing Date:{" "}
                  <Text>
                    {farmData?.ploughingDate
                      ? new Date(farmData.ploughingDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>

                <Text>
                  Weeding Date:{" "}
                  <Text>
                    {farmData?.weedingDate
                      ? new Date(farmData.weedingDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>

                <Text>
                  Sowing Date:{" "}
                  <Text>
                    {farmData?.sowingDate
                      ? new Date(farmData.sowingDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>
              </View>

              <View style={styles.spaceY}>
                <Text>
                  Flowering Date:{" "}
                  <Text>
                    {farmData?.floweringDate
                      ? new Date(farmData.floweringDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>

                <Text>
                  Pheromone Trap Date:{" "}
                  <Text>
                    {farmData?.pheromoneTrapDate
                      ? new Date(farmData.pheromoneTrapDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>

                <Text>
                  Lure Change Date:{" "}
                  <Text>
                    {farmData?.lureChangeDate
                      ? new Date(farmData.lureChangeDate)
                          .toISOString()
                          .split("T")[0]
                      : " - "}
                  </Text>
                </Text>
              </View>
            </View>

            <View>
              {((farmData?.irrigationDates.artificial &&
                farmData.irrigationDates.artificial.length > 0) ||
                (farmData?.irrigationDates.natural &&
                  farmData.irrigationDates.natural.length > 0)) && (
                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                    Irrigation Dates:
                  </Text>
                  <Table style={{ width: "100%", border: "1px solid #ccc" }}>
                    <TR>
                      {farmData?.irrigationDates.artificial.length > 0 && (
                        <TH style={{ border: "1px solid #ccc", padding: 5 }}>
                          Artificial
                        </TH>
                      )}
                      {farmData?.irrigationDates.natural.length > 0 && (
                        <TH style={{ border: "1px solid #ccc", padding: 5 }}>
                          Natural
                        </TH>
                      )}
                    </TR>
                    {(() => {
                      const maxLength = Math.max(
                        farmData?.irrigationDates.artificial.length || 0,
                        farmData?.irrigationDates.natural.length || 0
                      );

                      return Array.from({ length: maxLength }).map(
                        (_, index) => (
                          <TR key={index}>
                            {farmData?.irrigationDates.artificial.length > 0 && (
                              <TD
                                style={{
                                  border: "1px solid #ccc",
                                  padding: 5,
                                }}
                              >
                                {farmData.irrigationDates.artificial[index]
                                  ? new Date(
                                      farmData.irrigationDates.artificial[index]
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  : ""}
                              </TD>
                            )}
                            {farmData?.irrigationDates.natural.length > 0 && (
                              <TD
                                style={{
                                  border: "1px solid #ccc",
                                  padding: 5,
                                }}
                              >
                                {farmData.irrigationDates.natural[index]
                                  ? new Date(
                                      farmData.irrigationDates.natural[index]
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  : ""}
                              </TD>
                            )}
                          </TR>
                        )
                      );
                    })()}
                  </Table>
                </View>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

export default Certificate;
