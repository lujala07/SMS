import {Request, Response} from 'express';
import {loginUser} from '../services/authService.js';
import { InvitationError, resendInvitation, setInvitedPassword } from '../services/invitationService.js';

export const setPassword = async (req: Request, res: Response) => {
    try {
        await setInvitedPassword(req.body?.token, req.body?.password);
        return res.json({ message: 'Password set successfully. You can now sign in.' });
    } catch (error) {
        if (error instanceof InvitationError) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Could not set password. Please try again.' });
    }
};

export const resendAccountInvitation = async (req: Request, res: Response) => {
    const email = req.body?.email;
    if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        await resendInvitation(email.trim());
        return res.json({ message: 'A new invitation email has been sent. Previous links are no longer valid.' });
    } catch (error) {
        if (error instanceof InvitationError) return res.status(error.status).json({ message: error.message });
        return res.status(500).json({ message: 'Could not resend invitation. Please try again.' });
    }
};

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
