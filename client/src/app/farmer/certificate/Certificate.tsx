"use client";

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import mango_logo from "../../../../public/assets/Mango_logo.png";
import { styles } from "./style";
import { Farm } from "@/utils/Types/interfaces";

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
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

export default Certificate;
