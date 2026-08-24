

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          created_at?: string
        }
      }
      payees: {
        Row: {
          id: string
          user_id: string
          name: string
          account_details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          account_details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          account_details?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          payee_id: string | null
          amount: number
          currency: string
          type: 'INCOME' | 'EXPENSE'
          category: string | null
          description: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payee_id?: string | null
          amount: number
          currency?: string
          type: 'INCOME' | 'EXPENSE'
          category?: string | null
          description?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payee_id?: string | null
          amount?: number
          currency?: string
          type?: 'INCOME' | 'EXPENSE'
          category?: string | null
          description?: string | null
          status?: string
          created_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          payee_id: string | null
          title: string
          amount: number
          currency: string
          due_date: string
          frequency: 'ONCE' | 'MONTHLY' | 'YEARLY'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          payee_id?: string | null
          title: string
          amount: number
          currency?: string
          due_date: string
          frequency?: 'ONCE' | 'MONTHLY' | 'YEARLY'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          payee_id?: string | null
          title?: string
          amount?: number
          currency?: string
          due_date?: string
          frequency?: 'ONCE' | 'MONTHLY' | 'YEARLY'
          is_active?: boolean
          created_at?: string
        }
      }
      payment_requests: {
        Row: {
          id: string
          user_id: string
          person_name: string
          person_contact: string | null
          amount: number
          currency: string
          note: string | null
          status: 'PENDING' | 'PAID' | 'CANCELLED'
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          person_name: string
          person_contact?: string | null
          amount: number
          currency?: string
          note?: string | null
          status?: 'PENDING' | 'PAID' | 'CANCELLED'
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          person_name?: string
          person_contact?: string | null
          amount?: number
          currency?: string
          note?: string | null
          status?: 'PENDING' | 'PAID' | 'CANCELLED'
          due_date?: string | null
          created_at?: string
        }
      }
    }
  }
}