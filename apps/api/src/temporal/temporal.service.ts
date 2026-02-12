import { Injectable } from '@nestjs/common';
import { Client, WorkflowHandle } from '@temporalio/client';
import crypto from 'crypto';
import type { CadenceStep, WorkflowState } from 'shared';

@Injectable()
export class TemporalService {
  private client: Client;

  constructor() {
    this.client = new Client({
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    });
  }

  async startWorkflow(
    steps: CadenceStep[],
    contactEmail: string,
  ): Promise<{ workflowId: string; handle: WorkflowHandle }> {
    const workflowId = crypto.randomUUID();
    const handle = await this.client.workflow.start('cadenceWorkflow', {
      args: [steps, contactEmail],
      workflowId,
      taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'cadence-task-queue',
    });

    return { workflowId, handle };
  }

  async queryWorkflow(workflowId: string): Promise<WorkflowState> {
    const handle = this.client.workflow.getHandle(workflowId);
    return handle.query('getState');
  }

  async updateWorkflow(
    workflowId: string,
    steps: CadenceStep[],
  ): Promise<{ success: true }> {
    const handle = this.client.workflow.getHandle(workflowId);
    await handle.signal('updateCadence', steps);
    return { success: true };
  }
}
