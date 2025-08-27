const svgCaptcha = require('svg-captcha');

// Generate Captcha
exports.generateCaptcha = () => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 2,
    color: true,
    background: '#f0f0f0',
    width: 200,
    height: 60,
    fontSize: 40,
    charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });

  return {
    text: captcha.text,
    image: captcha.data
  };
};

// Validate Captcha
exports.validateCaptcha = (inputText, storedText) => {
  if (!inputText || !storedText) return false;
  return inputText.toLowerCase() === storedText.toLowerCase();
};

// Generate Simple Math Captcha
exports.generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operator = ['+', '-', '×'][Math.floor(Math.random() * 3)];
  
  let answer;
  let question;
  
  switch (operator) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case '-':
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
      break;
    case '×':
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
  }
  
  return {
    question,
    answer: answer.toString(),
    image: generateMathSVG(question)
  };
};

// Generate Math SVG
function generateMathSVG(question) {
  return `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="60" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
    <text x="100" y="35" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#495057">${question} = ?</text>
  </svg>`;
}
