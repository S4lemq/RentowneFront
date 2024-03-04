export const formatCardNumber = (cardNumber: number) => {
    const format = "•••• •••• •••• ••••";
    if (!cardNumber) {
      return format;
    } else {
      const cleaned = cardNumber.toString().replace(/\s+/g, "").replace(/[^0-9]/gi, "").padEnd(16, "•");
      const match = cleaned.match(/.{1,4}/g);
      return match ? match.join(" ") : format;
    }
  };
  
  
  export const formatExpiryDate = (str: number) => {
    const format = "••";
    if (!str) {
      return format;
    } else {
      return str.toString().replace(/\s+/g, "").padEnd(2, "•");
    }
  };
  