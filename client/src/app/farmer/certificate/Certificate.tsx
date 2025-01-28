import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { styles } from "./style";
import { Farm } from "@/utils/Types/interfaces";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import ListFarmCertificate from "@/app/components/farmer/components/ListFarmCertificate";

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
                  <Table style={styles.table}>
                    <TR style={styles.textBold}>
                      {farmData?.irrigationDates.artificial.length > 0 && (
                        <TD style={{ border: "1px solid #ccc", padding: 5 }}>
                          <Text>Artificial</Text>
                        </TD>
                      )}
                      {farmData?.irrigationDates.natural.length > 0 && (
                        <TD style={{ border: "1px solid #ccc", padding: 5 }}>
                          <Text>Natural</Text>
                        </TD>
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
                            {farmData?.irrigationDates.artificial.length >
                              0 && (
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
                                  : "-"}
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
                                  : "-"}
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

            <View>
              {farmData?.fertilizerApplications &&
                farmData.fertilizerApplications.length > 0 && (
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Fertilizer Application:
                    </Text>
                    <ListFarmCertificate
                      data={farmData.fertilizerApplications}
                      columns={[
                        { header: "Date", key: "date" },
                        { header: "Volume (L)", key: "volume" },
                      ]}
                    />
                  </View>
                )}
            </View>

            <View>
              {farmData?.pesticideApplications &&
                farmData.pesticideApplications.length > 0 && (
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                      Pesticide Application:
                    </Text>
                    <ListFarmCertificate
                      data={farmData.pesticideApplications}
                      columns={[
                        { header: "Date", key: "date" },
                        { header: "Volume (L)", key: "volume" },
                      ]}
                    />
                  </View>
                )}
            </View>

            <View>
              {farmData?.bagging && farmData.bagging.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                    Bagging:
                  </Text>
                  <ListFarmCertificate
                    data={farmData.bagging}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Quantity", key: "quantity" },
                    ]}
                  />
                </View>
              )}
            </View>

            <View>
              {farmData?.specialCare && farmData.specialCare.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                    Special care:
                  </Text>
                  <ListFarmCertificate
                    data={farmData.specialCare}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Name", key: "name" },
                    ]}
                  />
                </View>
              )}
            </View>

            <View>
              {farmData?.harvest && (
                <Text>
                  Harvest:{" "}
                  <Text>
                    <Text>Date: </Text>
                    <Text>
                      {farmData?.harvest
                        ? new Date(farmData.harvest.date)
                            .toISOString()
                            .split("T")[0]
                        : " - "}
                    </Text>
                  </Text>
                  <Text>
                    <Text>Yield: </Text>
                    <Text>{farmData?.harvest.yield}</Text>
                  </Text>
                </Text>
              )}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

export default Certificate;
