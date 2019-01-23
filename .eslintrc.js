module.exports = {
	"extends": "airbnb",
	"rules": {
    "react/prop-types": 0,
    "comma-dangle": ["error", "never"],
    "camelcase": 0,
    "max-len": 0,
    "react/no-danger": 0,
    "jsx-a11y/label-has-for": 0,
    "jsx-a11y/no-noninteractive-element-to-interactive-role": 0
	},
	"globals": {
		"document": true,
		"window": true,
    "sessionStorage": true,
    "FormData": true,
    "requestAnimFrame": true,
    "Audio": true,
	},
  "env": {
    "jest": true
  }
}
