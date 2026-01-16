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
} from "react-native";
import { Colors } from "../../constants/Colors";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you?", fromUser: false },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      { id: Date.now().toString(), text: input, fromUser: true },
      ...prev,
    ]);
    setInput("");
    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          text: "This is a sample chat reply.",
          fromUser: false,
        },
        ...prev,
      ]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        inverted
        style={styles.messagesList}
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
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
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
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bubble: {
    maxWidth: "70%",
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    alignSelf: "flex-start",
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
  },
  botText: {
    color: "#fff",
  },
  inputBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: Colors.light.primaryLighter,
    backgroundColor: Colors.light.background,
    padding: 8,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryLighter,
    marginRight: 8,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
