import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PreviewModal from '../preview/PreviewModal';

function MoodSection({ onDelete, onEdit, onShare, section }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.label}</Text>
      <View style={styles.cards}>
        {section.items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardText}>{item.text}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => onEdit(item)} style={styles.actionButton}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(item)} style={styles.actionButton}>
                <Text style={styles.actionText}>Delete</Text>
              </Pressable>
              <Pressable hitSlop={8} onPress={() => onShare(item)} style={styles.shareButton}>
                <Ionicons color="#8d6748" name="share-outline" size={18} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function CreatedFortunesSheet({
  onClearAll,
  onDeleteFortune,
  onEditFortune,
  onShareFortune,
  onClose,
  sections,
  visible,
}) {
  const hasContent = sections.length > 0;

  return (
    <PreviewModal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Your created fortunes</Text>
                <View style={styles.headerActions}>
                  {hasContent ? (
                    <Pressable hitSlop={8} onPress={onClearAll}>
                      <Text style={styles.headerActionText}>Clear all</Text>
                    </Pressable>
                  ) : null}
                  <Pressable hitSlop={8} onPress={onClose}>
                    <Text style={styles.headerActionText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={hasContent ? styles.scrollContent : styles.emptyScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {hasContent ? (
                sections.map((section) => (
                  <MoodSection
                    key={section.key}
                    onDelete={onDeleteFortune}
                    onEdit={onEditFortune}
                    onShare={onShareFortune}
                    section={section}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No created fortunes yet</Text>
                  <Text style={styles.emptyText}>
                    Save a custom fortune and it will appear here.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </PreviewModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 23, 20, 0.32)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '84%',
    backgroundColor: '#fff8f1',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4f3828',
    letterSpacing: -0.2,
  },
  headerActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8d6748',
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 14,
  },
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 2,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#8a674c',
  },
  cards: {
    gap: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(149, 114, 85, 0.16)',
    backgroundColor: '#fffdf9',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#3f2c20',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8d6748',
    letterSpacing: -0.12,
  },
  shareButton: {
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5a4130',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: '#8f6b4f',
  },
});
