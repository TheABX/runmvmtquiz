import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";
import { Section, Paragraph, BulletList } from "./ReportUI";
import type { TrainingPlanPdfData } from "@/src/lib/runmvmtTypes";

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.panel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  weekCard: {
    backgroundColor: theme.colors.panel,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weekNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: theme.colors.textMain,
  },
  weekKm: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  weekFocus: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontStyle: "italic",
    marginBottom: 8,
  },
  sessionItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  sessionDay: {
    fontSize: 9,
    fontWeight: 600,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  sessionType: {
    fontSize: 9,
    fontWeight: 600,
    color: theme.colors.textMain,
    marginBottom: 2,
  },
  sessionDesc: {
    fontSize: 9,
    color: theme.colors.textMuted,
    lineHeight: 1.3,
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
      alignItems: "center",
      marginBottom: 24,
    },
    brandText: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.colors.textMain,
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
      backgroundColor: "#E3E8FF",
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
      backgroundColor: "#E3E8FF",
      color: theme.colors.textMain,
    },
    pillSoft: {
      backgroundColor: "#FFE5D5",
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
  });

  return (
    <Page size="A4" style={pageStyles.page}>
      <View style={pageStyles.header}>
        <Text style={pageStyles.brandText}>RUN MVMT</Text>
        <Text style={pageStyles.tag}>Personalized Training Plan</Text>
      </View>

      <View style={pageStyles.mainCard}>
        <View style={pageStyles.decorativeBlob1} />
        <View style={pageStyles.decorativeBlob2} />
        <Text style={pageStyles.title}>{title}</Text>
        {subtitle && <Text style={pageStyles.subtitle}>{subtitle}</Text>}
        {tags.length > 0 && (
          <View style={pageStyles.pillRow}>
            {tags.map((t, i) => (
              <Text
                key={i}
                style={[
                  pageStyles.pill,
                  i === 0 ? pageStyles.pillPrimary : pageStyles.pillSoft
                ]}
              >
                {t}
              </Text>
            ))}
          </View>
        )}
      </View>

      {children}

      <View style={pageStyles.footer}>
        <Text>RUN MVMT • Move as one</Text>
        {pageNumber != null && <Text>Page {pageNumber}</Text>}
      </View>
    </Page>
  );
};

export type RunMvmtReportProps = {
  name?: string;
  data: TrainingPlanPdfData;
};

export const RunMvmtReport: React.FC<RunMvmtReportProps> = ({ name, data }) => {
  // Split weeks across pages (4-5 weeks per page)
  const weeksPerPage = 4;
  const totalPages = Math.ceil(data.weeklyPlans.length / weeksPerPage);

  const renderWeek = (week: typeof data.weeklyPlans[0]) => (
    <View key={week.week} style={styles.weekCard}>
      <View style={styles.weekHeader}>
        <Text style={styles.weekNumber}>Week {week.week}</Text>
        <Text style={styles.weekKm}>{week.targetKm}km total</Text>
      </View>
      <Text style={styles.weekFocus}>{week.focus}</Text>
      {week.keySessions.map((session, idx) => (
        <View key={idx} style={styles.sessionItem}>
          <Text style={styles.sessionDay}>{session.day}</Text>
          <Text style={styles.sessionType}>{session.type}</Text>
          <Text style={styles.sessionDesc}>
            {session.description}
            {session.durationKmOrMin && ` • ${session.durationKmOrMin}km`}
            {session.intensityHint && ` • ${session.intensityHint}`}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      {/* Page 1: Overview & Highlights */}
      <RunMvmtLayout
        title={`${data.distanceLabel} Training Plan`}
        subtitle={name ? `For: ${name}` : undefined}
        tags={[data.goalLabel, data.personaLabel]}
        pageNumber={1}
      >
        <View style={styles.card}>
          <Section title="Your Runner Profile">
            <Paragraph>{data.personaDescription}</Paragraph>
          </Section>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>Key Highlights</Text>
          {data.keyHighlights.map((highlight, i) => (
            <Text key={i} style={styles.highlightText}>
              • {highlight}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Section title="Strength Training Guidelines">
            <BulletList items={data.strengthGuidelines} />
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Recovery Guidelines">
            <BulletList items={data.recoveryGuidelines} />
          </Section>
        </View>

        <View style={styles.card}>
          <Section title="Fuelling Notes">
            <BulletList items={data.fuellingNotes} />
          </Section>
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: 10, color: theme.colors.textMuted, fontStyle: "italic", lineHeight: 1.4 }}>
            {data.runMvmtBranding.coachNote}
          </Text>
        </View>
      </RunMvmtLayout>

      {/* Training Plan Pages */}
      {Array.from({ length: totalPages }).map((_, pageIdx) => {
        const startWeek = pageIdx * weeksPerPage;
        const endWeek = Math.min(startWeek + weeksPerPage, data.weeklyPlans.length);
        const weeksForPage = data.weeklyPlans.slice(startWeek, endWeek);

        return (
          <RunMvmtLayout
            key={pageIdx}
            title="Weekly Training Schedule"
            tags={[`Weeks ${startWeek + 1}-${endWeek}`]}
            pageNumber={pageIdx + 2}
          >
            {weeksForPage.map(renderWeek)}
          </RunMvmtLayout>
        );
      })}
    </Document>
  );
};

