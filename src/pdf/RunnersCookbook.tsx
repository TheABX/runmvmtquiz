import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";
import { Section, Paragraph, BulletList } from "./ReportUI";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: theme.colors.primary,
    marginBottom: 6,
  },
  recipeSubtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginBottom: 8,
    fontStyle: "italic",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    fontSize: 7,
    color: theme.colors.textMain,
    backgroundColor: theme.colors.panel,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  tagV: { backgroundColor: "#E9D5FF", color: "#6B21A8" },
  tagVeg: { backgroundColor: "#D1FAE5", color: "#065F46" },
  tagGF: { backgroundColor: "#DBEAFE", color: "#1E40AF" },
  tagDF: { backgroundColor: "#CCFBF1", color: "#0D9488" },
  tagHC: { backgroundColor: "#FEF3C7", color: "#92400E" },
  tagLS: { backgroundColor: "#D1FAE5", color: "#047857" },
  tagIR: { backgroundColor: "#FEE2E2", color: "#991B1B" },
  tagP: { backgroundColor: "#FED7AA", color: "#9A3412" },
  tagLC: { backgroundColor: "#E5E7EB", color: "#374151" },
  ingredientList: {
    marginBottom: 8,
  },
  ingredientItem: {
    fontSize: 8,
    color: theme.colors.textMain,
    marginBottom: 3,
    paddingLeft: 8,
  },
  methodList: {
    marginBottom: 8,
  },
  methodItem: {
    fontSize: 8,
    color: theme.colors.textMain,
    marginBottom: 4,
    paddingLeft: 8,
  },
  swapBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  swapTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  swapText: {
    fontSize: 8,
    color: theme.colors.textMain,
    lineHeight: 1.3,
  },
  coachNote: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  coachTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  coachText: {
    fontSize: 8,
    color: theme.colors.textMain,
    lineHeight: 1.3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 700,
    color: theme.colors.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  categoryHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: 8,
    marginTop: 12,
  },
  table: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  tableHeader: {
    backgroundColor: theme.colors.panel,
    fontWeight: 700,
    fontSize: 9,
    color: theme.colors.textMain,
    padding: 8,
  },
  tableCell: {
    fontSize: 8,
    color: theme.colors.textMain,
    padding: 8,
    flex: 1,
  },
  timingNote: {
    fontSize: 8,
    color: theme.colors.textMuted,
    fontStyle: "italic",
    marginTop: 4,
  },
  caloriesBadge: {
    fontSize: 9,
    fontWeight: 600,
    color: theme.colors.textMuted,
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

const TagComponent: React.FC<{ tags: string[] }> = ({ tags }) => {
  const getTagStyle = (tag: string) => {
    const baseStyle = styles.tag;
    if (tag === "V") return [baseStyle, styles.tagV];
    if (tag === "Veg") return [baseStyle, styles.tagVeg];
    if (tag === "GF") return [baseStyle, styles.tagGF];
    if (tag === "DF") return [baseStyle, styles.tagDF];
    if (tag === "HC") return [baseStyle, styles.tagHC];
    if (tag === "LS") return [baseStyle, styles.tagLS];
    if (tag === "IR") return [baseStyle, styles.tagIR];
    if (tag === "P") return [baseStyle, styles.tagP];
    if (tag === "LC") return [baseStyle, styles.tagLC];
    return baseStyle;
  };

  return (
    <View style={styles.tagContainer}>
      {tags.map((tag, i) => (
        <Text key={i} style={getTagStyle(tag)}>
          {tag}
        </Text>
      ))}
    </View>
  );
};

interface RecipeProps {
  title: string;
  subtitle?: string;
  tags: string[];
  calories: string;
  ingredients: string[];
  method: string[];
  coachNotes?: string;
  swaps?: Array<{ title: string; content: string }>;
  timing?: string;
}

const RecipeCard: React.FC<RecipeProps> = ({
  title,
  subtitle,
  tags,
  calories,
  ingredients,
  method,
  coachNotes,
  swaps,
  timing,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.recipeTitle}>{title}</Text>
      {subtitle && <Text style={styles.recipeSubtitle}>{subtitle}</Text>}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <TagComponent tags={tags} />
        <Text style={styles.caloriesBadge}>{calories}</Text>
      </View>

      <Section title="Ingredients">
        {ingredients.map((ing, i) => (
          <Text key={i} style={styles.ingredientItem}>
            • {ing}
          </Text>
        ))}
      </Section>

      <Section title="Method">
        {method.map((step, i) => (
          <Text key={i} style={styles.methodItem}>
            {i + 1}. {step}
          </Text>
        ))}
      </Section>

      {coachNotes && (
        <View style={styles.coachNote}>
          <Text style={styles.coachTitle}>COACH'S NOTES</Text>
          <Text style={styles.coachText}>{coachNotes}</Text>
        </View>
      )}

      {swaps && swaps.length > 0 && (
        <View>
          {swaps.map((swap, i) => (
            <View key={i} style={styles.swapBox}>
              <Text style={styles.swapTitle}>{swap.title}</Text>
              <Text style={styles.swapText}>{swap.content}</Text>
            </View>
          ))}
        </View>
      )}

      {timing && (
        <Text style={styles.timingNote}>⚡ {timing}</Text>
      )}
    </View>
  );
};

export const RunnersCookbook: React.FC = () => {
  let pageNum = 1;

  return (
    <Document>
      {/* Cover Page */}
      <RunMvmtLayout
        title="RUN MVMT PERFORMANCE COOKBOOK"
        subtitle="Fuel Smart. Run Strong. Recover Better."
        pageNumber={pageNum++}
      >
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.primary,
              marginBottom: 20,
            }}
          >
            Performance Cookbook
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.textMuted,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Simple, practical meals for runners
          </Text>
        </View>
      </RunMvmtLayout>

      {/* Welcome Page */}
      <RunMvmtLayout title="Welcome" pageNumber={pageNum++}>
        <Paragraph>
          Running is simple — but fuelling properly isn't.
        </Paragraph>
        <Paragraph>
          Most runners either undereat, eat the wrong things at the wrong
          times, or fuel in a way that disrupts performance, recovery, and gut
          comfort.
        </Paragraph>
        <Paragraph>This cookbook fixes all of that.</Paragraph>
        <Paragraph>
          It's built for everyday runners who want to feel stronger, run faster,
          recover better, and avoid the classic mistakes that ruin long runs and
          race day. Inside, you'll find simple, practical, athlete-tested meals
          that make fuelling effortless — from breakfasts and dinners to
          race-week meals, gels, snacks, and hydration strategies.
        </Paragraph>
        <Paragraph>
          There's no confusing diet culture. No unnecessary restrictions. Just
          real food, easy preparation, and clear guidance you can actually use.
        </Paragraph>
        <Paragraph>
          Whether you're training for a local fun run, building toward a
          marathon, or simply running to feel good, this cookbook gives you the
          fuelling confidence to show up strong every single day.
        </Paragraph>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: theme.colors.primary,
            }}
          >
            Welcome to RUN MVMT.
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: theme.colors.textMuted,
              marginTop: 4,
            }}
          >
            Let's fuel your best year of running.
          </Text>
          <Text
            style={{
              fontSize: 9,
              color: theme.colors.textMuted,
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            — Deon
          </Text>
        </View>
      </RunMvmtLayout>

      {/* How to Use Page */}
      <RunMvmtLayout title="How to Use This Cookbook" pageNumber={pageNum++}>
        <Section title="1. Follow the Tags">
          <Paragraph>
            Every recipe includes tags so you can instantly see what fits your
            training day and dietary preferences.
          </Paragraph>
        </Section>

        <Section title="2. Use Swap Boxes">
          <Paragraph>
            Every meal includes swap boxes with quick substitutions for vegan,
            GF, high-carb, low-fibre, and other variations.
          </Paragraph>
        </Section>

        <Section title="3. Follow the Timing Guidance">
          <Paragraph>
            Every recipe tells you when to have it: before training, after
            sessions, race-week friendly, or long-run specific.
          </Paragraph>
        </Section>

        <Section title="4. Keep It Simple">
          <Paragraph>
            Most meals use 5–10 ingredients, minimal prep time, and everyday
            supermarket items. You don't need gourmet cooking skills.
          </Paragraph>
        </Section>

        <Section title="5. Practise Race Fuel Early">
          <Paragraph>
            Use the race-day and long-run fuel sections to build a fuelling plan
            that you practise well before race week.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Tag System Page */}
      <RunMvmtLayout title="Tag System" pageNumber={pageNum++}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Tag</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Meaning</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>V</Text>
            <Text style={styles.tableCell}>Vegan</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Veg</Text>
            <Text style={styles.tableCell}>Vegetarian</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>GF</Text>
            <Text style={styles.tableCell}>Gluten-Free</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>DF</Text>
            <Text style={styles.tableCell}>Dairy-Free</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>HC</Text>
            <Text style={styles.tableCell}>High-Carb</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>LS</Text>
            <Text style={styles.tableCell}>Low Fibre (race week friendly)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>IR</Text>
            <Text style={styles.tableCell}>Ideal for Recovery</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>P</Text>
            <Text style={styles.tableCell}>Paleo</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>LC</Text>
            <Text style={styles.tableCell}>Low-Carb</Text>
          </View>
        </View>
      </RunMvmtLayout>

      {/* BREAKFASTS SECTION */}
      <RunMvmtLayout
        title="🍳 BREAKFASTS"
        subtitle="Fast, easy, performance-driven meals"
        pageNumber={pageNum++}
      >
        <Text style={styles.categoryHeader}>
          300–400 kcal (Light Pre-Run Meals)
        </Text>

        <RecipeCard
          title="1. Banana Honey Toast"
          subtitle="Great for: Light pre-run fuel (30–90 mins before)"
          tags={["Veg", "V", "DF", "LS", "HC"]}
          calories="330 kcal"
          ingredients={[
            "1 slice white or sourdough bread",
            "1 banana",
            "1 tbsp honey",
          ]}
          method={[
            "Toast bread",
            "Slice banana",
            "Drizzle with honey",
            "Eat 60–90 minutes before run",
          ]}
          coachNotes="Ideal for runners who wake up early and need quick digesting carbs. White/sourdough bread = lower fibre → gentler on the stomach. Great before short intervals or base runs."
          swaps={[
            {
              title: "VEGAN SWAP",
              content: "Use maple syrup instead of honey → Calories: 335 kcal",
            },
            {
              title: "LOW-FIBRE SWAP",
              content: "Use white instead of multi-grain bread",
            },
            {
              title: "HIGH-CARB VERSION",
              content: "Add second slice (+120 kcal, +22g carbs)",
            },
          ]}
          timing="Best 60–90 minutes before training"
        />
      </RunMvmtLayout>

      {/* Continue with more breakfast recipes on next pages */}
      <RunMvmtLayout title="🍳 BREAKFASTS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="2. Light Oat Smoothie"
          subtitle="Great for: Runners who can't eat solids early AM"
          tags={["Veg", "V", "GF", "DF", "LS", "HC"]}
          calories="350 kcal"
          ingredients={[
            "½ cup oats",
            "1 banana",
            "1 cup almond milk",
            "1 tsp honey or maple syrup",
          ]}
          method={["Blend until smooth"]}
          coachNotes="Liquid carbs digest faster → great before threshold runs. Works well when appetite is low or you're rushing."
          swaps={[
            {
              title: "SUPER LIGHT VERSION",
              content: "Remove oats (+ drink 20 mins pre-run)",
            },
            {
              title: "HIGHER CARB",
              content: "Add extra tbsp honey",
            },
            {
              title: "VEGAN",
              content: "Maple syrup only",
            },
          ]}
          timing="Best 30–60 minutes before training"
        />

        <RecipeCard
          title="3. Yoghurt & Fruit Pot"
          subtitle="Great for: Easy training mornings; workplace breakfasts"
          tags={["Veg", "GF", "LS"]}
          calories="320 kcal"
          ingredients={[
            "150g Greek yoghurt",
            "1 small banana or berries",
            "1 tsp honey",
          ]}
          method={["Layer yoghurt + fruit + honey"]}
          coachNotes="Higher protein helps recovery if eaten after a run. If pre-run, choose banana over berries (lower fibre)."
          swaps={[
            {
              title: "VEGAN SWAP",
              content: "Coconut yoghurt → Calories +40 kcal",
            },
            {
              title: "LIGHTER VERSION",
              content: "Swap banana → berries (lower sugar)",
            },
          ]}
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="🍳 BREAKFASTS (continued)" pageNumber={pageNum++}>
        <Text style={styles.categoryHeader}>
          500–600 kcal (Pre-Threshold / Moderate Load Days)
        </Text>

        <RecipeCard
          title="4. Big Oats Bowl"
          subtitle="Great for: Moderate training sessions; runs 60–90 mins"
          tags={["Veg", "V", "GF", "HC"]}
          calories="560 kcal"
          ingredients={[
            "½ cup oats",
            "1 cup milk",
            "1 banana",
            "1 tbsp honey",
            "1 tbsp peanut butter",
          ]}
          method={[
            "Cook oats",
            "Top with banana + honey + PB",
          ]}
          coachNotes="Strong balance of carbs + fats → long-lasting energy. Peanut butter slows digestion slightly → ideal for steady-state runs."
          swaps={[
            {
              title: "VEGAN SWAP",
              content: "Plant milk → calories unchanged. Use maple syrup",
            },
            {
              title: "LOW-FIBRE SWAP",
              content: "Use instant oats + ripe banana",
            },
            {
              title: "HIGH-CARB VERSION",
              content: "Add extra tbsp honey → +60 kcal",
            },
          ]}
        />

        <RecipeCard
          title="5. Bagel with Jam + Yoghurt"
          subtitle="Great for: Harder sessions, threshold work, long runs < 90 mins"
          tags={["Veg", "LS", "HC"]}
          calories="590 kcal"
          ingredients={[
            "1 white bagel",
            "2 tbsp jam",
            "150g yoghurt",
          ]}
          method={[
            "Toast bagel",
            "Spread jam",
            "Yoghurt on side",
          ]}
          coachNotes="One of the most popular elite runner breakfasts. Bagels are high-carb, low-fibre, easy on the gut."
          swaps={[
            {
              title: "VEGAN SWAP",
              content: "Coconut yoghurt",
            },
            {
              title: "GUT-SENSITIVE",
              content: "Skip yoghurt → + banana instead",
            },
            {
              title: "HIGH CARB",
              content: "Add second tbsp jam (+40 kcal)",
            },
          ]}
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="🍳 BREAKFASTS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="6. Protein Smoothie Bowl"
          subtitle="Great for: Post-run recovery meals"
          tags={["Veg", "GF", "HC"]}
          calories="520 kcal"
          ingredients={[
            "Protein powder (1 scoop)",
            "1 banana",
            "½ cup oats",
            "1 cup milk",
            "1 tbsp honey",
          ]}
          method={["Blend until thick → serve as a bowl"]}
          coachNotes="Carbs refill glycogen; protein accelerates recovery. Cool temperature reduces inflammation after hot sessions."
          swaps={[
            {
              title: "VEGAN",
              content: "Use plant protein + plant milk",
            },
            {
              title: "LOWER CARB",
              content: "Remove oats",
            },
            {
              title: "HIGH CARB",
              content: "Add berries (+20g carbs)",
            },
          ]}
        />

        <Text style={styles.categoryHeader}>
          700–900 kcal (Marathon Training & Long Run Prep)
        </Text>

        <RecipeCard
          title="7. Marathon Porridge Bowl"
          subtitle="Great for: Big training days; long run mornings; carb loading"
          tags={["Veg", "GF", "HC", "IR"]}
          calories="740 kcal"
          ingredients={[
            "1 cup oats",
            "1.5 cups milk",
            "1 banana",
            "2 tbsp honey",
            "1 tbsp peanut butter",
          ]}
          method={[
            "Cook oats",
            "Layer banana + honey + PB",
          ]}
          coachNotes="Huge carb load → sustained endurance. Works well 2–3 hours before long runs."
          swaps={[
            {
              title: "HIGH CARB ADD-ON",
              content: "Add ½ cup raisins → +120 kcal, +31g carbs",
            },
            {
              title: "VEGAN SWAP",
              content: "Use plant milk",
            },
          ]}
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="🍳 BREAKFASTS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="8. Rice Breakfast Bowl"
          subtitle="Great for: Gut-sensitive runners; race week breakfast"
          tags={["V", "Veg", "GF", "DF", "HC", "LS"]}
          calories="810 kcal"
          ingredients={[
            "1 cup cooked white rice",
            "1–2 eggs (or tofu scramble for vegans)",
            "2 tsp soy sauce",
            "1 tsp sesame oil",
          ]}
          method={[
            "Heat rice",
            "Add eggs/tofu",
            "Drizzle soy",
          ]}
          coachNotes="White rice = ideal pre-race carb. Low fibre = minimal gut load. Excellent for gut-sensitive runners."
          swaps={[
            {
              title: "VEGAN SWAP",
              content: "Tofu scramble. New calories: ~780 kcal",
            },
            {
              title: "LOW-FIBRE SWAP",
              content: "Use white jasmine rice",
            },
          ]}
          timing="Eat this 2–3 hours before long runs for ultra-stable energy"
        />

        <RecipeCard
          title="9. Pancake Stack + Fruit"
          subtitle="Great for: Carb loading; weekend long run prep"
          tags={["Veg", "HC"]}
          calories="880 kcal"
          ingredients={[
            "2–3 pancakes",
            "1 banana or berries",
            "2 tbsp maple syrup",
            "Light butter or margarine",
          ]}
          method={[
            "Cook pancakes",
            "Stack with fruit + syrup",
          ]}
          coachNotes="Very high carb → perfect the day before a big session. Easy to eat even with low appetite."
          swaps={[
            {
              title: "HIGH CARB",
              content: "Extra syrup",
            },
            {
              title: "LOWER CALORIE",
              content: "Remove butter",
            },
            {
              title: "VEGAN",
              content: "Use vegan pancakes",
            },
          ]}
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="🍳 BREAKFASTS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="10. Savoury Egg & Potato Plate"
          subtitle="Great for: Runners who prefer savoury over sweet"
          tags={["GF", "IR", "HC"]}
          calories="620 kcal"
          ingredients={[
            "2 eggs",
            "250g potatoes (boiled or mashed)",
            "1 tsp olive oil",
            "Salt",
          ]}
          method={[
            "Cook potatoes",
            "Add fried/poached eggs",
            "Season",
          ]}
          coachNotes="Potatoes = extremely efficient running fuel. Egg yolks boost iron & nutrients."
          swaps={[
            {
              title: "LOW FAT",
              content: "Poach eggs",
            },
            {
              title: "HIGH CARB",
              content: "Add bread on the side",
            },
            {
              title: "VEGAN",
              content: "Swap eggs → tofu scramble",
            },
          ]}
        />
      </RunMvmtLayout>

      {/* LUNCHES SECTION */}
      <RunMvmtLayout
        title="🥗 LUNCHES"
        subtitle="Balanced meals for training days"
        pageNumber={pageNum++}
      >
        <RecipeCard
          title="1. Chicken Rice Bowl"
          subtitle="Great for: Everyday training; pre-PM session lunch"
          tags={["GF", "DF", "HC"]}
          calories="600 kcal"
          ingredients={[
            "150g chicken breast",
            "1 cup cooked rice",
            "Veg of choice (carrot, cucumber, capsicum)",
            "1 tbsp soy sauce (GF use tamari)",
            "1 tsp olive oil",
          ]}
          method={[
            "Cook chicken",
            "Assemble bowl with rice + veg",
            "Drizzle soy + oil",
          ]}
          coachNotes="Balanced carbs + protein = steady energy + good recovery. Easy to digest → suitable before afternoon running sessions."
          swaps={[
            {
              title: "VEGAN",
              content: "Tofu or tempeh (520–580 kcal depending on portion)",
            },
            {
              title: "VEGETARIAN",
              content: "Haloumi (+ fat, + salt, great before hot sessions)",
            },
            {
              title: "HIGH CARB",
              content: "Add +½ cup rice (+110 kcal)",
            },
          ]}
        />
      </RunMvmtLayout>

      {/* Continue with remaining lunches */}
      <RunMvmtLayout title="🥗 LUNCHES (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="2. Tuna Pasta Salad"
          subtitle="Great for: Hot-weather lunch; travel-friendly"
          tags={["HC", "DF"]}
          calories="650 kcal"
          ingredients={[
            "120g tinned tuna",
            "1.5 cups cooked pasta",
            "Cherry tomatoes",
            "Olive oil + lemon",
            "Salt + pepper",
          ]}
          method={[
            "Cook pasta",
            "Cool",
            "Toss with tuna, oil, lemon + tomatoes",
          ]}
          coachNotes="Cold pasta digests extremely well. Tuna gives high protein for muscle repair."
          swaps={[
            { title: "VEGAN", content: "Chickpeas or lentils (same calories)" },
            { title: "GLUTEN-FREE", content: "GF pasta" },
            { title: "HIGH CARB", content: "Add corn or extra pasta" },
          ]}
        />

        <RecipeCard
          title="3. Turkey & Cheese Wrap"
          subtitle="Great for: Pre-afternoon run; busy days"
          tags={["HC", "LS"]}
          calories="550 kcal"
          ingredients={[
            "Large wrap",
            "100g turkey slices",
            "Light cheese",
            "Lettuce",
            "Honey mustard",
          ]}
          method={["Layer wrap → roll → slice"]}
          coachNotes="Wraps digest easier than bread for some runners. Sodium from turkey helps hydration."
          swaps={[
            { title: "VEGAN", content: "Hummus + tofu" },
            { title: "GLUTEN-FREE", content: "GF wrap" },
            { title: "HIGH CARB", content: "Add mashed potato or rice" },
          ]}
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="🥗 LUNCHES (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="4. Burrito Bowl"
          subtitle="Great for: General training days; strength day lunches"
          tags={["GF", "HC"]}
          calories="700 kcal"
          ingredients={[
            "1 cup rice",
            "100g beef or chicken",
            "Black beans",
            "Corn",
            "Salsa",
          ]}
          method={["Layer everything into a bowl"]}
          coachNotes="Perfect macro balance. Beans increase protein → great for strength-focused runners."
          swaps={[
            { title: "VEGAN", content: "Extra beans + avocado" },
            { title: "VEGETARIAN", content: "Add haloumi" },
            { title: "HIGH CARB", content: "Add tortilla on the side" },
          ]}
        />

        <RecipeCard
          title="5. Egg Fried Rice"
          subtitle="Great for: Pre-run lunch; long-run eve"
          tags={["Veg", "GF", "HC", "LS"]}
          calories="680 kcal"
          ingredients={[
            "1 cup white rice",
            "2 eggs or tofu",
            "Soy sauce",
            "1 tsp sesame oil",
            "Frozen peas",
          ]}
          method={[
            "Stir-fry eggs",
            "Add rice + peas",
            "Season",
          ]}
          coachNotes="Rice is the easiest carbohydrate for most athletes to tolerate. Egg = high micronutrient density."
          swaps={[
            { title: "VEGAN", content: "Tofu scramble" },
            { title: "LOWER FAT", content: "Remove sesame oil" },
            { title: "HIGH CARB", content: "Add an extra ½ cup rice" },
          ]}
        />
      </RunMvmtLayout>

      {/* DINNERS SECTION */}
      <RunMvmtLayout
        title="🍽️ DINNERS"
        subtitle="High-carb options for big training days"
        pageNumber={pageNum++}
      >
        <RecipeCard
          title="1. Chicken Teriyaki Rice Bowl"
          subtitle="Great for: Night-before long run; PM training prep"
          tags={["GF", "DF", "HC", "LS"]}
          calories="680 kcal"
          ingredients={[
            "150g chicken breast",
            "1 cup cooked white rice",
            "2 tbsp teriyaki sauce",
            "Steamed broccoli/carrot",
          ]}
          method={[
            "Cook chicken",
            "Add teriyaki",
            "Serve over rice + veg",
          ]}
          coachNotes="Teriyaki adds sodium → improves hydration status. White rice = ideal low-fibre dinner before big sessions."
          swaps={[
            { title: "GF", content: "Use tamari + honey" },
            { title: "VEGAN", content: "Tofu or tempeh" },
            { title: "HIGH CARB", content: "Add extra ½ cup rice (+110 kcal)" },
          ]}
        />

        <RecipeCard
          title="2. Pasta Bolognese"
          subtitle="Great for: Carb-loading; high-volume weeks"
          tags={["HC", "IR"]}
          calories="720 kcal"
          ingredients={[
            "150g lean beef mince",
            "1.5 cups cooked pasta",
            "Tomato sauce",
            "Italian herbs",
          ]}
          method={[
            "Cook mince",
            "Add sauce",
            "Serve over pasta",
          ]}
          coachNotes="Beef increases iron — crucial for runners. Pasta provides dense, reliable carbohydrate fuel."
          swaps={[
            { title: "VEGAN", content: "Lentils instead of beef" },
            { title: "LOWER FIBRE", content: "White pasta + minimal veggies" },
            { title: "HIGH CARB", content: "Add garlic bread (+180 kcal)" },
          ]}
        />
      </RunMvmtLayout>

      {/* SNACKS SECTION */}
      <RunMvmtLayout
        title="🍎 SNACKS"
        subtitle="Quick carbs, recovery protein, balanced energy"
        pageNumber={pageNum++}
      >
        <Text style={styles.categoryHeader}>HIGH-CARB SNACKS (Pre-run fuel)</Text>
        
        <RecipeCard
          title="1. Jam Toast"
          subtitle="Great for: Pre-run snack within 60–90 mins"
          tags={["Veg", "V", "DF", "LS", "HC"]}
          calories="180–250 kcal"
          ingredients={["1–2 slices white bread", "1–2 tbsp jam"]}
          method={["Toast bread", "Spread jam"]}
          coachNotes="One of the best gut-friendly pre-run snacks. Works well 30–60 minutes before harder sessions."
          swaps={[
            { title: "HIGH CARB", content: "Add honey (+60 kcal)" },
            { title: "LOW FIBRE", content: "White bread only" },
          ]}
        />

        <RecipeCard
          title="2. Rice Cakes + Honey"
          subtitle="Great for: Fast fuel before speed sessions"
          tags={["GF", "Veg", "V", "DF", "LS", "HC"]}
          calories="150–220 kcal"
          ingredients={["2–3 rice cakes", "1 tbsp honey"]}
          method={["Spread honey on rice cakes"]}
          coachNotes="Elite marathoners use this before workouts. Extremely low fibre."
          swaps={[
            { title: "EXTRA CARBS", content: "Add jam" },
            { title: "LOWER CALORIES", content: "Use 2 rice cakes only" },
          ]}
        />
      </RunMvmtLayout>

      {/* SMOOTHIES SECTION */}
      <RunMvmtLayout
        title="🥤 SMOOTHIES"
        subtitle="Recovery, high-carb, light digestion options"
        pageNumber={pageNum++}
      >
        <Text style={styles.categoryHeader}>RECOVERY SMOOTHIES</Text>
        
        <RecipeCard
          title="1. Classic Recovery Smoothie"
          subtitle="Great for: Post-run within 30 minutes"
          tags={["Veg", "GF", "HC"]}
          calories="450 kcal"
          ingredients={[
            "1 banana",
            "1 cup milk",
            "1 scoop whey/plant protein",
            "1 tbsp honey",
            "½ cup oats",
          ]}
          method={["Blend everything until smooth"]}
          coachNotes="Ideal carb:protein ratio for recovery. Oats slow digestion → more sustained refuelling."
          swaps={[
            { title: "VEGAN", content: "Plant milk + plant protein" },
            { title: "HIGH CARB", content: "Add berries (+20g carbs)" },
            { title: "LOW FIBRE", content: "Remove oats" },
          ]}
        />

        <RecipeCard
          title="2. Chocolate Recovery Shake"
          subtitle="Great for: After hard intervals or strength days"
          tags={["Veg", "GF"]}
          calories="500 kcal"
          ingredients={[
            "1 cup milk",
            "1 scoop chocolate whey/plant protein",
            "1 banana",
            "1 tbsp cocoa",
            "1 tbsp maple syrup",
          ]}
          method={["Blend until thick"]}
          coachNotes="Cocoa helps reduce inflammation. Higher calorie → great during heavy training."
          swaps={[
            { title: "VEGAN", content: "Plant alternatives" },
            { title: "HIGH CARB", content: "Add oats" },
          ]}
        />
      </RunMvmtLayout>

      {/* More Lunches */}
      <RunMvmtLayout title="🥗 LUNCHES (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="6. Chicken Pesto Pasta"
          subtitle="Great for: Big training blocks; post-threshold recovery"
          tags={["HC", "GF"]}
          calories="720 kcal"
          ingredients={[
            "1.5 cups cooked pasta",
            "120g chicken breast",
            "1 tbsp pesto",
            "Cherry tomatoes",
          ]}
          method={[
            "Cook pasta",
            "Mix pesto",
            "Add chicken + tomatoes",
          ]}
          coachNotes="Pesto = easy calories for high-volume runners. Perfect on high-carb days."
          swaps={[
            { title: "VEGAN", content: "Pesto + tofu" },
            { title: "GF", content: "GF pasta" },
          ]}
        />

        <RecipeCard
          title="7. Mediterranean Power Bowl"
          subtitle="Great for: Healthy everyday lunch; recovery day"
          tags={["Veg", "HC"]}
          calories="640 kcal"
          ingredients={[
            "Couscous or quinoa",
            "Chickpeas",
            "Cucumber",
            "Olives",
            "Feta",
          ]}
          method={["Mix everything in a bowl → drizzle lemon"]}
          coachNotes="Higher fibre → better on easy/recovery days. Feta gives sodium for hydration."
          swaps={[
            { title: "VEGAN", content: "Remove feta → add tahini" },
            { title: "LOWER FIBRE", content: "Use rice instead of quinoa" },
          ]}
        />
      </RunMvmtLayout>

      {/* More Dinners */}
      <RunMvmtLayout title="🍽️ DINNERS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="3. Thai Green Curry with Rice"
          subtitle="Great for: High-calorie training days"
          tags={["DF", "GF", "HC"]}
          calories="800 kcal"
          ingredients={[
            "150g chicken or tofu",
            "Coconut milk",
            "Green curry paste",
            "Vegetables",
            "1 cup rice",
          ]}
          method={[
            "Simmer protein + veg in curry",
            "Serve over rice",
          ]}
          coachNotes="Coconut milk is calorie-dense — good for athletes with high energy needs. Rice = stable overnight glycogen refill."
          swaps={[
            { title: "VEGAN", content: "Tofu" },
            { title: "LOW CAL", content: "Light coconut milk" },
          ]}
        />

        <RecipeCard
          title="4. Beef Stir-Fry with Noodles"
          subtitle="Great for: Recovery + strength days"
          tags={["DF", "HC"]}
          calories="700 kcal"
          ingredients={[
            "150g beef strips",
            "Egg noodles",
            "Soy sauce + honey",
            "Veg",
            "Sesame oil",
          ]}
          method={["Stir-fry beef → add noodles + sauce"]}
          coachNotes="Noodles digest quicker than pasta. Beef improves iron stores for endurance athletes."
          swaps={[
            { title: "VEGAN", content: "Tofu" },
            { title: "GF", content: "Rice noodles" },
          ]}
        />
      </RunMvmtLayout>

      {/* More Snacks */}
      <RunMvmtLayout title="🍎 SNACKS (continued)" pageNumber={pageNum++}>
        <Text style={styles.categoryHeader}>HIGH-PROTEIN SNACKS (Recovery)</Text>
        
        <RecipeCard
          title="5. Greek Yoghurt + Protein Powder"
          subtitle="Great for: Post-run protein hit"
          tags={["Veg", "GF", "HC"]}
          calories="250–350 kcal"
          ingredients={[
            "150g Greek yoghurt",
            "½ scoop protein powder",
            "Fruit or honey (optional)",
          ]}
          method={["Mix yoghurt + protein", "Add fruit/honey if desired"]}
          coachNotes="Ideal recovery macro profile. Add honey if carbs are needed."
          swaps={[
            { title: "VEGAN", content: "Coconut yoghurt + plant protein" },
            { title: "HIGH CARB", content: "Add banana (+100 kcal)" },
          ]}
        />

        <Text style={styles.categoryHeader}>BALANCED SNACKS</Text>
        
        <RecipeCard
          title="8. Peanut Butter Banana Wrap"
          subtitle="Great for: Pre-long run or between meals"
          tags={["Veg", "V", "DF", "HC"]}
          calories="350 kcal"
          ingredients={[
            "1 wrap",
            "1 banana",
            "1 tbsp peanut butter",
          ]}
          method={["Spread PB on wrap", "Add banana", "Roll"]}
          coachNotes="Higher fat → slower release energy. Not ideal before high-intensity sessions."
          swaps={[
            { title: "VEGAN", content: "Maple syrup drizzle" },
            { title: "LOWER CALORIE", content: "Use half a banana" },
          ]}
        />
      </RunMvmtLayout>

      {/* More Smoothies */}
      <RunMvmtLayout title="🥤 SMOOTHIES (continued)" pageNumber={pageNum++}>
        <Text style={styles.categoryHeader}>HIGH-CARB SMOOTHIES</Text>
        
        <RecipeCard
          title="3. Carbo-Load Smoothie"
          subtitle="Great for: Pre-marathon training; morning thresholds"
          tags={["Veg", "GF", "HC", "LS"]}
          calories="520 kcal"
          ingredients={[
            "2 bananas",
            "1 tbsp honey",
            "1 cup apple juice",
            "½ scoop vanilla protein",
          ]}
          method={["Blend lightly; don't over-thicken"]}
          coachNotes="Liquid carbs = rapid digestion. Perfect 2–3 hours before a big session."
          swaps={[
            { title: "LOW FIBRE", content: "Use very ripe bananas" },
            { title: "HIGH CARB", content: "Add extra honey" },
          ]}
        />

        <Text style={styles.categoryHeader}>LIGHT DIGESTION SMOOTHIES</Text>
        
        <RecipeCard
          title="5. Pre-Run Light Smoothie"
          subtitle="Great for: 30–60 mins before training"
          tags={["Veg", "V", "GF", "DF", "LS"]}
          calories="260 kcal"
          ingredients={[
            "1 banana",
            "1 cup almond milk",
            "1 tsp maple syrup",
          ]}
          method={["Blend lightly"]}
          coachNotes="Minimal fibre. Very fast absorption. Doesn't slosh in the stomach."
          swaps={[
            { title: "HIGHER CARB", content: "Add small honey drizzle" },
          ]}
        />
      </RunMvmtLayout>

      {/* RACE-DAY FUELS SECTION */}
      <RunMvmtLayout
        title="⚡ RACE-DAY FUEL RECIPES"
        subtitle="Homemade gels, rice cakes, electrolyte mixes"
        pageNumber={pageNum++}
      >
        <RecipeCard
          title="1. Homemade Energy Gel"
          subtitle="Great for: Marathon pace & long run fuelling"
          tags={["V", "Veg", "GF", "DF", "LS", "HC"]}
          calories="110 kcal (27g carbs per gel)"
          ingredients={[
            "4 tbsp maltodextrin powder",
            "2 tbsp maple syrup or honey",
            "1–2 tbsp water",
            "Pinch of salt",
          ]}
          method={[
            "Mix all ingredients into a thick goo",
            "Store in soft gel flask",
          ]}
          coachNotes="Maltodextrin = very fast absorption. Maple = small fructose blend → helps higher carb oxidation. Salt improves uptake during heat."
          timing="One gel every 30–40 minutes on long runs & race day"
          swaps={[
            { title: "LOWER SWEETNESS", content: "Use more water" },
            { title: "HIGHER CARB", content: "Add ½ tbsp extra maltodextrin (+7g carbs)" },
          ]}
        />

        <RecipeCard
          title="2. Elite Marathon Carb Drink"
          subtitle="Great for: Pre-race sipping, marathon fuelling"
          tags={["V", "Veg", "DF", "GF", "LS", "HC"]}
          calories="60g carbs per bottle"
          ingredients={[
            "40g maltodextrin",
            "20g fructose (or 20g sugar)",
            "500ml water",
            "Pinch salt",
          ]}
          method={["Shake until fully dissolved"]}
          coachNotes="Mimics pro-level carb drinks. 2:1 glucose-to-fructose = optimal high-carb absorption."
          timing="250–500ml per hour. Perfect for long runs over 90 minutes"
        />
      </RunMvmtLayout>

      <RunMvmtLayout title="⚡ RACE-DAY FUELS (continued)" pageNumber={pageNum++}>
        <RecipeCard
          title="3. Soft Rice Cakes"
          subtitle="Great for: Long runs, ultras, easy-to-chew race fuel"
          tags={["Veg", "V", "GF", "LS", "HC"]}
          calories="150 kcal each"
          ingredients={[
            "2 cups cooked white rice",
            "2 tbsp sugar or honey",
            "1 banana (mashed)",
            "Pinch of salt",
          ]}
          method={[
            "Mix warm rice with mashed banana + sweetener",
            "Press into tray",
            "Slice into squares",
          ]}
          coachNotes="Rice = incredibly gut-friendly. Banana adds potassium. Soft texture = easy to chew while running."
          swaps={[
            { title: "VEGAN", content: "Maple syrup" },
            { title: "HIGH CARB", content: "Add extra sugar" },
          ]}
        />

        <RecipeCard
          title="4. Salted Potato Bites"
          subtitle="Great for: Hot weather, cramping, ultras"
          tags={["V", "Veg", "GF", "DF", "LS", "HC"]}
          calories="120 kcal per serve"
          ingredients={[
            "Baby potatoes",
            "Salt",
            "1 tsp olive oil (optional)",
          ]}
          method={[
            "Boil potatoes",
            "Sprinkle heavily with salt",
            "Store in bag",
          ]}
          coachNotes="The ultimate low-fibre, stomach-safe fuel. High sodium = cramp prevention."
          timing="Every 30–45 minutes during ultras or long runs"
        />
      </RunMvmtLayout>

      {/* DESSERTS SECTION */}
      <RunMvmtLayout
        title="🍨 DESSERTS FOR RUNNERS"
        subtitle="Simple • Healthy • Quick • High-Carb (when useful)"
        pageNumber={pageNum++}
      >
        <RecipeCard
          title="1. Greek Yoghurt + Honey + Cinnamon"
          subtitle="Great for: Post-dinner recovery; sweet craving"
          tags={["Veg", "GF"]}
          calories="220–280 kcal"
          ingredients={[
            "1 cup Greek yoghurt",
            "1–2 tsp honey",
            "Sprinkle cinnamon",
          ]}
          method={["Mix yoghurt + honey", "Sprinkle cinnamon"]}
          coachNotes="Excellent protein hit before bed. Cinnamon stabilises blood sugar."
          swaps={[
            { title: "LOW CALORIE", content: "Use low-fat yoghurt" },
            { title: "HIGH CARB", content: "Add banana or oats" },
            { title: "DAIRY-FREE", content: "Coconut yoghurt" },
          ]}
        />

        <RecipeCard
          title="4. Rice Pudding Lite"
          subtitle="Great for: Night-before-race dessert (low fibre, high carb)"
          tags={["Veg", "GF"]}
          calories="300–400 kcal"
          ingredients={[
            "Cooked white rice",
            "½ cup milk",
            "1–2 tsp sugar or honey",
            "Cinnamon",
          ]}
          method={["Heat gently until creamy"]}
          coachNotes="PERFECT race-week dessert. Very high-carb, very low-fibre."
          swaps={[
            { title: "DAIRY-FREE", content: "Coconut milk" },
            { title: "HIGH CARB", content: "Add extra sugar" },
          ]}
        />
      </RunMvmtLayout>

      {/* CHEAT SHEETS SECTION */}
      <RunMvmtLayout
        title="⚡ QUICK FUELING CHEAT SHEET"
        subtitle="Print, screenshot, or save to your phone"
        pageNumber={pageNum++}
      >
        <Section title="1. CARB TARGETS — THE GOLDEN RULES">
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>Daily Intake (training phase)</Text>
          </Paragraph>
          <BulletList
            items={[
              "Easy days: 5–6g carbs/kg",
              "Medium load: 6–8g/kg",
              "Hard sessions / long runs: 7–10g/kg",
              "Carb-loading (24–48 hours): 8–12g/kg",
            ]}
          />
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>During Training</Text>
          </Paragraph>
          <BulletList
            items={[
              "< 60 min: No fuel needed",
              "60–90 min: Optional 20–30g carbs",
              "90–120 min: 30–60g carbs/hr",
              "2–3 hrs (marathon prep): 60–90g carbs/hr",
              "3+ hrs (ultra/mountain): 60–100g carbs/hr",
            ]}
          />
        </Section>

        <Section title="2. GEL TIMING (MARATHON STANDARD)">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Race Time</Text>
              <Text style={[styles.tableHeader, { flex: 1 }]}>Carb/hr</Text>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Gel Frequency</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>3:00–3:30</Text>
              <Text style={styles.tableCell}>70–90g/hr</Text>
              <Text style={styles.tableCell}>1 gel every 20–25 min</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>3:30–4:00</Text>
              <Text style={styles.tableCell}>60–70g/hr</Text>
              <Text style={styles.tableCell}>1 gel every 25–30 min</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>4:00–4:30</Text>
              <Text style={styles.tableCell}>50–60g/hr</Text>
              <Text style={styles.tableCell}>1 gel every 30–35 min</Text>
            </View>
          </View>
        </Section>

        <Section title="3. PRE-RUN MEAL TIMING">
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>3–4 Hours Before</Text>
          </Paragraph>
          <BulletList
            items={[
              "80–120g carbs",
              "Low fibre",
              "Low fat",
              "Moderate protein",
            ]}
          />
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>60–90 Minutes Before</Text>
          </Paragraph>
          <BulletList items={["30–60g carbs", "Very low fibre", "No heavy fats"]} />
        </Section>
      </RunMvmtLayout>

      {/* CARB LOADING PLAN */}
      <RunMvmtLayout
        title="🥯 CARB LOADING PLAN"
        subtitle="For Half & Full Marathon — 24–48hr carb build"
        pageNumber={pageNum++}
      >
        <Section title="GOAL OF CARB LOADING">
          <BulletList
            items={[
              "Maximise muscle glycogen",
              "Reduce race-day fatigue",
              "Improve pace stability",
              "Reduce late-race 'bonk'",
              "Keep gut calm (low fibre)",
              "Keep stomach light (low fat)",
            ]}
          />
        </Section>

        <Section title="CARB TARGETS">
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>FULL Carb Load (48 Hours)</Text>
          </Paragraph>
          <Paragraph>8–12g carbs per kg per day</Paragraph>
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>EMERGENCY 24-Hour Carb Load</Text>
          </Paragraph>
          <Paragraph>6–8g/kg</Paragraph>
        </Section>

        <Section title="48-HOUR CARB LOAD PLAN">
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>DAY 2 BEFORE RACE (48 Hours Out)</Text>
          </Paragraph>
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>Breakfast (100–150g carbs)</Text>
          </Paragraph>
          <BulletList
            items={[
              "2–3 cups rice porridge",
              "Honey",
              "Banana",
            ]}
          />
          <Paragraph>
            <Text style={{ fontWeight: 700 }}>Dinner (120–180g carbs)</Text>
          </Paragraph>
          <BulletList
            items={[
              "Rice bowl + small protein portion",
              "Soy/honey",
              "Banana for dessert",
            ]}
          />
        </Section>
      </RunMvmtLayout>
    </Document>
  );
};

