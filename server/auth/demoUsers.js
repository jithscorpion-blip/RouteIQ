export const DEMO_USERS = [
  { id: "admin-demo", name: "Admin Demo", role: "Admin" },
  { id: "planner-demo", name: "Planner Demo", role: "Planner" },
  { id: "dispatcher-demo", name: "Dispatcher Demo", role: "Dispatcher" },
  { id: "driver-demo", name: "Driver Demo", role: "Driver" },
  { id: "viewer-demo", name: "Viewer Demo", role: "Viewer" },
];

export function findDemoUserByRole(role = "Viewer") {
  return DEMO_USERS.find((user) => user.role === role) || DEMO_USERS.find((user) => user.role === "Viewer");
}
