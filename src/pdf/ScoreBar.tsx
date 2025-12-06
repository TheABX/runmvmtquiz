import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

const styles = StyleSheet.create({
  row: { 
    marginBottom: 8 
  },
  labelRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 3,
  },
  label: { 
    fontSize: 9,
    color: theme.colors.textMain,
  },
  value: { 
    fontSize: 9,
    color: theme.colors.textMuted,
    fontWeight: 600,
  },
  barBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.line,
    overflow: "hidden",
  },
  barFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});

export const ScoreBar: React.FC<{
  label: string;
  score: number; // 1–5
}> = ({ label, score }) => {
  const widthPercent = `${(score / 5) * 100}%`;

  return (
    <View style={styles.row}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{score.toFixed(1)} / 5.0</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: widthPercent }]} />
      </View>
    </View>
  );
};


