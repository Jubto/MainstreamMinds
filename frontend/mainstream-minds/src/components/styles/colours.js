const colours = [
  '1BB55C',
  'FF9800',
  '1976D2',
  '9747FF',
  'FF6363',
  '009688',
  '3F51B5',
  'FFD600',
  'FF4081',
  '795548',
  '607D8B',
  '00BCD4'
]

const randomColour = () => {
  const chosenColour = colours[Math.floor(Math.random() * colours.length)]
  return `#${chosenColour}`
}

/**
 * Get a colour for a given string. Works by taking first character of given value
 * and converting it to its ascii value and then using mod to select a colour from
 * the configured colours.
 * @param value
 */
const getColourForString = (value) => {
  return colours[value[0].charCodeAt(0) % colours.length];
};

export {randomColour, getColourForString};
