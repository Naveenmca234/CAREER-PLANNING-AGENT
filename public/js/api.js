/**
 * Career Planning Agent - API Client
 */

const API = {
  baseUrl: '',

  async checkStatus() {
    try {
      const res = await fetch(`${this.baseUrl}/api/status`);
      if (!res.ok) throw new Error('Status endpoint failed');
      return await res.json();
    } catch (err) {
      console.warn('API status check error:', err);
      return {
        hasGeminiKey: false,
        activeProvider: 'Career Expert Engine (Local Mode)'
      };
    }
  },

  async getPresets() {
    try {
      const res = await fetch(`${this.baseUrl}/api/presets`);
      if (!res.ok) throw new Error('Failed to load presets');
      return await res.json();
    } catch (err) {
      console.warn('Error fetching presets:', err);
      return [];
    }
  },

  async updateSettings(settings) {
    try {
      const res = await fetch(`${this.baseUrl}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async generateCareerPlan(studentData) {
    try {
      const res = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentData })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate career plan.');
      }
      return data;
    } catch (err) {
      console.error('API Error generateCareerPlan:', err);
      throw err;
    }
  },

  async refineCareerPlan(payload) {
    try {
      const res = await fetch(`${this.baseUrl}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine career plan.');
      }
      return data;
    } catch (err) {
      console.error('API Error refineCareerPlan:', err);
      throw err;
    }
  }
};

window.API = API;
