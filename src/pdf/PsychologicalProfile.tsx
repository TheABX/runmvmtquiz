import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";
import { Section, Paragraph, BulletList } from "./ReportUI";

const styles = StyleSheet.create({
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
  strengthBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  strategyBox: {
    backgroundColor: theme.colors.panel,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  strategyTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  strategyText: {
    fontSize: 9,
    color: theme.colors.textMain,
    lineHeight: 1.4,
    marginBottom: 3,
  },
});

const RunMvmtLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  pageNumber?: number;
}> = ({ title, subtitle, children, pageNumber }) => {
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

interface PsychologicalProfileProps {
  name?: string;
  personalizedIntro: string;
  mainSection: string;
  strength: string;
}

export const PsychologicalProfile: React.FC<PsychologicalProfileProps> = ({
  name,
  personalizedIntro,
  mainSection,
  strength,
}) => {
  let pageNum = 1;

  const getSectionContent = () => {
    switch (mainSection) {
      case "performance_anxiety":
        return {
          title: "Performance Anxiety",
          whyItHappens: `Performance anxiety isn't about weakness — it's your body switching into "protect mode" before stressful events. When you care about an outcome, your brain jumps ahead and starts imagining everything that could go wrong. This makes your breathing shallow, your chest tight, and your legs feel heavier than they really are. Almost every runner, from beginners to elite athletes, feels this at some point.`,
          strategies: [
            {
              title: "1. Choose ONE physical cue for the run",
              content: "Examples: 'Relax my shoulders', 'Run tall', 'Smooth arms', 'Light feet'. This gives your brain something tangible to lock onto.",
            },
            {
              title: "2. Break the session or race into small milestones",
              content: "Instead of thinking about the entire distance, focus on: the first 2 minutes, the next landmark, the next kilometre, the next segment of the rep. You shrink the size of the task so your brain doesn't get overwhelmed.",
            },
            {
              title: "3. Don't judge your run until 2km in (or after the first rep)",
              content: "The body needs time to settle. Those first few minutes always feel weird. Give yourself time before deciding how you feel.",
            },
          ],
          whenToUse: "Before races, before big sessions, any time you feel pressure to 'perform'.",
          whyItWorks: "Your brain can't focus on a physical cue and a panic thought at the same time. By giving it something controllable, you reduce anxiety and increase control.",
        };

      case "negative_self_talk":
        return {
          title: "Negative Self-Talk & Overthinking",
          whyItHappens: `When running gets uncomfortable, your brain defaults to survival mode. Its job is to protect you, not push you. So the moment effort rises, it fires off thoughts like: "This is too hard", "I can't hold this", "I'm not fit enough", "Slow down". This isn't a lack of mental strength — it's biology. Around threshold pace, your brain is scanning for threat, and the easiest "threat" to project is self-doubt. Even elite athletes have these thoughts. The difference is they know what to do with them.`,
          strategies: [
            {
              title: "1. Notice the thought",
              content: `As soon as the negative talk starts, label it for what it is: "This is just a stress signal." Not truth. Not fact. Just a message. This alone breaks half the power.`,
            },
            {
              title: "2. Interrupt it (one short phrase)",
              content: `Use a short, sharp pattern-break phrase such as: "Not helpful", "Reset", "Back to work", "We're fine". This stops the spiral before it gains momentum.`,
            },
            {
              title: "3. Replace it with one physical cue",
              content: `Go straight into a physical focus you can control: "Relax shoulders", "Tall posture", "Smooth cadence", "Strong arms". Your brain can't hold a negative spiral and a skill cue at the same time. This is how you regain control.`,
            },
          ],
          whenToUse: "In threshold sessions, when reps start to bite, in the middle of a race, on days where you feel flat, anytime your brain starts telling stories.",
          whyItWorks: "Overthinking comes from being too far in the future. Negative talk comes from interpreting effort as danger. Physical cues bring you back into the body and the present moment. You stop making meaning out of the discomfort and simply move through it.",
        };

      case "pacing_anxiety":
        return {
          title: "Pacing Anxiety (The 2km Rule)",
          whyItHappens: `The first 1–2 kilometres of any run or race almost always feel harder, more awkward, and more stressful than they should. Your breathing hasn't settled, your heart rate is adjusting, and your body is switching from "rest mode" to "working mode." Most runners misinterpret this early discomfort as: "I'm unfit today", "I can't hold this pace", "Something's wrong", "I'm going to blow up". This creates panic, early slowing, or the opposite — forcing pace too soon and burning matches early. This isn't a mindset flaw. It's physiology. Your cardiovascular system simply needs time to stabilise.`,
          strategies: [
            {
              title: "1. Start controlled, not cautious",
              content: "Relax, breathe, settle — but don't jog or overthink it. You want to find rhythm, not tiptoe through the start.",
            },
            {
              title: "2. Give yourself a 'settling window'",
              content: `Tell yourself: "I won't judge anything until I'm past 2km." This removes pressure instantly.`,
            },
            {
              title: "3. Only assess effort after the settling point",
              content: "At 2km: your breathing has rhythm, your heart rate has stabilised, your stride feels smoother, your body has warmed into the work. Now you can make decisions about pacing.",
            },
            {
              title: "4. In sessions, don't evaluate until after the second rep",
              content: "The first rep is often the worst. The second rep tells the truth.",
            },
          ],
          whenToUse: "At the start of any run or race, before making pacing decisions.",
          whyItWorks: "Because it stops runners from making emotional decisions based on bad data. You teach the brain to ride out the early noise and trust the process. This gives you better race pacing, less panic, more even splits, fewer 'false alarms' early on, and more confidence overall.",
        };

      case "bad_sessions":
        return {
          title: "Emotional Recovery From Bad Sessions",
          whyItHappens: `Runners tie their identity and progress to single sessions. One bad run + they think: "I'm going backwards", "I'm losing fitness", "Training isn't working". This triggers stress, inconsistency, and overtraining.`,
          strategies: [
            {
              title: "1. Log it",
              content: "Write down what happened — the facts, not the feelings. This creates distance between the session and your emotional response.",
            },
            {
              title: "2. Take one lesson",
              content: "Ask yourself: 'What's one thing I can learn from this?' Not ten things. Not a full analysis. Just one insight.",
            },
            {
              title: "3. Leave it",
              content: "Close the log. Move on. Don't revisit it until the next day at the earliest.",
            },
            {
              title: "4. Reset next day",
              content: "Start fresh. Don't carry emotional baggage into your next session. Each run is a new opportunity.",
            },
          ],
          whenToUse: "After any session that didn't go to plan, when you feel frustrated or discouraged.",
          whyItWorks: "It reframes the session as data instead of drama. This is exactly how elite training staff keep athletes mentally stable over long blocks. You learn from it without letting it derail your confidence or consistency.",
        };

      default:
        return {
          title: "High-Performance Mindset",
          whyItHappens: "Based on your assessment, here are practical strategies to improve your mental approach to running.",
          strategies: [],
          whenToUse: "",
          whyItWorks: "",
        };
    }
  };

  const sectionContent = getSectionContent();
  const strengthMessages: Record<string, string> = {
    calmness: "Your ability to stay calm is a real strength — you can lean on this as you apply these strategies.",
    resilience: "Your resilience shows you can handle discomfort — use this as your foundation.",
    "emotional recovery": "Your ability to bounce back quickly is valuable — trust this process.",
    awareness: "Your self-awareness is a strength — you're already ahead by recognizing these patterns.",
    determination: "Your determination will help you implement these strategies consistently.",
  };

  return (
    <Document>
      {/* Cover Page */}
      <RunMvmtLayout
        title="PSYCHOLOGICAL PERFORMANCE PROFILE"
        subtitle={name ? `Personalized for ${name}` : "High-Performance Mindset Guide"}
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
            Mindset Guide
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.textMuted,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Practical strategies for high-performance running
          </Text>
        </View>
      </RunMvmtLayout>

      {/* Personalized Intro Page */}
      <RunMvmtLayout title="Your Mindset Profile" pageNumber={pageNum++}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Personalized Insight</Text>
          <Text style={styles.highlightText}>{personalizedIntro}</Text>
        </View>

        <Section title={`Your Main Challenge: ${sectionContent.title}`}>
          <Paragraph>
            {sectionContent.whyItHappens}
          </Paragraph>
        </Section>

        {strength && strengthMessages[strength] && (
          <View style={styles.strengthBox}>
            <Text style={styles.highlightTitle}>Your Strength</Text>
            <Text style={styles.highlightText}>
              {strengthMessages[strength]}
            </Text>
          </View>
        )}
      </RunMvmtLayout>

      {/* Strategies Page */}
      <RunMvmtLayout title={sectionContent.title} pageNumber={pageNum++}>
        <Section title="The Strategies">
          {sectionContent.strategies.map((strategy, i) => (
            <View key={i} style={styles.strategyBox}>
              <Text style={styles.strategyTitle}>{strategy.title}</Text>
              <Text style={styles.strategyText}>{strategy.content}</Text>
            </View>
          ))}
        </Section>

        {sectionContent.whenToUse && (
          <Section title="When to Use This">
            <Paragraph>{sectionContent.whenToUse}</Paragraph>
          </Section>
        )}

        {sectionContent.whyItWorks && (
          <Section title="Why This Works">
            <Paragraph>{sectionContent.whyItWorks}</Paragraph>
          </Section>
        )}
      </RunMvmtLayout>
    </Document>
  );
};

