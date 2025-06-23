document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const endpoint = "https://api.quickhaulxpressllc.dpdns.org/api/contact/submit";

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Submission successful! We'll reach out shortly.");
        form.reset();
      } else {
        alert("⚠️ " + (result.message || "Submission failed."));
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert("There was an error submitting your form. Please try again.");
    }
  });
});

