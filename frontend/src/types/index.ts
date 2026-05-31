// ─── Shared TypeScript Interfaces ────────────────────────────────────────────

export interface Shipment {
  id: string;
  item: string;
  partner: string;
  temp: number;
  target: string;
  route: string;
  status: string;
  ETA: string;
  risk: string;
  origin: string;
  destination: string;
  volume: string;
}

export interface FormData {
  name: string;
  email: string;
  idCode: string;
  role: string;
}

export interface NewShipmentForm {
  item: string;
  partner: string;
  temp: string;
  minTemp: string;
  maxTemp: string;
  origin: string;
  destination: string;
  volume: string;
}

export interface ChatLog {
  sender: 'ai' | 'user';
  text: string;
}

export type ActiveTab = 'overview' | 'ai-model' | 'detail' | 'account';

// ─── Theme helper strings (computed once, passed down as props) ───────────────
export interface ThemeClasses {
  cardThemeBg: string;
  inputThemeBg: string;
  secondaryBg: string;
}
