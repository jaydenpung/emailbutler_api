import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlRequestDTO as UrlRequestDTO } from './dto/url-request.dto';
import { General, GeneralDocument } from './schemas/general.schema';
import { UrlResponseDTO } from './dto/url-response.dto';

@Injectable()
export class GeneralService {
    constructor(@InjectModel(General.name) private readonly model: Model<GeneralDocument>) { }

    async getLoginUrl(loginRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        const selectedRedirectUrl = loginRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        const result = `${process.env.AUTH0_ISSUER_URL}authorize?response_type=token&audience=${process.env.AUTH0_AUDIENCE}&client_id=${process.env.AUTH0_CLIENT_ID}&access_type=offline&redirect_uri=${selectedRedirectUrl}`;
        const urlResponseDTO = new UrlResponseDTO();
        urlResponseDTO.url = result;

        return urlResponseDTO;
    }

    async getLogoutUrl(logoutRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        const selectedRedirectUrl = logoutRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        const result = `${process.env.AUTH0_ISSUER_URL}v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${selectedRedirectUrl}`;
        const urlResponseDTO = new UrlResponseDTO();
        urlResponseDTO.url = result;

        return urlResponseDTO;
    }

    async getGooglePermissionUrl(logoutRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        const selectedRedirectUrl = logoutRequest.redirectUrl || process.env.GOOG_REDIRECT_URI;
        const result = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOG_CLIENT_ID}&redirect_uri=${selectedRedirectUrl}&response_type=code&
        state=state_parameter_passthrough_value&scope=https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file&prompt=consent&include_granted_scopes=true`;
        const urlResponseDTO = new UrlResponseDTO();
        urlResponseDTO.url = result;

        return urlResponseDTO;
    }
}
