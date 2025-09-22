export default defineEventHandler(async (event) => {
    const query = getQuery(event).q as string
    if (!query) {
        throw createError({
            statusCode: 400,
            statusMessage: "Parametre 'q' gerekli",
        })
    }

    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
        query
    )}&btnI=I`

    const response = await $fetch.raw(googleUrl, { redirect: "manual" })
    const location = response.headers.get("location")

    if (location) {
        return sendRedirect(event, location, 302)
    } else {
        return sendRedirect(event, googleUrl, 302)
    }
})
