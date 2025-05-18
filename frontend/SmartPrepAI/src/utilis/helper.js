export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  

export const getInitials = (title) =>{
  if(!title) return "";

  const word = title.split(" ");
  let initials = "";

  for(let i=0; i<Math.min(word.length, 2); i++){
    initials += word[i][0];
  }

  return initials.toUpperCase();
};