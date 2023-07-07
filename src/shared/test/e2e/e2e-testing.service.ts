import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class E2ETestingService {
  constructor(private readonly httpService: HttpService) {}

  async getAccessToken() {
    const { data } = await firstValueFrom(
      this.httpService
        .post<any>(
          `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
          {
            grant_type: 'password',
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            username: 'test',
            password: 'test',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            // this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    return data.access_token;
  }
}

/*export async function getAccessToken(app: NestFastifyApplication) {
  const http = app.getHttpAdapter().getInstance();

  const response = await http.post({
    url: 'http://localhost:6080/auth/realms/master/protocol/openid-connect/token',
  });

  console.log(response);
}*/
