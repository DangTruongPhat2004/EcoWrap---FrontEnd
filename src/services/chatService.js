// Use relative URLs to work with Vercel proxy
// Both development and production use relative URLs
// The Vercel proxy (vercel.json) will forward requests to the backend
const API_BASE_URL = ""; // Always use relative URLs

class ChatService {
  constructor(token) {
    this.token = token;
    this.headers = {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Create or get existing conversation between seller and customer
  async createConversation(sellerId, customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/conversations`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          sellerId: sellerId,
          customerId: customerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }

  // Get conversation details
  async getConversation(conversationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/conversations/${conversationId}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get conversation");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId, limit = 30) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/conversations/${conversationId}/messages?limit=${limit}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get messages");
      }

      const data = await response.json();
      return data.items || []; // Return the items array
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(conversationId, messageData) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            body: messageData.body,
            contentType: messageData.contentType || "text",
            clientId: messageData.clientId || "web-client",
            attachmentUrl: messageData.attachmentUrl || null,
            attachmentName: messageData.attachmentName || null,
            attachmentSize: messageData.attachmentSize || 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Get user info
  async getUserInfo(userId) {
    try {
      const response = await fetch(`/api/Users/${userId}`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to get user info");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  // Add this method to your chatService.js file

  // In the ChatService class, add this method:

  // Get all conversations for current user
  async getUserConversations() {
    try {
      // NOTE: You may need to adjust this endpoint based on your backend API
      // This assumes there's an endpoint to get all conversations for the authenticated user
      const response = await fetch(`${API_BASE_URL}/chats/conversations`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error("Failed to get conversations");
      }

      const data = await response.json();

      // Return conversations array
      // Adjust this based on your API response structure
      return Array.isArray(data) ? data : data.items || [];
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chats/conversations/${conversationId}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get conversation");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  }
}

export default ChatService;
