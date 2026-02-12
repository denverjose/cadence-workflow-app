import { CadenceStep } from './cadence';

export type WorkflowStatus = 'RUNNING' | 'COMPLETED';

export interface WorkflowState {
  currentStepIndex: number;
  stepsVersion: number;
  status: WorkflowStatus;
  steps?: CadenceStep[];
}

export interface Enrollment {
  id: string;
  cadenceId: string;
  contactEmail: string;
  state?: WorkflowState;
}
