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
  experienceSection: {
    margin: 10,
    padding: 10,
    borderBottom: '1px solid #eee',
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 5,
  },
});

type Experience = {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string;
};

type Props = {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    linkedin: string;
    experience: Experience[];
  };
};

const formatDate = (date: Date | null) => date ? new Date(date).toLocaleDateString() : 'Presente';

const PdfViewer: React.FC<Props> = ({ data }) => (
  <PDFViewer width="100%" height="600">
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Información Personal</Text>
          <Text>Nombre: {data.firstName}</Text>
          <Text>Apellidos: {data.lastName}</Text>
          <Text>Email: {data.email}</Text>
          <Text>LinkedIn: {data.linkedin}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Experiencia</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.experienceSection}>
              <Text style={styles.subHeader}>{exp.company} - {exp.position}</Text>
              <Text>Desde: {formatDate(exp.startDate)} - Hasta: {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}</Text>
              <Text>Descripción: {exp.description}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  </PDFViewer>
);


export default PdfViewer