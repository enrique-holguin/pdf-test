import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
});

type Props = {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
  };
};

const PdfViewer: React.FC<Props> = ({ data }) => (
  <PDFViewer width="100%" height="600">
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>Nombre: {data.firstName}</Text>
        </View>
        <View style={styles.section}>
          <Text>Apellidos: {data.lastName}</Text>
        </View>
        <View style={styles.section}>
          <Text>Email: {data.email}</Text>
        </View>
        <View style={styles.section}>
          <Text>LinkedIn: {data.linkedin}</Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default PdfViewer