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
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.primary,
    marginBottom: 8,
    marginTop: 12,
  },
  chapterSubtitle: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.textMain,
    marginBottom: 6,
    marginTop: 8,
  },
  bodyText: {
    fontSize: 9,
    color: theme.colors.textMain,
    lineHeight: 1.5,
    marginBottom: 6,
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
  highlightBox: {
    backgroundColor: "#F5F3FF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  highlightTitle: {
    fontSize: 10,
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
  quoteBox: {
    backgroundColor: theme.colors.panel,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary,
    padding: 10,
    marginBottom: 10,
    fontStyle: "italic",
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

export const NutritionGuide: React.FC = () => {
  return (
    <Document>
      {/* Cover Page */}
      <RunMvmtLayout
        title="RUN MVMT – Comprehensive Nutrition Guide for Runners"
        subtitle="Fuel smarter. Recover faster. Run stronger."
        pageNumber={1}
      >
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Text style={{ fontSize: 24, fontWeight: 700, color: theme.colors.primary, marginBottom: 20 }}>
            Comprehensive Nutrition Guide
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.textMuted, textAlign: "center", marginBottom: 40 }}>
            Your complete guide to fueling your running performance
          </Text>
        </View>
      </RunMvmtLayout>

      {/* Chapter 1 */}
      <RunMvmtLayout title="Chapter 1 – Why Nutrition Matters for Runners" pageNumber={2}>
        <Paragraph>
          Running is one of the most demanding sports from a fuelling point of view. Every session places stress on your muscles, joints, hormones, immune system, and nervous system. Good training builds you up — but only if you give your body the raw materials to repair and adapt.
        </Paragraph>
        
        <Section title="Done well, nutrition helps you:">
          <BulletList items={[
            "Maintain stable energy across the day",
            "Hit quality in key sessions",
            "Recover faster between runs",
            "Reduce injury and illness risk",
            "Support healthy body composition",
            "Race to your actual fitness level (not what your fuelling allows)"
          ]} />
        </Section>

        <Section title="Done poorly, it can leave you:">
          <BulletList items={[
            "Constantly tired",
            "Flat in workouts",
            "Hungry but still under-fuelled",
            "Getting sick or injured more often",
            "Stuck in the same performance loop"
          ]} />
        </Section>

        <Paragraph>
          This guide will walk you through what to eat, how much, and when to support your training and racing — in a way that's practical for everyday life, not just elite athletes.
        </Paragraph>
      </RunMvmtLayout>

      {/* Chapter 2 */}
      <RunMvmtLayout title="Chapter 2 – Energy Balance, BMR, and TDEE" pageNumber={3}>
        <Section title="2.1 Basal Metabolic Rate (BMR)">
          <Paragraph>
            Your Basal Metabolic Rate (BMR) is the energy your body needs just to "keep the lights on" at rest — breathing, circulation, brain function, temperature, organ work. It doesn't include your runs, gym sessions, steps, or daily movement.
          </Paragraph>
          <Paragraph>
            BMR is usually 60–70% of your total energy needs. Runners almost always underestimate how much energy they need, especially when training volume goes up.
          </Paragraph>
        </Section>

        <Section title="2.2 Total Daily Energy Expenditure (TDEE)">
          <Paragraph>
            Total Daily Energy Expenditure (TDEE) is the sum of your BMR, your normal daily movement (walking, work, chores), and your training.
          </Paragraph>
          <Paragraph>
            TDEE is influenced by:
          </Paragraph>
          <BulletList items={[
            "Training load (volume + intensity)",
            "Job (sitting at a desk vs. physical work)",
            "Non-exercise activity (steps, fidgeting, lifestyle)",
            "Body size and muscle mass"
          ]} />
          <Paragraph>
            On light training days, your TDEE might be moderate. In a big training week with long runs and quality sessions, it can jump significantly.
          </Paragraph>
        </Section>

        <Section title="2.3 Smartwatches and Energy Tracking">
          <Paragraph>
            Most running watches and apps estimate daily energy use based on heart rate, movement, and exercise mode. These can be helpful, but they are not perfect. They often underestimate the true energy cost of long runs, intervals, and strength work. Crucially, they only know what you did, not what your body needs for recovery and adaptation.
          </Paragraph>
          <Paragraph>
            Treat watch data as a guide, not gospel. If you're consistently tired, hungry, and flat in sessions, your real needs are probably higher.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 2 continued - RED-S */}
      <RunMvmtLayout title="Chapter 2 – Energy Balance, BMR, and TDEE (continued)" pageNumber={4}>
        <Section title="2.4 Energy Availability and Relative Energy Deficiency in Sport (RED-S)">
          <Paragraph>
            Energy availability is the energy left for your body's basic functions after the energy cost of exercise is accounted for. It is the single most critical concept in endurance nutrition.
          </Paragraph>
          <Paragraph>
            When you eat too little relative to your training load, your body enters a state of Low Energy Availability (LEA). The body is forced to cut corners on non-essential functions to conserve energy for survival.
          </Paragraph>
          <Paragraph>
            Chronic LEA leads to Relative Energy Deficiency in Sport (RED-S). This is a syndrome of impaired physiological function that affects nearly every system in the body, not just the reproductive system (as was the focus of the older "Female Athlete Triad" model).
          </Paragraph>
        </Section>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1.5 }]}>System Affected</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Physiological Impact</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Endocrine/Hormonal</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Suppression of thyroid hormones, reduced sex hormones, increased cortisol</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Skeletal/Bone</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Decreased bone density, stress reactions, fractures</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Metabolic</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Impaired resting metabolic rate, chronic fatigue</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Immune</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Increased illness risk, prolonged recovery</Text>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>The fix for RED-S is usually more food, not harder training.</Text>
        </View>

        <Section title="Signs you might be under-fuelling:">
          <BulletList items={[
            "Persistent fatigue that doesn't resolve with rest",
            "Drop in performance despite consistent training",
            "Trouble sleeping or staying asleep",
            "Feeling cold often, even in warm environments",
            "Increased injuries, niggles, or stress fractures",
            "For women: menstrual disruptions",
            "For men: drops in sex drive"
          ]} />
        </Section>
      </RunMvmtLayout>

      {/* Chapter 3 */}
      <RunMvmtLayout title="Chapter 3 – Carbohydrates: Your Primary Fuel" pageNumber={5}>
        <Section title="3.1 Why Carbs Matter for Runners: The Glycogen Engine">
          <Paragraph>
            Carbohydrates are stored in the muscles and liver as glycogen. During running, especially at moderate to hard intensities (anything faster than a very easy jog), glycogen is your body's preferred and most efficient fuel source.
          </Paragraph>
          <Paragraph>
            When you run out of available glycogen, you experience glycogen depletion, commonly known as "hitting the wall" or "bonking." This is a sudden, dramatic drop in performance where the body is forced to rely almost entirely on fat for fuel.
          </Paragraph>
          <BulletList items={[
            "Low glycogen = Sessions feel harder, pace drops sooner, you struggle to hit target splits",
            "High glycogen = Stable energy, higher intensity tolerance, ability to maintain pace deep into long runs"
          ]} />
        </Section>

        <Section title="3.2 Daily Carb Targets">
          <Paragraph>
            Sports nutrition research provides clear guidelines for daily carbohydrate intake, which should be matched to your training load to ensure optimal glycogen stores.
          </Paragraph>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Training Load</Text>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Daily Carb Target</Text>
              <Text style={[styles.tableHeader, { flex: 1.6 }]}>Example (70kg runner)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Light</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>3–5 g/kg/day</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>210–350 g/day</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Moderate</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>5–7 g/kg/day</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>350–490 g/day</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Heavy</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>7–10 g/kg/day</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>490–700 g/day</Text>
            </View>
          </View>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 3 continued */}
      <RunMvmtLayout title="Chapter 3 – Carbohydrates (continued)" pageNumber={6}>
        <Section title="3.3 Quality Carb Sources">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Category</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Examples</Text>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Timing</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Staple Carbs</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Oats, brown rice, quinoa, pasta, bread, potatoes</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Main meals</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Quick Carbs</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Bananas, grapes, sports drinks, gels, chews</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Pre/during runs</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 600 }]}>Carb + Fibre</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Lentils, beans, wholegrain breads</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>General health</Text>
            </View>
          </View>
        </Section>

        <Section title="3.4 Carb Periodisation: Feeding the Work">
          <Paragraph>
            You do not need the same amount of carbs every single day. Carb periodisation is the strategy of matching your carbohydrate intake to the demands of your training schedule. Think: "Feed the work."
          </Paragraph>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Day Type</Text>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Carb Strategy</Text>
              <Text style={[styles.tableHeader, { flex: 1.6 }]}>Purpose</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>High-Carb</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>7–10 g/kg</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>Long runs, intervals, race sims</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Moderate</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>5–7 g/kg</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>Easy runs, shorter efforts</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>Lower-Carb</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>3–5 g/kg</Text>
              <Text style={[styles.tableCell, { flex: 1.6 }]}>Rest days, light cross-training</Text>
            </View>
          </View>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 4 */}
      <RunMvmtLayout title="Chapter 4 – Protein: Repair, Adaptation, and Strength" pageNumber={7}>
        <Section title="4.1 Why Runners Need Protein">
          <Paragraph>
            Running causes micro-damage to muscle fibres. Protein provides the amino acids necessary to repair and strengthen those fibres, which is the core mechanism of training adaptation.
          </Paragraph>
          <Section title="Benefits of adequate protein:">
            <BulletList items={[
              "Accelerated muscle repair and recovery",
              "Reduced muscle breakdown (catabolism)",
              "Improved adaptation to training stress",
              "Support for immune function",
              "Maintenance of lean muscle mass"
            ]} />
          </Section>
        </Section>

        <Section title="4.2 Daily Protein Targets">
          <Paragraph>
            For runners, the widely accepted recommendation is 1.2–1.6 g/kg bodyweight per day for most training blocks. This can increase up to 1.8 g/kg/day during heavy training blocks, strength phases, or when managing body weight.
          </Paragraph>
          
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1 }]}>Runner Weight</Text>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>General Target (1.4 g/kg)</Text>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Heavy Block (1.8 g/kg)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>60 kg</Text>
              <Text style={styles.tableCell}>84 g/day</Text>
              <Text style={styles.tableCell}>108 g/day</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>70 kg</Text>
              <Text style={styles.tableCell}>98 g/day</Text>
              <Text style={styles.tableCell}>126 g/day</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>80 kg</Text>
              <Text style={styles.tableCell}>112 g/day</Text>
              <Text style={styles.tableCell}>144 g/day</Text>
            </View>
          </View>
        </Section>

        <Section title="4.3 Protein Distribution Across the Day">
          <Paragraph>
            Aim for 20–40 g of high-quality protein per meal, spacing your intake across breakfast, lunch, dinner, and 1–2 protein-rich snacks. This ensures a steady supply of amino acids to support continuous repair and adaptation.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 5 */}
      <RunMvmtLayout title="Chapter 5 – Fat: Hormones, Health, and Long-Duration Energy" pageNumber={8}>
        <Section title="5.1 Why Fat Still Matters">
          <Paragraph>
            While carbohydrates are the primary fuel for performance, dietary fats are essential for overall health and long-term endurance.
          </Paragraph>
          <Section title="Fats support:">
            <BulletList items={[
              "Hormone production (including vital sex hormones)",
              "Cell membranes and brain function",
              "Absorption of fat-soluble vitamins (A, D, E, K)",
              "Long-duration, lower-intensity energy"
            ]} />
          </Section>
        </Section>

        <Section title="5.2 Daily Fat Targets">
          <Paragraph>
            General guide: 1–1.5 g/kg bodyweight per day. This typically accounts for 20–30% of your total daily energy intake.
          </Paragraph>
          <BulletList items={[
            "Too little fat over time can affect hormones, mood, and recovery",
            "Too much fat can crowd out carbohydrates needed for high-intensity performance"
          ]} />
        </Section>

        <Section title="5.3 Healthy Fat Sources">
          <BulletList items={[
            "Avocado",
            "Olive oil, olives",
            "Nuts and seeds (almonds, walnuts, chia, flax)",
            "Nut butters",
            "Oily fish (salmon, sardines, mackerel)"
          ]} />
          <Paragraph>
            Limit: Deep-fried foods, processed meats, trans fats, and heavily processed snacks.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 6 */}
      <RunMvmtLayout title="Chapter 6 – Micronutrients Runners Should Care About" pageNumber={9}>
        <Section title="6.1 Iron">
          <Paragraph>
            Iron is critical for oxygen transport and energy production. Low iron status (anaemia) is common for runners, especially women, leading to persistent fatigue, poor performance, and heavy legs.
          </Paragraph>
          <BulletList items={[
            "Sources: Red meat (most bioavailable), liver, chicken, lentils, beans, tofu",
            "Tip: Combine plant-based iron with Vitamin C to boost absorption",
            "Action: Blood tests are the only reliable way to monitor iron status"
          ]} />
        </Section>

        <Section title="6.2 Calcium & Vitamin D">
          <Paragraph>
            These are vital for bone health, especially given the impact loading from running.
          </Paragraph>
          <BulletList items={[
            "Calcium Sources: Dairy, fortified plant milks, almonds, leafy greens",
            "Vitamin D Sources: Sun exposure, fortified foods, fish, egg yolks",
            "Action: Many runners are deficient in Vitamin D, particularly in winter"
          ]} />
        </Section>

        <Section title="6.3 B Vitamins">
          <Paragraph>
            Involved in energy metabolism and red blood cell production. Sources: Wholegrains, meat, fish, eggs, legumes, green vegetables.
          </Paragraph>
        </Section>

        <Section title="6.4 Sodium and Electrolyte Balance">
          <Paragraph>
            For runs over 90 minutes, especially in the heat, aim for a sports drink or electrolyte solution containing 300–700 mg of sodium per litre of fluid. This is essential for maintaining plasma volume and preventing muscle cramps and fatigue.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 7 */}
      <RunMvmtLayout title="Chapter 7 – Hydration and Sweat Management" pageNumber={10}>
        <Section title="7.1 Daily Hydration Strategy">
          <Paragraph>
            Aim for consistent sipping across the day, not chugging large amounts in one go. Base guideline: 2–3 L of fluid per day, increasing significantly in hot weather or high-volume training.
          </Paragraph>
          <Paragraph>
            Signs of Under-hydration: Dark, strong-smelling urine, headaches, feeling sluggish, dry mouth. Aim for pale yellow urine.
          </Paragraph>
        </Section>

        <Section title="7.2 Hydration During Runs">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Run Duration</Text>
              <Text style={[styles.tableHeader, { flex: 2.8 }]}>Strategy</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Under 60 min</Text>
              <Text style={styles.tableCell}>Water is usually sufficient</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>60–90 min</Text>
              <Text style={styles.tableCell}>Water plus electrolytes may be useful</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>90+ min</Text>
              <Text style={styles.tableCell}>Fluids + electrolytes + carbohydrates become essential</Text>
            </View>
          </View>
        </Section>

        <Section title="7.3 Estimating Sweat Rate">
          <Paragraph>
            Knowing your sweat rate allows you to create a personalised hydration plan. Weigh yourself nude before and after a 60-minute run, tracking fluid consumed. Every 1 kg lost ≈ 1 L fluid loss.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 8 */}
      <RunMvmtLayout title="Chapter 8 – Daily Eating Structure for Runners" pageNumber={11}>
        <Section title="8.1 The Big Picture">
          <Paragraph>
            A solid nutrition day for a runner is structured around three key principles: Carbs timed around sessions, Protein spaced across the day, and Fluids consistently.
          </Paragraph>
          <Paragraph>
            A typical day includes 3 main meals (breakfast, lunch, dinner) and 1–3 snacks depending on training load.
          </Paragraph>
        </Section>

        <Section title="8.2 Example Day – Easy Training Day">
          <BulletList items={[
            "Breakfast: Oats with milk, banana, honey, and Greek yoghurt",
            "Snack: Piece of fruit + handful of nuts",
            "Lunch: Chicken and rice bowl with mixed veg + olive oil dressing",
            "Dinner: Salmon, sweet potato, and steamed veg",
            "Evening Snack: Yoghurt or a small smoothie"
          ]} />
        </Section>

        <Section title="8.3 Example Day – Hard Session Day">
          <Paragraph>
            This is a High-Carb Day where timing is everything:
          </Paragraph>
          <BulletList items={[
            "Pre-Session (2–3 hours): Bigger carb-based meal",
            "Pre-Session (60–90 min): Carb-rich, low-fibre snack",
            "During Session: Small amount of high-GI carbs if over 60 minutes",
            "Post-Session (30–60 min): Carb + protein recovery snack",
            "Dinner: Full, high-carb meal to replenish glycogen"
          ]} />
        </Section>
      </RunMvmtLayout>

      {/* Chapter 9 */}
      <RunMvmtLayout title="Chapter 9 – Race Week and Race-Day Fuelling" pageNumber={12}>
        <Section title="9.1 Carb-Loading for Longer Races">
          <Paragraph>
            For half-marathon and marathon distances, carb-loading over the 1–3 days before race day can improve performance by maximising muscle glycogen stores.
          </Paragraph>
          <Section title="Key Principles (The 3-Day Approach):">
            <BulletList items={[
              "Increase Carb Intake: Aim for 8–10 g/kg bodyweight per day",
              "Reduce Fibre: Switch to lower-fibre, easy-to-digest carb sources",
              "Maintain Protein/Fat: Keep moderate, don't overeat",
              "Taper Training: Reduce training volume significantly"
            ]} />
          </Section>
        </Section>

        <Section title="9.2 Pre-Race Day">
          <BulletList items={[
            "Eat Familiar Foods: No experiments",
            "Avoid: Very spicy, greasy, or heavy meals",
            "Hydrate: Sip fluids consistently throughout the day",
            "Dinner: A solid, high-carb, low-fibre meal"
          ]} />
        </Section>

        <Section title="9.3 Race Morning Timeline (Example for 7:30 am Start)">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1 }]}>Time Before</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Action</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>3–3.5 hours</Text>
              <Text style={styles.tableCell}>Main pre-race meal (1–2 g/kg carbs)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>90–60 min</Text>
              <Text style={styles.tableCell}>Optional small top-up snack</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>60–15 min</Text>
              <Text style={styles.tableCell}>Sip water or sports drink</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>15–5 min</Text>
              <Text style={styles.tableCell}>Optional final small gel</Text>
            </View>
          </View>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 10 */}
      <RunMvmtLayout title="Chapter 10 – Gut Training and GI Issues" pageNumber={13}>
        <Section title="10.1 Why Gut Training Matters">
          <Paragraph>
            Many runners avoid fuelling during races because gels or drinks "upset their stomach." Often, the issue isn't the product, but that the gut hasn't been trained to handle high carbohydrate loads at race intensity.
          </Paragraph>
          <Paragraph>
            The gut, like your muscles, adapts to stress. Regular exposure to high carb intake during training increases nutrient transporters, allowing you to absorb more fuel faster. You can train your gut just like you train your legs.
          </Paragraph>
        </Section>

        <Section title="10.2 Gradual Gut Training Plan">
          <Paragraph>
            Integrate this progression into your long runs over 6–8 weeks:
          </Paragraph>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1.2 }]}>Phase</Text>
              <Text style={[styles.tableHeader, { flex: 1.5 }]}>Target Carbs</Text>
              <Text style={[styles.tableHeader, { flex: 1.3 }]}>Example</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Start</Text>
              <Text style={styles.tableCell}>20–30 g/hour</Text>
              <Text style={styles.tableCell}>1 gel per 60 min</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Progression</Text>
              <Text style={styles.tableCell}>40–50 g/hour</Text>
              <Text style={styles.tableCell}>1 gel per 45 min</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Race Pace</Text>
              <Text style={styles.tableCell}>60 g/hour</Text>
              <Text style={styles.tableCell}>1 gel per 30 min</Text>
            </View>
          </View>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 11 */}
      <RunMvmtLayout title="Chapter 11 – Recovery in Depth" pageNumber={14}>
        <Section title="11.1 The 3 R's Revisited">
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 1 }]}>Component</Text>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Target</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 600 }]}>Refuel (Carbs)</Text>
              <Text style={styles.tableCell}>1.0–1.2 g/kg in first 1–4 hours after hard/long sessions</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 600 }]}>Repair (Protein)</Text>
              <Text style={styles.tableCell}>20–40 g of high-quality protein in first post-run meal</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { fontWeight: 600 }]}>Rehydrate</Text>
              <Text style={styles.tableCell}>Replace 125–150% of fluid lost, ideally with sodium</Text>
            </View>
          </View>
        </Section>

        <Section title="11.2 Evening Recovery">
          <BulletList items={[
            "Dinner: A proper dinner with carbs, protein, and healthy fats",
            "Pre-Sleep Protein: A casein-rich snack before bed supports overnight repair",
            "Hydration: Top up hydration before sleep, but avoid excessive drinking right before bed"
          ]} />
        </Section>
      </RunMvmtLayout>

      {/* Chapter 12 */}
      <RunMvmtLayout title="Chapter 12 – Weight, Body Composition, and Performance" pageNumber={15}>
        <Section title="12.1 The Trade-Off: Leaner Isn't Always Better">
          <Paragraph>
            The pursuit of leanness can be a trap for runners. While a lower body mass can reduce the energy cost of running, there is a critical balance. Performance is maximised when you are at a healthy, sustainable body composition that allows for optimal energy availability.
          </Paragraph>
          <Paragraph>
            Pushing too lean can lead to chronic LEA, hormonal disruption, and RED-S, ultimately destroying performance and health.
          </Paragraph>
        </Section>

        <Section title="12.2 Losing Body Fat Without Losing Performance">
          <Paragraph>
            If you want to trim body fat, the approach must be slow, strategic, and performance-first:
          </Paragraph>
          <BulletList items={[
            "Small Deficits Only: Make small, controlled calorie reductions",
            "Prioritise Protein: Keep protein on the higher side (1.6–1.8 g/kg/day)",
            "Carb Timing is King: Maintain high carbohydrate intake around key sessions",
            "Avoid Combining Stress: Never combine a heavy training block with a large calorie deficit"
          ]} />
        </Section>

        <Section title="12.3 When Not to Diet">
          <Paragraph>
            It is usually counterproductive and dangerous to be in a calorie deficit:
          </Paragraph>
          <BulletList items={[
            "Deep in a marathon build when intensity and long runs are high",
            "When you're already feeling very fatigued or run down",
            "Close to key races (within 4–6 weeks)"
          ]} />
          <Paragraph>
            Performance comes first. There will be better, safer windows to focus on body composition during off-season or base-building phases.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 13 */}
      <RunMvmtLayout title="Chapter 13 – Special Considerations" pageNumber={16}>
        <Section title="13.1 Plant-Based Runners">
          <Paragraph>
            A well-planned plant-based diet can fully support elite endurance performance, but it requires deliberate planning:
          </Paragraph>
          <BulletList items={[
            "Protein: Focus on total intake and variety. Combine different plant proteins",
            "Iron: Prioritise high-iron plant sources and pair with Vitamin C",
            "B12: Supplementation is mandatory for all plant-based runners",
            "Zinc & Omega-3s: Ensure adequate intake from seeds, nuts, and fortified foods"
          ]} />
        </Section>

        <Section title="13.2 Runners with Sensitive Guts">
          <BulletList items={[
            "Fibre Reduction: Use lower-fibre meals before long runs and races",
            "FODMAPs: A temporary low-FODMAP approach can help identify triggers",
            "Triggers: Certain sweeteners and very high-fructose foods may worsen symptoms"
          ]} />
        </Section>

        <Section title="13.3 Female Runners and Menstrual Cycle">
          <Paragraph>
            Hormonal fluctuations across the menstrual cycle can influence hunger, fluid retention, perceived effort, and recovery. Iron and overall energy intake are particularly important for female runners to prevent LEA and maintain bone health.
          </Paragraph>
        </Section>
      </RunMvmtLayout>

      {/* Chapter 14 */}
      <RunMvmtLayout title="Chapter 14 – Supplements: What's Worth Considering" pageNumber={17}>
        <Paragraph>
          Supplements support; they don't replace a solid food foundation. Focus on addressing deficiencies first.
        </Paragraph>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1.2 }]}>Supplement</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>Purpose</Text>
            <Text style={[styles.tableHeader, { flex: 1.8 }]}>Key Caveat</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 600 }]}>Electrolytes</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Replace sodium during long/hot sessions</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>Use only when needed</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 600 }]}>Creatine</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Supports strength phases, glycogen storage</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>Not just for strength athletes</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 600 }]}>Caffeine</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Performance enhancer, reduces perceived effort</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>Practise dosage in training</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 600 }]}>Iron</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Corrects diagnosed deficiency</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>MUST be guided by blood tests</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontWeight: 600 }]}>Vitamin D</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Supports bone health and immune function</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>Recommended if levels are low</Text>
          </View>
        </View>
      </RunMvmtLayout>

      {/* Chapter 15 */}
      <RunMvmtLayout title="Chapter 15 – Practical Tools, Checklists, and FAQs" pageNumber={18}>
        <Section title="15.1 Daily Checklist">
          <BulletList items={[
            "Did I eat 3+ balanced meals?",
            "Did I include carbs before my key session?",
            "Did I have 20–40g of protein after my session?",
            "Did I drink fluids regularly across the day (pale yellow urine)?",
            "Did I hit some fruit and veg for micronutrients?",
            "Do I feel generally energised, not constantly wiped out?"
          ]} />
        </Section>

        <Section title="15.2 Red Flags to Watch For">
          <Paragraph>
            These are signs that your body needs more fuel, not more discipline. They indicate potential Low Energy Availability (LEA) or overtraining:
          </Paragraph>
          <BulletList items={[
            "Constant fatigue not explained by life stress",
            "Regular injury, niggles, or illness",
            "Racing much slower than training suggests",
            "Big mood swings, poor sleep, or irritability",
            "Obsession with 'eating clean' while training hard but under-fuelling"
          ]} />
        </Section>

        <Section title="15.3 FAQs">
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>"How soon should I eat after a run?"</Text>
            <Text style={styles.highlightText}>
              Aim for a carbohydrate and protein source within 30–60 minutes of a hard or long session to maximize the "glycogen window" and kickstart muscle repair.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>"Do I need gels for a 10K?"</Text>
            <Text style={styles.highlightText}>
              For most runners, no. A 10K takes less than 90 minutes, meaning your body has sufficient stored glycogen. Focus on a good pre-race meal 2–3 hours before.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>"Is low-carb running good for fat loss?"</Text>
            <Text style={styles.highlightText}>
              While low-carb training can increase fat burning, it severely compromises high-intensity performance. For performance-focused runners, a high-carb approach around key sessions is superior.
            </Text>
          </View>
        </Section>
      </RunMvmtLayout>

      {/* Conclusion */}
      <RunMvmtLayout title="Conclusion" pageNumber={19}>
        <Paragraph>
          Great running isn't just about kilometres and intervals — it's about how well you support the work. When you match your nutrition to your training load, you unlock:
        </Paragraph>
        <BulletList items={[
          "Better sessions",
          "Better adaptation",
          "Better recovery",
          "Better race-day performances"
        ]} />
        <Paragraph>
          Use this guide as your base education, then layer on your personalised nutrition blueprint and meal options to bring it to life day-to-day.
        </Paragraph>
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 12, fontWeight: 700, color: theme.colors.primary }}>
            RUN MVMT
          </Text>
          <Text style={{ fontSize: 10, color: theme.colors.textMuted, marginTop: 4 }}>
            Move as one.
          </Text>
        </View>
      </RunMvmtLayout>
    </Document>
  );
};


