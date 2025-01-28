import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    color: "black",
    fontFamily: "Helvetica",
    fontSize: "12px",
    padding: "30px 50px",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
  },
  textBold: {
    fontFamily: 'Helvetica-Bold'
  },
  spaceY: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  farmId: {
    color: 'gray',
    fontSize: 10,
  },
  info: {
    marginVertical: 10,
    fontSize: 13,
    textAlign: 'center',
  },
});
