import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";
import type { MindsetShift } from "@/src/lib/mindsetShifts";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary,
  },
  oldThought: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontStyle: "italic",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  arrow: {
    fontSize: 10,
    color: theme.colors.primary,
    textAlign: "center",
    marginVertical: 4,
    fontWeight: "bold",
  },
  newThought: {
    fontSize: 10,
    color: theme.colors.textMain,
    fontWeight: 600,
    lineHeight: 1.4,
  },
  label: {
    fontSize: 8,
    color: theme.colors.textMuted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export const MindsetShiftCard: React.FC<{ shift: MindsetShift }> = ({ shift }) => (
  <View style={styles.card}>
    <Text style={styles.label}>Instead of thinking:</Text>
    <Text style={styles.oldThought}>"{shift.old}"</Text>
    <Text style={styles.arrow}>→</Text>
    <Text style={styles.label}>Try thinking:</Text>
    <Text style={styles.newThought}>"{shift.new}"</Text>
  </View>
);


