import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { sendChatMessage } from "../../utils/api";

const SUGGESTED_QUESTIONS = [
  "Risk score?",
  "Tremor analysis?",
  "Speech analysis?",
  "Drawing analysis?",
  "Is this a diagnosis?"
];

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello. Ask about your tests or report.", fromUser: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      { id: Date.now().toString(), text, fromUser: true },
      ...prev,
    ]);

    try {
      const data = await sendChatMessage(text);

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          fromUser: false,
        },
        ...prev,
      ]);
    } catch {
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          text: "Unable to respond right now.",
          fromUser: false,
        },
        ...prev,
      ]);
    }
  };

  const sendMessage = async () => {
    const text = input;
    setInput("");
    await handleSend(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        inverted
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.fromUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={item.fromUser ? styles.userText : styles.botText}>
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Suggestions stuck to bottom */}
      <View style={styles.suggestionsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {SUGGESTED_QUESTIONS.map((q, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSend(q)}
            >
              <Text style={styles.suggestionText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your report…"
          placeholderTextColor={Colors.light.textSecondary}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  bubble: {
    maxWidth: "75%",
    marginVertical: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.light.primaryLighter,
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: Colors.light.primary,
    alignSelf: "flex-start",
  },
  userText: {
    color: Colors.light.text,
    fontSize: 14,
  },
  botText: {
    color: "#fff",
    fontSize: 14,
  },

  /* Suggestions */
  suggestionsWrapper: {
    borderTopWidth: 1,
    borderColor: Colors.light.primaryLighter,
    paddingVertical: 6,
  },
  suggestionsContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  suggestionButton: {
    backgroundColor: Colors.light.primaryLighter,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
  },
  suggestionText: {
    fontSize: 11,
    color: Colors.light.text,
  },

  inputBar: {
    flexDirection: "row",
    backgroundColor: Colors.light.background,
    padding: 8,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.light.primaryLighter,
    marginRight: 8,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
