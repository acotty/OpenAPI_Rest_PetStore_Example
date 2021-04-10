const base64url = require("base64-url");

export class EncodingUtil {
  public static decodeUriWithBase64(str: string): string {
    try {
      return base64url.decode(str);
    } catch (err) {
      return str;
    }

  }

  public static encodeUriWithBase64(uri: string): string {
    const encodedUri = base64url.encode(uri);
    return encodedUri;
  }
}
