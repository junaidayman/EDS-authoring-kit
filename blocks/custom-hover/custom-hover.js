document.addEventListener('DOMContentLoaded', () => {
  const hoverBlocks = document.querySelectorAll('.custom-hover > div');

  hoverBlocks.forEach(block => {
    const heading = block.querySelector('h1');
    const content = block.querySelector('div:last-child');

    // Hide content initially
    content.style.display = 'none';

    // Show content on hover
    heading.addEventListener('mouseenter', () => {
      // Hide all other contents
      hoverBlocks.forEach(b => {
        const c = b.querySelector('div:last-child');
        c.style.display = 'none';
      });
      // Show current content
      content.style.display = 'block';
    });

    // Optional: hide again when mouse leaves heading
    heading.addEventListener('mouseleave', () => {
      content.style.display = 'none';
    });
  });
});