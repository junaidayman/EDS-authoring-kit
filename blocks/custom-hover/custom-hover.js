  const hoverBlocks = document.querySelectorAll('.custom-hover > div');

  hoverBlocks.forEach((block, idx) => {
    const heading = block.querySelector('h1');
    const content = block.querySelector('div:last-child');

    // Show content for the first item, hide for others
    content.style.display = idx === 0 ? 'block' : 'none';

    // Toggle content on click
    heading.addEventListener('click', () => {
      hoverBlocks.forEach((b, i) => {
        const c = b.querySelector('div:last-child');
        if (c !== content) c.style.display = 'none';
      });
      content.style.display = (content.style.display === 'block') ? 'none' : 'block';
    });
    
  });
