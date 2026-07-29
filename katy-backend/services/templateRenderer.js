// services/templateRenderer.js
// Loads a proposal HTML template and substitutes {{variable}} placeholders.
const fs = require('fs');
const path = require('path');

const TEMPLATE_MAP = {
  rentals: 'katy-proposal-rentals.html',
  buy_sell: 'katy-proposal-buysell.html',
  renovations: 'katy-proposal-renovations.html',
  titling: 'katy-proposal-titling.html',
  agents: 'katy-proposal-agents.html',
};

function renderTemplate(service, variables) {
  const filename = TEMPLATE_MAP[service];
  if (!filename) throw new Error(`No proposal template mapped for service: ${service}`);

  const filePath = path.join(__dirname, '..', 'templates', filename);
  let html = fs.readFileSync(filePath, 'utf8');

  Object.entries(variables).forEach(([key, value]) => {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(pattern, value ?? '');
  });

  return html;
}

module.exports = { renderTemplate, TEMPLATE_MAP };
