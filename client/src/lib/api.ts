import { AssignmentFormData, IAssignment, IGeneratedPaper } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  async listAssignments(search?: string): Promise<IAssignment[]> {
    const url = new URL(`${API_BASE_URL}/api/assignments`);
    if (search) url.searchParams.append('search', search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch assignments');
    const json = await res.json();
    return json.data;
  },

  async deleteAssignment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete assignment');
  },

  async createAssignment(data: AssignmentFormData): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_BASE_URL}/api/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create assignment');
    }
    
    const json = await res.json();
    return json.data;
  },

  async getAssignment(id: string): Promise<IAssignment> {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch assignment');
    const json = await res.json();
    return json.data;
  },

  async getGeneratedPaper(id: string): Promise<IGeneratedPaper> {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}/paper`);
    if (!res.ok) throw new Error('Failed to fetch paper');
    const json = await res.json();
    return json.data;
  },

  async regenerateAssignment(id: string): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/api/assignments/${id}/regenerate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to regenerate assignment');
    const json = await res.json();
    return json.data;
  },

  getDownloadPDFUrl(id: string): string {
    return `${API_BASE_URL}/api/assignments/${id}/pdf`;
  }
};
