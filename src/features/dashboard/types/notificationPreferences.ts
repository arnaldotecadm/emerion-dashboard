import type { NotificationCategory } from "./notification";

export const ALL_NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  "INGESTION",
  "STATUS_UPDATE",
  "APPROVAL_NEEDED",
  "SYSTEM",
];

export interface NotificationPreferenceOption {
  category: NotificationCategory;
  label: string;
  description: string;
}

export const NOTIFICATION_PREFERENCE_OPTIONS: NotificationPreferenceOption[] = [
  {
    category: "INGESTION",
    label: "Ingestão",
    description: "Novos lotes de dados recebidos e processamentos de carga.",
  },
  {
    category: "STATUS_UPDATE",
    label: "Atualizações de status",
    description: "Mudanças de status em processos, pedidos e integrações.",
  },
  {
    category: "APPROVAL_NEEDED",
    label: "Aprovação necessária",
    description: "Solicitações que dependem de aprovação do seu perfil.",
  },
  {
    category: "SYSTEM",
    label: "Sistema",
    description: "Comunicados técnicos e eventos gerais do sistema.",
  },
];
