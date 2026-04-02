document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".img-container img");

  // Create Modal Element and injection
  const modal = document.createElement("div");
  modal.id = "gallery-modal";
  modal.className = "modal";
  modal.innerHTML = `
        <span class="modal-close" title="Close (Esc)">&times;</span>
        <button class="modal-btn modal-prev" aria-label="Previous">&lt;</button>
        <div class="modal-content-wrapper">
            <img id="modal-image" src="" alt="Gallery Preview">
        </div>
        <button class="modal-btn modal-next" aria-label="Next">&gt;</button>
    `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("#modal-image");
  const closeBtn = modal.querySelector(".modal-close");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  let currentIndex = 0;

  // Helper functions
  const openModal = (index) => {
    currentIndex = index;
    updateModal();
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scroll
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  const updateModal = () => {
    // Fade out current image slightly before swapping
    modalImg.style.opacity = "0.5";
    setTimeout(() => {
      modalImg.src = images[currentIndex].src;
      modalImg.style.opacity = "1";
    }, 100);
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateModal();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModal();
  };

  // Event Listeners
  images.forEach((img, index) => {
    img.parentElement.addEventListener("click", () => openModal(index));
  });

  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  // Close when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (
      e.target === modal ||
      e.target.classList.contains("modal-content-wrapper")
    ) {
      closeModal();
    }
  });

  // Keyboard Navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});
