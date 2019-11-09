//
// Copyright 2019 AppRExp
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-Short-Identifier: Apache-2.0
//

import { LinkyshCoreApplication } from './application';
import { AuthenticationBindings } from '@loopback/authentication';
import {
  ApplicationConfig,
  CoreTags,
} from '@loopback/core';
import { uaaAuthStrategy } from './uaa-auth-strategy';

export {LinkyshCoreApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new LinkyshCoreApplication(options);
  await app.boot();
  await app.start();

  // Configure global default authentication strategy
  app
    .configure(AuthenticationBindings.COMPONENT)
    .to({defaultMetadata: { strategy: 'uaa' }});

  // Bind UAA auth strategy
  app
    .bind('authentication.strategies.uaaAuthStrategy')
    .to(uaaAuthStrategy)
    .tag({
      [CoreTags.EXTENSION_FOR]:
        AuthenticationBindings.AUTHENTICATION_STRATEGY_EXTENSION_POINT_NAME,
    });

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
