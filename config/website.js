const tailwind = require('../tailwind')

module.exports = {
  pathPrefix: '/', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "/portfolio"

  siteTitle: 'Tsang Sze Chun', // Navigation and Site Title
  siteTitleAlt: 'Jacky', // Alternative Site title for SEO
  siteTitleShort: 'Jacky Tsang', // short_name for manifest
  siteHeadline: 'Personal website of Tsang Sze Chun', // Headline for schema.org JSONLD
  siteUrl: 'https://tsangszechun.com/', // Domain of your site. No trailing slash!
  siteLanguage: 'en', // Language Tag on <html> element
  siteLogo: '/logo.png', // Used for SEO and manifest
  siteDescription: 'Personal website of Tsang Sze Chun',
  author: 'JackyTsang', // Author for schema.org JSONLD

  // siteFBAppID: '123456789', // Facebook App ID - Optional
  // userTwitter: '@cara', // Twitter Username
  // ogSiteName: 'cara', // Facebook Site Name
  // ogLanguage: 'en_US', // Facebook Language
  // googleAnalyticsID: 'UA-47519312-5',

  // Manifest and Progress color
  themeColor: tailwind.colors.orange,
  backgroundColor: tailwind.colors.blue,
}
