import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';

export function getEndpointProtectionProviders() {
  return [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ];
}

export function getKeycloakConfiguration() {
  return KeycloakConnectModule.register({
    authServerUrl: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
    policyEnforcement: PolicyEnforcementMode.ENFORCING,
    tokenValidation: TokenValidation.OFFLINE,
  });
}
