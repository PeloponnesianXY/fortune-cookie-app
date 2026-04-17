import React from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SAFETY_RESOURCES = [
  {
    label: 'Call or text 988',
    url: 'https://988lifeline.org/',
  },
  {
    label: 'Find help in your country',
    url: 'https://findahelpline.com/',
  },
  {
    label: 'LGBTQ+ youth support',
    url: 'https://www.thetrevorproject.org/get-help/',
  },
];

export default function SafetyLockScreen() {
  function openResource(url) {
    Linking.openURL(url).catch(() => {});
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Need immediate support?</Text>

          <Text style={styles.body}>
            This app is not designed to provide crisis or professional mental health support. If you may be in
            danger, or if you’re thinking about harming yourself or someone else, please use one of the official
            resources below now.
          </Text>

          <Text style={styles.emergency}>
            If there is immediate danger, call 911 or your local emergency services right away.
          </Text>

          <View style={styles.resourceList}>
            {SAFETY_RESOURCES.map((resource) => (
              <Pressable
                key={resource.url}
                onPress={() => openResource(resource.url)}
                style={styles.resourceCard}
              >
                <Text style={styles.resourceTitle}>{resource.label}</Text>
                <Text style={styles.resourceUrl}>{resource.url}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f1eb',
  },
  screen: {
    flex: 1,
    backgroundColor: '#f6f1eb',
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  title: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#2f2924',
    marginBottom: 18,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    color: '#524740',
    marginBottom: 18,
  },
  emergency: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#3b3029',
    marginBottom: 24,
  },
  resourceList: {
    gap: 14,
  },
  resourceCard: {
    borderWidth: 1,
    borderColor: '#ddd1c4',
    borderRadius: 18,
    backgroundColor: '#fffaf5',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resourceTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: '#2f2924',
    marginBottom: 6,
  },
  resourceUrl: {
    fontSize: 14,
    lineHeight: 20,
    color: '#7a6050',
  },
});
