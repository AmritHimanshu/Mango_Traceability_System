"use client";

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { styles } from "./style";

function Certificate() {

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
            <View style={styles.section}>
              <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
              <Text>Section #2</Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
}

export default Certificate;
