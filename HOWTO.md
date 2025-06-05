# This document contains various how-to guides.
- [How To Pass Configuration as Env vars to the SPA frontend loaded in browser](#how-to-pass-configuration-as-env-vars-to-the-spa-frontend-loaded-in-browser)

### How To Pass Configuration as Env vars to the SPA frontend loaded in browser.
1. create a `env.ts` file in the source code, sample file [here](https://github.com/bcgov/nr-epd-organics-info/blob/main/frontend/src/env.ts)
2. Update vite.config.ts and add the following, [sample](https://github.com/bcgov/nr-epd-organics-info/blob/main/frontend/vite.config.ts#L18-L35)
```javascript
      {
        name: 'build-html',
        apply: 'build',
        transformIndexHtml: (html) => {
          return {
            html,
            tags: [
              {
                tag: 'script',
                attrs: {
                  src: '/env.js',
                },
                injectTo: 'head',
              },
            ],
          }
        },
      },
``` 
3. Add similar section to Caddyfile which will return all your config data, [sample](https://github.com/bcgov/nr-epd-organics-info/blob/main/frontend/Caddyfile#L17C4-L22C6)
```javascript
 handle /env.js {
        header {
          Content-Type text/javascript
        }
        respond `window.config={"VITE_ENV_VAR":"{$VITE_ENV_VAR}"};`
    }
```
4. Add the env vars to frontend deployment, [sample](https://github.com/bcgov/nr-epd-organics-info/blob/main/charts/nr-epd-organics-info/templates/frontend/templates/deployment.yaml#L38-L56)
```yaml
            - name: VITE_ENV_VAR
              value: {{ .Values.frontend.someEnvVar | quote }}
```
5. feed these values during helm deploy either through set string or through values file.
6. Access the env.ts file as import in other files, [sample](https://github.com/bcgov/nr-epd-organics-info/blob/main/frontend/src/pages/map/layers/ZoomToResultsControl.tsx)
```javascript
import { env } from '@/env'
const zoomToResultsFeatureFlag =
    env.VITE_ZOOM_TO_RESULTS_CONTROL_FLAG === 'true'
```