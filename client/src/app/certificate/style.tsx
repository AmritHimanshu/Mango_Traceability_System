import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px",
  },
  firstSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBold: {
    fontFamily: "Helvetica-Bold",
  },
  subTitle: {
    fontSize: 8,
  },
  spaceY: {
    gap: "30px",
  },
  firstSectionMid: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    color: "#31473A",
    gap: "3px",
  },
  straigthLine: {
    width: 50,
    height: 0,
    border: "1px solid black",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10px",
  },
  flexCol: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  table: {
    fontSize: 8,
  },
  tableHeader: {
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#f2f2f2",
  },
  tableHeaderData: {
    textAlign: "center", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 5,
  },
  tableBodyData: {
    textAlign: "center", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 5,
  },
  gridContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap", 
    justifyContent: "space-between",
  },
  gridItem: {
    width: "50%",
    padding: 10,
    textAlign: "center",
  },



  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
  },
  farmId: {
    color: "gray",
    fontSize: 10,
  },
  info: {
    marginVertical: 10,
    fontSize: 13,
    textAlign: "center",
  },
});
