import {Request, Response} from 'express';
import {loginUser} from '../services/authService.js';

export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }
        const result = await loginUser(email, password);
        res.status(200).json(result);
    }catch(error){
        const message = error instanceof Error ? error.message: 'Login failed';

        return res.status(401).json({ message });
    }
};