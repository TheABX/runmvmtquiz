import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";
import { Section, Paragraph, BulletList } from "./ReportUI";
import type { NutritionPlan } from "@/src/lib/nutritionPlanGenerator";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  macroCard: {
    backgroundColor: theme.colors.panel,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 10,
    color: theme.colors.textMain,
    fontWeight: 600,
  },
  macroValue: {
    fontSize: 10,
    color: theme.colors.textMain,
    fontWeight: 700,
  },
  macroPercent: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  mealSection: {
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.primary,
    marginBottom: 6,
  },
  mealItem: {
    fontSize: 9,
    color: theme.colors.textMain,
    marginBottom: 4,
    paddingLeft: 8,
  },
  highlightBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 9,
    color: theme.colors.textMain,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  calorieDisplay: {
    fontSize: 24,
    fontWeight: 700,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: "center",
    marginBottom: 12,
  },
});

const RunMvmtLayout: React.FC<{
  title: string;
  subtitle?: string;
  tags?: string[];
  children: React.ReactNode;
  pageNumber?: number;
}> = ({ title, subtitle, tags = [], children, pageNumber }) => {
  const pageStyles = StyleSheet.create({
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
      alignItems: "flex-start",
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.line,
    },
    headerLeft: {
      flex: 1,
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
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    tag: {
      fontSize: 8,
      color: theme.colors.textMuted,
      backgroundColor: theme.colors.panel,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.line,
    },
    headerRight: {
      fontSize: 9,
      color: theme.colors.textMuted,
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 40,
      right: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.line,
    },
    footerText: {
      fontSize: 8,
      color: theme.colors.textMuted,
    },
  });

  return (
    <Page size="A4" style={pageStyles.page}>
      <View style={pageStyles.header}>
        <View style={pageStyles.headerLeft}>
          <Text style={pageStyles.title}>{title}</Text>
          {subtitle && <Text style={pageStyles.subtitle}>{subtitle}</Text>}
          {tags.length > 0 && (
            <View style={pageStyles.tags}>
              {tags.map((tag, i) => (
                <Text key={i} style={pageStyles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          )}
        </View>
        {pageNumber && (
          <Text style={pageStyles.headerRight}>Page {pageNumber}</Text>
        )}
      </View>
      {children}
      <View style={pageStyles.footer}>
        <Text style={pageStyles.footerText}>RUN MVMT — Move as one.</Text>
        <Text style={pageStyles.footerText}>
          {pageNumber ? `Page ${pageNumber}` : ""}
        </Text>
      </View>
    </Page>
  );
};

export interface NutritionReportProps {
  name?: string;
  plan: NutritionPlan;
}

export const NutritionReport: React.FC<NutritionReportProps> = ({ name, plan }) => {
  return (
    <Document>
      {/* Page 1: Overview & Calorie Targets */}
      <RunMvmtLayout
        title="Performance Nutrition Plan"
        subtitle={name ? `For: ${name}` : undefined}
        tags={["12-Week Program", "Personalized Nutrition"]}
        pageNumber={1}
      >
        <View style={styles.card}>
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Text style={styles.calorieDisplay}>{plan.dailyCalories}</Text>
            <Text style={styles.calorieLabel}>Daily Calorie Target</Text>
          </View>
          
          <View style={styles.macroCard}>
            <Text style={styles.macroLabel}>Macronutrient Breakdown</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Protein</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.macroValue}>{plan.protein}g</Text>
                <Text style={styles.macroPercent}>({plan.proteinPercent}%)</Text>
              </View>
            </View>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Carbohydrates</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.macroValue}>{plan.carbs}g</Text>
                <Text style={styles.macroPercent}>({plan.carbsPercent}%)</Text>
              </View>
            </View>
            <View style={styles.macroRow}>
              <Text style={styles.macroLabel}>Fats</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={styles.macroValue}>{plan.fats}g</Text>
                <Text style={styles.macroPercent}>({plan.fatsPercent}%)</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Your Metabolic Profile</Text>
          <Text style={styles.highlightText}>
            • Basal Metabolic Rate (BMR): {plan.bmr} calories/day
          </Text>
          <Text style={styles.highlightText}>
            • Total Daily Energy Expenditure (TDEE): {plan.tdee} calories/day
          </Text>
          <Text style={styles.highlightText}>
            • Target Daily Calories: {plan.dailyCalories} calories/day
          </Text>
        </View>

        <View style={styles.card}>
          <Section title="Meal Timing Guidelines">
            <BulletList items={plan.mealTimingGuidelines} />
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Hydration Guidelines">
            <BulletList items={plan.hydrationGuidelines} />
          </Section>
        </View>
      </RunMvmtLayout>

      {/* Page 2: Meal Suggestions */}
      <RunMvmtLayout
        title="Meal Suggestions"
        subtitle="Mix and match based on your preferences"
        pageNumber={2}
      >
        <View style={styles.card}>
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Breakfast Options</Text>
            {plan.breakfast.map((meal, i) => (
              <Text key={i} style={styles.mealItem}>
                • {meal}
              </Text>
            ))}
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Lunch Options</Text>
            {plan.lunch.map((meal, i) => (
              <Text key={i} style={styles.mealItem}>
                • {meal}
              </Text>
            ))}
          </View>

          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Dinner Options</Text>
            {plan.dinner.map((meal, i) => (
              <Text key={i} style={styles.mealItem}>
                • {meal}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.mealSection}>
            <Text style={styles.mealTitle}>Snack Options</Text>
            {plan.snacks.map((snack, i) => (
              <Text key={i} style={styles.mealItem}>
                • {snack}
              </Text>
            ))}
          </View>
        </View>
      </RunMvmtLayout>

      {/* Page 3: Pre/Post Workout & Fueling */}
      <RunMvmtLayout
        title="Training Nutrition"
        subtitle="Pre & Post Workout Fueling"
        pageNumber={3}
      >
        <View style={styles.card}>
          <Section title="Pre-Workout Nutrition">
            {plan.preWorkout.map((item, i) => (
              <Text key={i} style={styles.mealItem}>
                • {item}
              </Text>
            ))}
            <Paragraph>
              Aim to consume 30-60 minutes before training. Keep it light and easily digestible.
            </Paragraph>
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Post-Workout Nutrition">
            {plan.postWorkout.map((item, i) => (
              <Text key={i} style={styles.mealItem}>
                • {item}
              </Text>
            ))}
            <Paragraph>
              Consume within 30-60 minutes after training to optimize recovery. Include both protein and carbohydrates.
            </Paragraph>
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Fueling Guidelines">
            <BulletList items={plan.fuelingGuidelines} />
          </Section>
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: 10, color: theme.colors.textMuted, fontStyle: "italic", lineHeight: 1.4 }}>
            This nutrition plan is tailored to your body, training load, and preferences. Adjust portions based on hunger, energy levels, and training intensity. Consistency beats perfection.
          </Text>
        </View>
      </RunMvmtLayout>
    </Document>
  );
};


