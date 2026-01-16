import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { MaterialIcons } from '@expo/vector-icons';

const blogs = [
  {
    id: '1',
    title: 'Understanding Dementia',
    snippet: 'A brief guide to dementia awareness.',
    article: `Dementia is a general term for a decline in mental ability severe enough to interfere with daily life. It affects memory, thinking, orientation, comprehension, calculation, learning capacity, language, and judgment. Alzheimer's disease is the most common cause of dementia.`,
  },
  {
    id: '2',
    title: "Early Signs of Alzheimer's",
    snippet: 'What to look out for and how to help.',
    article: `Alzheimer’s disease is the most common cause of dementia — a progressive disease that destroys memory and other important mental functions. Early symptoms include memory loss, difficulty performing familiar tasks, and changes in mood or behavior. Early diagnosis can improve quality of life.`,
  },
];

export default function BlogsScreen() {
  const [selectedBlog, setSelectedBlog] = useState<typeof blogs[0] | null>(null);

  if (selectedBlog) {
    // Article view
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedBlog(null)} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={28} color={Colors.light.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>{selectedBlog.title}</Text>
        </View>
        <ScrollView style={styles.articleContainer} contentContainerStyle={styles.articleContent}>
          <Text style={styles.articleText}>{selectedBlog.article}</Text>
        </ScrollView>
      </View>
    );
  }

  // List view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blogs</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setSelectedBlog(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSnippet}>{item.snippet}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.primaryLighter,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSnippet: {
    color: Colors.light.textSecondary,
    marginTop: 8,
    fontSize: 14,
  },
  articleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  articleContent: {
    paddingBottom: 40,
  },
  articleText: {
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
});
