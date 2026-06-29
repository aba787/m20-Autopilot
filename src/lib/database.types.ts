export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bot_mode: 'safe' | 'semi' | 'auto';
          target_acos: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      amazon_connections: {
        Row: {
          id: string;
          user_id: string;
          profile_id: string;
          marketplace: string;
          seller_name: string | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          is_active: boolean;
          last_synced_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['amazon_connections']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['amazon_connections']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          amazon_campaign_id: string;
          name: string;
          type: string;
          status: string;
          budget: number;
          spend: number;
          sales: number;
          clicks: number;
          impressions: number;
          orders: number;
          acos: number;
          roas: number;
          ctr: number;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      keywords: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string;
          keyword: string;
          match_type: string;
          bid: number;
          impressions: number;
          clicks: number;
          spend: number;
          sales: number;
          acos: number;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['keywords']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['keywords']['Insert']>;
      };
      action_logs: {
        Row: {
          id: string;
          user_id: string;
          campaign_id: string | null;
          keyword_id: string | null;
          action_type: string;
          actor: 'ai' | 'user';
          mode: 'safe' | 'semi' | 'auto';
          status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
          payload: Json;
          result: Json | null;
          error: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['action_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['action_logs']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: 'info' | 'warning' | 'error' | 'success';
          read: boolean;
          link: string | null;
          campaign_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      ad_generations: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          category: string | null;
          brand: string | null;
          keywords: string[];
          headlines: string[];
          description: string;
          targeting: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ad_generations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ad_generations']['Insert']>;
      };
      accounting_snapshots: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          revenue: number;
          ad_spend: number;
          cogs: number;
          gross_profit: number;
          net_profit: number;
          acos: number;
          roas: number;
          orders: number;
          units: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['accounting_snapshots']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['accounting_snapshots']['Insert']>;
      };
      job_runs: {
        Row: {
          id: string;
          job_name: string;
          user_id: string | null;
          status: 'running' | 'completed' | 'failed';
          started_at: string;
          finished_at: string | null;
          records_processed: number;
          error: string | null;
        };
        Insert: Omit<Database['public']['Tables']['job_runs']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['job_runs']['Insert']>;
      };
    };
  };
}
