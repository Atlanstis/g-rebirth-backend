import 'express';

/** 拓展 express Request 数据 */
declare module 'express' {
  interface Request {
    user: App.JwtPayload;
  }
}
