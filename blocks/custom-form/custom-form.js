export default async function decorate(block) {
  // ✅ SAFETY: do nothing if already initialized
  if (block.dataset.initialized === 'true') {
    return;
  }
  block.dataset.initialized = 'true';
 
  // ✅ Scope everything to THIS block only
  const link = block.querySelector('a');
 
  if (!link || !link.href) {
    console.warn('custom-form: No JSON link found in this block');
    return;
  }
 
  let json;
  try {
    const response = await fetch(link.href);
 
    if (!response.ok) {
      console.error('custom-form: Fetch failed', response.status);
      return;
    }
 
    json = await response.json();
  } catch (e) {
    console.error('custom-form: Fetch error', e);
    return;
  }
 
  if (!json?.data?.length) {
    console.error('custom-form: Invalid or empty JSON');
    return;
  }
 
  // ✅ Remove ONLY the link, not the whole block
  link.remove();
 
  // ✅ Create form
  const form = document.createElement('form');
  form.className = 'custom-form';
 
  json.data.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field';
 
    const label = document.createElement('label');
    label.textContent = field['Name ']?.trim() || field.Value || '';
    label.setAttribute('for', field.Value);
 
    const input = document.createElement('input');
    input.type = field.Type || 'text';
    input.id = field.Value;
    input.name = field.Value;
 
    if (field.Placeholder) {
      input.placeholder = field.Placeholder;
    }
 
    if (field.Mandate === 'true') {
      input.required = true;
    }
 
    wrapper.append(label, input);
    form.appendChild(wrapper);
  });
 
  // ✅ Submit
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Submit';
 
  form.appendChild(submitBtn);
  block.appendChild(form);
}