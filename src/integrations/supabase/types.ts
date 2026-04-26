export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          about_logo_url: string | null
          about_logo_white: boolean
          facebook_pixel_id: string | null
          facebook_url: string | null
          form_cta_texto: string | null
          form_subtitulo: string | null
          form_titulo: string | null
          google_ads_id: string | null
          google_ads_label: string | null
          google_maps_url: string | null
          gtm_id: string | null
          header_logo_url: string | null
          header_logo_white: boolean
          hero_headline: string | null
          hero_headline_highlight: string | null
          hero_subtitle: string | null
          id: boolean
          instagram_url: string | null
          maps_embed_url: string | null
          modal_cta_texto: string | null
          modal_subtitulo: string | null
          modal_titulo: string | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string | null
          webhook_active: boolean | null
          webhook_get_active: boolean | null
          webhook_get_url: string | null
          webhook_url: string | null
          whatsapp_number: string | null
          youtube_url: string | null
        }
        Insert: {
          about_logo_url?: string | null
          about_logo_white?: boolean
          facebook_pixel_id?: string | null
          facebook_url?: string | null
          form_cta_texto?: string | null
          form_subtitulo?: string | null
          form_titulo?: string | null
          google_ads_id?: string | null
          google_ads_label?: string | null
          google_maps_url?: string | null
          gtm_id?: string | null
          header_logo_url?: string | null
          header_logo_white?: boolean
          hero_headline?: string | null
          hero_headline_highlight?: string | null
          hero_subtitle?: string | null
          id?: boolean
          instagram_url?: string | null
          maps_embed_url?: string | null
          modal_cta_texto?: string | null
          modal_subtitulo?: string | null
          modal_titulo?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          webhook_active?: boolean | null
          webhook_get_active?: boolean | null
          webhook_get_url?: string | null
          webhook_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Update: {
          about_logo_url?: string | null
          about_logo_white?: boolean
          facebook_pixel_id?: string | null
          facebook_url?: string | null
          form_cta_texto?: string | null
          form_subtitulo?: string | null
          form_titulo?: string | null
          google_ads_id?: string | null
          google_ads_label?: string | null
          google_maps_url?: string | null
          gtm_id?: string | null
          header_logo_url?: string | null
          header_logo_white?: boolean
          hero_headline?: string | null
          hero_headline_highlight?: string | null
          hero_subtitle?: string | null
          id?: boolean
          instagram_url?: string | null
          maps_embed_url?: string | null
          modal_cta_texto?: string | null
          modal_subtitulo?: string | null
          modal_titulo?: string | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          webhook_active?: boolean | null
          webhook_get_active?: boolean | null
          webhook_get_url?: string | null
          webhook_url?: string | null
          whatsapp_number?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      depoimentos: {
        Row: {
          created_at: string
          data_exibicao: string | null
          id: string
          is_public: boolean
          nome: string
          ordem: number
          texto: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_exibicao?: string | null
          id?: string
          is_public?: boolean
          nome: string
          ordem?: number
          texto: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_exibicao?: string | null
          id?: string
          is_public?: boolean
          nome?: string
          ordem?: number
          texto?: string
          updated_at?: string
        }
        Relationships: []
      }
      galeria_midia: {
        Row: {
          categoria: string
          created_at: string
          id: string
          ordem: number
          storage_path: string | null
          subtitulo: string | null
          titulo: string | null
          url_imagem: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          id?: string
          ordem?: number
          storage_path?: string | null
          subtitulo?: string | null
          titulo?: string | null
          url_imagem: string
        }
        Update: {
          categoria?: string
          created_at?: string
          id?: string
          ordem?: number
          storage_path?: string | null
          subtitulo?: string | null
          titulo?: string | null
          url_imagem?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          interesse: string | null
          local_imovel: string | null
          nome: string | null
          tem_projeto: boolean | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          interesse?: string | null
          local_imovel?: string | null
          nome?: string | null
          tem_projeto?: boolean | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          interesse?: string | null
          local_imovel?: string | null
          nome?: string | null
          tem_projeto?: boolean | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      opcoes_formulario: {
        Row: {
          ativo: boolean
          created_at: string | null
          emoji: string | null
          id: string
          label: string
          posicao: number
          value: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string | null
          emoji?: string | null
          id?: string
          label: string
          posicao?: number
          value: string
        }
        Update: {
          ativo?: boolean
          created_at?: string | null
          emoji?: string | null
          id?: string
          label?: string
          posicao?: number
          value?: string
        }
        Relationships: []
      }
      opcoes_local: {
        Row: {
          ativo: boolean
          created_at: string | null
          id: string
          label: string
          posicao: number
          value: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string | null
          id?: string
          label: string
          posicao?: number
          value: string
        }
        Update: {
          ativo?: boolean
          created_at?: string | null
          id?: string
          label?: string
          posicao?: number
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
