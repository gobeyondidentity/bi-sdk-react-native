import { StyleSheet } from "react-native";

export const Color = {
  primary: "#4673D3",
  backgroundColor: "#f8f8f8",
  responseBackground: "#E3E3E4",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: Color.backgroundColor,
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    backgroundColor: Color.backgroundColor,
  },
  version: {
    fontSize: 16,
    marginBottom: 10,
    color: "gray",
    backgroundColor: Color.backgroundColor,
  },
  input: {
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#595959",
    borderWidth: 1,
    padding: 10,
    minWidth: 150,
    backgroundColor: Color.backgroundColor,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Color.backgroundColor,
  },
  title: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold",
    backgroundColor: Color.backgroundColor,
  },
  detail: {
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: Color.backgroundColor,
  },
});
