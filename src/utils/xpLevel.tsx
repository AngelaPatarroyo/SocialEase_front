
export function getLevelFromXP(xp: number) {
    xp = Number(xp) || 0;
  
    if (xp <= 100) return 1;
    if (xp <= 200) return 2;
    if (xp <= 300) return 3;
    if (xp <= 400) return 4;
    if (xp <= 500) return 5;
    if (xp <= 600) return 6;
    if (xp <= 700) return 7;
    if (xp <= 800) return 8;
    if (xp <= 900) return 9;
    return 10; 
  }
  