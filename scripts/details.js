const API_BASE = "https://cf-atd-server.vercel.app/api/submission";
const content = document.getElementById("content");

function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function createProblemAccordion(problems, whyNot) {
  if (!problems.length) {
    return `<div class="alert alert-warning">${whyNot || "No problems attached with this submission."}</div>`;
  }

  return `
    <div class="accordion" id="problemAccordion">
      ${problems
        .map((problem, index) => {
          return `
            <div class="accordion-item rounded mb-3 shadow-sm">
              <h2 class="accordion-header" id="heading${index}">
                <button 
                  class="accordion-button collapsed fw-semibold" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapse${index}" 
                  aria-expanded="false"
                >
                  <div class="d-flex justify-content-between w-100 align-items-center">
                    <span>🔹 Problem ${index + 1}: ${problem.title || "Untitled"}</span>
                    <span class="badge bg-info text-dark m-2">Rating: ${problem.rating || "N/A"}</span>
                  </div>
                </button>
              </h2>
              <div 
                id="collapse${index}" 
                class="accordion-collapse collapse" 
                aria-labelledby="heading${index}" 
                data-bs-parent="#problemAccordion"
              >
                <div class="accordion-body">
                  <p><strong>🔗 Link:</strong> <a href="${problem.link}" target="_blank">${problem.link}</a></p>
                  
                  <p><strong>🏷️ Tags:</strong> ${
                    problem.tags
                      ? problem.tags
                          .split(",")
                          .map(tag => `<span class="badge rounded-pill bg-primary me-1">${tag.trim()}</span>`)
                          .join("")
                      : "None"
                  }</p>

                  <p><strong>💻 Source Code:</strong> <a href="${problem.sourceCode}" target="_blank">${problem.sourceCode}</a></p>

                  <div class="mt-4">
                    <h6>🧠 How I Solved It:</h6>
                    <pre class="p-3 rounded text-wrap" style="white-space:pre-wrap; font-family: 'Arial', monospace;">${problem.howSolved || "Not provided"}</pre>
                  </div>
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

async function loadSubmissionDetails() {
  const id = getIdFromUrl();
  if (!id) {
    content.innerHTML = `<div class="alert alert-danger">No ID found in URL.</div>`;
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch submission");

    const data = await res.json();

    content.innerHTML = `
      <div class="submission-meta mb-4">
        <p><strong>👤 Handle:</strong> ${data.name || "N/A"}</p>
        <p><strong>📅 Date:</strong> ${data.date ? new Date(data.date).toLocaleDateString("en-US") : "N/A"}</p>
        <p><strong>📊 Status:</strong> 
          <span class="badge bg-${data.solvedStatus === "yes" ? "success" : "danger"} text-uppercase">${data.solvedStatus}</span>
        </p>
      </div>
      ${createProblemAccordion(data.problems || [], data.whyNot)}
    `;
  } catch (error) {
    console.error(error);
    content.innerHTML = `<div class="alert alert-danger">Error loading submission. Try again later.</div>`;
  }
}

loadSubmissionDetails();
