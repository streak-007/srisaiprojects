export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          full_description: string;
          category: "final_year" | "minor";
          target_year: number;
          branch_tags: string[];
          domain_tags: string[];
          cover_image_url: string | null;
          gallery: string[];
          status: "draft" | "published" | "sold_out";
          starting_from: number;
          features: string[];
          tech_stack: string[];
          demo_video_url: string | null;
          deliverables: string[];
          timeline_days: number | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      project_components: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          quantity: number;
          unit_cost: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          quantity?: number;
          unit_cost?: number;
        };
        Update: Partial<Database["public"]["Tables"]["project_components"]["Row"]>;
        Relationships: [];
      };
      project_addons: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          type: "flat" | "percent";
          value: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          type: "flat" | "percent";
          value: number;
        };
        Update: Partial<Database["public"]["Tables"]["project_addons"]["Row"]>;
        Relationships: [];
      };
      detail_requests: {
        Row: {
          id: string;
          project_id: string;
          student_name: string;
          phone: string;
          email: string;
          college: string;
          year: number;
          branch: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          student_name: string;
          phone: string;
          email: string;
          college: string;
          year: number;
          branch: string;
          status?: "pending" | "approved" | "rejected";
        };
        Update: Partial<Database["public"]["Tables"]["detail_requests"]["Row"]>;
        Relationships: [];
      };
      detail_links: {
        Row: {
          id: string;
          project_id: string;
          request_id: string | null;
          token: string;
          expires_at: string | null;
          opened_at: string | null;
          single_use: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          request_id?: string | null;
          token?: string;
          expires_at?: string | null;
          opened_at?: string | null;
          single_use?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["detail_links"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          student_name: string;
          college: string;
          quote: string;
          project_title: string | null;
          photo_url: string | null;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_name: string;
          college: string;
          quote: string;
          project_title?: string | null;
          photo_url?: string | null;
          published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
