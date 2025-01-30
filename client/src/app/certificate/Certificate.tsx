import React, { useEffect } from "react";
import { Document, pdf } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { Farm } from "@/utils/Types/interfaces";
import { saveAs } from "file-saver";
import { isMobile } from "@/utils/IsMobile/isMobile";
import PDFContent from "./PDFContent";

function Certificate({
  farmData,
  farm_id,
}: {
  farmData: Farm | undefined;
  farm_id: string | null;
}) {
  useEffect(() => {
    if (isMobile() && farmData) {
      const generatePdf = async () => {
        const blob = await pdf(
          <Document>
            <PDFContent farmData={farmData} farm_id={farm_id} />
          </Document>
        ).toBlob();
        saveAs(blob, `certificate_${farm_id}.pdf`);
      };

      generatePdf();
    }
  }, [farmData, farm_id]);

  if (isMobile()) {
    return null;
  }

  return (
    <div className="w-full h-[750px]">
      <PDFViewer
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Document>
          <PDFContent farmData={farmData} farm_id={farm_id} />
        </Document>
      </PDFViewer>
    </div>
  );
}

export default Certificate;
