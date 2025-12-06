import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 32,
    backgroundColor: theme.colors.background,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
  },
  brandText: {
    fontSize: 14,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginLeft: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  tag: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  mainCard: {
    backgroundColor: theme.colors.panel,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#00000020",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    position: "relative",
    overflow: "hidden",
  },
  decorativeBlob1: {
    position: "absolute",
    top: -20,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFE0CC",
    opacity: 0.4,
  },
  decorativeBlob2: {
    position: "absolute",
    top: 40,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD66B",
    opacity: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 9,
    marginRight: 6,
    marginBottom: 4,
  },
  pillPrimary: {
    backgroundColor: "#FFE5D5",
    color: theme.colors.textMain,
  },
  pillSoft: {
    backgroundColor: "#E3E8FF",
    color: theme.colors.textMain,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: theme.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
    marginVertical: 8,
  },
});

export const ReportLayout: React.FC<{
  name: string;
  patternLabel: string;
  tags?: string[];
  children: React.ReactNode;
  pageNumber?: number;
}> = ({ name, patternLabel, tags = [], children, pageNumber }) => (
  <Page size="A4" style={styles.page}>
    {/* Header */}
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle} />
        <Text style={styles.brandText}>LIFEPHORIA</Text>
      </View>
      <Text style={styles.tag}>Personalised Pattern Report</Text>
    </View>

    {/* Main top card with decorative blobs */}
    <View style={styles.mainCard}>
      <View style={styles.decorativeBlob1} />
      <View style={styles.decorativeBlob2} />
      <Text style={styles.title}>{patternLabel}</Text>
      <Text style={styles.subtitle}>Name: {name}</Text>
      {tags.length > 0 && (
        <View style={styles.pillRow}>
          {tags.map((t, i) => (
            <Text
              key={i}
              style={[
                styles.pill,
                i === 0 ? styles.pillPrimary : styles.pillSoft
              ]}
            >
              {t}
            </Text>
          ))}
        </View>
      )}
    </View>

    {/* Dynamic body sections */}
    {children}

    {/* Footer */}
    <View style={styles.footer}>
      <Text>LIFEPHORIA • Generated for personal reflection</Text>
      {pageNumber != null && <Text>Page {pageNumber}</Text>}
    </View>
  </Page>
);


