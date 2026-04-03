import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PreviewModal from './PreviewModal';

function formatFortuneTimestamp(value) {
  if (!value) {
    return '';
  }

  return new Date(value).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatMeta(item, library) {
  const detailParts = [];

  if (item.mood) {
    detailParts.push(library === 'history' ? `"${item.mood}"` : item.mood);
  } else if (item.category) {
    detailParts.push(item.category);
  }

  const timestamp = library === 'favorites'
    ? item.favoritedAt || item.createdAt
    : item.latestCreatedAt || item.createdAt;

  if (timestamp) {
    detailParts.push(formatFortuneTimestamp(timestamp));
  }

  return detailParts.join(' | ');
}

function LibraryItem({ item, library, onRemoveFavorite, onShareItem, onToggleFavorite }) {
  const isFavorites = library === 'favorites';

  return (
    <Pressable onPress={() => onShareItem(item)} style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemMeta}>{formatMeta(item, library)}</Text>
        <View style={styles.itemHeaderActions}>
          {!isFavorites ? (
            <Pressable
              hitSlop={8}
              onPress={(event) => {
                event.stopPropagation?.();
                onToggleFavorite(item);
              }}
              style={styles.favoriteButton}
            >
              <Ionicons
                color={item.isFavorite ? '#b85f4b' : '#9b7c64'}
                name={item.isFavorite ? 'heart' : 'heart-outline'}
                size={18}
              />
            </Pressable>
          ) : null}
          {item.repeatCount > 1 ? (
            <View style={styles.repeatBadge}>
              <Text style={styles.repeatBadgeText}>x{item.repeatCount}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.itemText}>{item.text}</Text>

      {isFavorites ? (
        <Pressable onPress={() => onRemoveFavorite(item)} style={styles.inlineAction}>
          <Text style={styles.inlineActionText}>Remove</Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

function EmptyLibraryMessage({ isFavorites }) {
  return (
    <Text
      adjustsFontSizeToFit
      minimumFontScale={0.78}
      numberOfLines={1}
      style={styles.emptyText}
    >
      {isFavorites
        ? 'Favorite a revealed fortune and it will appear here.'
        : 'Open a fortune and it will be saved here automatically.'}
    </Text>
  );
}

export default function FortuneLibrarySheet({
  activeLibrary,
  favorites,
  history,
  onClose,
  onRemoveFavorite,
  onShareItem,
  onToggleFavorite,
  onSelectLibrary,
  visible,
}) {
  const isFavorites = activeLibrary === 'favorites';
  const items = isFavorites ? favorites : history;

  return (
    <PreviewModal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.sheet}>
            <View style={styles.topRow}>
              <Text style={styles.title}>Your fortunes - click to share</Text>
              <Pressable hitSlop={8} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.switcher}>
              <Pressable
                onPress={() => onSelectLibrary('history')}
                style={[styles.switcherButton, !isFavorites && styles.switcherButtonActive]}
              >
                <Text style={[styles.switcherText, !isFavorites && styles.switcherTextActive]}>
                  History
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onSelectLibrary('favorites')}
                style={[styles.switcherButton, isFavorites && styles.switcherButtonActive]}
              >
                <Text style={[styles.switcherText, isFavorites && styles.switcherTextActive]}>
                  Favorites
                </Text>
              </Pressable>
            </View>

            <FlatList
              contentContainerStyle={items.length ? styles.listContent : styles.emptyContent}
              data={items}
              initialNumToRender={8}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <LibraryItem
                  item={item}
                  library={activeLibrary}
                  onRemoveFavorite={onRemoveFavorite}
                  onShareItem={onShareItem}
                  onToggleFavorite={onToggleFavorite}
                />
              )}
              removeClippedSubviews
              ListEmptyComponent={(
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>
                    {isFavorites ? 'No favorites yet' : 'No fortune history yet'}
                  </Text>
                  <EmptyLibraryMessage isFavorites={isFavorites} />
                </View>
              )}
              showsVerticalScrollIndicator={false}
              windowSize={5}
            />
          </View>
        </SafeAreaView>
      </View>
    </PreviewModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 30, 36, 0.34)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '72%',
    backgroundColor: '#fffaf2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5b412d',
  },
  closeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9a673d',
  },
  switcher: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  switcherButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ead6be',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff3e4',
  },
  switcherButtonActive: {
    backgroundColor: '#f0cda1',
    borderColor: '#ddb17a',
  },
  switcherText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8a6544',
  },
  switcherTextActive: {
    color: '#5d3d21',
  },
  listContent: {
    paddingBottom: 12,
    gap: 12,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#ecdcc9',
    backgroundColor: '#fffdf8',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 10,
  },
  itemHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemMeta: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#8b6c50',
    fontWeight: '600',
  },
  repeatBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f5e4ca',
  },
  repeatBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#845b36',
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    minHeight: 24,
  },
  itemText: {
    fontSize: 17,
    lineHeight: 24,
    color: '#3f3023',
    fontWeight: '600',
  },
  inlineAction: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  inlineActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a0612f',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5b412d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8b6c50',
    textAlign: 'center',
  },
});
