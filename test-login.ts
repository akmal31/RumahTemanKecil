async function run() {
  const loginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@temankecil.id", password: "any" }),
  });
  console.log("Login status:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("Login response:", loginData);

  const cookies = loginRes.headers.get("set-cookie");
  console.log("Set-Cookie:", cookies);

  const sessionRes = await fetch("http://localhost:3000/api/auth/session", {
    headers: { Cookie: cookies },
  });
  console.log("Session status:", sessionRes.status);
  const sessionData = await sessionRes.text();
  console.log("Session data:", sessionData);
}

run().catch(console.error);
