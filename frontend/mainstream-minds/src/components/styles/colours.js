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

export {randomColour};