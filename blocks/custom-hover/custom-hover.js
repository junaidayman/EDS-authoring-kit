document.addEventListener('DOMContentLoaded', () => {
  const hoverBlocks = document.querySelectorAll('.custom-hover > div');

  hoverBlocks.forEach(block => {
    const heading = block.querySelector('h1');
    const content = block.querySelector('div:last-child');

    // Hide content initially
    content.style.display = 'none';

    // Toggle content on click
    heading.addEventListener('click', () => {
      // Hide all other contents
      hoverBlocks.forEach(b => {
        const c = b.querySelector('div:last-child');
        if (c !== content) c.style.display = 'none';
      });
      // Toggle current content
      content.style.display = (content.style.display === 'block') ? 'none' : 'block';
    });
  });
});
