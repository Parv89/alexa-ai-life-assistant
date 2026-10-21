import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'alexa', 'system'],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    intent: {
      type: String,
      default: 'GeneralConversation',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    suggestedActions: [
      {
        label: String,
        action: String,
        payload: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage;
