const validateUserInput = (name, email, address, city, zip, request) => {
  const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const invalidSigns = /[<>%\$]/;

  let isValid = true;
  if (!name && !email && !address && !city && !zip) isValid = false;
  else if (name.length < 3 && city.length < 3) isValid = false;

  else if (!validEmail.test(email)) isValid = false;
  else if (invalidSigns.test(name)
    ||
    invalidSigns.test(email)
    ||
    invalidSigns.test(address)
    ||
    invalidSigns.test(city)
    ||
    invalidSigns.test(zip)
  ) isValid = false;

  if (request) {
    if (request.length > 30) {
      isValid = false;
    } else if (invalidSigns.test(request)) isValid = false;
  }

  return isValid;
};

module.exports = validateUserInput;