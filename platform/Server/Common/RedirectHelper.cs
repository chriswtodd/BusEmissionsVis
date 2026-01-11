using Server.Models.Api;

namespace Server.Common;

public static class RedirectHelper
{
    public static string CreateRedirectUrl(this ICallback callback, string baseUrl)
    {
        return $"{baseUrl}{System.Web.HttpUtility.UrlDecode(callback.Callback)}";
    }
}
