export const calculateAge = (dob) => {
  // console.log("Calculate age called");
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();

  // If birthday hasn't occurred yet this year, subtract 1
  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  return age;
};


//Decode a token
export const decode = (token) => {
  if (!token) return null;

  try {
    const tokenArray = token.split(".");
    const base64Payload = tokenArray[1]; // payload is the second part of JWT
    const decodedPayload = atob(base64Payload); // base64 decode
    return JSON.parse(decodedPayload); // convert string to object
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
