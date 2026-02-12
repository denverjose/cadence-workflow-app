import { Worker } from '@temporalio/worker';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities: require('./activities'),
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'cadence-task-queue',
  });

  await worker.run();
}

run();
