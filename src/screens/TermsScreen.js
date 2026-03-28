import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.title}>MeetDaisy Terms of Service</Text>
        <Text style={styles.date}>Last Updated: October 17, 2025</Text>

        {/* SECTION 1 */}
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.text}>
          These Terms of Service form a binding agreement between Meet Daisy, Inc.
          and any person using our Service. By using the platform, you agree to
          these Terms and Privacy Policy.
        </Text>

        {/* SECTION 2 */}
        <Text style={styles.heading}>2. What is MeetDaisy?</Text>
        <Text style={styles.text}>
          MeetDaisy is a community-powered event platform that helps users discover
          local events through curated calendars including personal, creator,
          unclaimed, and market calendars.
        </Text>

        {/* SECTION 3 */}
        <Text style={styles.heading}>3. Eligibility</Text>
        <Text style={styles.text}>
          You must be at least 13 years old to use the Service. Users under 18 must
          have parental consent.
        </Text>

        {/* SECTION 4 */}
        <Text style={styles.heading}>4. User Accounts</Text>
        <Text style={styles.text}>
          You are responsible for maintaining your account security and providing
          accurate information.
        </Text>

        {/* SECTION 5 */}
        <Text style={styles.heading}>5. Event Submissions</Text>
        <Text style={styles.text}>
          Users may submit events and content. You grant MeetDaisy permission to
          use submitted content for platform operations.
        </Text>

        {/* SECTION 9 */}
        <Text style={styles.heading}>9. Advertising</Text>
        <Text style={styles.text}>
          MeetDaisy may display ads including third-party networks like Google AdSense.
        </Text>

        {/* SECTION 16 */}
        <Text style={styles.heading}>16. Disclaimers</Text>
        <Text style={styles.text}>
          The Service is provided "as is" without warranties of any kind.
        </Text>

        {/* SECTION 19 */}
        <Text style={styles.heading}>19. Governing Law</Text>
        <Text style={styles.text}>
          These Terms are governed by Delaware law and disputes are handled in Massachusetts courts.
        </Text>

        {/* CONTACT */}
        <Text style={styles.heading}>21. Contact Us</Text>
        <Text style={styles.text}>
          Meet Daisy, Inc.{"\n"}
          P.O. Box 2152, Lenox, MA 01240{"\n"}
          hello@meetdaisy.co{"\n"}
          (413) 200-4104
        </Text>

        <Text style={styles.footer}>
          End of Terms
        </Text>

      </ScrollView>
    </View>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },

  content: {
    padding: 15,
    paddingBottom: 40,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginBottom: 5,
  },

  date: {
    fontSize: 12,
    color: '#777',
    marginBottom: 15,
  },

  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#22C3B5',
    marginTop: 15,
    marginBottom: 5,
  },

  text: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },

  footer: {
    marginTop: 25,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});