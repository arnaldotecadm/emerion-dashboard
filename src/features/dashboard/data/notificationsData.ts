export interface NotificationItem {
  id: string;
  reference: string;
  category: string;
  name: string;
  description: string;
  icon: string;
  time: string;
  unread?: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    reference: "CLI-1030",
    category: "Crédito",
    name: "Limite de crédito excedido",
    description: "Distribuidora Alfa Ltda. ultrapassou o teto de crédito permitido para o mês corrente.",
    icon: "credit_card_off",
    time: "5 min atrás",
    unread: true,
  },
  {
    id: "n2",
    reference: "ORD-90245",
    category: "Pedidos",
    name: "Novo pedido recebido",
    description: "Pedido #ORD-90245 foi registrado e está aguardando aprovação do gestor responsável.",
    icon: "receipt_long",
    time: "22 min atrás",
    unread: true,
  },
  {
    id: "n3",
    reference: "STK-0512",
    category: "Estoque",
    name: "Estoque baixo",
    description: "5 itens da Curva A estão abaixo do estoque de segurança configurado.",
    icon: "inventory_2",
    time: "1 h atrás",
    unread: true,
  },
  {
    id: "n4",
    reference: "VND-0088",
    category: "Metas",
    name: "Meta batida",
    description: "Carlos Eduardo S. atingiu 105% da meta de vendas do mês.",
    icon: "task_alt",
    time: "3 h atrás",
  },
];

export function getNotificationById(id: string | undefined): NotificationItem | undefined {
  if (!id) return undefined;
  return NOTIFICATIONS.find((n) => n.id === id);
}
