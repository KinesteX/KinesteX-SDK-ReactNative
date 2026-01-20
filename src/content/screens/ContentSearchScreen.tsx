/**
 * ContentSearchScreen
 *
 * Main content search interface with filters for content type,
 * category, body parts, and search by ID or title.
 *
 * Similar to: lib/content/content_view.dart
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ContentType, BodyPart } from 'kinestex-sdk-react-native';
import { useContentFetch } from '../hooks/useContentFetch';

interface ContentSearchScreenProps {
  apiKey: string;
  companyName: string;
  onResultsFetched?: (data: any, contentType: ContentType) => void;
}

enum FilterType {
  NONE = 'none',
  CATEGORY = 'category',
  BODY_PARTS = 'bodyParts',
}

enum SearchType {
  FIND_BY_ID = 'findById',
  FIND_BY_TITLE = 'findByTitle',
}

export const ContentSearchScreen: React.FC<ContentSearchScreenProps> = ({
  apiKey,
  companyName,
  onResultsFetched,
}) => {
  const [selectedContent, setSelectedContent] = useState<ContentType>(
    ContentType.WORKOUT
  );
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.NONE
  );
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>(
    SearchType.FIND_BY_ID
  );
  const [searchText, setSearchText] = useState('');
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>([]);

  const { state, fetchContent } = useContentFetch(apiKey, companyName);

  const handleFetch = async () => {
    if (!searchText && selectedFilter === FilterType.NONE) {
      Alert.alert('Error', 'Please enter search criteria or select a filter');
      return;
    }

    let params: any = {
      contentType: selectedContent,
    };

    // Search by ID or Title
    if (selectedFilter === FilterType.NONE) {
      if (selectedSearchType === SearchType.FIND_BY_ID) {
        params.id = searchText;
      } else {
        params.title = searchText;
      }
    }
    // Filter by category
    else if (selectedFilter === FilterType.CATEGORY) {
      params.category = searchText;
    }
    // Filter by body parts
    else if (selectedFilter === FilterType.BODY_PARTS) {
      if (selectedBodyParts.length === 0) {
        Alert.alert('Error', 'Please select at least one body part');
        return;
      }
      params.bodyParts = selectedBodyParts;
    }

    const result = await fetchContent(params);

    if (result && onResultsFetched) {
      onResultsFetched(result.data, selectedContent);
    } else if (state.error) {
      Alert.alert('Error', state.error);
    }
  };

  const toggleBodyPart = (bodyPart: BodyPart) => {
    setSelectedBodyParts((prev) =>
      prev.includes(bodyPart)
        ? prev.filter((bp) => bp !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const renderContentTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Content Type</Text>
      <View style={styles.segmentControl}>
        {[ContentType.WORKOUT, ContentType.PLAN, ContentType.EXERCISE].map(
          (type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.segmentButton,
                selectedContent === type && styles.segmentButtonActive,
              ]}
              onPress={() => setSelectedContent(type)}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  selectedContent === type && styles.segmentButtonTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );

  const renderFilterTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Filter Type</Text>
      <View style={styles.segmentControl}>
        {[FilterType.NONE, FilterType.CATEGORY, FilterType.BODY_PARTS].map(
          (type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.segmentButton,
                selectedFilter === type && styles.segmentButtonActive,
              ]}
              onPress={() => setSelectedFilter(type)}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  selectedFilter === type && styles.segmentButtonTextActive,
                ]}
              >
                {type === FilterType.NONE
                  ? 'None'
                  : type === FilterType.CATEGORY
                  ? 'Category'
                  : 'Body Parts'}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );

  const renderSearchTypeSelector = () => {
    if (selectedFilter !== FilterType.NONE) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Search By</Text>
        <View style={styles.segmentControl}>
          {[SearchType.FIND_BY_ID, SearchType.FIND_BY_TITLE].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.segmentButton,
                selectedSearchType === type && styles.segmentButtonActive,
              ]}
              onPress={() => setSelectedSearchType(type)}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  selectedSearchType === type && styles.segmentButtonTextActive,
                ]}
              >
                {type === SearchType.FIND_BY_ID ? 'ID' : 'Title'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderSearchInput = () => {
    if (selectedFilter === FilterType.BODY_PARTS) return null;

    const placeholder =
      selectedFilter === FilterType.CATEGORY
        ? 'Enter category name'
        : selectedSearchType === SearchType.FIND_BY_ID
        ? 'Enter content ID'
        : 'Enter content title';

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedFilter === FilterType.CATEGORY ? 'Category' : 'Search'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
      </View>
    );
  };

  const renderBodyPartsSelector = () => {
    if (selectedFilter !== FilterType.BODY_PARTS) return null;

    const bodyParts = Object.values(BodyPart);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Body Parts</Text>
        <View style={styles.bodyPartsGrid}>
          {bodyParts.map((bodyPart) => (
            <TouchableOpacity
              key={bodyPart}
              style={[
                styles.bodyPartChip,
                selectedBodyParts.includes(bodyPart) &&
                  styles.bodyPartChipActive,
              ]}
              onPress={() => toggleBodyPart(bodyPart)}
            >
              <Text
                style={[
                  styles.bodyPartChipText,
                  selectedBodyParts.includes(bodyPart) &&
                    styles.bodyPartChipTextActive,
                ]}
              >
                {bodyPart}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Content Search</Text>

        {renderContentTypeSelector()}
        {renderFilterTypeSelector()}
        {renderSearchTypeSelector()}
        {renderSearchInput()}
        {renderBodyPartsSelector()}

        <TouchableOpacity
          style={[styles.fetchButton, state.isLoading && styles.fetchButtonDisabled]}
          onPress={handleFetch}
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.fetchButtonText}>Fetch Content</Text>
          )}
        </TouchableOpacity>

        {state.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    padding: 20,
    paddingBottom: 10,
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  segmentControl: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#2196F3',
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  segmentButtonTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#212121',
  },
  bodyPartsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bodyPartChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  bodyPartChipActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  bodyPartChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  bodyPartChipTextActive: {
    color: '#FFF',
  },
  fetchButton: {
    margin: 20,
    marginTop: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fetchButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  fetchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    margin: 20,
    marginTop: 0,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
});
