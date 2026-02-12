"use client";

import { useState } from "react";
import { Cadence, CadenceStep, WorkflowState } from "shared";

const BASE_URL = "http://localhost:3001";
export default function Home() {
  const [json, setJson] = useState<string>(
    JSON.stringify(
      {
        id: "cad_123",
        name: "Welcome Flow",
        steps: [
          {
            id: "1",
            type: "SEND_EMAIL",
            subject: "Welcome",
            body: "Hello there",
          },
          { id: "2", type: "WAIT", seconds: 10 },
          {
            id: "3",
            type: "SEND_EMAIL",
            subject: "Follow up",
            body: "Checking in",
          },
        ],
      } as Cadence,
      null,
      2,
    ),
  );

  const [enrollmentId, setEnrollmentId] = useState<string>("");
  const [state, setState] = useState<WorkflowState | null>(null);

  async function createCadence() {
    const data: Cadence = JSON.parse(json);
    await fetch(`${BASE_URL}/cadences`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function enroll() {
    const data: Cadence = JSON.parse(json);
    const res = await fetch(`${BASE_URL}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cadenceId: data.id,
        contactEmail: "test@email.com",
      }),
    });
    const result = await res.json();
    setEnrollmentId(result.id);
  }

  async function poll() {
    const res = await fetch(`${BASE_URL}/enrollments/${enrollmentId}`);
    const result: WorkflowState = await res.json();
    setState(result);
  }

  async function updateCadence() {
    const data: Cadence = JSON.parse(json);
    await fetch(`${BASE_URL}/enrollments/${enrollmentId}/update-cadence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps: data.steps as CadenceStep[] }),
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Cadence Builder</h1>
      <textarea
        rows={20}
        cols={80}
        value={json}
        onChange={(e) => setJson(e.target.value)}
      />
      <div>
        <button onClick={createCadence}>Create Cadence</button>
        <button onClick={enroll}>Enroll</button>
        <button onClick={poll}>Poll State</button>
        <button onClick={updateCadence}>Update Running</button>
      </div>

      <pre>
        {state
          ? JSON.stringify(state, null, 2)
          : "Workflow state not fetched yet"}
      </pre>
    </div>
  );
}
