import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../src/user/schemas/user.schema';
import { UrlRequestDTO } from './dto/url-request.dto';
import { UrlResponseDTO } from './dto/url-response.dto';
import { google } from 'googleapis';
import { GoogleScope } from '../../src/common/enum/google-scope.enum';
import { AuthUserDTO } from '../../src/common/dto/auth-user.dto';
import { UpdateTokenDTO } from '../../src/user/dto/update-token.dto';
import { CustomGeneralException } from '../../src/common/exception/custom-general.exception';
import { AuthCodeType } from '../../src/common/enum/auth-code-type.enum';
import { AuthenticationClient, ManagementClient } from 'auth0';

@Injectable()
export class GeneralService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }

    async getLoginUrl(urlRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        const selectedRedirectUrl = urlRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        /*Commented line below which will request refresh token if pass "scope=offline_access", and "connection_scope" to request gmail scopes.
          For now, login should not be asking for gmail/gdrive scopes, hence no need to request for refresh token.
        */
        //const result = `${process.env.AUTH0_ISSUER_URL}authorize?${urlRequest.requestRefreshToken? 'scope=offline_access&' : ''}response_type=code&connection_scope=${GoogleScope.GMAIL},${GoogleScope.GDRIVE}&audience=${process.env.AUTH0_AUDIENCE}&client_id=${process.env.AUTH0_CLIENT_ID}&access_type=offline&redirect_uri=${selectedRedirectUrl}${urlRequest.requestRefreshToken? '&prompt=consent' : ''}`;
        const result = `${process.env.AUTH0_ISSUER_URL}authorize?response_type=token&audience=${process.env.AUTH0_AUDIENCE}&client_id=${process.env.AUTH0_CLIENT_ID}&access_type=offline&redirect_uri=${selectedRedirectUrl}${urlRequest.requestRefreshToken? '&prompt=consent' : ''}`;
        const urlResponseDTO = new UrlResponseDTO();
        urlResponseDTO.url = result;

        return urlResponseDTO;
    }

    async getLogoutUrl(urlRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        const selectedRedirectUrl = urlRequest.redirectUrl || process.env.AUTH0_REDIRECT;
        const result = `${process.env.AUTH0_ISSUER_URL}v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${selectedRedirectUrl}`;
        const urlResponseDTO = new UrlResponseDTO();
        urlResponseDTO.url = result;

        return urlResponseDTO;
    }

    async checkGooglePermissionUrl(authUser: AuthUserDTO, urlRequest: UrlRequestDTO): Promise<UrlResponseDTO> {
        //setup google oauth authenticator
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOG_CLIENT_ID,
            process.env.GOOG_CLIENT_SECRET,
            process.env.GOOG_REDIRECT_URI
        );
        const authenticationUrl = oauth2Client.generateAuthUrl({
            client_id: process.env.GOOG_CLIENT_ID,
            redirect_uri: urlRequest.redirectUrl || process.env.GOOG_REDIRECT_URI,
            response_type: 'code',
            state: urlRequest.state,
            scope: [GoogleScope.GDRIVE, GoogleScope.GMAIL],
            prompt: 'consent',
            access_type: 'offline',
            include_granted_scopes: true,
            login_hint: authUser.email
        });

        const urlResponseDTO = new UrlResponseDTO();

        //check if user exist
        const user = await this.userModel.findOne({ authUserId: authUser.userId });
        if (!user) {
            urlResponseDTO.isAuthenticated = false;
            urlResponseDTO.url = authenticationUrl;
            return urlResponseDTO;
        }

        //check if there is refresh token in user
        if (!user.refreshToken) {
            urlResponseDTO.isAuthenticated = false;
            urlResponseDTO.url = authenticationUrl;
            return urlResponseDTO;
        }
        
        //check if refresh token valid, and get access token if valid
        oauth2Client.setCredentials({ refresh_token: user.refreshToken });
        let googleAccessToken = "";
        try {
            googleAccessToken = (await oauth2Client.getAccessToken()).token;
        }
        catch(ex) {
            urlResponseDTO.isAuthenticated = false;
            urlResponseDTO.url = authenticationUrl;
            return urlResponseDTO;
        }

        //check if access token has required scopes
        const tokenInfo = await oauth2Client.getTokenInfo(googleAccessToken);
        if (tokenInfo.scopes.includes(GoogleScope.GDRIVE) && tokenInfo.scopes.includes(GoogleScope.GMAIL)) {
            urlResponseDTO.isAuthenticated = true;
            urlResponseDTO.url = "";
            return urlResponseDTO;
        }
        else {
            urlResponseDTO.isAuthenticated = false;
            urlResponseDTO.url = authenticationUrl;
            return urlResponseDTO;
        }
    }

    async updateRefreshToken(authUser: AuthUserDTO, updateToken: UpdateTokenDTO): Promise<boolean> {
        //create user if not exist
        await this.userModel.updateOne(
            { authUserId: authUser.userId, deletedAt: null },
            { email: authUser.email, authUserId: authUser.userId, refreshToken: authUser.refreshToken, updatedAt: new Date() },
            { upsert: true }
        );
        const user = await this.userModel.findOne({ authUserId: authUser.userId });

        if (updateToken.type == AuthCodeType.GOOGLE) {
            //setup google oauth authenticator
            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOG_CLIENT_ID,
                process.env.GOOG_CLIENT_SECRET,
                updateToken.redirectUrl || process.env.GOOG_REDIRECT_URI
            );

            // get refresh token
            try {
                const { tokens } = await oauth2Client.getToken(updateToken.authCode);
                const results = await oauth2Client.getTokenInfo(tokens.access_token);
                const user_id = results.sub;
                const scopes = results.scopes;

                if (user_id !== authUser.googleUserId || !scopes.includes(GoogleScope.USERINFO_PROFILE)) {
                    throw new CustomGeneralException("Refresh Token belongs to different google user");
                }
                else if (!scopes.includes(GoogleScope.GDRIVE)) {
                    throw new CustomGeneralException("Missing gdrive scope");
                }
                else if (!scopes.includes(GoogleScope.GMAIL)) {
                    throw new CustomGeneralException("Missing gmail scope");
                }

                user.refreshToken = tokens.refresh_token || user.refreshToken;
                await user.save();
            }
            catch(ex) {
                if (ex.name === CustomGeneralException.name) {
                    throw ex;
                }
                throw new CustomGeneralException("Invalid authCode" + ex);
            }
        }
        else if (updateToken.type == AuthCodeType.AUTH0) {
            // const auth0 = await this.getAuthClient();
            // const code = await auth0.oauth.authorizationCodeGrant({ code: updateToken.authCode, redirect_uri: process.env.AUTH0_REDIRECT });
        }

        return null;
    }

    async getManagementClient(): Promise<ManagementClient> {
        return new ManagementClient({
            domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
            clientId: `${process.env.AUTH0_M2M_CLIENT_ID}`,
            clientSecret: `${process.env.AUTH0_M2M_CLIENT_SECRET}`
        });
    }

    async getAuthClient(): Promise<AuthenticationClient> {
        return new AuthenticationClient({
            domain: `${process.env.AUTH0_ACCOUNT}.auth0.com`,
            clientId: `${process.env.AUTH0_CLIENT_ID}`,
            clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`
        });
    }
}
