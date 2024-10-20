


// import { Request, Response, NextFunction } from 'express';

// // Simulación de middleware de autenticación
// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers['authorization'];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         // Aquí deberías verificar el token (JWT o cualquier otro sistema)
//         const decoded = { userId: 1, name: 'Test User' };  // Simulación de decodificación de token
//         req.user = decoded;  // Añadir el usuario decodificado al request
//         next();  // Continuar al siguiente middleware o controlador
//     } catch (error) {
//         return res.status(401).json({ message: 'Invalid token' });
//     }
// };

// export default authMiddleware;
