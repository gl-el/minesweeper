export default function themeSwitcher() {
  const btn = document.querySelector('.btn_light');
  const sysDark = window.matchMedia('(prefers-color-scheme: dark').matches;
  const savedTheme = localStorage.getItem('theme');
  btn.textContent = sysDark ? 'light_mode' : 'dark_mode';
  if (savedTheme === 'light') {
    btn.textContent = 'dark_mode';
    document.body.classList.toggle('light-mode');
  } else if (savedTheme === 'dark') {
    btn.textContent = 'light_mode';
    document.body.classList.toggle('dark-mode');
  }

  btn.addEventListener('click', () => {
    let mode = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    document.body.classList.toggle('light-mode');
    if (!sysDark) {
      mode = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
      document.body.classList.toggle('dark-mode');
    }
    btn.textContent = btn.textContent === 'light_mode' ? 'dark_mode' : 'light_mode';
    localStorage.setItem('theme', mode);
  });
}
