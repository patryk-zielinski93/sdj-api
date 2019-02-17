import * as url from "url";
import * as querystring from "querystring";

export namespace Utils {
    export function extractVideoIdFromYoutubeUrl(ytUrl: string): string {
        const u = url.parse(ytUrl);
        const query = u.query;

        if (query) {
            return <string>querystring.parse(query)['v'];
        }

        if (u.pathname) {
            return u.pathname.slice(1, 11);
        }

        return '';
    }

}
