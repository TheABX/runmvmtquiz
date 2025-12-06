import React from "react";
import { Document, View, Text, StyleSheet } from "@react-pdf/renderer";
import { ReportLayout } from "./ReportLayout";
import { Section, Paragraph } from "./ReportUI";
import { ScoreBar } from "./ScoreBar";
import { theme } from "./theme";
import { getGrowthPriorities } from "@/src/lib/growthPriorities";
import { buildPlanBlocks } from "@/src/lib/growthBlocks";
import { getMindsetShifts } from "@/src/lib/mindsetShifts";
import { MindsetShiftCard } from "./MindsetShiftCard";
import type { Scores } from "@/src/lib/types";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  scoreCard: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
  scoreLabel: {
    fontSize: 10,
    color: theme.colors.textMain,
    flex: 1,
  },
  scoreValue: {
    fontSize: 10,
    fontWeight: 600,
    color: theme.colors.textMain,
    marginRight: 8,
  },
  scorePill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 8,
  },
  pillLow: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  pillMedium: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  pillHigh: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  subsectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    marginBottom: 3,
    color: theme.colors.textMain,
  },
  priorityPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  priorityPillPrimary: {
    backgroundColor: "#FFE5D5",
  },
  priorityPillSoft: {
    backgroundColor: "#E3E8FF",
  },
  planBlock: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  planBlockPrimary: {
    backgroundColor: theme.colors.panel,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  planBlockSecondary: {
    backgroundColor: "#F5F3FF",
  },
  actionItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  actionBullet: {
    fontSize: 10,
    marginRight: 6,
    marginTop: 2,
    color: theme.colors.secondary,
  },
  actionText: {
    fontSize: 10,
    flex: 1,
    lineHeight: 1.4,
    color: theme.colors.textMain,
  },
  checkInItem: {
    fontSize: 10,
    marginBottom: 4,
    color: theme.colors.textMain,
    lineHeight: 1.4,
  },
});

export type ReportProps = {
  name: string;
  profile: {
    attachment: { title: string; body: string; growth: string };
    neuroticism: string;
    conscientiousness: string;
    leadership: string;
    frame: string;
    lifeDirection: string;
    scores: Record<string, number>;
    levels: Record<string, string>;
  };
};

const getPillStyle = (level: string) => {
  switch (level) {
    case "low":
      return styles.pillLow;
    case "medium":
      return styles.pillMedium;
    case "high":
      return styles.pillHigh;
    default:
      return styles.pillMedium;
  }
};

export const Report: React.FC<ReportProps> = ({ name, profile }) => {
  const attachmentTag = profile.attachment.title.replace("Your Attachment Profile: ", "");
  const tags = [
    attachmentTag,
    `Emotional Reactivity: ${profile.levels.neuroticism}`,
    `Reliability: ${profile.levels.conscientiousness}`,
  ];

  // Get growth priorities
  const priorities = getGrowthPriorities(profile.scores as Scores);
  
  // Build action plan blocks
  const planBlocks = buildPlanBlocks(profile.scores as Scores);

  // Get personalized mindset shifts
  const mindsetShifts = getMindsetShifts(profile.scores as Scores);

  return (
    <Document>
      {/* Page 1: Insights & Analysis */}
      <ReportLayout
        name={name}
        patternLabel={profile.attachment.title}
        tags={tags}
        pageNumber={1}
      >
        {/* Visual Score Bars */}
        <View style={styles.card}>
          <Section title="Your Core Scores">
            <ScoreBar label="Dating Anxiety" score={profile.scores.anxiety} />
            <ScoreBar label="Avoidance" score={profile.scores.avoidance} />
            <ScoreBar label="Emotional Reactivity" score={profile.scores.neuroticism} />
            <ScoreBar label="Conscientiousness" score={profile.scores.conscientiousness} />
            <ScoreBar label="Leadership Energy" score={profile.scores.transformational} />
            <ScoreBar label="Self-Respect & Frame" score={profile.scores.selfFrame} />
            <ScoreBar label="Life Direction" score={profile.scores.goalOrientation} />
          </Section>
        </View>

        {/* Growth Priorities */}
        {priorities.length > 0 && (
          <View style={styles.card}>
            <Section title="Your Top Growth Priorities">
              {priorities.map((p, i) => (
                <View
                  key={i}
                  style={[
                    styles.priorityPill,
                    i === 0 ? styles.priorityPillPrimary : styles.priorityPillSoft
                  ]}
                >
                  <Text style={{ fontSize: 9, color: theme.colors.textMain }}>
                    {i + 1}. {p}
                  </Text>
                </View>
              ))}
            </Section>
          </View>
        )}

        {/* Attachment Style Section */}
        <View style={styles.card}>
          <Section title="Summary">
            <Paragraph>{profile.attachment.body}</Paragraph>
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Growth Focus">
            <Paragraph>{profile.attachment.growth}</Paragraph>
          </Section>
        </View>

        {/* Core Personality Tendencies */}
        <View style={styles.card}>
          <Section title="Core Personality Tendencies">
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.subsectionTitle}>
                Neuroticism (Emotional Stability)
              </Text>
              <Paragraph>{profile.neuroticism}</Paragraph>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.subsectionTitle}>
                Conscientiousness (Reliability)
              </Text>
              <Paragraph>{profile.conscientiousness}</Paragraph>
            </View>
          </Section>
        </View>

        {/* Relationship Leadership */}
        <View style={styles.card}>
          <Section title="Relationship Leadership Style">
            <Paragraph>{profile.leadership}</Paragraph>
          </Section>
        </View>

        {/* Personal Frame */}
        <View style={styles.card}>
          <Section title="Personal Frame & Boundaries">
            <Paragraph>{profile.frame}</Paragraph>
          </Section>
        </View>

        {/* Life Direction */}
        <View style={styles.card}>
          <Section title="Life Direction & Purpose">
            <Paragraph>{profile.lifeDirection}</Paragraph>
          </Section>
        </View>

        {/* Mindset Shifts Section */}
        {mindsetShifts.length > 0 && (
          <View style={styles.card}>
            <Section title="Mindset Shifts That Will Transform Your Dating">
              <Text style={{ fontSize: 10, color: theme.colors.textMuted, marginBottom: 8, lineHeight: 1.4 }}>
                These reframes address the core beliefs that may be holding you back. Practice one per week.
              </Text>
              {mindsetShifts.map((shift, i) => (
                <MindsetShiftCard key={i} shift={shift} />
              ))}
            </Section>
          </View>
        )}
      </ReportLayout>

      {/* Page 2: Action Plan */}
      <ReportLayout
        name={name}
        patternLabel="Personal Development Plan"
        tags={["Next 8 Weeks"]}
        pageNumber={2}
      >
        <View style={styles.card}>
          <Text style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: theme.colors.textMain }}>
            Your Personal Development Plan
          </Text>
          <Text style={{ fontSize: 10, color: theme.colors.textMuted, marginBottom: 12, lineHeight: 1.4 }}>
            Start with one or two focus areas at a time. You'll see the biggest change by staying consistent with small behaviours rather than trying to fix everything at once.
          </Text>

          {planBlocks.map((block, idx) => (
            <View
              key={idx}
              style={[
                styles.planBlock,
                idx === 0 ? styles.planBlockPrimary : styles.planBlockSecondary
              ]}
            >
              <Text style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: theme.colors.textMain }}>
                Focus Area {idx + 1}: {block.title}
              </Text>
              {block.actions.map((a, i) => (
                <View key={i} style={styles.actionItem}>
                  <Text style={styles.actionBullet}>•</Text>
                  <Text style={styles.actionText}>{a}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Weekly Check-In */}
        <View style={styles.card}>
          <Section title="Weekly Check-In (Use this once a week)">
            <Text style={styles.checkInItem}>
              1. What did I do this week that I'm proud of in how I showed up?
            </Text>
            <Text style={styles.checkInItem}>
              2. Where did I abandon my standards or chase reassurance?
            </Text>
            <Text style={styles.checkInItem}>
              3. One small change I'll make next week:
            </Text>
          </Section>
        </View>
      </ReportLayout>
    </Document>
  );
};

