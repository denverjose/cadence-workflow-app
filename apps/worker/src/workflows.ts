import {
  proxyActivities,
  defineSignal,
  defineQuery,
  setHandler,
  sleep,
} from "@temporalio/workflow";
import type { CadenceStep, WorkflowState } from "shared";
import type * as activities from "./activities";

const { sendEmail } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});
export const updateCadenceSignal =
  defineSignal<[CadenceStep[]]>("updateCadence");
export const getStateQuery = defineQuery<WorkflowState>("getState");

export async function cadenceWorkflow(
  initialSteps: CadenceStep[],
  contactEmail: string,
) {
  let steps = [...initialSteps];
  let currentStepIndex = 0;
  let stepsVersion = 1;
  let status: "RUNNING" | "COMPLETED" = "RUNNING";

  setHandler(updateCadenceSignal, (newSteps: CadenceStep[]) => {
    steps = newSteps;
    stepsVersion++;
    if (steps.length <= currentStepIndex) {
      status = "COMPLETED";
    }
  });

  setHandler(getStateQuery, () => ({
    currentStepIndex,
    stepsVersion,
    status,
    steps,
  }));

  while (currentStepIndex < steps.length) {
    const step = steps[currentStepIndex];

    if (step.type === "SEND_EMAIL") {
      await sendEmail({
        to: contactEmail,
        subject: step.subject!,
        body: step.body!,
      });
    }

    if (step.type === "WAIT") {
      await sleep(step.seconds! * 1000);
    }

    currentStepIndex++;
  }

  status = "COMPLETED";
}
