// Simple form submission handler
document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    alert("✅ Data uploaded successfully!");
  });
});