export const protect = (req: any, res: any, next: () => void) => {
  req.user = { id: 'mockUserId' };
  next();
};


export const verifyAndRefreshToken = (req: any, res: any, next: () => void) => {
  next(); // just let it pass
};