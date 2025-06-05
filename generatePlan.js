async function generatePersonalPlan() {
  const focus = JSON.parse(localStorage.getItem("userResponses"))?.[0] || "";
  const faith = JSON.parse(localStorage.getItem("userResponses"))?.[1] || "";
  const schedule = JSON.parse(localStorage.getItem("userResponses"))?.[2] || "";
  const coaching = JSON.parse(localStorage.getItem("userResponses"))?.[3] || "";
  const careerFrom = localStorage.getItem("careerFrom") || "";
  const careerTo = localStorage.getItem("careerTo") || "";
  const email = localStorage.getItem("userEmail") || "anonymous";

  const prompt = `
You are a smart personal coach app called Northstar.
User email: ${email}
Top focus: ${focus}
Belief system: ${faith}
Career: ${careerFrom} ➡️ ${careerTo}
Schedule: ${schedule}
Coaching style: ${coaching}

Create a personalized 7-day plan for the user including:
- 3 daily goals
- 2 habits to build
- 1 journaling prompt per day
- 1 quote for motivation
Be concise but helpful. Respond in JSON format.
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const plan = data.choices?.[0]?.message?.content;
  localStorage.setItem("aiPlan", plan);
  renderPlan(plan);
}
