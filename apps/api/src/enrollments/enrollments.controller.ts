import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { TemporalService } from '../temporal/temporal.service';
import type { CadenceStep, WorkflowState } from 'shared';
import { cadences } from '../cadences/cadences.controller';

const enrollments = new Map<string, { id: string; status: string }>();

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly temporalService: TemporalService) {}

  @Post()
  async enroll(
    @Body()
    body: {
      cadenceId: string;
      contactEmail: string;
      steps?: CadenceStep[];
    },
  ) {
    const cadence = cadences.get(body.cadenceId);

    const steps: CadenceStep[] = body.steps ?? cadence?.steps ?? [];

    if (!steps.length) {
      throw new BadRequestException('No steps provided');
    }

    const { workflowId } = await this.temporalService.startWorkflow(
      steps,
      body.contactEmail,
    );

    enrollments.set(workflowId, { id: workflowId, status: 'RUNNING' });
    return { id: workflowId };
  }

  @Post(':id/update-cadence')
  async update(
    @Param('id') id: string,
    @Body() body: { steps: CadenceStep[] },
  ) {
    return this.temporalService.updateWorkflow(id, body.steps);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<WorkflowState> {
    return this.temporalService.queryWorkflow(id);
  }
}
