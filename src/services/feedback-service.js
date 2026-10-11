// Parent feedback data boundary.
// The management feature owns the feedback domain contract; this service owns
// direct Supabase access to the existing parent_feedback table.

export function createFeedbackService(db) {
  if (!db) throw new Error('A Supabase client is required.');

  return Object.freeze({
    async listAll() {
      const { data, error } = await db
        .from('parent_feedback')
        .select('id,feedback_type,subject,message,status,created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    async create(payload = {}) {
      const { data, error } = await db
        .from('parent_feedback')
        .insert({
          feedback_type: payload.feedbackType,
          subject: payload.subject,
          message: payload.message
        })
        .select('id,feedback_type,subject,message,status,created_at')
        .single();

      if (error) throw error;
      return data;
    },

    async updateStatus(id, status) {
      const { data, error } = await db
        .from('parent_feedback')
        .update({ status })
        .eq('id', id)
        .select('id,feedback_type,subject,message,status,created_at')
        .single();

      if (error) throw error;
      return data;
    }
  });
}
