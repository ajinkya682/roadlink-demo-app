class SSEManager {
  constructor() {
    // Maps userId -> Array of Response objects
    this.clients = new Map();

    // Heartbeat every 4 seconds to aggressively prevent ERR_INCOMPLETE_CHUNKED_ENCODING timeouts
    setInterval(() => {
      this.clients.forEach(userClients => {
        userClients.forEach(res => {
          // Send an SSE comment to keep connection alive
          res.write(':\n\n'); 
          if (typeof res.flush === 'function') res.flush();
        });
      });
    }, 4000);
  }

  addClient(userId, res) {
    const uId = userId.toString();
    if (!this.clients.has(uId)) {
      this.clients.set(uId, []);
    }
    this.clients.get(uId).push(res);
    console.log(`[SSE] Client connected for user ${uId}`);

    // Clean up on disconnect
    res.on('close', () => {
      this.removeClient(uId, res);
      console.log(`[SSE] Client disconnected for user ${uId}`);
    });
  }

  removeClient(userId, res) {
    const uId = userId.toString();
    const userClients = this.clients.get(uId);
    if (userClients) {
      const filtered = userClients.filter(client => client !== res);
      if (filtered.length === 0) {
        this.clients.delete(uId);
      } else {
        this.clients.set(uId, filtered);
      }
    }
  }

  /**
   * Push an event to a specific user
   * @param {string} userId - The target user ID
   * @param {string} event - The event name (e.g., 'NOTIFICATION', 'VEHICLE_UPDATED')
   * @param {object} data - The payload to send
   */
  sendToUser(userId, event, data) {
    const uId = userId.toString();
    const userClients = this.clients.get(uId);
    if (userClients) {
      const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      userClients.forEach(res => {
        res.write(payload);
        if (typeof res.flush === 'function') res.flush();
      });
    }
  }
}

module.exports = new SSEManager();
