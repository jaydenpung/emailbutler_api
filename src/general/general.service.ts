import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginRequestDTO as LoginoutRequestDTO } from './dto/loginout-request.dto';
import { LoginDTO } from './dto/login.dto';
import { General, GeneralDocument } from './schemas/general.schema';
import { LogoutDTO } from './dto/logout.dto';

@Injectable()
export class GeneralService {
    constructor(@InjectModel(General.name) private readonly model: Model<GeneralDocument>) { }

    async getLoginUrl(loginRequest: LoginoutRequestDTO): Promise<LoginDTO> {
        const selectedRedirectUrl = loginRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        const result = `${process.env.AUTH0_ISSUER_URL}authorize?response_type=token&audience=${process.env.AUTH0_AUDIENCE}&client_id=${process.env.AUTH0_CLIENT_ID}&connection_scope=https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/drive.file&access_type=offline&redirect_uri=${selectedRedirectUrl}`;
        const login = new LoginDTO();
        login.url = result;

        return login;
    }

    async getLogoutUrl(logoutRequest: LoginoutRequestDTO): Promise<LogoutDTO> {
        const selectedRedirectUrl = logoutRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        const result = `${process.env.AUTH0_ISSUER_URL}v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${selectedRedirectUrl}`;
        const logout = new LogoutDTO();
        logout.url = result;

        return logout;
    }
}
