export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string
          department: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          department: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          department?: string
          is_active?: boolean
        }
      }
      complaints: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string
          priority_score: number
          location_lat: number
          location_lng: number
          image_url: string
          assigned_to: string | null
          status: string
          priority: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: string
          priority_score?: number
          location_lat?: number
          location_lng?: number
          image_url?: string
          assigned_to?: string | null
          status?: string
          priority?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          priority_score?: number
          location_lat?: number
          location_lng?: number
          image_url?: string
          assigned_to?: string | null
          status?: string
          priority?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone_number: string
          role: string
          language_preference: string
          location: string
          department: string
          clerk_id: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone_number: string
          role?: string
          language_preference?: string
          location?: string
          department?: string
          clerk_id?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone_number?: string
          role?: string
          language_preference?: string
          location?: string
          department?: string
          clerk_id?: string
        }
      }
      feedback: {
        Row: {
          id: string
          complaint_id: string
          user_id: string
          rating: number
          comment: string
          sentiment_score: number
          citizen_id: string
        }
        Insert: {
          id?: string
          complaint_id: string
          user_id: string
          rating: number
          comment: string
          sentiment_score?: number
          citizen_id: string
        }
        Update: {
          id?: string
          complaint_id?: string
          user_id?: string
          rating?: number
          comment?: string
          sentiment_score?: number
          citizen_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          complaint_id: string
          user_id: string
          text: string
          content: string
          attachment_url: string
          is_internal: boolean
        }
        Insert: {
          id?: string
          complaint_id: string
          user_id: string
          text: string
          content: string
          attachment_url?: string
          is_internal?: boolean
        }
        Update: {
          id?: string
          complaint_id?: string
          user_id?: string
          text?: string
          content?: string
          attachment_url?: string
          is_internal?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          type: string
          is_read: boolean
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type: string
          is_read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: string
          is_read?: boolean
        }
      }
      audit_logs: {
        Row: {
          id: string
          performed_by: string
          action: string
          complaint_id: string
          resource_type: string
          resource_id: string
          details: any
          user_id: string
        }
        Insert: {
          id?: string
          performed_by: string
          action: string
          complaint_id: string
          resource_type: string
          resource_id: string
          details?: any
          user_id: string
        }
        Update: {
          id?: string
          performed_by?: string
          action?: string
          complaint_id?: string
          resource_type?: string
          resource_id?: string
          details?: any
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      complaint_status: 'pending' | 'in_progress' | 'resolved' | 'closed'
      complaint_priority: 'low' | 'medium' | 'high' | 'urgent'
      user_role: 'citizen' | 'official' | 'officer' | 'admin' | 'super_admin'
      notification_type: 'status_update' | 'feedback_request' | 'assignment' | 'escalation'
    }
  }
}

export type ComplaintStatus = Database['public']['Enums']['complaint_status']
export type ComplaintPriority = Database['public']['Enums']['complaint_priority']
export type UserRole = Database['public']['Enums']['user_role']

export type Complaint = Database['public']['Tables']['complaints']['Row']
export type ComplaintInsert = Database['public']['Tables']['complaints']['Insert']
export type ComplaintUpdate = Database['public']['Tables']['complaints']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Feedback = Database['public']['Tables']['feedback']['Row']
export type FeedbackInsert = Database['public']['Tables']['feedback']['Insert']
export type FeedbackUpdate = Database['public']['Tables']['feedback']['Update']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert']
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update']
