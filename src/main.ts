import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <div style="
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0c0b14;
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    ">
      <div>
        <h1 style="color: #a78bfa; font-size: 48px;">Planify.</h1>
        <p>If you can see this, the app is working!</p>
      </div>
    </div>
  `;
}