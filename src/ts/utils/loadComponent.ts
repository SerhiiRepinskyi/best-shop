export async function loadComponent(selector: string, path: string) {
  const host = document.querySelector(selector);
  if (!host) return;

  const response = await fetch(path);
  const html = await response.text();

  host.innerHTML = html;
}
