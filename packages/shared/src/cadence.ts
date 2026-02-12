export type StepType = "SEND_EMAIL" | "WAIT";

export interface CadenceStep {
  id: string;
  type: StepType;
  subject?: string;
  body?: string;
  seconds?: number;
}

export interface Cadence {
  id: string;
  name: string;
  steps: CadenceStep[];
}
