import React from "react";
import { styles } from "./style";
import { Farm, userCert } from "@/utils/Types/interfaces";
import { Page, Text, View } from "@react-pdf/renderer";
import { Table, TD, TR } from "@ag-media/react-pdf-table";
import ListFarmCertificate from "@/app/components/farmer/ListFarmCertificate";

function PDFContent({
  farmData,
  userData,
  farm_id,
}: {
  farmData: Farm | undefined;
  userData: userCert | undefined;
  farm_id: string | null;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.spaceY}>
        <View style={styles.firstSection}>
          <View style={styles.flexCol}>
            <Text style={styles.textBold}>{farmData?.farm}</Text>
            <Text style={styles.subTitle}>{farmData?.uniqueID}</Text>
          </View>

          <View style={[styles.firstSectionMid, styles.textBold]}>
            <Text>Mango</Text>
            <View style={styles.flexRow}>
              <Text style={styles.straigthLine}></Text>
              <Text>Traceability</Text>
              <Text style={styles.straigthLine}></Text>
            </View>
            <Text>System</Text>
          </View>

          <View style={styles.flexCol}>
            <Text style={styles.textBold}>{farmData?.crop}</Text>
            <Text style={styles.subTitle}>
              {new Date(Date.now()).toISOString().split("T")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.spaceY}>
          <View>
            <Table style={styles.table}>
              <TR style={styles.tableHeader}>
                <TD style={styles.tableHeaderData}>Ploughing Date</TD>
                <TD style={styles.tableHeaderData}>Sowing Date</TD>
                <TD style={styles.tableHeaderData}>Flowering Date</TD>
                <TD style={styles.tableHeaderData}>Pheromone Trap Date</TD>
                <TD style={styles.tableHeaderData}>Lure Change Date</TD>
              </TR>
              <TR>
                <TD style={styles.tableBodyData}>
                  {farmData?.ploughingDate
                    ? new Date(farmData.ploughingDate)
                        .toISOString()
                        .split("T")[0]
                    : " - "}
                </TD>
                <TD style={styles.tableBodyData}>
                  {farmData?.sowingDate
                    ? new Date(farmData.sowingDate).toISOString().split("T")[0]
                    : " - "}
                </TD>
                <TD style={styles.tableBodyData}>
                  {farmData?.floweringDate
                    ? new Date(farmData.floweringDate)
                        .toISOString()
                        .split("T")[0]
                    : " - "}
                </TD>
                <TD style={styles.tableBodyData}>
                  {farmData?.pheromoneTrapDate
                    ? new Date(farmData.pheromoneTrapDate)
                        .toISOString()
                        .split("T")[0]
                    : " - "}
                </TD>
                <TD style={styles.tableBodyData}>
                  {farmData?.lureChangeDate
                    ? new Date(farmData.lureChangeDate)
                        .toISOString()
                        .split("T")[0]
                    : " - "}
                </TD>
              </TR>
            </Table>
          </View>

          <View style={styles.gridContainer}>
            <View style={[styles.gridItem, styles.flexCol]}>
              <Text style={styles.subTitle}>Weeding Dates</Text>
              <Table style={styles.table}>
                {farmData?.weedingDate
                  .reduce<string[][]>((acc, date, index) => {
                    if (index % 3 === 0) acc.push([]);
                    acc[acc.length - 1].push(date);
                    return acc;
                  }, [])
                  .map((row, rowIndex) => (
                    <TR key={rowIndex}>
                      {row.map((date, index) => (
                        <TD
                          key={index}
                          style={styles.tableBodyData}
                        >
                          {new Date(date).toISOString().split("T")[0]}
                        </TD>
                      ))}
                    </TR>
                  ))}
              </Table>
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              <Text style={styles.subTitle}>Irrigation Dates</Text>
              {((farmData?.irrigationDates.artificial &&
                farmData.irrigationDates.artificial.length > 0) ||
                (farmData?.irrigationDates.natural &&
                  farmData.irrigationDates.natural.length > 0)) && (
                <Table style={styles.table}>
                  <TR style={styles.tableHeader}>
                    {farmData?.irrigationDates.artificial.length > 0 && (
                      <TD style={styles.tableHeaderData}>
                        <Text>Artificial</Text>
                      </TD>
                    )}
                    {farmData?.irrigationDates.natural.length > 0 && (
                      <TD style={styles.tableHeaderData}>
                        <Text>Natural</Text>
                      </TD>
                    )}
                  </TR>
                  {(() => {
                    const maxLength = Math.max(
                      farmData?.irrigationDates.artificial.length || 0,
                      farmData?.irrigationDates.natural.length || 0
                    );

                    return Array.from({ length: maxLength }).map((_, index) => (
                      <TR key={index}>
                        {farmData?.irrigationDates.artificial.length > 0 && (
                          <TD style={styles.tableBodyData}>
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
                          <TD style={styles.tableBodyData}>
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
                    ));
                  })()}
                </Table>
              )}
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              {farmData?.fertilizerApplications &&
                farmData.fertilizerApplications.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>Fertilizer Application</Text>

                    <ListFarmCertificate
                      data={farmData.fertilizerApplications}
                      columns={[
                        { header: "Date", key: "date" },
                        { header: "Volume (L)", key: "volume" },
                      ]}
                    />
                  </>
                )}
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              {farmData?.pesticideApplications &&
                farmData.pesticideApplications.length > 0 && (
                  <>
                    <Text style={styles.subTitle}>Pesticide Application</Text>

                    <ListFarmCertificate
                      data={farmData.pesticideApplications}
                      columns={[
                        { header: "Date", key: "date" },
                        { header: "Volume (L)", key: "volume" },
                      ]}
                    />
                  </>
                )}
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              {farmData?.bagging && farmData.bagging.length > 0 && (
                <>
                  <Text style={styles.subTitle}>Bagging</Text>
                  <ListFarmCertificate
                    data={farmData.bagging}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Quantity", key: "quantity" },
                    ]}
                  />
                </>
              )}
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              {farmData?.specialCare && farmData.specialCare.length > 0 && (
                <>
                  <Text style={styles.subTitle}>Special care</Text>
                  <ListFarmCertificate
                    data={farmData.specialCare}
                    columns={[
                      { header: "Date", key: "date" },
                      { header: "Name", key: "name" },
                    ]}
                  />
                </>
              )}
            </View>

            <View style={[styles.gridItem, styles.flexCol]}>
              {farmData?.harvest && (
                <>
                  <Text style={styles.subTitle}>Harvest</Text>
                  <Table style={styles.table}>
                    <TR style={styles.tableHeader}>
                      <TD style={styles.tableHeaderData}>Date</TD>
                      <TD style={styles.tableHeaderData}>Yield</TD>
                    </TR>
                    <TR>
                      <TD style={styles.tableBodyData}>
                        {
                          new Date(farmData.harvest.date)
                            .toISOString()
                            .split("T")[0]
                        }
                      </TD>
                      <TD style={styles.tableBodyData}>
                        {farmData?.harvest.yield}
                      </TD>
                    </TR>
                  </Table>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Page>
  );
}

export default PDFContent;
