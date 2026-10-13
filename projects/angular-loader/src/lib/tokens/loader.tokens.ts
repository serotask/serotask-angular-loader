import { HttpContextToken } from '@angular/common/http';

import { LoaderOptions } from '../models/loader.types';

/** Set to `true` on an HTTP request to keep the loader hidden for it. */
export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

/** Per-request loader options, e.g. a custom text for one upload. */
export const LOADER_OPTIONS = new HttpContextToken<LoaderOptions | null>(() => null);
