import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

const uiStyles = StyleSheet.create({
  section: { 
    marginTop: 10, 
    marginBottom: 6 
  },
  heading: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.colors.textMain,
    marginBottom: 3,
  },
  body: { 
    fontSize: 10, 
    lineHeight: 1.4, 
    color: theme.colors.textMain,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    marginRight: 6,
    backgroundColor: theme.colors.secondary,
  },
  bulletText: { 
    fontSize: 10, 
    color: theme.colors.textMain, 
    flex: 1,
    lineHeight: 1.4,
  },
});

export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={uiStyles.section}>
    <Text style={uiStyles.heading}>{title}</Text>
    {children}
  </View>
);

export const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <View>
    {items.map((t, i) => (
      <View style={uiStyles.bulletRow} key={i}>
        <View style={uiStyles.bulletDot} />
        <Text style={uiStyles.bulletText}>{t}</Text>
      </View>
    ))}
  </View>
);

export const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={uiStyles.body}>{children}</Text>
);


